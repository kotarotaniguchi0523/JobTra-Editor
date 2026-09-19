export interface JapaneseMetrics {
  totalChars: number;
  charsNoWhitespace: number;
  linesCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  kanjiCount: number;
  hiraganaCount: number;
  katakanaCount: number;
  kanjiRatio: number;
  longestSentenceLength: number;
}

export interface AuditCheck {
  id: string;
  title: string;
  status: 'pass' | 'warning' | 'info';
  message: string;
  detail?: string;
  replacement?: {
    original: string;
    suggested: string;
  };
}

export type WritingPhase = 'conclusion' | 'situation' | 'action' | 'result' | 'contribution';

export type WritingProfile = {
  label: string;
  ratioLabels: readonly [string, string, string, string];
  ratios: readonly [number, number, number, number];
  phases: Record<
    WritingPhase,
    { label: string; question: string; tabSuggestion: string; explanation: string }
  >;
};

export interface GhostGuidance {
  phase: WritingPhase;
  phaseLabel: string;
  question: string;
  tabSuggestion: string;
  explanation: string;
}

export interface BlockTarget {
  name: string;
  idealRatio: number;
  idealChars: number;
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

export interface RedundancyMatch {
  id: string;
  startIndex: number;
  endIndex: number;
  original: string;
  suggested: string;
  charsSaved: number;
  label: string;
}
