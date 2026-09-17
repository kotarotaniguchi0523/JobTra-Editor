'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { draftActions, draftStore } from '@entities/draft/model/draftStore';
import {
  resolveDraftConflict,
  syncDrafts,
  type DraftSyncConflict,
  type DraftSyncValue,
} from '@features/device-sync/sync/draft-sync';
import { IndexedDbRevisionStore } from '@features/device-sync/sync/indexeddb-store';
import type { MergeChoice } from '@features/device-sync/sync/merge';
import {
  createPairingToken,
  decodePairingToken,
  encodePairingToken,
} from '@features/device-sync/transport/pairing-token';
import { getReplicaId } from '@features/device-sync/transport/replica-identity';
import { createTrysteroChannel } from '@features/device-sync/transport/trystero';
import { currentTimeMs } from '@features/device-sync/transport/clock';
import {
  DeviceSyncPanelContent,
  type SyncPanelMode,
} from '@features/device-sync/ui/DeviceSyncPanelContent';
import { QrScanner } from '@features/device-sync/ui/QrScanner';

const SYNC_APP_ID = 'jobtra-editor-device-sync-v1';
const PAIRING_TTL_MS = 2 * 60 * 1_000;

export function DeviceSyncPanel(props: { onClose: () => void }) {
  const [mode, setMode] = useState<SyncPanelMode>('idle');
  const [pairingToken, setPairingToken] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [summaryMessage, setSummaryMessage] = useState('');
  const [conflicts, setConflicts] = useState<DraftSyncConflict[]>([]);
  const [choices, setChoices] = useState<Record<string, MergeChoice>>({});
  const [copied, setCopied] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const storeRef = useRef<IndexedDbRevisionStore<DraftSyncValue> | null>(null);
  const channelRef = useRef<{ close: () => void } | null>(null);

  useEffect(() => {
    return () => {
      channelRef.current?.close();
      void storeRef.current?.close();
    };
  }, []);

  function resetPanel(): void {
    channelRef.current?.close();
    channelRef.current = null;
    setMode('idle');
    setPairingToken('');
    setQrDataUrl('');
    setManualToken('');
    setStatusMessage('');
    setErrorMessage('');
    setSummaryMessage('');
    setConflicts([]);
    setChoices({});
    setCopied(false);
    setIsJoining(false);
  }

  async function createHostPairing(): Promise<void> {
    resetPanel();
    const token = createPairingToken({
      appId: SYNC_APP_ID,
      strategy: 'nostr',
      ttlMs: PAIRING_TTL_MS,
      now: currentTimeMs(),
    });
    const encoded = encodePairingToken(token);
    setPairingToken(encoded);
    setMode('host');
    setStatusMessage('QRを表示しています。相手の端末で1回読み取ってください。');
    try {
      const dataUrl = await QRCode.toDataURL(encoded, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 280,
      });
      setQrDataUrl(dataUrl);
      connectAndSync(token).catch((error: unknown) => {
        setErrorMessage(toErrorMessage(error));
        setMode('error');
      });
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      setMode('error');
    }
  }

  function startScanner(): void {
    if (isJoining) return;
    resetPanel();
    setMode('scan');
    setStatusMessage('カメラを起動しています。QRコードを枠内に写してください。');
  }

  async function joinWithEncodedToken(encoded: string): Promise<void> {
    if (isJoining) return;
    setIsJoining(true);
    try {
      const token = decodePairingToken(encoded.trim(), currentTimeMs());
      const validationError = validateSyncToken(token);
      if (validationError !== null) {
        setErrorMessage(validationError);
        setMode('error');
        return;
      }
      setPairingToken(encoded.trim());
      setMode('syncing');
      setStatusMessage('相手の端末を待って同期しています。');
      await connectAndSync(token);
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      setMode('error');
    }
    setIsJoining(false);
  }

  async function connectAndSync(token: ReturnType<typeof createPairingToken>): Promise<void> {
    const store = storeRef.current ?? new IndexedDbRevisionStore<DraftSyncValue>();
    storeRef.current = store;
    const channel = createTrysteroChannel<DraftSyncValue>({
      appId: token.appId,
      roomId: token.roomId,
      password: token.password,
    });
    channelRef.current = channel;
    try {
      const result = await syncDrafts({
        drafts: draftStore.getState().drafts,
        store,
        channel,
        replicaId: getReplicaId(),
        now: currentTimeMs(),
        timeoutMs: 30_000,
      });
      await draftActions.applySyncedDrafts(result.syncedDrafts);
      setConflicts(result.conflicts);
      setSummaryMessage(
        `送信 ${result.summary.sent}件 / 受信 ${result.summary.received}件。IndexedDBへ反映しました。`,
      );
      setStatusMessage(
        result.conflicts.length === 0
          ? '同期が完了しました。'
          : `${result.conflicts.length}件の競合があります。内容を選んで解決してください。`,
      );
      setMode('complete');
    } catch (error) {
      channel.close();
      channelRef.current = null;
      throw error;
    }
    channel.close();
    channelRef.current = null;
  }

  async function resolveConflict(conflict: DraftSyncConflict): Promise<void> {
    const store = storeRef.current;
    if (store === null) return;
    const resolution: Record<string, MergeChoice> = {};
    for (const item of conflict.conflicts) {
      resolution[item.path] = choices[choiceKey(conflict, item.path)] ?? 'local';
    }
    try {
      const resolved = await resolveDraftConflict({
        conflict,
        choices: resolution,
        store,
        replicaId: getReplicaId(),
        now: currentTimeMs(),
      });
      const currentDrafts = draftStore
        .getState()
        .drafts.filter((draft) => draft.id !== conflict.documentId);
      await draftActions.applySyncedDrafts(
        resolved === null ? currentDrafts : [...currentDrafts, resolved],
      );
      setConflicts((current) => current.filter((item) => item.documentId !== conflict.documentId));
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      setMode('error');
    }
  }

  async function copyToken(): Promise<void> {
    if (!pairingToken || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(pairingToken);
      setCopied(true);
    } catch (error) {
      setErrorMessage(toErrorMessage(error));
      setMode('error');
    }
  }

  const contentProps = {
    mode,
    pairingToken,
    qrDataUrl,
    manualToken,
    statusMessage,
    errorMessage,
    summaryMessage,
    conflicts,
    choices,
    copied,
    isJoining,
    onCreateHostPairing: () => {
      createHostPairing().catch((error: unknown) => {
        setErrorMessage(toErrorMessage(error));
        setMode('error');
      });
    },
    onStartScanner: startScanner,
    onJoinManualToken: () => {
      joinWithEncodedToken(manualToken).catch((error: unknown) => {
        setErrorMessage(toErrorMessage(error));
        setMode('error');
      });
    },
    onManualTokenChange: setManualToken,
    onCopyToken: () => {
      copyToken().catch((error: unknown) => {
        setErrorMessage(toErrorMessage(error));
        setMode('error');
      });
    },
    onReset: resetPanel,
    onClose: props.onClose,
    onResolveConflict: (conflict: DraftSyncConflict) => {
      resolveConflict(conflict).catch((error: unknown) => {
        setErrorMessage(toErrorMessage(error));
        setMode('error');
      });
    },
    onChooseConflict: (conflict: DraftSyncConflict, path: string, choice: MergeChoice) =>
      setChoices((current) => ({ ...current, [choiceKey(conflict, path)]: choice })),
    scannerSlot:
      mode === 'scan' ? (
        <QrScanner
          onToken={(value) => {
            joinWithEncodedToken(value).catch((error: unknown) => {
              setErrorMessage(toErrorMessage(error));
              setMode('error');
            });
          }}
          onError={(error) => {
            setErrorMessage(toErrorMessage(error));
            setMode('error');
          }}
        />
      ) : undefined,
  };

  return <DeviceSyncPanelContent {...contentProps} />;
}

function choiceKey(conflict: DraftSyncConflict, path: string): string {
  return `${conflict.documentId}:${path}`;
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : '予期しないエラーが発生しました。';
}

function validateSyncToken(token: ReturnType<typeof createPairingToken>): string | null {
  if (token.appId !== SYNC_APP_ID) return 'このサイト用ではない同期トークンです。';
  if (token.strategy !== 'nostr') return 'この同期方式には対応していません。';
  return null;
}
