"use client";

import React, {
  useReducer,
  useDeferredValue,
  useCallback,
  useTransition,
  useEffect,
  useEffectEvent,
  memo,
} from 'react';
import { ESDraft, StarBlocks, DraftSnapshot, EditorMode } from '../types';
import { assembleStarBlocks, cleanForSubmission, calculateMetrics } from '../services/analyzer';
import { EditorHeaderBar } from './EditorHeaderBar';
import { WriteWorkspace } from './WriteWorkspace';
import { StarStructureEditor } from './StarStructureEditor';
import { DocumentPreview } from './DocumentPreview';
import { DeferredMetricsBar } from './DeferredMetricsBar';

interface EditorProps {
  draft: ESDraft;
  onUpdateDraft: (partial: Partial<ESDraft>, immediate?: boolean) => void;
  activeMode: EditorMode;
  onChangeMode: (mode: EditorMode) => void;
  targetCount: number;
  onChangeTargetCount: (target: number) => void;
  onToggleAudit: () => void;
  auditIssuesCount: number;
  starGuideSlot?: React.ReactNode;
  checklistSlot?: React.ReactNode;
}

interface EditorState {
  content: string;
  cursorPos: number;
  isFocusSentenceEnabled: boolean;
  isTypewriterScrollEnabled: boolean;
  localStarBlocks: StarBlocks;
  hasUnappliedStarChanges: boolean;
}

type EditorAction =
  | { type: 'COMMIT_CONTENT'; content: string; cursorPos: number }
  | { type: 'SET_CURSOR'; cursorPos: number }
  | { type: 'TOGGLE_FOCUS_SENTENCE' }
  | { type: 'TOGGLE_TYPEWRITER' }
  | { type: 'UPDATE_STAR_BLOCK'; field: keyof StarBlocks; value: string }
  | { type: 'APPLY_STAR_TO_CONTENT'; combined: string }
  | { type: 'SET_INITIAL_STAR_BLOCKS'; blocks: StarBlocks }
  | { type: 'CLEAN_FORMATTING'; cleaned: string };

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'COMMIT_CONTENT':
      return { ...state, content: action.content, cursorPos: action.cursorPos };
    case 'SET_CURSOR':
      return { ...state, cursorPos: action.cursorPos };
    case 'TOGGLE_FOCUS_SENTENCE':
      return { ...state, isFocusSentenceEnabled: !state.isFocusSentenceEnabled };
    case 'TOGGLE_TYPEWRITER':
      return { ...state, isTypewriterScrollEnabled: !state.isTypewriterScrollEnabled };
    case 'UPDATE_STAR_BLOCK':
      return {
        ...state,
        localStarBlocks: { ...state.localStarBlocks, [action.field]: action.value },
        hasUnappliedStarChanges: true,
      };
    case 'APPLY_STAR_TO_CONTENT':
      return {
        ...state,
        content: action.combined,
        hasUnappliedStarChanges: false,
      };
    case 'SET_INITIAL_STAR_BLOCKS':
      return {
        ...state,
        localStarBlocks: action.blocks,
      };
    case 'CLEAN_FORMATTING':
      return {
        ...state,
        content: action.cleaned,
      };
    default:
      return state;
  }
}

/**
 * Editor:
 * 下書きの編集セッションを管理する統合オーケストレーター。
 * メタデータ設定（EditorHeaderBar）、本文執筆（WriteWorkspace）、
 * 思考構造化（StarStructureEditor）、版管理プレビュー（DocumentPreview）へ
 * 責務を委譲し、クリーンな単一責任原則を実現。
 */
