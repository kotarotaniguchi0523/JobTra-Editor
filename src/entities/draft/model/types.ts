export type ESQuestionCategory =
  | 'gakuchika'
  | 'shibou'
  | 'pr'
  | 'zasetsu'
  | 'jiku'
  | 'future'
  | 'custom';

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
  category: ESQuestionCategory;
  content: string;
  starBlocks?: StarBlocks;
  isBlockMode: boolean;
  targetCount: number;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  starred?: boolean;
  snapshots?: DraftSnapshot[];
}
