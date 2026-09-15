import React from 'react';
import { CheckCircle, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

/**
 * AuditGuidelines - React Server Component (RSC)
 * Rendered at build time with zero client JS bundle cost.
 * Provides rich guidance for resume and essay evaluation.
 */
export function AuditGuidelines() {
  return (
    <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 text-[11px] text-neutral-700 space-y-2.5">
      <div className="flex items-center justify-between pb-1.5 border-b border-neutral-200">
        <div className="font-bold text-neutral-900 flex items-center gap-1.5 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>内定獲得のためのES三大原則</span>
        </div>
        <span className="text-[10px] text-neutral-400 font-mono">RSC Static Guide</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-start gap-2 bg-white p-2 rounded border border-neutral-200">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-900 block">1. 一文一義（一文の長さは40〜60字以内）</span>
            <p className="text-neutral-500 text-[10px] leading-relaxed">
              1つの文章に複数の接続詞（「〜ですが」「〜なので」）を繋げると主述のねじれが発生します。読点で繋がず句点「。」で分割してください。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white p-2 rounded border border-neutral-200">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-900 block">2. 定量化と客観的事実の提示</span>
            <p className="text-neutral-500 text-[10px] leading-relaxed">
              「非常に」「大きく貢献」「たくさん」などの主観的形容詞は面接官に響きません。「前年比120%」「30人中1位」「週4回」と数値化します。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 bg-white p-2 rounded border border-neutral-200">
          <ShieldAlert className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-neutral-900 block">3. 敬語と表記統一の厳守</span>
            <p className="text-neutral-500 text-[10px] leading-relaxed">
              ESなどの書面では「貴社」、面接の口頭では「御社」。「〜させていただく」の重複や、「です・ます」と「である」の混在は致命的減点です。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
