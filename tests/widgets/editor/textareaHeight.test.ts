import { describe, expect, it } from 'vitest';
import { getTextareaHeight } from '@widgets/editor/lib/textareaHeight';

describe('textarea auto height', () => {
  it('最小高さを下回らず、内容が増えたときだけ伸びる', () => {
    expect(getTextareaHeight(120, 340)).toBe(340);
    expect(getTextareaHeight(612.2, 340)).toBe(613);
  });
});
