import { describe, it, expect } from 'vitest';
import { analyzeGhostContext } from '../src/services/ghostGuidance';

describe('Ghost Guidance (思考の伴走ゴースト) - AAA Blackbox Tests', () => {
  it('白紙または開始直後は「結論・強み」の問いかけとTab補完を提示すること', () => {
    // Arrange
    const emptyText = '';
    const cursor = 0;

    // Act
    const guidance = analyzeGhostContext(emptyText, cursor);

    // Assert
    expect(guidance.phase).toBe('conclusion');
    expect(guidance.question).toContain('強み');
    expect(guidance.tabSuggestion).toContain('私の強みは');
  });

  it('結論の1文目を書き終えた直後は「状況と課題」の問いかけを提示すること', () => {
    // Arrange
    const text = '私の強みは、目標に向かって周囲を巻き込む完遂力です。';
    const cursor = text.length;

    // Act
    const guidance = analyzeGhostContext(text, cursor);

    // Assert
    expect(guidance.phase).toBe('situation');
    expect(guidance.question).toContain('課題');
    expect(guidance.tabSuggestion).toContain('課題');
  });

  it('課題・困難を記述した後は「独自の工夫・行動」の問いかけを提示すること', () => {
    // Arrange
    const text =
      '私の強みは行動力です。当時、アルバイト先では新人の離職率が40%と高く、育成の仕組み不足が大きな課題となっていました。';
    const cursor = text.length;

    // Act
    const guidance = analyzeGhostContext(text, cursor);

    // Assert
    expect(guidance.phase).toBe('action');
    expect(guidance.question).toContain('工夫');
    expect(guidance.tabSuggestion).toContain('そこで私は');
  });

  it('独自の工夫・行動を記述した後は「結果・成果」の問いかけを提示すること', () => {
    // Arrange
    const text =
      '私の強みは行動力です。当時、新人の離職率が課題でした。そこで私は、業務内容を分解した新人育成シートを自ら考案し、先輩全員と共有する取り組みを行いました。';
    const cursor = text.length;

    // Act
    const guidance = analyzeGhostContext(text, cursor);

    // Assert
    expect(guidance.phase).toBe('result');
    expect(guidance.question).toContain('変化');
    expect(guidance.tabSuggestion).toContain('その結果');
  });

  it('成果を記述した後は「入社後の貢献」の問いかけを提示すること', () => {
    // Arrange
    const text =
      '私の強みは行動力です。当時、新人の離職率が課題でした。そこで私は、新人育成シートを考案しました。その結果、離職率は10%まで改善され、店舗売上も目標を達成しました。';
    const cursor = text.length;

    // Act
    const guidance = analyzeGhostContext(text, cursor);

    // Assert
    expect(guidance.phase).toBe('contribution');
    expect(guidance.question).toContain('貢献');
    expect(guidance.tabSuggestion).toContain('貴社におい');
  });
});
