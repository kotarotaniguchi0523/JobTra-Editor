"use client";

import React, { useTransition } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ArrowRight,
  FileCheck2,
  X
} from 'lucide-react';
import { AuditCheck, JapaneseMetrics } from '../types';

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
  const [, startTransition] = useTransition();
  const warnings = checks.filter(c => c.status === 'warning');

  return (
    <div id="es-review-panel" className="bg-white rounded-lg border border-neutral-200 p-4 sm:p-5 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-neutral-100 flex items-center justify-center text-neutral-800">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-neutral-900">
              ES推敲・文章校正アシスト
            </h3>
            <p className="text-xs text-neutral-500">
              採用担当者が好むビジネスマナー・可読性・論理性をチェック
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-mono text-neutral-500">
            {warnings.length === 0 ? '問題なし' : `要確認 ${warnings.length}件`}
          </span>
          {onClose && (
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  onClose();
                });
              }}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded"
              title="閉じる"
              aria-label="閉じる"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm">
        <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
          <span className="text-xs text-neutral-400 block">文字数（空白除く）</span>
          <span className="font-mono font-semibold text-neutral-900 text-base">
            {metrics.charsNoWhitespace}字
          </span>
        </div>

        <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
          <span className="text-xs text-neutral-400 block">一文の平均長</span>
          <span className={`font-mono font-semibold text-base ${
            metrics.avgSentenceLength > 60 ? 'text-amber-700' : 'text-neutral-900'
          }`}>
            {metrics.avgSentenceLength}字
          </span>
        </div>

        <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
          <span className="text-xs text-neutral-400 block">漢字比率 (理想20-35%)</span>
          <span className={`font-mono font-semibold text-base ${
            metrics.kanjiRatio > 40 ? 'text-amber-700' : 'text-neutral-900'
          }`}>
            {metrics.kanjiRatio}%
          </span>
        </div>

        <div className="p-3 bg-neutral-50 rounded border border-neutral-200">
          <span className="text-xs text-neutral-400 block">文の数</span>
          <span className="font-mono font-semibold text-neutral-900 text-base">
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
                className={`p-3.5 rounded-md border transition-colors ${
                  isWarning
                    ? 'bg-amber-50/50 border-amber-200 text-amber-950'
                    : isPass
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                    : 'bg-neutral-50 border-neutral-200 text-neutral-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    {isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    ) : isPass ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                    )}
                    <h4 className="text-sm font-semibold">
                      {check.title}
                    </h4>
                  </div>

                  {check.replacement && (
                    <button
                      type="button"
                      onClick={() => {
                        onApplyReplacement(check.replacement!.original, check.replacement!.suggested);
                      }}
                      className="px-2.5 py-1 rounded bg-white hover:bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-300 shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <span>「{check.replacement.suggested}」に置換</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-neutral-600 mt-1 pl-6 leading-relaxed">
                  {check.message}
                </p>

                {check.detail && (
                  <div className="mt-1.5 pl-6 text-xs text-neutral-500 font-mono">
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
