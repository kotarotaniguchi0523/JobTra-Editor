import { afterEach, describe, expect, it, vi } from 'vitest';
import { generateEsMarkdown } from '@features/export/lib/exportMarkdown';
import { buildEsPdfMarkdown, generateEsPdf } from '@features/export/lib/exportPdf';
import type { ESDraft } from '@entities/draft/model/types';

vi.mock('@minitype/minitype', () => ({
  mdString: vi.fn(() => ({ blocks: [] })),
  minitype: vi.fn(() => ({
    toPdf: async () => new TextEncoder().encode(`%PDF-1.7\n${'x'.repeat(256)}`),
  })),
}));

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Export Features', () => {
  const mockDraft: ESDraft = {
    id: 'test-draft-1',
    title: 'カフェでの顧客体験改善',
    companyName: 'スターバックス コーヒー ジャパン',
    category: 'gakuchika',
    targetCount: 400,
    isBlockMode: false,
    tags: ['アルバイト', '業務効率化'],
    content:
      '学生時代にカフェのアルバイトで新メニューの提案と提供時間の短縮に取り組みました。課題であったピーク時のオペレーション遅延に対し、動線の見直しとチーム内の声掛けを徹底しました。結果として提供時間を25%短縮し、顧客満足度スコアを店舗歴代最高に引き上げることができました。',
    starBlocks: {
      conclusion: 'オペレーション改善による顧客満足度向上',
      situation: '大学2年次より勤務しているカフェでのアルバイト',
      action: '動線の可視化シートの作成と役割分担の再定義',
      result: '提供時間を平均4分から3分へ短縮、満足度向上',
      contribution: '入社後も現状分析とチームワークで貢献したい',
    },
    snapshots: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  it('Markdownが構造化されたフォーマットで正しく出力されること', () => {
    const md = generateEsMarkdown(mockDraft, {
      includeFrontmatter: true,
      includeStar: true,
      includeAuditSummary: true,
      exportedAt: '2026-09-17T00:00:00.000Z',
    });

    expect(md).toContain('---');
    expect(md).toContain('title: "カフェでの顧客体験改善"');
    expect(md).toContain('company: "スターバックス コーヒー ジャパン"');
    expect(md).toContain('# カフェでの顧客体験改善');
    expect(md).toContain('## 本文');
    expect(md).toContain('学生時代にカフェのアルバイトで新メニューの提案');
    expect(md).toContain('## STAR論理構成');
    expect(md).toContain('### Situation');
    expect(md).toContain('### Action');
    expect(md).toContain('### Result');
    expect(md).toContain('## 推敲メモ');
    expect(md).toContain('Exported from 就活ESクラフト');
    expect(md).toContain('exported_at: "2026-09-17T00:00:00.000Z"');

    expect(
      generateEsMarkdown(mockDraft, {
        includeFrontmatter: true,
        includeStar: true,
        includeAuditSummary: true,
        exportedAt: '2026-09-17T00:00:00.000Z',
      }),
    ).toBe(md);
  });

  it('ブラウザ内minitypeでPDFのUint8Arrayバイナリが生成されること', async () => {
    const fetchMock = vi.fn(async (_url: RequestInfo | URL) => {
      return new Response(new ArrayBuffer(16), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchMock);

    const pdfBytes = await generateEsPdf({
      title: mockDraft.title,
      company: mockDraft.companyName,
      categoryLabel: 'ガクチカ（学生時代注力）',
      targetCharCount: mockDraft.targetCount,
      currentCharCount: mockDraft.content.replace(/\s/g, '').length,
      content: mockDraft.content,
      exportedAt: '2026年9月17日',
      star: mockDraft.starBlocks,
      includeStar: true,
      includeMeta: true,
    });

    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(100); // PDFバイナリ
    // PDFヘッダーシグネチャ %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D) の検証
    const header = String.fromCharCode(...pdfBytes.slice(0, 5));
    expect(header).toBe('%PDF-');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.every(([url]) => !String(url).includes('/api/export/pdf'))).toBe(
      true,
    );
  }, 15000);

  it('PDFソースにメタ情報とSTAR構成が含まれること', () => {
    const source = buildEsPdfMarkdown({
      title: mockDraft.title,
      company: mockDraft.companyName,
      categoryLabel: 'ガクチカ（学生時代注力）',
      targetCharCount: mockDraft.targetCount,
      currentCharCount: mockDraft.content.replace(/\s/g, '').length,
      content: mockDraft.content,
      exportedAt: '2026年9月17日',
      star: mockDraft.starBlocks,
      includeStar: true,
      includeMeta: true,
    });

    expect(source).toContain('# カフェでの顧客体験改善');
    expect(source).toContain('応募先企業');
    expect(source).toContain('## STAR論理構成メモ');
    expect(source).toContain('### 3. Action');
    expect(source).toContain('**作成日**: 2026年9月17日');
  });
});
