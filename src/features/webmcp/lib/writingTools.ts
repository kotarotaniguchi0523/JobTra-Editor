import type { WebMCP } from 'webmcp-types';
import type { ESDraft, DraftSnapshot, StarBlocks } from '@entities/draft/model/types';
import { draftStore } from '@entities/draft/model/draftStore';
import { auditText, calculateMetrics } from '@features/writing-assistance/lib/analyzer';
import { calculateRatioBalance } from '@features/writing-assistance/lib/ratioBalance';
import {
  detectRedundancies,
  type RedundancyMatch,
} from '@features/writing-assistance/lib/sculptor';
import {
  parseAnalyzeWritingInput,
  parseCompareWritingVersionsInput,
  parseGetWritingContextInput,
} from '@features/webmcp/model/writingToolSchemas';
import { getContentDigest } from '@features/webmcp/lib/contentRevision';

const MAX_TOOL_CONTENT_LENGTH = 8_000;
const MAX_SELECTION_CONTEXT_LENGTH = 400;

type ToolFailure = {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};

type ToolSuccess<T extends object> = { ok: true } & T;

type WritingToolResult = ToolFailure | ToolSuccess<Record<string, unknown>>;

type DraftSummary = {
  id: string;
  title: string;
  companyName: string;
  category: ESDraft['category'];
  targetCount: number;
  updatedAt: number;
  charsNoWhitespace: number;
};

type DraftResolution = { draft: ESDraft } | ToolFailure;

const STAR_FIELDS = ['conclusion', 'situation', 'action', 'result', 'contribution'] as const;

function failure(code: string, message: string): ToolFailure {
  return { ok: false, error: { code, message } };
}

function assertNotAborted(signal: AbortSignal): void {
  if (!signal.aborted) return;

  const error = new Error('文章支援ツールの実行がキャンセルされました。');
  error.name = 'AbortError';
  throw error;
}

function resolveDraft(draftId: string | undefined): DraftResolution {
  const state = draftStore.getState();

  if (state.isLoading) {
    return failure(
      'drafts_loading',
      '下書きを読み込み中です。読み込み完了後に再実行してください。',
    );
  }

  if (draftId) {
    const draft = state.drafts.find((candidate) => candidate.id === draftId);
    return draft
      ? { draft }
      : failure('draft_not_found', `指定された下書き「${draftId}」が見つかりません。`);
  }

  const draft =
    state.drafts.find((candidate) => candidate.id === state.activeDraftId) ?? state.drafts[0];

  return draft
    ? { draft }
    : failure('draft_not_found', '利用可能な下書きがありません。先に下書きを作成してください。');
}

function summarizeDraft(draft: ESDraft): DraftSummary {
  return {
    id: draft.id,
    title: truncateToolContent(draft.title).text,
    companyName: truncateToolContent(draft.companyName).text,
    category: draft.category,
    targetCount: draft.targetCount,
    updatedAt: draft.updatedAt,
    charsNoWhitespace: calculateMetrics(draft.content).charsNoWhitespace,
  };
}

function truncateToolContent(text: string): { text: string; truncated: boolean } {
  return text.length > MAX_TOOL_CONTENT_LENGTH
    ? { text: text.slice(0, MAX_TOOL_CONTENT_LENGTH), truncated: true }
    : { text, truncated: false };
}

function summarizeStarBlocks(starBlocks: StarBlocks | undefined): {
  value: StarBlocks | null;
  truncatedBlocks: Array<(typeof STAR_FIELDS)[number]>;
} {
  if (!starBlocks) return { value: null, truncatedBlocks: [] };

  const truncatedBlocks: Array<(typeof STAR_FIELDS)[number]> = [];
  const bounded = (field: (typeof STAR_FIELDS)[number]): string => {
    const result = truncateToolContent(starBlocks[field]);
    if (result.truncated) truncatedBlocks.push(field);
    return result.text;
  };
  const value: StarBlocks = {
    conclusion: bounded('conclusion'),
    situation: bounded('situation'),
    action: bounded('action'),
    result: bounded('result'),
    contribution: bounded('contribution'),
  };

  return { value, truncatedBlocks };
}

function getSelection(content: string): {
  start: number;
  end: number;
  text: string;
  textTruncated: boolean;
  before: string;
  after: string;
} | null {
  if (typeof document === 'undefined') return null;

  const textarea = document.getElementById('es-body-textarea');
  if (!(textarea instanceof HTMLTextAreaElement) || textarea.value !== content) return null;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  if (start === end) return null;

  const selectedText = truncateToolContent(textarea.value.slice(start, end));

  return {
    start,
    end,
    text: selectedText.text,
    textTruncated: selectedText.truncated,
    before: textarea.value.slice(Math.max(0, start - MAX_SELECTION_CONTEXT_LENGTH), start),
    after: textarea.value.slice(end, end + MAX_SELECTION_CONTEXT_LENGTH),
  };
}

function summarizeStarStructure(starBlocks: StarBlocks | undefined) {
  const completedBlocks = starBlocks
    ? STAR_FIELDS.filter((field) => starBlocks[field].trim().length > 0)
    : [];

  return {
    available: Boolean(starBlocks),
    completedBlocks,
    missingBlocks: STAR_FIELDS.filter((field) => !completedBlocks.includes(field)),
  };
}

