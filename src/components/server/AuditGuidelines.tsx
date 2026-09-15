import React from 'react';
import { CheckCircle, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

/**
 * AuditGuidelines - React Server Component (RSC)
 * Rendered at build time with zero client JS bundle cost.
 * Provides rich guidance for resume and essay evaluation.
 */
export function AuditGuidelines() {
  return (
    <div className="space-y-2.5 rounded-lg border border-neutral-200 bg-neutral-50 p-3.5 text-xs text-neutral-700">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-1.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-900">
          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
          <span>内定獲得のためのES三大原則</span>
        </div>
        <span className="font-mono text-xs text-neutral-400">RSC Static Guide</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <div className="flex items-start gap-2 rounded bg-white/80 p-2.5">
          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <div>
            <span className="block font-semibold text-neutral-900">
              1. 一文一義（一文の長さは40〜60字以内）
            </span>
            <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
              1つの文章に複数の接続詞（「〜ですが」「〜なので」）を繋げると主述のねじれが発生します。読点で繋がず句点「。」で分割してください。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded bg-white/80 p-2.5">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" />
          <div>
            <span className="block font-semibold text-neutral-900">
              2. 定量化と客観的事実の提示
            </span>
            <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
              「非常に」「大きく貢献」「たくさん」などの主観的形容詞は面接官に響きません。「前年比120%」「30人中1位」「週4回」と数値化します。
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded bg-white/80 p-2.5">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-600" />
          <div>
            <span className="block font-semibold text-neutral-900">3. 敬語と表記統一の厳守</span>
            <p className="mt-0.5 text-xs leading-relaxed text-neutral-600">
              ESなどの書面では「貴社」、面接の口頭では「御社」。「〜させていただく」の重複や、「です・ます」と「である」の混在は致命的減点です。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
