import { describe, it, expect } from 'vitest';
import { extractFocusSentence } from '@features/writing-assistance/lib/focusSentence';

describe('extractFocusSentence Pure Logic - AAA Tests', () => {
  it('空文字列の場合は空のコンテキストを返すこと', () => {
    // Arrange
    const text = '';
    const cursorPos = 0;

    // Act
    const result = extractFocusSentence(text, cursorPos);

    // Assert
    expect(result.beforeText).toBe('');
    expect(result.focusSentence).toBe('');
    expect(result.afterText).toBe('');
    expect(result.totalSentences).toBe(0);
  });

  it('文の途中にカーソルがある場合、その一文をフォーカスとして抽出し前後を正しく分割すること', () => {
    // Arrange
    const text =
      '私の強みは粘り強さです。学生時代はカフェの離職率低減に挑みました。結果として離職率が半減しました。';
    // 「カフェの離職率低減」のあたり（インデックス 20）
    const cursorPos = 20;

    // Act
    const result = extractFocusSentence(text, cursorPos);

    // Assert
    expect(result.beforeText).toBe('私の強みは粘り強さです。');
    expect(result.focusSentence).toBe('学生時代はカフェの離職率低減に挑みました。');
    expect(result.afterText).toBe('結果として離職率が半減しました。');
  });

  it('改行区切りの文でも正しく判定すること', () => {
    // Arrange
    const text = '第一の理由です\n第二の理由です\n第三の理由です';
    const cursorPos = 10; // 「第二の理由です」の中

    // Act
    const result = extractFocusSentence(text, cursorPos);

    // Assert
    expect(result.beforeText).toBe('第一の理由です\n');
    expect(result.focusSentence).toBe('第二の理由です\n');
    expect(result.afterText).toBe('第三の理由です');
  });

  it('先頭の文にカーソルがある場合、beforeTextが空になること', () => {
    // Arrange
    const text = '最初の一文です。次の一文です。';
    const cursorPos = 2;

    // Act
    const result = extractFocusSentence(text, cursorPos);

    // Assert
    expect(result.beforeText).toBe('');
    expect(result.focusSentence).toBe('最初の一文です。');
    expect(result.afterText).toBe('次の一文です。');
  });
});
