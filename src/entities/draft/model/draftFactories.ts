import type { ESDraft, ESQuestionCategory } from '@entities/draft/model/types';

const DAY_MS = 24 * 60 * 60 * 1_000;

type SampleDraftTemplate = Omit<ESDraft, 'createdAt' | 'updatedAt'> & {
  createdAtOffsetMs: number;
  updatedAtOffsetMs: number;
};

const SAMPLE_DRAFT_TEMPLATES: readonly SampleDraftTemplate[] = [
  {
    id: 'sample-gakuchika-1',
    title: 'カフェアルバイトでの新人離職率改善',
    companyName: '株式会社サンプル商事',
    category: 'gakuchika',
    targetCount: 400,
    isBlockMode: false,
    content: `学生時代に注力したことは、カフェでの新人アルバイトの定着率向上です。私が働く店舗では新人の離職率が40%と高く、業務習得の負担が原因でした。そこで私は「新人育成チェックシート」と「バディ制度」の導入を店長に提案しました。具体的には、習得項目を30個に細分化し、先輩が毎日10分間の振り返りを行う体制を整えました。最初は既存スタッフから「指導時間が増える」との懸念もありましたが、指導マニュアルを動画化して負担を軽減しました。結果として半年後の新人離職率は10%まで激減し、店舗全体の顧客満足度アンケートでも地域1位を獲得しました。この経験から、課題の本質を見極めて周囲を巻き込み、仕組み化で解決する力を培いました。`,
    createdAtOffsetMs: -2 * DAY_MS,
    updatedAtOffsetMs: -1 * DAY_MS,
    tags: ['ガクチカ', 'チーム改善', '定着率向上'],
    starred: true,
  },
  {
    id: 'sample-pr-1',
    title: '定量的分析と粘り強さで課題をやり抜く力',
    companyName: 'テック株式会社',
    category: 'pr',
    targetCount: 300,
    isBlockMode: false,
    content: `私の強みは「データに基づく改善提案力」と「完遂力」です。大学祭の実行委員会で広報リーダーを務めた際、来場者数前年比20%増を目標に掲げました。過去5年分のアンケートを分析したところ、若年層の認知経路の7割がSNSである一方、従来の広報予算の8割が紙チラシに偏っていることを突き止めました。そこでSNS動画発信に注力し、週3回の投稿企画を実施しました。結果、目標を上回る前年比25%増の来場を達成しました。貴社においても、現状を数値で冷静に把握し、最適な施策をやり抜くことで事業貢献いたします。`,
    createdAtOffsetMs: -5 * DAY_MS,
    updatedAtOffsetMs: -3 * DAY_MS,
    tags: ['自己PR', '分析力', '実行力'],
    starred: false,
  },
];

/** Builds fresh sample objects from a caller-provided reference time. */
export function createInitialSampleDrafts(referenceTime: number): ESDraft[] {
  return SAMPLE_DRAFT_TEMPLATES.map(({ createdAtOffsetMs, updatedAtOffsetMs, ...draft }) => ({
    ...draft,
    tags: [...draft.tags],
    createdAt: referenceTime + createdAtOffsetMs,
    updatedAt: referenceTime + updatedAtOffsetMs,
  }));
}

export function buildDraftId(timestamp: number, entropy: string): string {
  return `draft_${timestamp}_${entropy}`;
}

export function buildSnapshotId(timestamp: number, entropy: string): string {
  return `snap_${timestamp}_${entropy}`;
}

export function buildDefaultDraft(
  category: ESQuestionCategory,
  id: string,
  timestamp: number,
): ESDraft {
  return {
    id,
    title: '新規エントリーシート',
    companyName: '',
    category,
    targetCount: 400,
    isBlockMode: false,
    content: '',
    createdAt: timestamp,
    updatedAt: timestamp,
    tags: [],
    starred: false,
    snapshots: [],
  };
}

export function cloneDraft(draft: ESDraft): ESDraft {
  return {
    ...draft,
    tags: [...draft.tags],
    starBlocks: draft.starBlocks ? { ...draft.starBlocks } : undefined,
    snapshots: draft.snapshots?.map((snapshot) => ({ ...snapshot })),
  };
}

export function buildDuplicatedDraft(source: ESDraft, id: string, timestamp: number): ESDraft {
  return {
    ...cloneDraft(source),
    id,
    title: `${source.title} (コピー)`,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
