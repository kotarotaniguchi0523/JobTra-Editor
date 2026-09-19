import type { ReactNode } from 'react';
import { AlertTriangle, Check, Copy, Link2, Loader2, QrCode, X } from 'lucide-react';
import type { DraftSyncConflict, MergeChoice } from '@features/device-sync/sync/types';

export type SyncPanelMode = 'idle' | 'host' | 'scan' | 'syncing' | 'complete' | 'error';

export interface DeviceSyncPanelContentProps {
  mode: SyncPanelMode;
  pairingToken: string;
  qrDataUrl: string;
  manualToken: string;
  statusMessage: string;
  errorMessage: string;
  summaryMessage: string;
  conflicts: DraftSyncConflict[];
  choices: Record<string, MergeChoice>;
  copied: boolean;
  isJoining: boolean;
  scannerSlot?: ReactNode;
  onCreateHostPairing: () => void;
  onStartScanner: () => void;
  onJoinManualToken: () => void;
  onManualTokenChange: (value: string) => void;
  onCopyToken: () => void;
  onReset: () => void;
  onClose: () => void;
  onResolveConflict: (conflict: DraftSyncConflict) => void;
  onChooseConflict: (conflict: DraftSyncConflict, path: string, choice: MergeChoice) => void;
}

export function DeviceSyncPanelContent(props: DeviceSyncPanelContentProps) {
  return (
    <dialog
      open
      id="device-sync-panel"
      className="fixed inset-0 z-50 m-0 flex h-full w-full max-w-none items-center justify-center border-0 bg-transparent p-3 sm:p-5"
      aria-labelledby="device-sync-title"
    >
      <button
        type="button"
        aria-label="端末同期パネルを閉じる"
        className="fixed inset-0 h-full w-full cursor-default border-none bg-neutral-900/50 backdrop-blur-xs"
        onClick={props.onClose}
      />
      <section className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <h2 id="device-sync-title" className="text-sm font-bold text-neutral-900">
                端末間同期
              </h2>
              <p className="text-xs text-neutral-500">QR 1回・サーバー保存なし</p>
            </div>
          </div>
          <button
            type="button"
            aria-label="端末同期を閉じる"
            className="rounded-md p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
            onClick={props.onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto p-5">
          {props.mode === 'idle' && <IdleView {...props} />}
          {props.mode === 'host' && <HostView {...props} />}
          {props.mode === 'scan' && <ScanView {...props} />}
          {props.mode === 'syncing' && <SyncingView />}
          {props.mode === 'complete' && <CompleteView {...props} />}
          {props.mode === 'error' && <ErrorView {...props} />}
        </div>
      </section>
    </dialog>
  );
}

function IdleView(props: DeviceSyncPanelContentProps) {
  return (
    <div className="space-y-4">
      <p className="text-xs leading-relaxed text-neutral-600">
        このサイトは静的に配信できます。同期するときだけ、QRに含まれる一時鍵で2台を直接接続します。
        下書き本文は同期リレーに保存しません。
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <button
          id="device-sync-create-qr-btn"
          type="button"
          className="flex items-center justify-center gap-2 rounded-md bg-neutral-900 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-700"
          onClick={props.onCreateHostPairing}
        >
          <QrCode className="h-4 w-4" />
          QRを発行する
        </button>
        <button
          id="device-sync-scan-qr-btn"
          type="button"
          className="flex items-center justify-center gap-2 rounded-md border border-neutral-300 bg-white px-3 py-2.5 text-xs font-semibold text-neutral-800 transition hover:bg-neutral-50"
          onClick={props.onStartScanner}
        >
          <QrCode className="h-4 w-4" />
          QRを読み取る
        </button>
      </div>
      <ManualTokenForm {...props} />
    </div>
  );
}

function HostView(props: DeviceSyncPanelContentProps) {
  return (
    <div className="space-y-4 text-center">
      {props.qrDataUrl ? (
        <img
          className="mx-auto h-64 w-64 rounded-lg border border-neutral-200 p-2"
          src={props.qrDataUrl}
          alt="端末同期用QRコード"
        />
      ) : (
        <div className="flex h-64 items-center justify-center text-xs text-neutral-400">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> QRを生成中...
        </div>
      )}
      <p className="text-xs leading-relaxed text-neutral-600">{props.statusMessage}</p>
      <TokenFallback {...props} />
      <button
        type="button"
        className="text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-900"
        onClick={props.onReset}
      >
        キャンセル
      </button>
    </div>
  );
}

function ScanView(props: DeviceSyncPanelContentProps) {
  return (
    <div className="space-y-4">
      {props.scannerSlot ?? (
        <div className="flex aspect-square items-center justify-center rounded-lg bg-neutral-950 text-xs text-white">
          カメラを起動しています...
        </div>
      )}
      <p className="text-xs leading-relaxed text-neutral-600">{props.statusMessage}</p>
      <ManualTokenForm {...props} />
      <button
        type="button"
        className="w-full rounded-md border border-neutral-200 px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50"
        onClick={props.onReset}
      >
        キャンセル
      </button>
    </div>
  );
}

function SyncingView() {
  return (
    <div className="space-y-3 py-10 text-center">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-neutral-700" />
      <p className="text-sm font-semibold text-neutral-800">端末を接続して同期中...</p>
      <p className="text-xs leading-relaxed text-neutral-500">
        相手がQRを読み取るまで、この画面を開いたままにしてください。
      </p>
    </div>
  );
}

function CompleteView(props: DeviceSyncPanelContentProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
          <Check className="h-4 w-4" /> {props.statusMessage}
        </div>
        <p className="mt-1 text-xs text-emerald-700">{props.summaryMessage}</p>
      </div>
      {props.conflicts.length > 0 ? (
        <>
          <p className="text-xs leading-relaxed text-neutral-600">
            競合は自動で上書きせず、3-way mergeの結果を確認してから保存します。
          </p>
          <ul className="space-y-3">
            {props.conflicts.map((conflict) => (
              <ConflictView key={conflict.documentId} {...props} conflict={conflict} />
            ))}
          </ul>
        </>
      ) : (
        <button
          type="button"
          className="w-full rounded-md bg-neutral-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700"
          onClick={props.onClose}
        >
          閉じる
        </button>
      )}
    </div>
  );
}

