import { expect, test } from '@playwright/test';
import { DeviceSyncPage } from './pages/device-sync-page';
import { EditorPage } from './pages/editor-page';
import { StructurePage } from './pages/structure-page';

test.describe('ES editor browser workflows', () => {
  test('starts with no drafts and creates an unconfigured document', async ({ page }) => {
    const editor = new EditorPage(page);

    await editor.goto();

    await expect(editor.page).toHaveTitle('就活ESクラフト - 楽しく書けるES作成エディタ');
    await expect(editor.page.locator('#app-top-header')).toBeVisible();
    await expect.poll(() => editor.draftCount()).toBe(0);
    await expect(editor.page.getByText('就活ESクラフトへようこそ')).toBeVisible();
    await editor.createDraft();

    await editor.fillTitle('ブラウザ統合テストの下書き');
    await editor.fillBody('Playwrightでユーザーの執筆フローを検証します。');

    await expect(editor.body).toHaveValue('Playwrightでユーザーの執筆フローを検証します。');
  });

  test('persists a newly created draft across a page reload', async ({ page }) => {
    const editor = new EditorPage(page);
    const title = 'CIで検証する新しいES';
    const content = 'この文章はChromiumを使ったCIのブラウザテストで保存を確認します。';

    await editor.goto();
    await editor.createDraft();
    await editor.fillTitle(title);
    await editor.fillBody(content);
    await editor.waitForSaved();

    await editor.reload();

    await expect(editor.draftTitle).toHaveValue(title);
    await expect(editor.body).toHaveValue(content);
    await expect.poll(() => editor.draftCount()).toBe(1);
  });

  test('keeps the selected draft while moving through STAR and preview modes', async ({ page }) => {
    const editor = new EditorPage(page);
    const structure = new StructurePage(page);

    await editor.goto();
    await editor.createDraft();
    await editor.fillTitle('STAR構成を確認するES');
    await editor.openStructure();

    await structure.fillConclusion('課題を見つけて改善をやり抜く力です。');
    await structure.fillSituation('新人教育の負担によって離職率が高い課題がありました。');
    await structure.applyToEditor();
    await editor.waitForSaved();

    await editor.openPreview();

    await expect(
      editor.page.getByRole('main').getByRole('heading', { name: 'STAR構成を確認するES' }),
    ).toBeVisible();
    await expect(editor.page.getByRole('main').getByText('【結論】')).toBeVisible();
    await expect(
      editor.page.getByRole('main').getByText('課題を見つけて改善をやり抜く力です。'),
    ).toBeVisible();
  });

  test('opens the one-scan device sync flow and generates a short-lived QR token', async ({
    page,
  }) => {
    const editor = new EditorPage(page);
    const deviceSync = new DeviceSyncPage(page);

    await editor.goto();
    await editor.createDraft();
    await deviceSync.open();
    await deviceSync.createPairingQr();
    await deviceSync.close();
  });

  test('keeps header controls inside the header on narrow desktop widths', async ({ page }) => {
    const editor = new EditorPage(page);

    for (const width of [768, 900, 1024]) {
      await page.setViewportSize({ width, height: 900 });
      await editor.goto();
      await editor.createDraft();

      const geometry = await page.locator('#app-top-header').evaluate((header) => {
        const headerRect = header.getBoundingClientRect();
        const controls = Array.from(
          header.querySelectorAll<HTMLElement>(
            '#header-handbook-btn, #header-audit-toggle-btn, #header-export-btn, #header-device-sync-btn, #clean-copy-btn',
          ),
        )
          .filter((element) => element.offsetParent !== null)
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
          });
        return { header: { left: headerRect.left, right: headerRect.right }, controls };
      });

      expect(geometry.controls.every((control) => control.left >= geometry.header.left)).toBe(true);
      expect(geometry.controls.every((control) => control.right <= geometry.header.right)).toBe(
        true,
      );
      for (let index = 1; index < geometry.controls.length; index += 1) {
        expect(geometry.controls[index - 1].right).toBeLessThanOrEqual(
          geometry.controls[index].left,
        );
      }
    }
  });
});
