"use client";

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
export const DeferredMetricsBar: React.FC<DeferredMetricsBarProps> = memo(({
  metrics,
  targetCount,
  onToggleAudit,
  auditIssuesCount,
}) => {
  const charsNoWs = metrics.charsNoWhitespace;
  const currentTarget = targetCount || 400;
  const ratio = currentTarget > 0 ? charsNoWs / currentTarget : 0;
  const isTargetFit = ratio >= 0.9 && ratio <= 1.0;
  const isOver = ratio > 1.0;

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-2.5 sm:px-4 flex flex-wrap items-center justify-between gap-2.5 shadow-xs">
      {/* Main Character Gauge */}
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-bold font-mono tracking-tight ${
                isTargetFit ? 'text-emerald-700' : isOver ? 'text-rose-600' : 'text-neutral-900'
              }`}
            >
              {charsNoWs}
            </span>
            <span className="text-sm text-neutral-500 font-mono">
              / {currentTarget} 字
            </span>
          </div>
          <div className="text-xs text-neutral-500">
            {isTargetFit ? (
              <span className="text-emerald-700 font-medium">🎯 90〜100%の理想密度</span>
            ) : isOver ? (
              <span className="text-rose-600 font-medium">超過 +{charsNoWs - currentTarget}字</span>
            ) : (
              <span>残り {Math.max(0, currentTarget - charsNoWs)}字</span>
            )}
          </div>
        </div>

        <div className="hidden sm:block h-8 w-px bg-neutral-200 mx-1" />

        {/* Essential Stats (Cleaned & Minimal) */}
        <div className="hidden sm:flex items-center gap-4 text-sm text-neutral-600">
          <div>
            <span className="text-neutral-400 text-xs block">空白含む</span>
            <span className="font-mono font-medium">{metrics.totalChars}字</span>
          </div>
          <div>
            <span className="text-neutral-400 text-xs block">一文平均</span>
            <span className="font-mono font-medium">{metrics.avgSentenceLength}字</span>
          </div>
        </div>
      </div>

      {/* Audit Button */}
      <button
        type="button"
        onClick={onToggleAudit}
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-md border text-sm font-medium transition-colors cursor-pointer bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800"
        title="貴社/御社、ら抜き言葉、文末重複などをチェック"
        aria-label="推敲チェック"
      >
        <span>推敲チェック</span>
        {auditIssuesCount > 0 ? (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-mono text-xs rounded-full font-semibold">
            {auditIssuesCount}
          </span>
        ) : (
          <Check className="w-4 h-4 text-emerald-600" />
        )}
      </button>
    </div>
  );
});

DeferredMetricsBar.displayName = 'DeferredMetricsBar';