function findSnapshot(draft: ESDraft, snapshotId: string): DraftSnapshot | null {
  return draft.snapshots?.find((snapshot) => snapshot.id === snapshotId) ?? null;
}

function summarizeSnapshot(snapshot: DraftSnapshot) {
  const content = truncateToolContent(snapshot.content);

  return {
    id: snapshot.id,
    label: snapshot.label,
    timestamp: snapshot.timestamp,
    charsNoWhitespace: calculateMetrics(snapshot.content).charsNoWhitespace,
    contentDigest: getContentDigest(snapshot.content),
    content: content.text,
    contentTruncated: content.truncated,
  };
}

function summarizeTextDifference(previous: string, current: string) {
  let prefixLength = 0;
  const shortestLength = Math.min(previous.length, current.length);

  while (prefixLength < shortestLength && previous[prefixLength] === current[prefixLength]) {
    prefixLength += 1;
  }

  let previousEnd = previous.length;
  let currentEnd = current.length;
  while (
    previousEnd > prefixLength &&
    currentEnd > prefixLength &&
    previous[previousEnd - 1] === current[currentEnd - 1]
  ) {
    previousEnd -= 1;
    currentEnd -= 1;
  }

  const removedText = previous.slice(prefixLength, previousEnd);
  const addedText = current.slice(prefixLength, currentEnd);
  const changed = removedText.length > 0 || addedText.length > 0;

  return {
    changed,
    charsRemoved: removedText.length,
    charsAdded: addedText.length,
    changeWindow: changed
      ? {
          start: prefixLength,
          before: removedText.slice(0, MAX_SELECTION_CONTEXT_LENGTH),
          after: addedText.slice(0, MAX_SELECTION_CONTEXT_LENGTH),
          beforeTruncated: removedText.length > MAX_SELECTION_CONTEXT_LENGTH,
          afterTruncated: addedText.length > MAX_SELECTION_CONTEXT_LENGTH,
        }
      : null,
  };
}

async function getWritingContext(
  rawInput: unknown,
  signal: AbortSignal,
): Promise<WritingToolResult> {
  const input = parseGetWritingContextInput(rawInput);
  if (!input) {
    return failure('invalid_input', 'draftId、scope、snapshotIdの形式を確認してください。');
  }

  assertNotAborted(signal);
  const resolved = resolveDraft(input.draftId);
  if ('error' in resolved) return resolved;

  const scope = input.scope ?? 'current';
  if (scope !== 'snapshot' && input.snapshotId) {
    return failure('invalid_input', 'snapshotIdはscopeがsnapshotの場合だけ指定できます。');
  }

  const { draft } = resolved;
  const summary = summarizeDraft(draft);
  const contentDigest = getContentDigest(draft.content);

  if (scope === 'selection') {
    const selection = getSelection(draft.content);
    if (!selection) {
      return failure(
        'selection_required',
        '執筆エディタで対象の文章を選択してから、もう一度実行してください。',
      );
    }

    return { ok: true, scope, draft: summary, contentDigest, selection };
  }

  if (scope === 'star') {
    const starBlocks = summarizeStarBlocks(draft.starBlocks);
    return {
      ok: true,
      scope,
      draft: summary,
      contentDigest,
      isBlockMode: draft.isBlockMode,
      starBlocks: starBlocks.value,
      starBlocksTruncated: starBlocks.truncatedBlocks,
    };
  }

  if (scope === 'snapshot') {
    if (!input.snapshotId) {
      return failure('snapshot_required', 'scopeがsnapshotの場合はsnapshotIdが必要です。');
    }

    const snapshot = findSnapshot(draft, input.snapshotId);
    if (!snapshot) {
      return failure(
        'snapshot_not_found',
        `指定されたスナップショット「${input.snapshotId}」が見つかりません。`,
      );
    }

    const snapshotResult = summarizeSnapshot(snapshot);
    return {
      ok: true,
      scope,
      draft: summary,
      snapshot: {
        id: snapshotResult.id,
        label: snapshotResult.label,
        timestamp: snapshotResult.timestamp,
        charsNoWhitespace: snapshotResult.charsNoWhitespace,
      },
      contentDigest: snapshotResult.contentDigest,
      content: snapshotResult.content,
      contentTruncated: snapshotResult.contentTruncated,
    };
  }

  const content = truncateToolContent(draft.content);
  const starBlocks = summarizeStarBlocks(draft.starBlocks);

  return {
    ok: true,
    scope: 'current',
    draft: summary,
    contentDigest,
    content: content.text,
    contentTruncated: content.truncated,
    starBlocks: starBlocks.value,
    starBlocksTruncated: starBlocks.truncatedBlocks,
    selection: getSelection(draft.content),
  };
}

