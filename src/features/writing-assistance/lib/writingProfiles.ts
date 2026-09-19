import type { ESQuestionCategory } from '@entities/draft/model/types';

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

const profile = (
  label: string,
  ratioLabels: WritingProfile['ratioLabels'],
  phases: WritingProfile['phases'],
): WritingProfile => ({ label, ratioLabels, ratios: [0.25, 0.25, 0.3, 0.2], phases });

const PROFILES: Record<ESQuestionCategory, WritingProfile> = {
  gakuchika: profile('ガクチカ', ['結論', '目標・状況', '工夫・行動', '成果・学び'], {
    conclusion: {
      label: '1. 結論',
      question: '学生時代に最も力を入れたことを、一言で言うと何ですか？',
      tabSuggestion: '学生時代に最も力を入れたことは、',
      explanation: '最初に経験の要点を示します。',
    },
    situation: {
      label: '2. 目標・状況',
      question: 'どんな目標や課題があり、なぜ取り組む必要がありましたか？',
      tabSuggestion: '当時は、',
      explanation: '目標と状況を具体的にします。',
    },
    action: {
      label: '3. 工夫・行動',
      question: 'あなた自身が考え、周囲に働きかけた工夫は何ですか？',
      tabSuggestion: 'そこで私は、',
      explanation: '自分の判断と行動を厚く書きます。',
    },
    result: {
      label: '4. 成果・学び',
      question: '何が変わり、どんな学びを得ましたか？',
      tabSuggestion: 'その結果、',
      explanation: '成果は数値や事実で示します。',
    },
    contribution: {
      label: '5. 活かし方',
      question: '得た力を次にどう活かしますか？',
      tabSuggestion: 'この経験で得た力を、',
      explanation: '経験を将来へ接続します。',
    },
  }),
  pr: profile('自己PR', ['強み', '根拠となる経験', '行動・成果', '再現性・貢献'], {
    conclusion: {
      label: '1. 強み',
      question: 'あなたの強みを一言で言い切ると何ですか？',
      tabSuggestion: '私の強みは、',
      explanation: '主張を先に明確にします。',
    },
    situation: {
      label: '2. 根拠となる経験',
      question: 'その強みが発揮された場面と課題は何ですか？',
      tabSuggestion: 'この強みは、',
      explanation: '強みの根拠となる場面を置きます。',
    },
    action: {
      label: '3. 行動・成果',
      question: 'どのように行動し、どんな成果を出しましたか？',
      tabSuggestion: '私は、',
      explanation: '行動と成果で強みを裏付けます。',
    },
    result: {
      label: '4. 再現性',
      question: '同じ強みを仕事でどう再現しますか？',
      tabSuggestion: '貴社でも、',
      explanation: '仕事での再現性を示します。',
    },
    contribution: {
      label: '5. 貢献',
      question: '強みを通じてどのように貢献しますか？',
      tabSuggestion: 'この強みを活かし、',
      explanation: '貢献で締めくくります。',
    },
  }),
  shibou: profile('志望動機', ['結論・適合', '原体験・課題', '企業理解', '入社後の貢献'], {
    conclusion: {
      label: '1. 結論・適合',
      question: 'なぜこの業界・企業を志望するのですか？',
      tabSuggestion: '貴社を志望する理由は、',
      explanation: '志望の結論を最初に置きます。',
    },
    situation: {
      label: '2. 原体験・課題',
      question: '関心を持つに至った経験や問題意識は何ですか？',
      tabSuggestion: 'その背景には、',
      explanation: '志望の起点を具体化します。',
    },
    action: {
      label: '3. 企業理解',
      question: 'なぜ他社ではなく、この企業なのですか？',
      tabSuggestion: '中でも貴社の、',
      explanation: '調べた事実と自身の価値観を結びます。',
    },
    result: {
      label: '4. 入社後の貢献',
      question: '入社後に何を実現し、どう貢献しますか？',
      tabSuggestion: '入社後は、',
      explanation: '具体的な貢献で締めます。',
    },
    contribution: {
      label: '5. 将来像',
      question: '中長期でどのような価値を届けたいですか？',
      tabSuggestion: '将来的には、',
      explanation: '将来像を一文で補います。',
    },
  }),
  zasetsu: profile('困難・挫折克服', ['出来事', '困難・課題', '対応・行動', '学び・活用'], {
    conclusion: {
      label: '1. 出来事',
      question: 'どのような困難・挫折を経験しましたか？',
      tabSuggestion: '私が最も困難を感じた経験は、',
      explanation: '出来事を端的に示します。',
    },
    situation: {
      label: '2. 困難・課題',
      question: '何が難しく、どんな影響がありましたか？',
      tabSuggestion: '特に課題だったのは、',
      explanation: '困難の重さを具体化します。',
    },
    action: {
      label: '3. 対応・行動',
      question: 'どう向き合い、何を変えましたか？',
      tabSuggestion: 'そこで私は、',
      explanation: '立て直すための行動を中心にします。',
    },
    result: {
      label: '4. 学び',
      question: '結果と、そこから得た学びは何ですか？',
      tabSuggestion: 'この経験から、',
      explanation: '学びを明確にします。',
    },
    contribution: {
      label: '5. 活用',
      question: '学びを今後どう活かしますか？',
      tabSuggestion: '今後も、',
      explanation: '次の行動へつなげます。',
    },
  }),
  jiku: profile('就活の軸', ['価値観', '背景・経験', '判断基準', '企業との接点'], {
    conclusion: {
      label: '1. 価値観',
      question: '就職先を選ぶうえで大切にする軸は何ですか？',
      tabSuggestion: '私が就職先を選ぶうえで大切にするのは、',
      explanation: '価値観を明言します。',
    },
    situation: {
      label: '2. 背景・経験',
      question: 'その価値観を持つようになった経験は何ですか？',
      tabSuggestion: 'この軸を持つようになった背景は、',
      explanation: '価値観の根拠を示します。',
    },
    action: {
      label: '3. 判断基準',
      question: '企業のどの事実を見て判断しますか？',
      tabSuggestion: '企業選びでは、',
      explanation: '抽象論だけで終えないようにします。',
    },
    result: {
      label: '4. 企業との接点',
      question: 'この企業とどこが合うと考えますか？',
      tabSuggestion: '貴社は、',
      explanation: '軸と企業の接点を書きます。',
    },
    contribution: {
      label: '5. 意欲',
      question: 'その環境で何を実現したいですか？',
      tabSuggestion: 'その環境で、',
      explanation: '意欲を簡潔に添えます。',
    },
  }),
  future: profile(
    '入社後キャリア・ビジョン',
    ['目指す姿', '現在地・経験', '行動計画', '実現する貢献'],
    {
      conclusion: {
        label: '1. 目指す姿',
        question: '将来どのような役割・価値を担いたいですか？',
        tabSuggestion: '将来は、',
        explanation: '目指す姿を先に示します。',
      },
      situation: {
        label: '2. 現在地・経験',
        question: 'その志向につながる現在の経験や強みは何ですか？',
        tabSuggestion: 'そのために現在は、',
        explanation: '将来像と現在をつなげます。',
      },
      action: {
        label: '3. 行動計画',
        question: '入社後、どのように力をつけますか？',
        tabSuggestion: '入社後は、',
        explanation: '具体的な成長行動を置きます。',
      },
      result: {
        label: '4. 実現する貢献',
        question: '誰にどのような価値を届けたいですか？',
        tabSuggestion: 'その先には、',
        explanation: '実現する価値を明確にします。',
      },
      contribution: {
        label: '5. 長期視点',
        question: '長期的にどのような存在になりたいですか？',
        tabSuggestion: '長期的には、',
        explanation: '長期視点を補います。',
      },
    },
  ),
  custom: profile('自由記述', ['結論', '背景', '具体例', 'まとめ'], {
    conclusion: {
      label: '1. 結論',
      question: '最も伝えたいことは何ですか？',
      tabSuggestion: '私が最も伝えたいことは、',
      explanation: '伝えたい結論を最初に書きます。',
    },
    situation: {
      label: '2. 背景',
      question: 'その背景や前提は何ですか？',
      tabSuggestion: 'その背景には、',
      explanation: '読み手に必要な背景だけを示します。',
    },
    action: {
      label: '3. 具体例',
      question: '具体的な経験・事実は何ですか？',
      tabSuggestion: '具体的には、',
      explanation: '事実で裏付けます。',
    },
    result: {
      label: '4. まとめ',
      question: 'この内容から何を伝えたいですか？',
      tabSuggestion: 'この経験から、',
      explanation: '結論へ戻ってまとめます。',
    },
    contribution: {
      label: '5. 補足',
      question: '必要な補足はありますか？',
      tabSuggestion: 'さらに、',
      explanation: '必要な場合のみ補足します。',
    },
  }),
};

export function getWritingProfile(category: ESQuestionCategory | null): WritingProfile | null {
  return category ? PROFILES[category] : null;
}
