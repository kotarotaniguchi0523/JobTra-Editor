import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mdString, minitype } from '@minitype/minitype';
import { buildEsPdfMarkdown, type ExportPdfOptions } from '@features/export/lib/exportPdf';

const repositoryRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputPath = path.resolve(
  process.argv[2] ?? path.join(os.tmpdir(), 'jobtra-editor-minitype-smoke.pdf'),
);
const fontDir = path.join(repositoryRoot, 'node_modules/@minitype/minitype/fonts');
const cacheDirectory = await mkdtemp(path.join(os.tmpdir(), 'jobtra-editor-minitype-'));
const previousWorkingDirectory = process.cwd();

const options: ExportPdfOptions = {
  title: 'CLI PDF出力確認',
  company: '株式会社サンプル',
  categoryLabel: '自己PR',
  targetCharCount: 400,
  currentCharCount: 168,
  content:
    '私は、利用者の声をもとに業務フローを改善できます。\n\nアルバイト先で待ち時間を分析し、案内方法を見直しました。結果として、繁忙時間帯の問い合わせを減らし、チームが接客に集中できる状態をつくりました。',
  star: {
    conclusion: '利用者起点で改善を最後まで実行する力があります。',
    situation: '繁忙時間帯に問い合わせが集中していました。',
    task: '待ち時間と現場負担を同時に減らす必要がありました。',
    action: '問い合わせ内容を分類し、案内表示と担当分担を変更しました。',
    result: '問い合わせ件数が減り、接客の安定につながりました。',
    contribution: '入社後も現場の事実から改善を提案します。',
  },
  includeStar: true,
  includeMeta: true,
};

try {
  process.chdir(cacheDirectory);

  const markdown = buildEsPdfMarkdown(options);
  const { blocks } = mdString(markdown);
  const document = minitype(
    [{ body: blocks }],
    { size: 'A4' },
    {
      fontDir,
      metadata: {
        title: options.title,
        author: '就活ESクラフト',
        subject: 'エントリーシート',
      },
    },
  );
  const pdfBytes = await document.toPdf();

  if (pdfBytes.length < 10_000) {
    throw new Error(`生成されたPDFが小さすぎます: ${pdfBytes.length} bytes`);
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, pdfBytes);

  const header = String.fromCharCode(...(await readFile(outputPath)).subarray(0, 5));
  if (header !== '%PDF-') {
    throw new Error(`PDFヘッダーが不正です: ${header}`);
  }

  console.log(`minitype CLI PDF verified: ${outputPath} (${pdfBytes.length} bytes)`);
} finally {
  process.chdir(previousWorkingDirectory);
  await rm(cacheDirectory, { recursive: true, force: true });
}
