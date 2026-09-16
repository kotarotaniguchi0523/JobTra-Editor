import type { ESQuestionCategory } from '@entities/draft/model/types';

export const CATEGORY_LABELS: Record<ESQuestionCategory, string> = {
  gakuchika: 'ガクチカ（学生時代に力を入れたこと）',
  shibou: '志望動機',
  pr: '自己PR',
  zasetsu: '困難・挫折の克服経験',
  jiku: '就活の軸・大切にしたい価値観',
  future: '将来のキャリアビジョン',
  custom: '自由記述設問',
};
