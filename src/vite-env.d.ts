/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEXIE_CLOUD_SYNC_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
