import { expect, type Locator, type Page } from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly newDraftButton: Locator;
  readonly draftCountBadge: Locator;
  readonly draftTitle: Locator;
  readonly draftCategory: Locator;
  readonly draftProgress: Locator;
  readonly body: Locator;
  readonly searchInput: Locator;
  readonly focusSentenceButton: Locator;
  readonly typewriterScrollButton: Locator;
  readonly structureTab: Locator;
  readonly previewTab: Locator;
  private readonly runtimeIssues: string[] = [];

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('#app-sidebar');
    this.newDraftButton = page.locator('#sidebar-new-draft-btn');
    this.draftCountBadge = this.sidebar.getByText(/^\d+件$/);
    this.draftTitle = page.locator('#draft-title-input');
    this.draftCategory = page.locator('#draft-category-select');
    this.draftProgress = page.locator('#draft-progress-status');
    this.body = page.locator('#es-body-textarea');
    this.searchInput = page.locator('#sidebar-search-input');
    this.focusSentenceButton = page.getByTitle('いまカーソルがある一文のみをハイライト');
    this.typewriterScrollButton = page.getByTitle('入力行を常に視線の中央にキープ');
    this.structureTab = page.locator('#mode-tab-structure');
    this.previewTab = page.locator('#mode-tab-preview');

    page.on('pageerror', (error) => this.runtimeIssues.push(`pageerror: ${error.message}`));
    page.on('console', (message) => {
      if (message.type() === 'error' || message.type() === 'warning') {
        const issue = `console.${message.type()}: ${message.text()}`;
        if (!isExpectedTransportWarning(issue)) this.runtimeIssues.push(issue);
      }
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.waitForReady();
  }

  async waitForReady(): Promise<void> {
    await expect(this.page.locator('#app-top-header')).toBeVisible();
    await expect(this.sidebar).toHaveAttribute('aria-busy', 'false');
  }

  async draftCount(): Promise<number> {
    const text = await this.draftCountBadge.textContent();
    return Number.parseInt(text?.replace('件', '') ?? '0', 10);
  }

  async createDraft(): Promise<void> {
    const countBefore = await this.draftCount();
    const idBefore = new URL(this.page.url()).searchParams.get('id');
    const buttonBounds = await this.newDraftButton.boundingBox();
    const viewport = this.page.viewportSize();
    const isInsideViewport =
      buttonBounds !== null &&
      viewport !== null &&
      buttonBounds.x >= 0 &&
      buttonBounds.x + buttonBounds.width <= viewport.width &&
      buttonBounds.y >= 0 &&
      buttonBounds.y + buttonBounds.height <= viewport.height;

    if (!isInsideViewport) {
      await this.page.getByRole('button', { name: '下書き一覧を開く' }).click();
    }
    await this.newDraftButton.click();
    await expect.poll(() => new URL(this.page.url()).searchParams.get('id')).not.toBe(idBefore);
    await expect(this.draftTitle).toHaveValue('新規エントリーシート');
    await expect(this.draftCategory).toHaveValue('');
    await expect(this.draftProgress).toHaveValue('');
    await expect(this.body).toBeVisible();
    await expect.poll(() => this.draftCount()).toBe(countBefore + 1);
  }

  async fillTitle(title: string): Promise<void> {
    await this.draftTitle.fill(title);
  }

  async fillBody(content: string): Promise<void> {
    await this.body.fill(content);
  }

  async selectCategory(category: string): Promise<void> {
    await this.draftCategory.selectOption(category);
    await expect(this.draftCategory).toHaveValue(category);
  }

  async selectProgress(progress: string): Promise<void> {
    await this.draftProgress.selectOption(progress);
    await expect(this.draftProgress).toHaveValue(progress);
  }

  async filterByCategory(label: string): Promise<void> {
    const filter = this.sidebar.getByRole('button', { name: label, exact: true });
    await filter.click();
    await expect(filter).toHaveAttribute('aria-pressed', 'true');
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await expect(this.searchInput).toHaveValue(query);
  }

  async expectDraftVisibility(title: string, visible: boolean): Promise<void> {
    const draft = this.sidebar.getByRole('button', {
      name: new RegExp(`${escapeRegExp(title)} を選択$`),
    });
    if (visible) await expect(draft).toBeVisible();
    else await expect(draft).toBeHidden();
  }

  async enableWritingFocus(): Promise<void> {
    await this.focusSentenceButton.click();
    await expect(this.focusSentenceButton).toHaveAttribute('aria-pressed', 'true');
    await this.typewriterScrollButton.click();
    await expect(this.typewriterScrollButton).toHaveAttribute('aria-pressed', 'true');
  }

  async expectNoRuntimeIssues(): Promise<void> {
    expect(this.runtimeIssues, 'React/RSC hydration and browser runtime warnings').toEqual([]);
  }

  async waitForSaved(): Promise<void> {
    const title = await this.draftTitle.inputValue();
    const content = await this.body.inputValue();

    await expect
      .poll(() => this.hasPersistedDraft(title, content), {
        timeout: 5_000,
        message: 'IndexedDBに現在の下書きが保存されるまで待機します',
      })
      .toBe(true);
    await expect(this.page.getByTitle('IndexedDBに自動保存されています')).toBeVisible();
  }

  private async hasPersistedDraft(title: string, content: string): Promise<boolean> {
    return this.page.evaluate(
      async ({ expectedTitle, expectedContent }) => {
        const db = await new Promise<IDBDatabase | null>((resolve) => {
          const request = window.indexedDB.open('es_craft_indexed_db');
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve(null);
        });

        if (!db || !db.objectStoreNames.contains('drafts')) return false;

        const drafts = await new Promise<Array<{ title?: string; content?: string }>>((resolve) => {
          const request = db.transaction('drafts', 'readonly').objectStore('drafts').getAll();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => resolve([]);
        });
        db.close();

        return drafts.some(
          (draft) => draft.title === expectedTitle && draft.content === expectedContent,
        );
      },
      { expectedTitle: title, expectedContent: content },
    );
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

function isExpectedTransportWarning(issue: string): boolean {
  return issue.startsWith(
    "console.error: WebSocket connection to 'wss://nostr.vulpem.com/' failed:",
  );
}
