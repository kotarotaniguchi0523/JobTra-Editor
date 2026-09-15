import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  desc: string;
}

const CHECKLIST_ITEMS: readonly ChecklistItem[] = [
  { id: 'honorific', title: '企業名・敬称の確認', desc: '「御社」ではなく「貴社」になっているか。略称（株）ではなく「株式会社」と正式表記しているか。' },
  { id: 'conclusion', title: '結論ファースト', desc: '1文目で「私の強みは〜です」「学生時代に注力したのは〜です」と結論が明示されているか。' },
  { id: 'numbers', title: '数字による客観的証明', desc: '「多くの」「大幅に」を「30名の部員」「前年比120%」などの具体的数値に置き換えているか。' },
  { id: 'length', title: '一文の長さの適正化', desc: '一文が60文字以内で、読点（、）でダラダラ繋がず適切にピリオド（。）で切れているか。' },
  { id: 'kanji', title: '漢字とひらがなの比率', desc: '漢字が多すぎて黒く詰まって見えないか（黄金比は漢字25〜30%程度）。' },
  { id: 'future', title: '入社後の貢献（再現性）', desc: '単なる学生時代の自慢話で終わらず、入社後の仕事にどう活きるかまで書かれているか。' },
];

/**
 * SubmissionChecklist - React Server Component (RSC)
 * 提出前プレビュー画面に表示される最終確認チェックリスト。
 * ゼロクライアントJSで完全静的にレンダリングされます。
 */
export function SubmissionChecklist() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-neutral-800" />
          <h4 className="text-sm font-semibold text-neutral-900">
            提出前 最終確認チェックリスト
          </h4>
        </div>
        <span className="text-xs text-neutral-400 font-mono">RSC Static Audit</span>
      </div>

      <p className="text-xs text-neutral-500">
        Webフォーム提出・送信ボタンを押す直前に必ず確認すべき重要チェックポイントです。
      </p>

      <div className="space-y-2.5 pt-1">
        {CHECKLIST_ITEMS.map((item, idx) => (
          <div
            key={item.id}
            className="p-2.5 rounded bg-neutral-50 border border-neutral-200 text-xs flex items-start gap-2.5"
          >
            <div className="w-4 h-4 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 mt-0.5 font-mono text-xs font-semibold">
              {idx + 1}
            </div>
            <div className="space-y-0.5">
              <span className="font-semibold text-neutral-900 block">{item.title}</span>
              <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
