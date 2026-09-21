import { expect, type Locator, type Page } from '@playwright/test';

export class ExportPage {
  readonly page: Page;
  readonly dialog: Locator;
  readonly markdownTab: Locator;
  readonly saveMarkdownButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'ドキュメントエクスポート' });
    this.markdownTab = page.getByRole('tab', { name: /Markdown 出力/ });
    this.saveMarkdownButton = page.getByRole('button', { name: '.md ファイルを保存' });
  }

  async open(): Promise<void> {
    await this.page.locator('#header-export-btn').click();
    await expect(this.dialog).toBeVisible();
  }

  async downloadMarkdown(): Promise<void> {
    await this.markdownTab.click();
    await expect(this.markdownTab).toHaveAttribute('aria-selected', 'true');

    const downloadPromise = this.page.waitForEvent('download');
    await this.saveMarkdownButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.md$/);
  }

  async close(): Promise<void> {
    await this.dialog.locator('footer').getByRole('button', { name: '閉じる' }).click();
    await expect(this.dialog).toBeHidden();
  }
}
