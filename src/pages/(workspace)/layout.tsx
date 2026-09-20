import React from 'react';
import { Outlet } from '@funstack/router';
import { DraftRuntime } from '@app/runtime/DraftRuntime';

/**
 * Browser-only workspace layout. Marketing and guide routes stay free of the
 * draft bootstrap and IndexedDB synchronization runtime.
 */
export default function WorkspaceRouteLayout() {
  return (
    <>
      <DraftRuntime />
      <Outlet />
    </>
  );
}
