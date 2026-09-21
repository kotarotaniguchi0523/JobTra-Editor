import type { WebMCP } from 'webmcp-types';
import { draftActions, draftStore } from '@entities/draft/model/draftStore';
import { calculateMetrics } from '@features/writing-assistance/lib/analyzer';
import { getContentDigest } from '@features/webmcp/lib/contentRevision';
import {
  cloudGuideInputSchema,
  parseCloudGuideInput,
  parseTutorialExampleInput,
  parseTutorialExampleOutput,
  parseTutorialGuideOutput,
  parseTutorialStageInput,
  tutorialExampleInputSchema,
  tutorialStageInputSchema,
  type TutorialExampleOutput,
  type TutorialFailure,
  type TutorialGuideOutput,
  type TutorialStage,
} from '@features/webmcp/model/tutorialToolSchemas';

const TUTORIAL_PATH = '/ai/jobtra-tutorial.ja.md';
const CLOUD_GUIDE_PATH = '/ai/jobtra-cloud-setup.ja.md';

const EXAMPLES = {
  gakuchika:
    '学生時代に注力したことは、アルバイト先の新人定着率を改善した経験です。課題を分析し、周囲を巻き込みながら仕組みを整えた結果、定着率を高めました。',
} as const;

function failure(code: string, message: string): TutorialFailure {
  return { ok: false, error: { code, message } };
}

function assertNotAborted(signal: AbortSignal): void {
  if (!signal.aborted) return;
  const error = new Error('チュートリアル操作がキャンセルされました。');
  error.name = 'AbortError';
  throw error;
}

async function readGuide(
  path: string,
  topic: string,
  stage: TutorialStage | null,
  signal: AbortSignal,
): Promise<TutorialGuideOutput | TutorialFailure> {
  assertNotAborted(signal);
  const response = await fetch(path, {
    signal,
    headers: { Accept: 'text/markdown' },
  });
  if (!response.ok) {
    return failure('guide_unavailable', `ガイドを取得できませんでした (${response.status})。`);
  }

  const markdown = await response.text();
  assertNotAborted(signal);
  return { ok: true, topic, stage, contentType: 'text/markdown', source: path, markdown };
}

async function getTutorial(rawInput: unknown, signal: AbortSignal) {
  const input = parseTutorialStageInput(rawInput);
  if (!input) return failure('invalid_input', 'stageの形式を確認してください。');
  return readGuide(TUTORIAL_PATH, 'jobtra-tutorial', input.stage ?? null, signal);
}

async function getCloudGuide(rawInput: unknown, signal: AbortSignal) {
  if (!parseCloudGuideInput(rawInput))
    return failure('invalid_input', '入力は空のオブジェクトにしてください。');
  return readGuide(CLOUD_GUIDE_PATH, 'dexie-cloud-setup', null, signal);
}

async function applyTutorialExample(
  rawInput: unknown,
  signal: AbortSignal,
): Promise<TutorialExampleOutput | TutorialFailure> {
  const input = parseTutorialExampleInput(rawInput);
  if (!input) return failure('invalid_input', 'exampleId、mode、confirmの形式を確認してください。');
  if (!input.confirm) {
    return failure(
      'confirmation_required',
      'ユーザーの明示的な確認後にconfirm:trueで再実行してください。',
    );
  }

  assertNotAborted(signal);
  const current = draftStore.getState();
  if (current.isLoading) return failure('drafts_loading', '下書きを読み込み中です。');

  if (input.draftId) {
    if (!current.drafts.some((draft) => draft.id === input.draftId)) {
      return failure('draft_not_found', `指定された下書き「${input.draftId}」が見つかりません。`);
    }
    draftActions.selectDraft(input.draftId);
  }

  const activeDraft = draftStore
    .getState()
    .drafts.find((draft) => draft.id === draftStore.getState().activeDraftId);
  if (!activeDraft) return failure('draft_not_found', '利用可能な下書きがありません。');

  const insertedText = EXAMPLES[input.exampleId];
  if (input.mode === 'replace_empty' && activeDraft.content.trim().length > 0) {
    return failure('draft_not_empty', '既存本文があるためreplace_emptyは実行できません。');
  }

  const content =
    input.mode === 'append' && activeDraft.content
      ? `${activeDraft.content}\n${insertedText}`
      : insertedText;
  draftActions.updateActiveDraft({ content }, { updatedAt: Date.now(), immediate: true });
  assertNotAborted(signal);

  const updated = draftStore.getState().drafts.find((draft) => draft.id === activeDraft.id);
  if (!updated) return failure('draft_not_found', '更新後の下書きを取得できませんでした。');
  return {
    ok: true,
    draftId: updated.id,
    exampleId: input.exampleId,
    mode: input.mode,
    insertedText,
    contentDigest: getContentDigest(updated.content),
    charsNoWhitespace: calculateMetrics(updated.content).charsNoWhitespace,
  };
}

function executeGuide<T>(
  toolName: string,
  rawInput: unknown,
  signal: AbortSignal,
  execute: (input: unknown, signal: AbortSignal) => Promise<unknown>,
  parse: (value: unknown) => T | null,
): Promise<T> {
  return execute(rawInput, signal).then((value) => {
    const parsed = parse(value);
    if (parsed) return parsed;
    throw new Error(`${toolName} returned an invalid structured output.`);
  });
}

export const tutorialTools: readonly WebMCP.ModelContextTool[] = [
  {
    name: 'get_jobtra_tutorial',
    title: 'JobTra チュートリアル取得',
    description:
      'JobTraの初回利用、執筆、レビュー、同期の手順をMarkdownで取得します。AIがユーザーに説明するための読み取り専用ツールです。',
    inputSchema: tutorialStageInputSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: false, consequentialHint: false },
    execute: (input, { signal }) =>
      executeGuide('get_jobtra_tutorial', input, signal, getTutorial, parseTutorialGuideOutput),
  },
  {
    name: 'get_jobtra_cloud_setup_guide',
    title: 'Dexie Cloud 設定ガイド取得',
    description:
      '個人Dexie Cloudの作成、Origin許可、JobTraへのURL入力、別端末同期の説明をMarkdownで取得します。',
    inputSchema: cloudGuideInputSchema,
    annotations: { readOnlyHint: true, untrustedContentHint: false, consequentialHint: false },
    execute: (input, { signal }) =>
      executeGuide(
        'get_jobtra_cloud_setup_guide',
        input,
        signal,
        getCloudGuide,
        parseTutorialGuideOutput,
      ),
  },
  {
    name: 'apply_tutorial_example',
    title: 'チュートリアル例文を入力',
    description:
      'ユーザーが明示的に確認した場合だけ、JobTraの現在の下書きへ例文を入力します。入力後はanalyze_writingで評価できます。',
    inputSchema: tutorialExampleInputSchema,
    annotations: { readOnlyHint: false, untrustedContentHint: false, consequentialHint: true },
    execute: (input, { signal }) =>
      executeGuide(
        'apply_tutorial_example',
        input,
        signal,
        applyTutorialExample,
        parseTutorialExampleOutput,
      ),
  },
];
