/**
 * Ghost Guidance (思考の伴走ゴースト)
 * カーソル位置と前後の文脈（結論・状況・工夫・成果・貢献）をミリ秒で解析し、
 * 白紙で止まらないための「直接的な問いかけ」と「Tabキー補完フレーズ」を提供する純粋ロジック。
 */

export type ESPhase = 'conclusion' | 'situation' | 'action' | 'result' | 'contribution';

export interface GhostGuidance {
  phase: ESPhase;
  phaseLabel: string;
  question: string;
  tabSuggestion: string;
  explanation: string;
}

const PHASE_CONFIG: Record<ESPhase, Omit<GhostGuidance, 'phase'>> = {
  conclusion: {
    phaseLabel: '1. 結論・強み',
    question: '一言で表すあなたの最大の強み、または成し遂げた成果は何ですか？',
    tabSuggestion: '私の強みは、困難な状況でも諦めずに周囲を巻き込む完遂力です。',
    explanation:
      '採用担当者は冒頭数秒で読み進めるかを判断します。まずズバリ結論を言い切るのが鉄則です。',
  },
  situation: {
    phaseLabel: '2. 状況と課題',
    question: '当時直面した一番の壁や困難、周囲の具体的な課題は何でしたか？',
    tabSuggestion: '当時直面した最大の課題は、',
    explanation:
      '課題の難易度や制約条件（時間・人数・目標値）を具体的に書くことで、後の行動が際立ちます。',
  },
  action: {
    phaseLabel: '3. 独自の工夫・行動',
    question: '他の人とは違う、あなた自身の独自の工夫や具体的なアクションは何ですか？',
    tabSuggestion: 'そこで私は、現状を打開するために',
    explanation:
      '「ただ頑張った」ではなく、なぜその方法を選んだのかの思考プロセスと具体的な施策を書きます。',
  },
  result: {
    phaseLabel: '4. 結果・学び',
    question: 'その行動によって数値や周囲はどう変化しましたか？（客観的成果と学び）',
    tabSuggestion: 'その結果、半年後には目標を大きく上回り、',
    explanation:
      '数字の変化（前年比○%増など）や周囲からの信頼・評価の言葉を客観的事実として書きます。',
  },
  contribution: {
    phaseLabel: '5. 入社後の貢献',
    question: 'この経験で培った強みを、志望先でどのように活かして貢献しますか？',
    tabSuggestion: '貴社においても、この培った完遂力を活かし、',
    explanation:
      '過去の自慢で終わらせず、「入社後にどう会社に利益をもたらすか」へ接続して締めくくります。',
  },
};

/**
 * テキストとカーソル位置から、現在の執筆フェーズを推定する
 */
export function analyzeGhostContext(text: string, cursorPosition: number): GhostGuidance {
  const trimmed = text.trim();

  // 1. 完全白紙または冒頭50字未満で句点がない場合 -> 結論
  if (!trimmed || trimmed.length === 0) {
    return {
      phase: 'conclusion',
      ...PHASE_CONFIG.conclusion,
    };
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
    return {
      phase: 'contribution',
      ...PHASE_CONFIG.contribution,
    };
  }

  // 3. 行動・工夫が出た後の文脈 -> 結果・成果
  const hasActionKeywords =
    /(そこで私|取り組みとして|工夫として|施策として|提案し|働きかけ|構築し|徹底し)/.test(
      activeContent,
    );
  if (hasActionKeywords && !hasResultKeywords && sentenceCount >= 3) {
    return {
      phase: 'result',
      ...PHASE_CONFIG.result,
    };
  }

  // 4. 課題・状況が出た後の文脈 -> 独自の工夫・行動
  const hasSituationKeywords = /(当時|背景|課題|問題|困難|直面|不足|壁と)/.test(activeContent);
  if (hasSituationKeywords && !hasActionKeywords) {
    return {
      phase: 'action',
      ...PHASE_CONFIG.action,
    };
  }

  // 5. 1文目を書き終えた、または「強み」「注力」を言った直後 -> 状況と課題
  const hasConclusionKeywords = /(私の強み|注力した|力を注ぎ|成し遂げ|最も打ち込)/.test(
    activeContent,
  );
  if (hasConclusionKeywords || sentenceCount === 1) {
    return {
      phase: 'situation',
      ...PHASE_CONFIG.situation,
    };
  }

  // 文数によるフォールバック
  if (sentenceCount >= 5) {
    return { phase: 'contribution', ...PHASE_CONFIG.contribution };
  }
  if (sentenceCount >= 4) {
    return { phase: 'result', ...PHASE_CONFIG.result };
  }
  if (sentenceCount >= 2) {
    return { phase: 'action', ...PHASE_CONFIG.action };
  }

  return {
    phase: 'situation',
    ...PHASE_CONFIG.situation,
  };
}
