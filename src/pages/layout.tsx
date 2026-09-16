import React from 'react';
import { Outlet } from '@funstack/router';
import { DraftRuntime } from '@app/runtime/DraftRuntime';

/**
 * Root Layout for Funstack Static File-System Routing
 * Starts the browser-local draft runtime and provides the <Outlet /> for child routes.
 */
export default function RootLayout() {
  return (
    <>
      <DraftRuntime />
      <div className="flex min-h-full flex-col bg-neutral-50 font-sans text-neutral-900 antialiased">
        <Outlet />
      </div>
    </>
  );
}
