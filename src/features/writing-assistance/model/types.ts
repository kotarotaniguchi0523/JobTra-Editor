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
