import React from 'react';
import { CheckCircle2, AlertTriangle, Info, ArrowRight, FileCheck2, X } from 'lucide-react';
import type { AuditCheck, JapaneseMetrics } from '@features/writing-assistance/model/types';

interface ReviewPanelProps {
  checks: AuditCheck[];
  metrics: JapaneseMetrics;
  onApplyReplacement: (original: string, suggested: string) => void;
  onClose?: () => void;
  guidelinesSlot?: React.ReactNode;
}

export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  checks,
  metrics,
  onApplyReplacement,
  onClose,
  guidelinesSlot,
}) => {
  const warnings = checks.filter((c) => c.status === 'warning');

  return (
    <div
      id="es-review-panel"
      className="space-y-3.5 rounded-lg border border-neutral-200 bg-white p-4 shadow-xs sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-neutral-100 text-neutral-800">
            <FileCheck2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">ES推敲・文章校正アシスト</h3>
            <p className="text-xs text-neutral-500">
              採用担当者が好むビジネスマナー・可読性・論理性をチェック
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-neutral-500">
            {warnings.length === 0 ? '問題なし' : `要確認 ${warnings.length}件`}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1.5 text-neutral-400 hover:text-neutral-700"
              title="閉じる"
              aria-label="閉じる"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-sm sm:grid-cols-4">
        <div className="rounded bg-neutral-50 p-2.5">
          <span className="block text-xs text-neutral-500">文字数（空白除く）</span>
          <span className="font-mono text-base font-semibold text-neutral-900">
            {metrics.charsNoWhitespace}字
          </span>
        </div>

        <div className="rounded bg-neutral-50 p-2.5">
          <span className="block text-xs text-neutral-500">一文の平均長</span>
          <span
            className={`font-mono text-base font-semibold ${
              metrics.avgSentenceLength > 60 ? 'text-amber-700' : 'text-neutral-900'
            }`}
          >
            {metrics.avgSentenceLength}字
          </span>
        </div>

        <div className="rounded bg-neutral-50 p-2.5">
          <span className="block text-xs text-neutral-500">漢字比率 (理想20-35%)</span>
          <span
            className={`font-mono text-base font-semibold ${
              metrics.kanjiRatio > 40 ? 'text-amber-700' : 'text-neutral-900'
            }`}
          >
            {metrics.kanjiRatio}%
          </span>
        </div>

        <div className="rounded bg-neutral-50 p-2.5">
          <span className="block text-xs text-neutral-500">文の数</span>
          <span className="font-mono text-base font-semibold text-neutral-900">
            {metrics.sentenceCount}文
          </span>
        </div>
      </div>

      {/* Audit List */}
      <div className="space-y-2.5">
        {checks.length === 0 ? (
          <div className="p-4 text-center text-sm text-neutral-400">
            本文を入力すると、自動で文章の校正チェックが実行されます。
          </div>
        ) : (
          checks.map((check) => {
            const isWarning = check.status === 'warning';
            const isPass = check.status === 'pass';

            return (
              <div
                key={check.id}
                className={`rounded-md border p-3.5 transition-colors ${
                  isWarning
                    ? 'border-amber-200 bg-amber-50/50 text-amber-950'
                    : isPass
                      ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {isWarning ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    ) : isPass ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    ) : (
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-neutral-500" />
                    )}
                    <h4 className="text-sm font-semibold">{check.title}</h4>
                  </div>

                  {check.replacement && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyReplacement(
                          check.replacement!.original,
                          check.replacement!.suggested,
                        );
                      }}
                      className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded border border-neutral-300 bg-white px-2.5 py-1 text-xs font-medium text-neutral-800 shadow-2xs transition-colors hover:bg-neutral-100"
                    >
                      <span>「{check.replacement.suggested}」に置換</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <p className="mt-1 pl-6 text-xs leading-relaxed text-neutral-600">
                  {check.message}
                </p>

                {check.detail && (
                  <div className="mt-1.5 pl-6 font-mono text-xs text-neutral-500">
                    {check.detail}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Writing wisdom / guidelines slot (RSC composition) */}
      {guidelinesSlot}
    </div>
  );
};
