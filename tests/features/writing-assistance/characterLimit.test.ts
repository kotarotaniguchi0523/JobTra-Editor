import { describe, expect, it } from 'vitest';
import { evaluateCharacterLimit } from '@features/writing-assistance/lib/characterLimit';

describe('character limit policy', () => {
  it('上限未選択では判定を出さない', () => {
    expect(evaluateCharacterLimit(530, null)).toEqual({ status: 'unconfigured' });
  });

  it('600字以内では480字からOKとし、530字を推奨帯に含める', () => {
    expect(evaluateCharacterLimit(479, 600)).toMatchObject({ status: 'under', minimum: 480 });
    expect(evaluateCharacterLimit(530, 600)).toMatchObject({
      status: 'ok',
      minimum: 480,
      preferredMaximum: 540,
    });
  });

  it('上限超過を明確に検出する', () => {
    expect(evaluateCharacterLimit(601, 600)).toEqual({ status: 'over', over: 1, percentage: 100 });
  });
});
