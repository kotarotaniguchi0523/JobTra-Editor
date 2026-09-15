'use client';

import React, { memo } from 'react';
import { Check } from 'lucide-react';
import { JapaneseMetrics } from '../types';

interface DeferredMetricsBarProps {
  metrics: JapaneseMetrics;
  targetCount: number;
  onToggleAudit: () => void;
  auditIssuesCount: number;
}

/**
 * DeferredMetricsBar:
 * 日本語文字数（空白除外/全文字）、90〜100%の適正判定、推敲チェックボタンを
 * 独立したコンポーネント単位に分離。
 * React 19のトランジション中断モデルに従い、キーストローク処理が優先され、
 * メトリクス集計が非同期で反映されます。
 */
export const DeferredMetricsBar: React.FC<DeferredMetricsBarProps> = memo(
  ({ metrics, targetCount, onToggleAudit, auditIssuesCount }) => {
    const charsNoWs = metrics.charsNoWhitespace;
    const currentTarget = targetCount || 400;
    const ratio = currentTarget > 0 ? charsNoWs / currentTarget : 0;
    const isTargetFit = ratio >= 0.9 && ratio <= 1.0;
    const isOver = ratio > 1.0;

    return (
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-lg border border-neutral-200 bg-white p-2.5 shadow-xs sm:px-4">
        {/* Main Character Gauge */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`font-mono text-3xl font-bold tracking-tight ${
                  isTargetFit ? 'text-emerald-700' : isOver ? 'text-rose-600' : 'text-neutral-900'
                }`}
              >
                {charsNoWs}
              </span>
              <span className="font-mono text-sm text-neutral-500">/ {currentTarget} 字</span>
            </div>
            <div className="text-xs text-neutral-500">
              {isTargetFit ? (
                <span className="font-medium text-emerald-700">🎯 90〜100%の理想密度</span>
              ) : isOver ? (
                <span className="font-medium text-rose-600">
                  超過 +{charsNoWs - currentTarget}字
                </span>
              ) : (
                <span>残り {Math.max(0, currentTarget - charsNoWs)}字</span>
              )}
            </div>
          </div>

          <div className="mx-1 hidden h-8 w-px bg-neutral-200 sm:block" />

          {/* Essential Stats (Cleaned & Minimal) */}
          <div className="hidden items-center gap-4 text-sm text-neutral-600 sm:flex">
            <div>
              <span className="block text-xs text-neutral-400">空白含む</span>
              <span className="font-mono font-medium">{metrics.totalChars}字</span>
            </div>
            <div>
              <span className="block text-xs text-neutral-400">一文平均</span>
              <span className="font-mono font-medium">{metrics.avgSentenceLength}字</span>
            </div>
          </div>
        </div>

        {/* Audit Button */}
        <button
          type="button"
          onClick={onToggleAudit}
          className="flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3.5 py-1.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-100"
          title="貴社/御社、ら抜き言葉、文末重複などをチェック"
          aria-label="推敲チェック"
        >
          <span>推敲チェック</span>
          {auditIssuesCount > 0 ? (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800">
              {auditIssuesCount}
            </span>
          ) : (
            <Check className="h-4 w-4 text-emerald-600" />
          )}
        </button>
      </div>
    );
  },
);

DeferredMetricsBar.displayName = 'DeferredMetricsBar';
