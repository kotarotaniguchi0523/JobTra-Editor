import { describe, it, expect } from 'vitest';
import {
  detectRedundancies,
  applySculpt,
  applyAllSculpts,
} from '@features/writing-assistance/lib/sculptor';

describe('Redundancy Sculptor (彫刻ノミ機能) - AAA Blackbox Tests', () => {
  describe('detectRedundancies', () => {
    it('空文字列が入力された場合、空配列を返すこと (Arrange-Act-Assert)', () => {
      // Arrange
      const input = '';

      // Act
      const result = detectRedundancies(input);

      // Assert
      expect(result).toEqual([]);
    });

    it('冗長表現が含まれる場合、正確に検出して削減文字数を算出すること', () => {
      // Arrange
      const input = '私自身の強みといたしましては、目標達成に向けてチームを牽引することです。';

      // Act
      const result = detectRedundancies(input);

      // Assert
      expect(result.length).toBe(1);
      expect(result[0].original).toBe('私自身の強みといたしましては');
      expect(result[0].suggested).toBe('私の強みは');
      expect(result[0].charsSaved).toBe(
        '私自身の強みといたしましては'.length - '私の強みは'.length,
      );
      expect(result[0].charsSaved).toBe(9);
    });

    it('複数の冗長表現が含まれる場合、重複なく先頭から順に検出されること', () => {
      // Arrange
      const input =
        'カフェでのアルバイトという経験をさせていただきました。業務改善を行うことが可能となりました。';

      // Act
      const result = detectRedundancies(input);

      // Assert
      expect(result.length).toBe(2);
      expect(result[0].original).toBe('という経験をさせていただきました');
      expect(result[0].suggested).toBe('を経験しました');
      expect(result[1].original).toBe('を行うことが可能となりました');
      expect(result[1].suggested).toBe('を可能にしました');
    });

    it('呼び出し間で共有ルールの正規表現状態を持ち越さないこと', () => {
      const input = 'させていただきました。させていただきました。';

      const first = detectRedundancies(input);
      const second = detectRedundancies(input);

      expect(second).toEqual(first);
      expect(second).toHaveLength(2);
    });
  });

  describe('applySculpt', () => {
    it('指定された特定の1つの冗長表現のみをきれいに置換すること', () => {
      // Arrange
      const text = 'この経験を通じて貢献することができると考えております。以上です。';
      const matches = detectRedundancies(text);
      expect(matches.length).toBeGreaterThan(0);

      // Act
      const sculptResult = applySculpt(text, matches[0]);

      // Assert
      expect(sculptResult).toBe('この経験を通じて貢献できると考えます。以上です。');
      expect(sculptResult.length).toBeLessThan(text.length);
    });
  });

  describe('applyAllSculpts', () => {
    it('文章内のすべての贅肉表現を一括で削ぎ落とし、正確な削減文字数を返すこと', () => {
      // Arrange
      const text =
        '私自身の強みといたしましては、問題解決力です。カフェでリーダーを担当させていただいております。様々な種類の施策に取り組み、売上向上を行うことが可能となりました。貴社に貢献することができると考えております。';

      // Act
      const { newText, charsSaved, appliedCount } = applyAllSculpts(text);

      // Assert
      expect(appliedCount).toBeGreaterThanOrEqual(4);
      expect(charsSaved).toBeGreaterThan(20);
      expect(newText).toContain('私の強みは');
      expect(newText).toContain('しています');
      expect(newText).toContain('を可能にしました');
      expect(newText).toContain('貢献できると考えます');
      expect(newText.length).toBe(text.length - charsSaved);
    });

    it('冗長表現が一切ない締まった文章の場合、元の文章をそのまま維持すること', () => {
      // Arrange
      const cleanText = '私の強みは課題解決力です。新人離職率を10%低減させました。';

      // Act
      const { newText, charsSaved, appliedCount } = applyAllSculpts(cleanText);

      // Assert
      expect(newText).toBe(cleanText);
      expect(charsSaved).toBe(0);
      expect(appliedCount).toBe(0);
    });
  });
});
