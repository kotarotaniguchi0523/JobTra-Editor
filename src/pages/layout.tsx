import React from 'react';
import { Outlet } from '@funstack/router';

/**
 * Root Layout for Funstack Static File-System Routing
 * Provides only the static site frame and the <Outlet /> for child routes.
 */
export default function RootLayout() {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50 font-sans text-neutral-900 antialiased">
      <Outlet />
    </div>
  );
}
