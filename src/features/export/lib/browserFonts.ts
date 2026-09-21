import type { BrowserFontData } from '@minitype/minitype';
import sourceHanSerifBoldUrl from '../../../../node_modules/@minitype/minitype/fonts/SourceHanSerifJP-Bold.otf?url';
import sourceHanSerifRegularUrl from '../../../../node_modules/@minitype/minitype/fonts/SourceHanSerifJP-Regular.otf?url';

const FONT_URLS = [
  {
    fontKey: 'SourceHanSerifJP-Regular' as const,
    url: sourceHanSerifRegularUrl,
  },
  {
    fontKey: 'SourceHanSerifJP-Bold' as const,
    url: sourceHanSerifBoldUrl,
  },
] satisfies ReadonlyArray<{
  fontKey: BrowserFontData['fontKey'];
  url: string;
}>;

let browserFontsPromise: Promise<BrowserFontData[]> | undefined;

export function loadBrowserFonts(): Promise<BrowserFontData[]> {
  if (!browserFontsPromise) {
    browserFontsPromise = Promise.all(
      FONT_URLS.map(async ({ fontKey, url }) => {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`PDFフォントの読み込みに失敗しました (${response.status})`);
        }

        return {
          fontKey,
          data: await response.arrayBuffer(),
        };
      }),
    ).catch((error: unknown) => {
      browserFontsPromise = undefined;
      throw error;
    });
  }

  return browserFontsPromise;
}
