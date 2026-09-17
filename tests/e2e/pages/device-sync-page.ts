import { expect, type Locator, type Page } from '@playwright/test';

export class DeviceSyncPage {
  readonly page: Page;
  readonly panel: Locator;
  readonly createQrButton: Locator;
  readonly scanQrButton: Locator;
  readonly token: Locator;

  constructor(page: Page) {
    this.page = page;
    this.panel = page.locator('#device-sync-panel');
    this.createQrButton = page.locator('#device-sync-create-qr-btn');
    this.scanQrButton = page.locator('#device-sync-scan-qr-btn');
    this.token = page.getByLabel('端末同期トークン');
  }

  async open(): Promise<void> {
    await this.page.locator('#header-device-sync-btn').click();
    await expect(this.panel).toBeVisible();
  }

  async createPairingQr(): Promise<void> {
    await this.createQrButton.click();
    await expect(this.page.getByAltText('端末同期用QRコード')).toBeVisible();
    await expect(this.token).toHaveValue(/^[A-Za-z0-9_-]+$/);
  }

  async close(): Promise<void> {
    await this.page.getByRole('button', { name: '端末同期を閉じる' }).click();
    await expect(this.panel).toBeHidden();
  }
}
