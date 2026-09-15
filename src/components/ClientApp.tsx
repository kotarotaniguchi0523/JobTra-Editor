'use client';

import React from 'react';
import { DraftProvider } from '../context/DraftContext';
import { WritePageClient } from './WritePageClient';

interface ClientAppProps {
  handbookSlot?: React.ReactNode;
  guidelinesSlot?: React.ReactNode;
  brandSlot?: React.ReactNode;
  linksSlot?: React.ReactNode;
  sidebarFooterSlot?: React.ReactNode;
  starGuideSlot?: React.ReactNode;
  checklistSlot?: React.ReactNode;
  emptyDraftGuideSlot?: React.ReactNode;
}

/**
 * ClientApp:
 * 共通の DraftProvider でラップされたワークスペースエントリー。
 * リデューサーに依存せず、シンプルな State とトランジションで高速に動作。
 */
export function ClientApp(props: ClientAppProps) {
  return (
    <DraftProvider>
      <WritePageClient {...props} />
    </DraftProvider>
  );
}
