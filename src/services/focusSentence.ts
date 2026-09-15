/**
 * focusSentence.ts
 * 純粋ロジック: カーソル位置から「いま打っている一文」と前後の文を分割抽出する
 */

export interface SentenceFocusContext {
  beforeText: string;
  focusSentence: string;
  afterText: string;
  sentenceIndex: number;
  totalSentences: number;
}

/**
 * 日本語の文境界記号（。！？\n）を基準に、
 * カーソル位置（cursorPos）が属する一文とその前後を分割する純粋関数
 */
export function extractFocusSentence(text: string, cursorPos: number): SentenceFocusContext {
  if (!text) {
    return {
      beforeText: '',
      focusSentence: '',
      afterText: '',
      sentenceIndex: 0,
      totalSentences: 0,
    };
  }

  const clampedPos = Math.max(0, Math.min(cursorPos, text.length));

  // 文境界デリミタ: 。 ！？ \n
  const isDelimiter = (char: string) =>
    char === '。' || char === '！' || char === '？' || char === '\n';

  // 1. カーソルより前の直近の文境界を探す（開始位置）
  let start = 0;
  for (let i = clampedPos - 1; i >= 0; i--) {
    if (isDelimiter(text[i])) {
      start = i + 1;
      break;
    }
  }

  // 2. カーソル以降の直近の文境界を探す（終了位置）
  let end = text.length;
  for (let i = clampedPos; i < text.length; i++) {
    if (isDelimiter(text[i])) {
      end = i + 1; // 句点や改行も含めて一文とする
      break;
    }
  }

  const beforeText = text.slice(0, start);
  const focusSentence = text.slice(start, end);
  const afterText = text.slice(end);

  // 全体の文数をカウント
  const sentences = text.split(/(?<=[。！？\n])/).filter((s) => s.length > 0);
  const totalSentences = Math.max(1, sentences.length);

  // 現在の文インデックス
  let sentenceIndex = 0;
  let runningLen = 0;
  for (let i = 0; i < sentences.length; i++) {
    runningLen += sentences[i].length;
    if (runningLen >= clampedPos) {
      sentenceIndex = i;
      break;
    }
  }

  return {
    beforeText,
    focusSentence,
    afterText,
    sentenceIndex,
    totalSentences,
  };
}
