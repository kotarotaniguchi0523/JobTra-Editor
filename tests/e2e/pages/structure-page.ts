import { expect, type Locator, type Page } from '@playwright/test';

export class StructurePage {
  readonly page: Page;
  readonly conclusion: Locator;
  readonly situation: Locator;
  readonly applyButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.conclusion = page.getByRole('textbox', {
      name: '結論・強み（一言で何を成し遂げたか）',
    });
    this.situation = page.getByRole('textbox', {
      name: '状況と課題（直面した困難や高い目標）',
    });
    this.applyButton = page.getByRole('link', { name: '本文エディタへ反映して執筆へ' });
  }

  async fillConclusion(value: string): Promise<void> {
    await this.conclusion.fill(value);
  }

  async fillSituation(value: string): Promise<void> {
    await this.situation.fill(value);
  }

  async applyToEditor(): Promise<void> {
    await this.applyButton.click();
    await expect(this.page).toHaveURL(/\/?\?id=/);
    await expect(this.page.locator('#es-body-textarea')).toHaveValue(/【結論】/);
  }
}
