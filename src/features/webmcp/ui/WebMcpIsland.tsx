'use client';

import { useEffect } from 'react';
import { registerWritingTools } from '@features/webmcp/lib/registerWritingTools';

/**
 * Registers the writing-assistance tools only while the writing route is alive.
 * WebMCP is an external browser API, so this is the sole effect in the island.
 */
export function WebMcpIsland() {
  useEffect(() => {
    const controller = new AbortController();

    void registerWritingTools(controller.signal).catch((error: unknown) => {
      const failedBeforeUnmount = !controller.signal.aborted;
      controller.abort();

      if (failedBeforeUnmount) {
        console.error('Failed to register WebMCP writing tools:', error);
      }
    });

    return () => controller.abort();
  }, []);

  return null;
}
