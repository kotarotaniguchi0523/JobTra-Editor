import type { AuditCheck, JapaneseMetrics } from '@features/writing-assistance/model/types';
import { countNonWhitespaceCharacters } from '@shared/lib/text';
import { evaluateCharacterLimit } from '@features/writing-assistance/lib/characterLimit';

export function calculateMetrics(text: string): JapaneseMetrics {
  const totalChars = text.length;
  const charsNoWhitespace = countNonWhitespaceCharacters(text);
  const linesCount = text ? text.split('\n').length : 0;

  // Split into sentences using Japanese punctuation (。！？!?)
  const sentences = text
    .split(/[。！？\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sentenceCount = sentences.length || (charsNoWhitespace > 0 ? 1 : 0);
  const avgSentenceLength = sentenceCount > 0 ? Math.round(charsNoWhitespace / sentenceCount) : 0;
  const longestSentenceLength = sentences.reduce((max, s) => Math.max(max, s.length), 0);

  // Character sets
  const kanjiMatches = text.match(/[\u4e00-\u9faf\u3400-\u4dbf]/g);
  const hiraganaMatches = text.match(/[\u3040-\u309f]/g);
  const katakanaMatches = text.match(/[\u30a0-\u30ff]/g);

  const kanjiCount = kanjiMatches ? kanjiMatches.length : 0;
  const hiraganaCount = hiraganaMatches ? hiraganaMatches.length : 0;
  const katakanaCount = katakanaMatches ? katakanaMatches.length : 0;

  const kanjiRatio = charsNoWhitespace > 0 ? Math.round((kanjiCount / charsNoWhitespace) * 100) : 0;

  return {
    totalChars,
    charsNoWhitespace,
    linesCount,
    sentenceCount,
    avgSentenceLength,
    kanjiCount,
    hiraganaCount,
    katakanaCount,
    kanjiRatio,
    longestSentenceLength,
  };
}

export function auditText(text: string, targetCount: number | null): AuditCheck[] {
  const checks: AuditCheck[] = [];
  const charsNoWs = countNonWhitespaceCharacters(text);

  if (!text.trim()) {
    return checks;
  }

  // 1. 上限字数の達成度判定
  const characterLimit = evaluateCharacterLimit(charsNoWs, targetCount);
  if (characterLimit.status !== 'unconfigured') {
    if (characterLimit.status === 'over') {
      checks.push({
        id: 'character-limit-over',
        title: `文字数オーバー (+${characterLimit.over}文字)`,
        status: 'warning',
        message: `上限${targetCount}文字を${characterLimit.over}文字超過しています。余分な接続詞や冗長な修飾語を削りましょう。`,
      });
    } else if (characterLimit.status === 'ok') {
      checks.push({
        id: 'character-limit-ok',
        title: `文字数OK（${characterLimit.percentage}%）`,
        status: 'pass',
        message: `上限${targetCount}字の8割以上に収まっています。${charsNoWs <= characterLimit.preferredMaximum ? '目安の範囲内です。' : '十分な分量です。'}`,
      });
    } else {
      checks.push({
        id: 'character-limit-under',
        title: `文字数不足 (あと${characterLimit.remaining}文字)`,
        status: 'info',
        message: `上限${targetCount}字の8割未満（現在${characterLimit.percentage}%）です。まず${characterLimit.minimum}字を目安に具体例を補いましょう。`,
      });
    }
  }

  // 2. 御社 vs 貴社 (書類は「貴社」、口頭面接は「御社」)
  const onshaMatches = text.match(/御社/g);
  if (onshaMatches && onshaMatches.length > 0) {
    checks.push({
      id: 'onsha-check',
      title: '書類マナー：書き言葉は「貴社」を使用',
      status: 'warning',
      message: `エントリーシート等の書面では「貴社」が正しい表記です（「御社」は面接での話し言葉）。${onshaMatches.length}箇所検出されました。`,
      replacement: {
        original: '御社',
        suggested: '貴社',
      },
    });
  } else if (text.includes('貴社')) {
    checks.push({
      id: 'kisha-pass',
      title: '書面敬語「貴社」の統一',
      status: 'pass',
      message: '書き言葉のマナー（貴社）が遵守されています。',
    });
  }

  // 3. ら抜き言葉の検出
  const ranukiPatterns = [
    { pattern: /見れる/g, original: '見れる', suggested: '見られる' },
    { pattern: /来れる/g, original: '来れる', suggested: '来られる' },
    { pattern: /食べれる/g, original: '食べれる', suggested: '食べられる' },
    { pattern: /着れる/g, original: '着れる', suggested: '着られる' },
    { pattern: /起きれる/g, original: '起きれる', suggested: '起きられる' },
    { pattern: /出れる/g, original: '出れる', suggested: '出られる' },
  ];

  for (const r of ranukiPatterns) {
    if (r.pattern.test(text)) {
      checks.push({
        id: `ranuki-${r.original}`,
        title: `ら抜き言葉の検出（「${r.original}」）`,
        status: 'warning',
        message: `正式な文語表現は「${r.suggested}」です。ビジネス文章の品位を高めるため修正を推奨します。`,
        replacement: {
          original: r.original,
          suggested: r.suggested,
        },
      });
    }
  }

  // 4. 一文の長さチェック (1文60字以内が最も読みやすい)
  const sentences = text
    .split(/[。！？\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const longSentences = sentences.filter((s) => s.length >= 65);
  if (longSentences.length > 0) {
    checks.push({
      id: 'long-sentence',
      title: `長文の一文があります（${longSentences.length}箇所が65文字以上）`,
      status: 'warning',
      message: `人間が一息で読める目安は40〜60字です。一文一義を意識し、2つの文に分割すると論理が明確になります。`,
      detail: `「${longSentences[0].slice(0, 30)}...」（${longSentences[0].length}文字）`,
    });
  } else if (sentences.length >= 2) {
    checks.push({
      id: 'sentence-length-pass',
      title: '一文の長さが適切',
      status: 'pass',
      message: '一文一義が守られており、テンポ良く読み進められる構成です。',
    });
  }

  // 5. 文末の3連続重複チェック
  let repeatCount = 1;
  let lastEnding = '';
  let foundRepeatEnding = '';

  for (const s of sentences) {
    let currentEnding = '';
    if (s.endsWith('でした')) currentEnding = 'でした';
    else if (s.endsWith('ました')) currentEnding = 'ました';
    else if (s.endsWith('です')) currentEnding = 'です';
    else if (s.endsWith('ます')) currentEnding = 'ます';

    if (currentEnding && currentEnding === lastEnding) {
      repeatCount++;
      if (repeatCount >= 3) {
        foundRepeatEnding = currentEnding;
      }
    } else {
      repeatCount = 1;
      lastEnding = currentEnding;
    }
  }

  if (foundRepeatEnding) {
    checks.push({
      id: 'ending-repetition',
      title: `文末の連続（「${foundRepeatEnding}」が3回以上連続）`,
      status: 'warning',
      message: `同じ文末が続くと単調な印象を与えます。「体言止め」や「〜と考えます」「〜と確信しております」など変化をつけましょう。`,
    });
  }

  // 6. 定量的数字の含有チェック
  const numberMatches = text.match(
    /[0-9０-９]+(?:\.[0-9]+)?(?:%|％|人|倍|割|位|件|円|万|カ月|ヶ月|年|回|日)/g,
  );
  if (numberMatches && numberMatches.length > 0) {
    checks.push({
      id: 'numeric-evidence',
      title: `定量的データ・数値の実績あり（${numberMatches.length}箇所）`,
      status: 'pass',
      message: `「${numberMatches.slice(0, 3).join('、')}」などの客観的数字が入り、説得力があります。`,
    });
  } else if (charsNoWs > 150) {
    checks.push({
      id: 'numeric-missing',
      title: '数値や客観データの追加を検討',
      status: 'info',
      message:
        '「前年比○%増」「チーム○名」「週○回」など、数字を1つ入れると事実としての重みが増します。',
    });
  }

  // 7. 漢字とひらがなの比率
  const metrics = calculateMetrics(text);
  if (charsNoWs > 100) {
    if (metrics.kanjiRatio > 40) {
      checks.push({
        id: 'kanji-dense',
        title: `漢字が多め（漢字率 ${metrics.kanjiRatio}%）`,
        status: 'warning',
        message:
          '漢字が40%を超えると黒々として圧迫感があります。「〜の事」→「〜のこと」など適度にひらがなに開きましょう。',
      });
    } else if (metrics.kanjiRatio < 20) {
      checks.push({
        id: 'kanji-sparse',
        title: `ひらがなが多め（漢字率 ${metrics.kanjiRatio}%）`,
        status: 'info',
        message:
          '漢字率が20%未満だと幼い印象を与えることがあります。適切な名詞や動詞を漢字に変換しましょう。',
      });
    } else {
      checks.push({
        id: 'kanji-ratio-pass',
        title: `漢字比率が適正（${metrics.kanjiRatio}%）`,
        status: 'pass',
        message: '最も読みやすい20〜38%のバランスに収まっています。',
      });
    }
  }

  return checks;
}

// Format clean text for direct pasting into company web entry forms
export function cleanForSubmission(text: string): string {
  return (
    text
      // Replace multiple consecutive blank lines with single newline
      .replace(/\n{3,}/g, '\n\n')
      // Trim trailing whitespace per line
      .split('\n')
      .map((line) => line.trimEnd())
      .join('\n')
      .trim()
  );
}
