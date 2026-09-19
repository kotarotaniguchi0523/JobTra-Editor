/**
 * Ratio Balance (黄金比バランス計算)
 * カテゴリごとに固定された構成プロファイルと本文の比率を対比する純粋ロジック。
 */

import type { ESQuestionCategory } from '@entities/draft/model/types';
import { getWritingProfile } from '@features/writing-assistance/lib/writingProfiles';

interface BlockTarget {
  name: string;
  idealRatio: number; // 例: 0.1 (10%)
  idealChars: number; // 例: 40文字 (400字の場合)
  actualChars: number;
  actualRatio: number;
  status: 'perfect' | 'short' | 'long' | 'empty';
  feedback: string;
}

export interface RatioBalanceResult {
  totalActualChars: number;
  targetChars: number | null;
  profileLabel: string;
  blocks: {
    conclusion: BlockTarget;
    situation: BlockTarget;
    action: BlockTarget;
    resultAndContribution: BlockTarget;
  };
  overallAdvice: string;
}

/**
 * 本文の文数やキーワードから各パートの文字数を大まかに推計し、
 * 黄金比率（10:20:45:25）と比較する
 */
export function calculateRatioBalance(
  text: string,
  targetCount: number | null,
  category: ESQuestionCategory,
): RatioBalanceResult {
  const charsNoWs = text.replace(/\s+/g, '').length;
  const profile = getWritingProfile(category);
  if (!profile) throw new Error('A writing profile is required for ratio balance.');
  const target = targetCount ? Math.max(100, targetCount) : null;

  // 本文を句点で分割
  const rawSentences = text
    .split(/[。\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let conclusionChars = 0;
  let situationChars = 0;
  let actionChars = 0;
  let resultChars = 0;

  if (rawSentences.length === 0) {
    // 空の場合
  } else if (rawSentences.length === 1) {
    conclusionChars = rawSentences[0].length;
  } else {
    // 1文目は結論
    conclusionChars = rawSentences[0].length;

    // 2文目以降を文脈キーワードで仕分け
    for (let i = 1; i < rawSentences.length; i++) {
      const sentence = rawSentences[i];
      const len = sentence.length;

      if (/(その結果|達成|評価|学び|貴社|貢献|活かし)/.test(sentence)) {
        resultChars += len;
      } else if (/(そこで|取り組み|工夫|施策|提案|働きかけ|構築|徹底)/.test(sentence)) {
        actionChars += len;
      } else if (/(当時|課題|問題|困難|背景|不足)/.test(sentence)) {
        situationChars += len;
      } else {
        // キーワードがない場合は出現位置で按分
        const relativePos = i / rawSentences.length;
        if (relativePos < 0.35) {
          situationChars += len;
        } else if (relativePos < 0.75) {
          actionChars += len;
        } else {
          resultChars += len;
        }
      }
    }
  }

  // 評価ヘルパー
  const evaluate = (name: string, idealRatio: number, actual: number): BlockTarget => {
    const ideal = target ? Math.round(target * idealRatio) : 0;
    const actualRatio = charsNoWs > 0 ? actual / charsNoWs : 0;

    let status: BlockTarget['status'] = 'perfect';
    let feedback = '適切な分量です';

    if (actual === 0) {
      status = 'empty';
      feedback = 'まだ書かれていません';
    } else if (ideal > 0 && actual < ideal * 0.7) {
      status = 'short';
      feedback = `目標より少なめです (理想: 約${ideal}字)`;
    } else if (ideal > 0 && actual > ideal * 1.35) {
      status = 'long';
      feedback = `少し長すぎます。簡潔に削りましょう (理想: 約${ideal}字)`;
    }

    return {
      name,
      idealRatio,
      idealChars: ideal,
      actualChars: actual,
      actualRatio: Math.round(actualRatio * 100),
      status,
      feedback,
    };
  };

  const conclusion = evaluate(
    `${profile.ratioLabels[0]} (${Math.round(profile.ratios[0] * 100)}%)`,
    profile.ratios[0],
    conclusionChars,
  );
  const situation = evaluate(
    `${profile.ratioLabels[1]} (${Math.round(profile.ratios[1] * 100)}%)`,
    profile.ratios[1],
    situationChars,
  );
  const action = evaluate(
    `${profile.ratioLabels[2]} (${Math.round(profile.ratios[2] * 100)}%)`,
    profile.ratios[2],
    actionChars,
  );
  const resultAndContribution = evaluate(
    `${profile.ratioLabels[3]} (${Math.round(profile.ratios[3] * 100)}%)`,
    profile.ratios[3],
    resultChars,
  );

  // 全体総括
  let overallAdvice = 'バランス良く書けています。';
  if (charsNoWs === 0) {
    overallAdvice = 'まずは一文目の結論から書き始めましょう。';
  } else if (situation.status === 'long' && action.status === 'short') {
    overallAdvice =
      '「状況や課題の説明」が長くなっています。状況を削り、自分自身の「工夫・行動」をもっと増やしましょう。';
  } else if (action.status === 'short') {
    overallAdvice =
      '選考官が最も重視する「独自の工夫・行動」が少なめです。具体的な行動プロセスを厚くしましょう。';
  } else if (conclusion.status === 'long') {
    overallAdvice = '結論が長くなっています。一言で言い切る短い文に整えると伝わりやすくなります。';
  }

  return {
    totalActualChars: charsNoWs,
    targetChars: target,
    profileLabel: profile.label,
    blocks: {
      conclusion,
      situation,
      action,
      resultAndContribution,
    },
    overallAdvice,
  };
}
