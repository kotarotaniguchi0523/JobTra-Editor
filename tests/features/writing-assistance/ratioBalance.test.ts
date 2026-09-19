import { describe, it, expect } from 'vitest';
import { calculateRatioBalance } from '@features/writing-assistance/lib/ratioBalance';

describe('Ratio Balance (黄金比バランス計算) - AAA Blackbox Tests', () => {
  it('本文が空の場合、各ブロックが未記入（empty）となり適切なアドバイスが返ること', () => {
    // Arrange
    const text = '';
    const target = 400;

    // Act
    const result = calculateRatioBalance(text, target, 'gakuchika');

    // Assert
    expect(result.totalActualChars).toBe(0);
    expect(result.targetChars).toBe(400);
    expect(result.blocks.conclusion.status).toBe('empty');
    expect(result.blocks.conclusion.idealChars).toBe(100); // 25% of 400
    expect(result.blocks.situation.idealChars).toBe(100); // 25% of 400
    expect(result.blocks.action.idealChars).toBe(120); // 30% of 400
    expect(result.blocks.resultAndContribution.idealChars).toBe(80); // 20% of 400
    expect(result.overallAdvice).toContain('結論から');
  });

  it('状況説明ばかり長く工夫が少ない場合、不均衡を検知してアドバイスすること', () => {
    // Arrange
    // 状況説明が極端に長い文章
    const text = `私の強みは粘り強さです。当時、アルバイト先では様々な課題がありました。スタッフの連絡不足やシフトの乱れ、さらに顧客アンケートの不満など、非常に多くの困難な問題が同時に発生しており、店舗全体の士気も下がり続けているという厳しい状況と背景がありました。そこで少し改善しました。結果良くなりました。`;
    const target = 400;

    // Act
    const result = calculateRatioBalance(text, target, 'gakuchika');

    // Assert
    expect(result.blocks.situation.actualChars).toBeGreaterThan(50);
    expect(result.blocks.action.status).toBe('short');
    expect(result.overallAdvice).toContain('工夫');
  });

  it('工夫と行動がしっかり書かれた400字ESで適切なバランス判定を行うこと', () => {
    // Arrange
    const text =
      '私の強みは課題解決力です。カフェで新人離職率が40%と高く、指導体制の欠如が課題でした。そこで私は業務を30項目に細分化した育成チェックシートを作成し、先輩が毎日5分間フィードバックを行うバディ制度を提案・導入しました。その結果、離職率は10%に低下し、エリア最優秀店舗賞を受賞しました。貴社でもこの仕組み化の力を活かします。';
    const target = 400;

    // Act
    const result = calculateRatioBalance(text, target, 'gakuchika');

    // Assert
    expect(result.totalActualChars).toBeGreaterThan(150);
    expect(result.blocks.conclusion.actualChars).toBeGreaterThan(0);
    expect(result.blocks.action.actualChars).toBeGreaterThan(50);
    expect(result.blocks.resultAndContribution.actualChars).toBeGreaterThan(0);
  });
});