async function analyzeWriting(rawInput: unknown, signal: AbortSignal): Promise<WritingToolResult> {
  const input = parseAnalyzeWritingInput(rawInput);
  if (!input) {
    return failure('invalid_input', 'draftIdの形式を確認してください。');
  }

  assertNotAborted(signal);
  const resolved = resolveDraft(input.draftId);
  if ('error' in resolved) return resolved;

  const { draft } = resolved;
  const metrics = calculateMetrics(draft.content);
  const auditChecks = auditText(draft.content, draft.targetCount);
  const ratioBalance = calculateRatioBalance(draft.content, draft.targetCount);
  const redundancyMatches: RedundancyMatch[] = detectRedundancies(draft.content);
  const starStructure = summarizeStarStructure(draft.starBlocks);

  assertNotAborted(signal);

  return {
    ok: true,
    draft: summarizeDraft(draft),
    contentDigest: getContentDigest(draft.content),
    metrics,
    auditChecks,
    ratioBalance,
    redundancyMatches,
    starStructure,
  };
}

async function compareWritingVersions(
  rawInput: unknown,
  signal: AbortSignal,
): Promise<WritingToolResult> {
  const input = parseCompareWritingVersionsInput(rawInput);
  if (!input) {
    return failure('invalid_input', 'snapshotIdおよびdraftIdの形式を確認してください。');
  }

  assertNotAborted(signal);
  const resolved = resolveDraft(input.draftId);
  if ('error' in resolved) return resolved;

  const { draft } = resolved;
  const snapshot = findSnapshot(draft, input.snapshotId);
  if (!snapshot) {
    return failure(
      'snapshot_not_found',
      `指定されたスナップショット「${input.snapshotId}」が見つかりません。`,
    );
  }

  const currentContent = truncateToolContent(draft.content);
  const snapshotContent = truncateToolContent(snapshot.content);
  const currentMetrics = calculateMetrics(draft.content);
  const comparison = summarizeTextDifference(snapshot.content, draft.content);

  assertNotAborted(signal);

  return {
    ok: true,
    draft: summarizeDraft(draft),
    current: {
      contentDigest: getContentDigest(draft.content),
      charsNoWhitespace: currentMetrics.charsNoWhitespace,
      content: currentContent.text,
      contentTruncated: currentContent.truncated,
    },
    snapshot: {
      id: snapshot.id,
      label: snapshot.label,
      timestamp: snapshot.timestamp,
      charsNoWhitespace: calculateMetrics(snapshot.content).charsNoWhitespace,
      contentDigest: getContentDigest(snapshot.content),
      content: snapshotContent.text,
      contentTruncated: snapshotContent.truncated,
    },
    comparison,
  };
}

const draftIdInputSchema = {
  type: 'string',
  minLength: 1,
  maxLength: 128,
  pattern: '^[A-Za-z0-9_-]+$',
} as const;

const getWritingContextInputSchema = {
  type: 'object',
  properties: {
    draftId: {
      ...draftIdInputSchema,
      description: '対象の下書きID。省略時は現在選択中の下書きを使います。',
    },
    scope: {
      type: 'string',
      enum: ['current', 'selection', 'star', 'snapshot'],
      description: '取得範囲。currentは本文、selectionは選択範囲、starはSTARブロックです。',
    },
    snapshotId: {
      ...draftIdInputSchema,
      description: 'scopeがsnapshotの場合に取得するスナップショットIDです。',
    },
  },
  additionalProperties: false,
} as const;

const analyzeWritingInputSchema = {
  type: 'object',
  properties: {
    draftId: {
      ...draftIdInputSchema,
      description: '対象の下書きID。省略時は現在選択中の下書きを分析します。',
    },
  },
  additionalProperties: false,
} as const;

const compareWritingVersionsInputSchema = {
  type: 'object',
  properties: {
    draftId: {
      ...draftIdInputSchema,
      description: '対象の下書きID。省略時は現在選択中の下書きを使います。',
    },
    snapshotId: {
      ...draftIdInputSchema,
      description: '現在の本文と比較する既存スナップショットのIDです。',
    },
  },
  required: ['snapshotId'],
  additionalProperties: false,
} as const;

export const writingTools: readonly WebMCP.ModelContextTool[] = [
  {
    name: 'get_writing_context',
    title: '執筆コンテキスト取得',
    description:
      '現在のエントリーシート下書き、選択範囲、STAR構成、またはスナップショットを取得し、文章の改善案を作るためのコンテキストを提供します。',
    inputSchema: getWritingContextInputSchema,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    },
    execute: (input, { signal }) => getWritingContext(input, signal),
  },
  {
    name: 'analyze_writing',
    title: '文章分析',
    description:
      'エントリーシート本文を既存の文字数、文章監査、STAR比率、冗長表現の分析ロジックで確認し、改善判断に使える構造化結果を返します。',
    inputSchema: analyzeWritingInputSchema,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    },
    execute: (input, { signal }) => analyzeWriting(input, signal),
  },
  {
    name: 'compare_writing_versions',
    title: '文章バージョン比較',
    description:
      '現在のエントリーシート本文と既存スナップショットを比較し、変更内容、文字数差分、比較対象の本文を返します。',
    inputSchema: compareWritingVersionsInputSchema,
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: true,
      consequentialHint: false,
    },
    execute: (input, { signal }) => compareWritingVersions(input, signal),
  },
];
