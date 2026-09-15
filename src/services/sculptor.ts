/**
 * Redundancy Sculptor (彫刻ノミ)
 * 就活ES特有の冗長表現・二重敬語・文字数喰い表現を高速に検知し、
 * ワンタップで本質的な簡潔表現へ引き締める純粋ロジック。
 * 外部AIゼロ・完全クライアント完結。
 */

export interface RedundancyRule {
  id: string;
  pattern: RegExp;
  replacement: string;
  category: 'politeness' | 'weak_verb' | 'filler' | 'passive';
  label: string;
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

export const REDUNDANCY_RULES: RedundancyRule[] = [
  {
    id: 'kangaete_orimasu',
    pattern: /というふうに考えております/g,
    replacement: 'と考えます',
    category: 'politeness',
    label: 'まわりくどい思考表現',
  },
  {
    id: 'kanou_to_narimashita',
    pattern: /を行うことが可能となりました/g,
    replacement: 'を可能にしました',
    category: 'politeness',
    label: '冗長な可能表現',
  },
  {
    id: 'keiken_sasete_itadakimashita',
    pattern: /という経験をさせていただきました/g,
    replacement: 'を経験しました',
    category: 'politeness',
    label: '過剰な敬語表現',
  },
  {
    id: 'watashijishin_no_tsuyomi',
    pattern: /私自身の強みといたしましては/g,
    replacement: '私の強みは',
    category: 'politeness',
    label: 'まわりくどい主述導入',
  },
  {
    id: 'sasete_itadaite_orimasu',
    pattern: /させていただいております/g,
    replacement: 'しています',
    category: 'politeness',
    label: '過剰な敬語',
  },
  {
    id: 'sasete_itadakimashita',
    pattern: /させていただきました/g,
    replacement: 'しました',
    category: 'politeness',
    label: '過剰な敬語',
  },
  {
    id: 'wo_okonau_koto_ga_dekita',
    pattern: /を行うことができました/g,
    replacement: 'ができました',
    category: 'weak_verb',
    label: '迂言的表現',
  },
  {
    id: 'torikumasete_itadakimashita',
    pattern: /に取り組ませていただきました/g,
    replacement: 'に取り組みました',
    category: 'politeness',
    label: '過剰な敬語',
  },
  {
    id: 'juuyou_de_aru_to_kangaemasu',
    pattern: /することが重要であると考えます/g,
    replacement: 'が重要と考えます',
    category: 'weak_verb',
    label: '簡潔化',
  },
  {
    id: 'ten_ni_tsukimashite_wa',
    pattern: /の点につきましては/g,
    replacement: 'については',
    category: 'filler',
    label: '過剰敬語・接続',
  },
  {
    id: 'kanou_de_aru',
    pattern: /することが可能である/g,
    replacement: 'できる',
    category: 'weak_verb',
    label: '漢語的冗長表現',
  },
  {
    id: 'to_iu_you_na',
    pattern: /というような/g,
    replacement: 'という',
    category: 'filler',
    label: '曖昧なぼかし表現',
  },
  {
    id: 'jinryoku_sasete',
    pattern: /に尽力させていただきました/g,
    replacement: 'に尽力しました',
    category: 'politeness',
    label: '過剰な敬語',
  },
  {
    id: 'kekka_wo_eru_koto_ga',
    pattern: /という結果を得ることができました/g,
    replacement: 'という成果を上げました',
    category: 'weak_verb',
    label: '受け身な結果表現',
  },
  {
    id: 'kouken_suru_koto_ga_dekiru',
    pattern: /貢献することができると考えております/g,
    replacement: '貢献できると考えます',
    category: 'politeness',
    label: '重畳的推量・敬語',
  },
  {
    id: 'hatasu_koto_ga_dekita_nodewanaika',
    pattern: /を果たすことができたのではないかと思っております/g,
    replacement: 'を果たせたと考えています',
    category: 'politeness',
    label: '自信のない過度の謙遜',
  },
  {
    id: 'kokorogakete_iku_shozon',
    pattern: /を心掛けていく所存でございます/g,
    replacement: 'を心掛けます',
    category: 'politeness',
    label: '堅すぎる結び',
  },
  {
    id: 'hijouni_ookuno',
    pattern: /非常に多くの/g,
    replacement: '多数の',
    category: 'filler',
    label: '副詞の引き締め',
  },
  {
    id: 'samazamana_shurui',
    pattern: /様々な種類の/g,
    replacement: '多様な',
    category: 'filler',
    label: '重複表現',
  },
  {
    id: 'koto_ga_ari',
    pattern: /ということがあり、/g,
    replacement: 'ため、',
    category: 'filler',
    label: '冗長な接続',
  },
  {
    id: 'wo_jisshi_suru_koto_ni_yotte',
    pattern: /を実施することによって/g,
    replacement: 'の実施により',
    category: 'weak_verb',
    label: '迂言的手段',
  },
  {
    id: 'torikumi_wo_okonaimashita',
    pattern: /取り組みを行いました/g,
    replacement: '取り組みました',
    category: 'weak_verb',
    label: '二重動詞',
  },
];

/**
 * テキスト全体の冗長箇所を検出してリスト化する
 */
export function detectRedundancies(text: string): RedundancyMatch[] {
  if (!text) return [];

  const matches: RedundancyMatch[] = [];

  for (const rule of REDUNDANCY_RULES) {
    // globalフラグを持つ正規表現のlastIndexをリセット
    rule.pattern.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = rule.pattern.exec(text)) !== null) {
      const original = match[0];
      const charsSaved = original.length - rule.replacement.length;

      // 実際に文字数が短縮される場合のみ提案
      if (charsSaved > 0) {
        matches.push({
          id: `${rule.id}-${match.index}`,
          startIndex: match.index,
          endIndex: match.index + original.length,
          original,
          suggested: rule.replacement,
          charsSaved,
          label: rule.label,
        });
      }
    }
  }

  // 出現順にソート
  matches.sort((a, b) => a.startIndex - b.startIndex);

  // 範囲が重複するマッチがある場合は先頭のものを優先
  const nonOverlapping: RedundancyMatch[] = [];
  let lastEnd = -1;

  for (const m of matches) {
    if (m.startIndex >= lastEnd) {
      nonOverlapping.push(m);
      lastEnd = m.endIndex;
    }
  }

  return nonOverlapping;
}

/**
 * 特定の置換を1つ適用する
 */
export function applySculpt(text: string, match: RedundancyMatch): string {
  if (!text) return '';
  const before = text.slice(0, match.startIndex);
  const after = text.slice(match.endIndex);
  return before + match.suggested + after;
}

/**
 * 検出されたすべての冗長表現を一括で引き締める
 */
export function applyAllSculpts(text: string): {
  newText: string;
  charsSaved: number;
  appliedCount: number;
} {
  const matches = detectRedundancies(text);
  if (matches.length === 0) {
    return { newText: text, charsSaved: 0, appliedCount: 0 };
  }

  let result = text;
  let totalSaved = 0;

  // 末尾から置換することでインデックスのズレを防ぐ
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    result = applySculpt(result, m);
    totalSaved += m.charsSaved;
  }

  return {
    newText: result,
    charsSaved: totalSaved,
    appliedCount: matches.length,
  };
}
