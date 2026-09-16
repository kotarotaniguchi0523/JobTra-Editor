import { ESDraft } from '../types';
import {
  parseCategory,
  parseDraft,
  parseDraftCollection,
  parseDraftId,
  parseSnapshotLabel,
} from '../validation/schemas';

const DB_NAME = 'es_craft_indexed_db';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';

// Sample starting drafts so the user isn't faced with a completely blank screen
const INITIAL_SAMPLE_DRAFTS: ESDraft[] = [
  {
    id: 'sample-gakuchika-1',
    title: 'カフェアルバイトでの新人離職率改善',
    companyName: '株式会社サンプル商事',
    category: 'gakuchika',
    targetCount: 400,
    isBlockMode: false,
    content: `学生時代に注力したことは、カフェでの新人アルバイトの定着率向上です。私が働く店舗では新人の離職率が40%と高く、業務習得の負担が原因でした。そこで私は「新人育成チェックシート」と「バディ制度」の導入を店長に提案しました。具体的には、習得項目を30個に細分化し、先輩が毎日10分間の振り返りを行う体制を整えました。最初は既存スタッフから「指導時間が増える」との懸念もありましたが、指導マニュアルを動画化して負担を軽減しました。結果として半年後の新人離職率は10%まで激減し、店舗全体の顧客満足度アンケートでも地域1位を獲得しました。この経験から、課題の本質を見極めて周囲を巻き込み、仕組み化で解決する力を培いました。`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
    tags: ['ガクチカ', 'チーム改善', '定着率向上'],
    starred: true,
  },
  {
    id: 'sample-pr-1',
    title: '定量的分析と粘り強さで課題をやり抜く力',
    companyName: 'テック株式会社',
    category: 'pr',
    targetCount: 300,
    isBlockMode: false,
    content: `私の強みは「データに基づく改善提案力」と「完遂力」です。大学祭の実行委員会で広報リーダーを務めた際、来場者数前年比20%増を目標に掲げました。過去5年分のアンケートを分析したところ、若年層の認知経路の7割がSNSである一方、従来の広報予算の8割が紙チラシに偏っていることを突き止めました。そこでSNS動画発信に注力し、週3回の投稿企画を実施しました。結果、目標を上回る前年比25%増の来場を達成しました。貴社においても、現状を数値で冷静に把握し、最適な施策をやり抜くことで事業貢献いたします。`,
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
    tags: ['自己PR', '分析力', '実行力'],
    starred: false,
  },
];

class IndexedDbStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private isIndexedDbAvailable: boolean;

  constructor() {
    this.isIndexedDbAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
  }

  private async openDb(): Promise<IDBDatabase> {
    if (!this.isIndexedDbAvailable) {
      throw new Error('IndexedDB is not available');
    }

    if (!this.dbPromise) {
      this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            store.createIndex('updatedAt', 'updatedAt', { unique: false });
            store.createIndex('category', 'category', { unique: false });
          }
        };

        request.onsuccess = () => {
          const db = request.result;
          resolve(db);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    }

    return this.dbPromise;
  }

  // Fallback to localStorage if IndexedDB is blocked or throws
  private getLocalStorageDrafts(): ESDraft[] {
    try {
      const data = localStorage.getItem(DB_NAME);
      if (data) {
        return parseDraftCollection(JSON.parse(data)) || [...INITIAL_SAMPLE_DRAFTS];
      }
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return [...INITIAL_SAMPLE_DRAFTS];
  }

  private saveLocalStorageDrafts(drafts: ESDraft[]): void {
    try {
      const validated = parseDraftCollection(drafts);
      if (!validated) {
        console.warn('LocalStorage draft validation failed');
        return;
      }
      localStorage.setItem(DB_NAME, JSON.stringify(validated));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  public async getAllDrafts(): Promise<ESDraft[]> {
    try {
      const db = await this.openDb();
      return new Promise<ESDraft[]>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
          const list = parseDraftCollection(request.result) || [];
          if (list.length === 0) {
            // First time: seed sample drafts
            this.seedInitialDrafts().then(resolve).catch(reject);
            return;
          }
          // Sort by updatedAt descending
          list.sort((a, b) => b.updatedAt - a.updatedAt);
          resolve(list);
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (err) {
      console.warn('IndexedDB unavailable or failed, falling back to LocalStorage', err);
      const list = this.getLocalStorageDrafts();
      list.sort((a, b) => b.updatedAt - a.updatedAt);
      return list;
    }
  }

  private async seedInitialDrafts(): Promise<ESDraft[]> {
    await Promise.all(INITIAL_SAMPLE_DRAFTS.map((draft) => this.saveDraft(draft)));
    return [...INITIAL_SAMPLE_DRAFTS];
  }

  public async getDraft(id: string): Promise<ESDraft | null> {
    const validId = parseDraftId(id);
    if (!validId) return null;

    try {
      const db = await this.openDb();
      return new Promise<ESDraft | null>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(validId);

        request.onsuccess = () => {
          resolve(parseDraft(request.result));
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      const drafts = this.getLocalStorageDrafts();
      return drafts.find((d) => d.id === validId) || null;
    }
  }

  public async saveDraft(draft: ESDraft): Promise<void> {
    const validatedDraft = parseDraft(draft);
    if (!validatedDraft) {
      throw new Error('Draft validation failed');
    }

    const draftToSave: ESDraft = {
      ...validatedDraft,
      updatedAt: Date.now(),
    };

    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(draftToSave);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      const drafts = this.getLocalStorageDrafts();
      const index = drafts.findIndex((d) => d.id === draftToSave.id);
      if (index >= 0) {
        drafts[index] = draftToSave;
      } else {
        drafts.unshift(draftToSave);
      }
      this.saveLocalStorageDrafts(drafts);
    }
  }

  public async deleteDraft(id: string): Promise<void> {
    const validId = parseDraftId(id);
    if (!validId) return;

    try {
      const db = await this.openDb();
      return new Promise<void>((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(validId);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch {
      const drafts = this.getLocalStorageDrafts().filter((d) => d.id !== validId);
      this.saveLocalStorageDrafts(drafts);
    }
  }

  public async duplicateDraft(source: ESDraft): Promise<ESDraft> {
    const newDraft: ESDraft = {
      ...source,
      id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: `${source.title} (コピー)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.saveDraft(newDraft);
    return newDraft;
  }
  public async createDefaultDraft(category: string = 'gakuchika'): Promise<ESDraft> {
    const newDraft: ESDraft = {
      id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: '新規エントリーシート',
      companyName: '',
      category: parseCategory(category),
      targetCount: 400,
      isBlockMode: false,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      starred: false,
      snapshots: [],
    };
    await this.saveDraft(newDraft);
    return newDraft;
  }

  public async addSnapshot(id: string, label: string): Promise<ESDraft | null> {
    const validId = parseDraftId(id);
    if (!validId) return null;

    const draft = await this.getDraft(validId);
    if (!draft) return null;

    const snapshot = {
      id: 'snap_' + Date.now(),
      label: parseSnapshotLabel(label),
      content: draft.content,
      charCount: draft.content.replace(/\s+/g, '').length,
      timestamp: Date.now(),
    };

    const updated: ESDraft = {
      ...draft,
      snapshots: [snapshot, ...(draft.snapshots || [])],
      updatedAt: Date.now(),
    };

    await this.saveDraft(updated);
    return updated;
  }
}

export const storage = new IndexedDbStorage();