export const Editor: React.FC<EditorProps> = memo(({
  draft,
  onUpdateDraft,
  activeMode,
  onChangeMode,
  targetCount,
  onChangeTargetCount,
  onToggleAudit,
  auditIssuesCount,
  starGuideSlot,
  checklistSlot,
}) => {
  const [state, dispatch] = useReducer(editorReducer, {
    content: draft.content,
    cursorPos: 0,
    isFocusSentenceEnabled: false,
    isTypewriterScrollEnabled: true,
    localStarBlocks: draft.starBlocks || {
      conclusion: '',
      situation: '',
      action: '',
      result: '',
      contribution: '',
    },
    hasUnappliedStarChanges: false,
  });

  const [isModePending, startTransition] = useTransition();

  // useEffectEvent: エディタ特有のショートカット（Cmd+1/2/3, Cmd+Shift+F）
  const onEditorKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === '1') {
      e.preventDefault();
      startTransition(() => {
        onChangeMode('write');
      });
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '2') {
      e.preventDefault();
      handleTransferToBlocks();
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key === '3') {
      e.preventDefault();
      startTransition(() => {
        onChangeMode('preview');
      });
      return;
    }
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      dispatch({ type: 'TOGGLE_FOCUS_SENTENCE' });
    }
  });

  useEffect(() => {
    window.addEventListener('keydown', onEditorKeyDown);
    return () => {
      window.removeEventListener('keydown', onEditorKeyDown);
    };
  }, []);

  // 本文確定処理
  const handleContentCommit = useCallback((val: string, pos: number) => {
    dispatch({ type: 'COMMIT_CONTENT', content: val, cursorPos: pos });
    onUpdateDraft({ content: val });
  }, [onUpdateDraft]);

  const handleCursorChange = useCallback((pos: number) => {
    dispatch({ type: 'SET_CURSOR', cursorPos: pos });
  }, []);

  // useDeferredValue による高負荷分析の遅延
  const deferredContent = useDeferredValue(state.content);
  const deferredCursorPos = useDeferredValue(state.cursorPos);
  const metrics = calculateMetrics(deferredContent);

  // STAR構成のブロック更新
  const handleStarBlockChange = useCallback((field: keyof StarBlocks, value: string) => {
    dispatch({ type: 'UPDATE_STAR_BLOCK', field, value });
  }, []);

  // STARブロックを本文へ適用
  const handleApplyBlocksToContent = useCallback(() => {
    const combined = assembleStarBlocks(state.localStarBlocks);
    startTransition(() => {
      dispatch({ type: 'APPLY_STAR_TO_CONTENT', combined });
      onUpdateDraft({
        starBlocks: state.localStarBlocks,
        content: combined,
      }, true);
    });
  }, [state.localStarBlocks, onUpdateDraft]);

  // 本文からSTARブロックの初期生成
  const handleTransferToBlocks = useCallback(() => {
    startTransition(() => {
      if (!draft.starBlocks) {
        const sentences = state.content.split(/[。\n]/).filter((s) => s.trim().length > 0);
        const total = sentences.length;
        const initialBlocks: StarBlocks = {
          conclusion: sentences.slice(0, Math.max(1, Math.floor(total * 0.2))).join('。') + (sentences.length > 0 ? '。' : ''),
          situation: sentences.slice(Math.max(1, Math.floor(total * 0.2)), Math.max(2, Math.floor(total * 0.4))).join('。') + (sentences.length > 1 ? '。' : ''),
          action: sentences.slice(Math.max(2, Math.floor(total * 0.4)), Math.max(3, Math.floor(total * 0.7))).join('。') + (sentences.length > 2 ? '。' : ''),
          result: sentences.slice(Math.max(3, Math.floor(total * 0.7)), Math.max(4, Math.floor(total * 0.85))).join('。') + (sentences.length > 3 ? '。' : ''),
          contribution: sentences.slice(Math.max(4, Math.floor(total * 0.85))).join('。') + (sentences.length > 4 ? '。' : ''),
        };
        dispatch({ type: 'SET_INITIAL_STAR_BLOCKS', blocks: initialBlocks });
        onUpdateDraft({ starBlocks: initialBlocks }, true);
      }
      onChangeMode('structure');
    });
  }, [draft.starBlocks, state.content, onChangeMode, onUpdateDraft]);

  // フレーズ挿入
  const handleInsertPhrase = useCallback((phrase: string) => {
    const next = state.content.slice(0, state.cursorPos) + phrase + state.content.slice(state.cursorPos);
    const nextPos = state.cursorPos + phrase.length;
    startTransition(() => {
      dispatch({ type: 'COMMIT_CONTENT', content: next, cursorPos: nextPos });
      onUpdateDraft({ content: next }, true);
    });
  }, [state.content, state.cursorPos, onUpdateDraft]);

  // 書式整理
  const handleCleanFormatting = useCallback(() => {
    const cleaned = cleanForSubmission(state.content);
    startTransition(() => {
      dispatch({ type: 'CLEAN_FORMATTING', cleaned });
      onUpdateDraft({ content: cleaned }, true);
    });
  }, [state.content, onUpdateDraft]);

  // スナップショット保存
  const handleSaveSnapshot = useCallback((label: string) => {
    const newSnapshot: DraftSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: Date.now(),
      label: label.trim() || `${new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} 時点の版`,
      content: state.content,
      charCount: metrics.charsNoWhitespace,
    };
    const existing = draft.snapshots || [];
    startTransition(() => {
      onUpdateDraft({
        snapshots: [newSnapshot, ...existing],
      }, true);
    });
  }, [draft.snapshots, metrics.charsNoWhitespace, onUpdateDraft, state.content]);

  // スナップショット復元
  const handleRestoreSnapshot = useCallback((snap: DraftSnapshot) => {
    startTransition(() => {
      dispatch({ type: 'COMMIT_CONTENT', content: snap.content, cursorPos: 0 });
      onUpdateDraft({ content: snap.content }, true);
    });
  }, [onUpdateDraft]);

  const currentTarget = targetCount || draft.targetCount || 400;

  return (
    <div id="es-main-editor-container" className="flex flex-col gap-2">
      {/* 1. Top Document Metadata Bar */}
      <EditorHeaderBar
        draft={draft}
        onUpdateDraft={onUpdateDraft}
        activeMode={activeMode}
        onChangeMode={(m) => {
          startTransition(() => {
            onChangeMode(m);
          });
        }}
        targetCount={targetCount}
        onChangeTargetCount={(t) => {
          startTransition(() => {
            onChangeTargetCount(t);
          });
        }}
        onTransferToBlocks={handleTransferToBlocks}
        hasUnappliedStarChanges={state.hasUnappliedStarChanges}
        isModePending={isModePending}
      />

      {/* 2. Mode-Specific Workspaces */}
      {activeMode === 'write' && (
        <WriteWorkspace
          content={state.content}
          cursorPos={state.cursorPos}
          isFocusSentenceEnabled={state.isFocusSentenceEnabled}
          isTypewriterScrollEnabled={state.isTypewriterScrollEnabled}
          metrics={metrics}
          deferredContent={deferredContent}
          deferredCursorPos={deferredCursorPos}
          onToggleFocusSentence={() => {
            startTransition(() => {
              dispatch({ type: 'TOGGLE_FOCUS_SENTENCE' });
            });
          }}
          onToggleTypewriter={() => {
            startTransition(() => {
              dispatch({ type: 'TOGGLE_TYPEWRITER' });
            });
          }}
          onCleanFormatting={handleCleanFormatting}
          onContentCommit={handleContentCommit}
          onCursorChange={handleCursorChange}
          onInsertPhrase={handleInsertPhrase}
        />
      )}

      {activeMode === 'structure' && (
        <StarStructureEditor
          currentStarBlocks={state.localStarBlocks}
          onBlockChange={handleStarBlockChange}
          onSwitchToWriteMode={() => {
            startTransition(() => {
              onChangeMode('write');
            });
          }}
          onApplyBlocksToContent={handleApplyBlocksToContent}
          hasUnappliedChanges={state.hasUnappliedStarChanges}
          starGuideSlot={starGuideSlot}
        />
      )}

      {activeMode === 'preview' && (
        <DocumentPreview
          draft={draft}
          charsNoWs={metrics.charsNoWhitespace}
          currentTarget={currentTarget}
          onSaveSnapshot={handleSaveSnapshot}
          onRestoreSnapshot={handleRestoreSnapshot}
          checklistSlot={checklistSlot}
        />
      )}

      {/* 3. Bottom Real-time Metrics Bar */}
      <DeferredMetricsBar
        metrics={metrics}
        targetCount={currentTarget}
        onToggleAudit={() => {
          startTransition(() => {
            onToggleAudit();
          });
        }}
        auditIssuesCount={auditIssuesCount}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

