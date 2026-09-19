import React from 'react';
import { RatioBalanceResult } from '@features/writing-assistance/lib/ratioBalance';
import { BarChart3, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RatioBalanceMeterProps {
  balance: RatioBalanceResult;
}

export const RatioBalanceMeter: React.FC<RatioBalanceMeterProps> = ({ balance }) => {
  const blocks = [
    {
      key: 'conclusion',
      block: balance.blocks.conclusion,
      color: 'bg-indigo-500',
      barBg: 'bg-indigo-100',
    },
    {
      key: 'situation',
      block: balance.blocks.situation,
      color: 'bg-amber-500',
      barBg: 'bg-amber-100',
    },
    {
      key: 'action',
      block: balance.blocks.action,
      color: 'bg-emerald-500',
      barBg: 'bg-emerald-100',
    },
    {
      key: 'resultAndContribution',
      block: balance.blocks.resultAndContribution,
      color: 'bg-sky-500',
      barBg: 'bg-sky-100',
    },
  ];

  return (
    <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
          <BarChart3 className="h-3.5 w-3.5 text-neutral-500" />
          <span>{balance.profileLabel}の構成バランス</span>
        </div>
        <span className="text-xs text-neutral-500">
          {balance.targetChars ? `上限 ${balance.targetChars}字 基準` : '上限未設定'}
        </span>
      </div>

      {/* Grid of Blocks */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {blocks.map(({ key, block, color, barBg }) => {
          const ratioPercent = Math.min(
            100,
            Math.round((block.actualChars / Math.max(1, block.idealChars)) * 100),
          );

          return (
            <div key={key} className="space-y-1 rounded bg-white/80 p-2">
              <div className="flex items-center justify-between text-xs">
                <span className="truncate font-medium text-neutral-700">{block.name}</span>
                <span className="font-mono text-neutral-500">{block.actualChars}字</span>
              </div>

              {/* Progress bar compared to ideal target */}
              <div className={`h-1.5 w-full ${barBg} overflow-hidden rounded-full`}>
                <div
                  className={`h-full ${color} rounded-full transition-all duration-300`}
                  style={{ width: `${ratioPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs text-neutral-500">
                <span>目安: 約{block.idealChars}字</span>
                {block.status === 'perfect' && (
                  <span className="flex items-center gap-0.5 font-medium text-emerald-700">
                    <CheckCircle2 className="h-2.5 w-2.5" /> 良好
                  </span>
                )}
                {block.status === 'short' && (
                  <span className="font-medium text-amber-700">不足気味</span>
                )}
                {block.status === 'long' && <span className="font-medium text-rose-600">長め</span>}
                {block.status === 'empty' && <span className="text-neutral-400">未記入</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Advice note */}
      <div className="flex items-start gap-1.5 pt-0.5 text-xs text-neutral-600">
        <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-400" />
        <p className="leading-normal">{balance.overallAdvice}</p>
      </div>
    </div>
  );
};
