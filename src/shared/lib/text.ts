/** Counts characters that contribute to an ES character limit. */
export function countNonWhitespaceCharacters(text: string): number {
  return text.replace(/\s/g, '').length;
}