function ErrorView(props: DeviceSyncPanelContentProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-800">
        <div className="mb-1 flex items-center gap-2 font-semibold">
          <AlertTriangle className="h-4 w-4" /> 同期できませんでした
        </div>
        {props.errorMessage}
      </div>
      <ManualTokenForm {...props} />
      <button
        type="button"
        className="w-full rounded-md bg-neutral-900 px-3 py-2.5 text-xs font-semibold text-white hover:bg-neutral-700"
        onClick={props.onReset}
      >
        もう一度試す
      </button>
    </div>
  );
}

function ConflictView(props: DeviceSyncPanelContentProps & { conflict: DraftSyncConflict }) {
  const { conflict } = props;
  return (
    <li className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div>
          <p className="text-xs font-semibold text-amber-900">下書き「{conflict.documentId}」</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            同じ箇所が別々に編集されました。各項目で残す側を選んでください。
          </p>
        </div>
      </div>
      <ul className="space-y-2">
        {conflict.conflicts.map((item, index) => {
          const path = item.path || '(ドキュメント全体)';
          const selected = props.choices[choiceKey(conflict, item.path)] ?? 'local';
          return (
            <li
              key={`${conflict.documentId}-${item.path}-${index}`}
              className="border-l-2 border-amber-200 py-2 pl-3"
            >
              <div className="mb-2 text-xs font-medium text-neutral-700">{path}</div>
              <div className="flex flex-wrap gap-1.5">
                <ChoiceButton
                  active={selected === 'local'}
                  label="この端末"
                  onClick={() => props.onChooseConflict(conflict, item.path, 'local')}
                />
                <ChoiceButton
                  active={selected === 'remote'}
                  label="相手の端末"
                  onClick={() => props.onChooseConflict(conflict, item.path, 'remote')}
                />
                {item.base !== undefined && (
                  <ChoiceButton
                    active={selected === 'base'}
                    label="共通の元"
                    onClick={() => props.onChooseConflict(conflict, item.path, 'base')}
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <button
        type="button"
        className="w-full rounded-md bg-amber-800 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-900"
        onClick={() => props.onResolveConflict(conflict)}
      >
        この競合を解消して保存
      </button>
    </li>
  );
}

function ManualTokenForm(props: DeviceSyncPanelContentProps) {
  return (
    <form
      className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
      onSubmit={(event) => {
        event.preventDefault();
        props.onJoinManualToken();
      }}
    >
      <label htmlFor="device-sync-token" className="block text-xs font-medium text-neutral-600">
        QRが使えない場合（トークン貼り付け）
      </label>
      <div className="flex gap-2">
        <input
          id="device-sync-token"
          value={props.manualToken}
          onChange={(event) => props.onManualTokenChange(event.target.value)}
          className="min-w-0 flex-1 rounded-md border border-neutral-300 bg-white px-2.5 py-2 font-mono text-xs outline-none focus:border-neutral-700"
          placeholder="同期トークン"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={props.isJoining || props.manualToken.trim().length === 0}
          className="shrink-0 rounded-md bg-neutral-800 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          接続
        </button>
      </div>
    </form>
  );
}

function TokenFallback(props: DeviceSyncPanelContentProps) {
  return (
    <div className="space-y-2 text-left">
      <div className="flex items-center justify-between text-xs font-medium text-neutral-600">
        <span>カメラが使えない場合のトークン</span>
        <button
          type="button"
          className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900"
          onClick={props.onCopyToken}
        >
          <Copy className="h-3 w-3" /> {props.copied ? 'コピー済み' : 'コピー'}
        </button>
      </div>
      <textarea
        value={props.pairingToken}
        readOnly
        rows={3}
        className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-50 p-2 font-mono text-xs leading-relaxed text-neutral-600"
        aria-label="端末同期トークン"
      />
      <p className="text-xs leading-relaxed text-neutral-400">有効期限は発行から2分です。</p>
    </div>
  );
}

function ChoiceButton(props: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`rounded border px-2 py-1 text-xs font-medium transition ${
        props.active
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400'
      }`}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

function choiceKey(conflict: DraftSyncConflict, path: string): string {
  return `${conflict.documentId}:${path}`;
}
