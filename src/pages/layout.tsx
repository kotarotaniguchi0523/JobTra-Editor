import React from 'react';
import { Outlet } from '@funstack/router';
import { DraftProvider } from '../context/DraftContext';

/**
 * Root Layout for Funstack Static File-System Routing
 * Wraps all pages under src/pages with DraftProvider and provides the <Outlet /> for child routes.
 */
export default function RootLayout() {
  return (
    <DraftProvider>
      <div className="min-h-full flex flex-col bg-neutral-50 text-neutral-900 font-sans antialiased">
        <Outlet />
      </div>
    </DraftProvider>
  );
}
