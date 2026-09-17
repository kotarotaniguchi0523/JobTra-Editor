import { expect, test } from '@playwright/test';
import { DeviceSyncPage } from './pages/device-sync-page';
import { EditorPage } from './pages/editor-page';
import { StructurePage } from './pages/structure-page';

test.describe('ES editor browser workflows', () => {
  test('loads seeded drafts and edits the active document', async ({ page }) => {
    const editor = new EditorPage(page);

    await editor.goto();

    await expect(editor.page).toHaveTitle('就活ESクラフト - 楽しく書けるES作成エディタ');
    await expect(editor.page.locator('#app-top-header').getByText('就活ESクラフト')).toBeVisible();
    await expect.poll(() => editor.draftCount()).toBe(2);
    await expect(editor.body).toHaveValue(/学生時代に注力したことは/);

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
    await expect.poll(() => editor.draftCount()).toBe(3);
  });

  test('keeps the selected draft while moving through STAR and preview modes', async ({ page }) => {
    const editor = new EditorPage(page);
    const structure = new StructurePage(page);

    await editor.goto();
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
    await deviceSync.open();
    await deviceSync.createPairingQr();
    await deviceSync.close();
  });
});
