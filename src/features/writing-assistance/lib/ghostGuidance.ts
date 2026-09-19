/**
 * Ghost Guidance (思考の伴走ゴースト)
 * カーソル位置と前後の文脈を解析し、カテゴリ固定の構成に沿って
 * 白紙で止まらないための「直接的な問いかけ」と「Tabキー補完フレーズ」を提供する純粋ロジック。
 */

import type { ESQuestionCategory } from '@entities/draft/model/types';
import {
  getWritingProfile,
  type WritingPhase,
} from '@features/writing-assistance/lib/writingProfiles';

export interface GhostGuidance {
  phase: WritingPhase;
  phaseLabel: string;
  question: string;
  tabSuggestion: string;
  explanation: string;
}

/**
 * テキストとカーソル位置から、現在の執筆フェーズを推定する
 */
export function analyzeGhostContext(
  text: string,
  cursorPosition: number,
  category: ESQuestionCategory | null,
): GhostGuidance | null {
  const profile = getWritingProfile(category);
  if (!profile) return null;
  const guidanceFor = (phase: WritingPhase): GhostGuidance => ({
    phase,
    phaseLabel: profile.phases[phase].label,
    question: profile.phases[phase].question,
    tabSuggestion: profile.phases[phase].tabSuggestion,
    explanation: profile.phases[phase].explanation,
  });
  const trimmed = text.trim();

  // 1. 完全白紙または冒頭50字未満で句点がない場合 -> 結論
  if (!trimmed || trimmed.length === 0) {
    return guidanceFor('conclusion');
  }

  // カーソル直前までのテキストを文脈とする
  const textBeforeCursor = text.slice(0, Math.max(0, cursorPosition)).trim();
  const activeContent = textBeforeCursor || trimmed;

  // 句点による文の分割
  const sentences = activeContent
    .split(/[。\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const sentenceCount = sentences.length;

  // 2. 成果・結果が出た後の文脈 -> 入社後の貢献
  const hasResultKeywords = /(その結果|成果を|達成し|学びを得|評価をいた|改善され|向上しまし)/.test(
    activeContent,
  );
  const hasContributionKeywords = /(貴社におい|入社後|貢献いた|活かして|努めてまい)/.test(
    activeContent,
  );

  if (hasResultKeywords && !hasContributionKeywords && sentenceCount >= 4) {
    return guidanceFor('contribution');
  }

  // 3. 行動・工夫が出た後の文脈 -> 結果・成果
  const hasActionKeywords =
    /(そこで私|取り組みとして|工夫として|施策として|提案し|働きかけ|構築し|徹底し)/.test(
      activeContent,
    );
  if (hasActionKeywords && !hasResultKeywords && sentenceCount >= 3) {
    return guidanceFor('result');
  }

  // 4. 課題・状況が出た後の文脈 -> 独自の工夫・行動
  const hasSituationKeywords = /(当時|背景|課題|問題|困難|直面|不足|壁と)/.test(activeContent);
  if (hasSituationKeywords && !hasActionKeywords) {
    return guidanceFor('action');
  }

  // 5. 1文目を書き終えた、または「強み」「注力」を言った直後 -> 状況と課題
  const hasConclusionKeywords = /(私の強み|注力した|力を注ぎ|成し遂げ|最も打ち込)/.test(
    activeContent,
  );
  if (hasConclusionKeywords || sentenceCount === 1) {
    return guidanceFor('situation');
  }

  // 文数によるフォールバック
  if (sentenceCount >= 5) {
    return guidanceFor('contribution');
  }
  if (sentenceCount >= 4) {
    return guidanceFor('result');
  }
  if (sentenceCount >= 2) {
    return guidanceFor('action');
  }

  return guidanceFor('situation');
}
