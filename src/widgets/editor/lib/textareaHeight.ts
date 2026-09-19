/** DOM値を受け取り、textareaに適用する高さを純粋に決める。 */
export function getTextareaHeight(scrollHeight: number, minHeight: number): number {
  return Math.max(Math.ceil(scrollHeight), Math.ceil(minHeight));
}
