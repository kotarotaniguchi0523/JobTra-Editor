import type { DraftProgressStatus } from '@entities/draft/model/types';

export const PROGRESS_STATUS_LABELS: Record<DraftProgressStatus, string> = {
  not_started: '未着手',
  in_progress: '進行中',
  paused: '一時停止',
  completed: '完了',
};

export function getProgressStatusLabel(status: DraftProgressStatus | null): string {
  return status ? PROGRESS_STATUS_LABELS[status] : '進捗未設定';
}
