import { expect, type Locator, type Page } from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly newDraftButton: Locator;
  readonly draftTitle: Locator;
  readonly draftCategory: Locator;
  readonly body: Locator;
  readonly structureTab: Locator;
  readonly previewTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('#app-sidebar');
    this.newDraftButton = page.locator('#sidebar-new-draft-btn');
    this.draftTitle = page.locator('#draft-title-input');
    this.draftCategory = page.locator('#draft-category-select');
    this.body = page.locator('#es-body-textarea');
    this.structureTab = page.locator('#mode-tab-structure');
    this.previewTab = page.locator('#mode-tab-preview');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await expect(this.draftTitle).toBeVisible();
    await expect(this.body).toBeVisible();
  }

  async draftCount(): Promise<number> {
    return this.sidebar.getByRole('button', { name: /を選択$/ }).count();
  }

  async createDraft(): Promise<void> {
    const countBefore = await this.draftCount();
    await this.newDraftButton.click();
    await expect(this.draftTitle).toHaveValue('新規エントリーシート');
    await expect.poll(() => this.draftCount()).toBe(countBefore + 1);
  }

  async fillTitle(title: string): Promise<void> {
    await this.draftTitle.fill(title);
  }

  async fillBody(content: string): Promise<void> {
    await this.body.fill(content);
  }

  async waitForSaved(): Promise<void> {
    await expect(this.page.getByTitle('IndexedDBに自動保存されています')).toBeVisible();
  }

  async reload(): Promise<void> {
    await this.page.reload();
    await this.waitForReady();
  }

  async selectDraft(title: string): Promise<void> {
    await this.sidebar
      .getByRole('button', { name: new RegExp(`${escapeRegExp(title)} を選択$`) })
      .click();
    await expect(this.draftTitle).toHaveValue(title);
  }

  async openStructure(): Promise<void> {
    await this.structureTab.click();
    await expect(this.page).toHaveURL(/\/structure\?id=/);
    await expect(this.page.getByRole('heading', { name: 'STAR論理構成エディタ' })).toBeVisible();
  }

  async openPreview(): Promise<void> {
    await this.previewTab.click();
    await expect(this.page).toHaveURL(/\/preview\?id=/);
    await expect(this.page.getByText('提出前 最終確認チェックリスト')).toBeVisible();
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
