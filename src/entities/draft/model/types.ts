export type ESQuestionCategory =
  | 'gakuchika'
  | 'shibou'
  | 'pr'
  | 'zasetsu'
  | 'jiku'
  | 'future'
  | 'custom';

export type DraftProgressStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export interface StarBlocks {
  conclusion: string;
  situation: string;
  action: string;
  result: string;
  contribution: string;
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
  /** 未選択を含む。分類はユーザーが明示的に選ぶまで推測しない。 */
  category: ESQuestionCategory | null;
  content: string;
  starBlocks?: StarBlocks;
  isBlockMode: boolean;
  /** 「N字以内」の上限。未選択時に任意の既定値へ置き換えない。 */
  targetCount: number | null;
  /** 作業上の進捗。カテゴリとは独立した、任意の単一選択タグ。 */
  progressStatus?: DraftProgressStatus | null;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  starred?: boolean;
  snapshots?: DraftSnapshot[];
}
