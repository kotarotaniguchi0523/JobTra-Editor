export type CharacterLimitEvaluation =
  | { status: 'unconfigured' }
  | { status: 'under'; minimum: number; remaining: number; percentage: number }
  | { status: 'ok'; minimum: number; preferredMaximum: number; percentage: number }
  | { status: 'over'; over: number; percentage: number };

/** 上限字数に対する達成度を、副作用なしで評価する。 */
export function evaluateCharacterLimit(
  charsNoWhitespace: number,
  characterLimit: number | null,
): CharacterLimitEvaluation {
  if (!characterLimit) return { status: 'unconfigured' };

  const percentage = Math.round((charsNoWhitespace / characterLimit) * 100);
  const minimum = Math.ceil(characterLimit * 0.8);
  const preferredMaximum = Math.floor(characterLimit * 0.9);

  if (charsNoWhitespace > characterLimit) {
    return { status: 'over', over: charsNoWhitespace - characterLimit, percentage };
  }
  if (charsNoWhitespace < minimum) {
    return {
      status: 'under',
      minimum,
      remaining: minimum - charsNoWhitespace,
      percentage,
    };
  }
  return { status: 'ok', minimum, preferredMaximum, percentage };
}
