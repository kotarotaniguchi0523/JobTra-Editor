export type ESQuestionCategory =
  | 'gakuchika' // ガクチカ（学生時代に力を入れたこと）
  | 'shibou' // 志望動機
  | 'pr' // 自己PR
  | 'zasetsu' // 困難・挫折克服
  | 'jiku' // 就活の軸・価値観
  | 'future' // 入社後のビジョン・キャリア
  | 'custom'; // 自由記述

export const CATEGORY_LABELS: Record<ESQuestionCategory, string> = {
  gakuchika: 'ガクチカ（学生時代に力を入れたこと）',
  shibou: '志望動機',
  pr: '自己PR',
  zasetsu: '困難・挫折の克服経験',
  jiku: '就活の軸・大切にしたい価値観',
  future: '将来のキャリアビジョン',
  custom: '自由記述設問',
};

export interface StarBlocks {
  conclusion: string; // 結論・強み（一言で何を伝達するか）
  situation: string; // 状況・直面した課題や背景
  action: string; // 独自の工夫や具体的な行動
  result: string; // 数値的成果・周囲の変化・学び
  contribution: string; // 志望先企業での活かし方・貢献
}

export interface DraftSnapshot {
  id: string;
  label: string;
  content: string;
  charCount: number;
  timestamp: number;
}

export interface ESDraft {
  id: string;
  title: string;
  companyName: string;
  category: ESQuestionCategory;
  content: string;
  starBlocks?: StarBlocks;
  isBlockMode: boolean;
  targetCount: number; // e.g. 200, 300, 400, 500, 600, 800
  createdAt: number;
  updatedAt: number;
  tags: string[];
  starred?: boolean;
  snapshots?: DraftSnapshot[];
}

export interface JapaneseMetrics {
  totalChars: number;
  charsNoWhitespace: number;
  linesCount: number;
  sentenceCount: number;
  avgSentenceLength: number;
  kanjiCount: number;
  hiraganaCount: number;
  katakanaCount: number;
  kanjiRatio: number; // 0 - 100%
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

/** エディタの表示・編集モードを表す型 */
export type EditorMode = 'write' | 'structure' | 'preview';

/**
 * サイドバーの絞り込み検索条件
 */
export interface FilterCriteria {
  query: string;
  category: string;
  starredOnly: boolean;
}
