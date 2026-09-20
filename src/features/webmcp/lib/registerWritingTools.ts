import type { WebMCP } from 'webmcp-types';
import { writingTools } from '@features/webmcp/lib/writingTools';
import { tutorialTools } from '@features/webmcp/lib/tutorialTools';

function isModelContext(value: unknown): value is WebMCP.ModelContext {
  return (
    typeof value === 'object' &&
    value !== null &&
    'registerTool' in value &&
    typeof value.registerTool === 'function'
  );
}

function getModelContext(): WebMCP.ModelContext | undefined {
  if (typeof document !== 'undefined' && isModelContext(document.modelContext)) {
    return document.modelContext;
  }

  const navigatorWithModelContext =
    typeof navigator === 'undefined'
      ? undefined
      : (navigator as Navigator & { modelContext?: WebMCP.ModelContext });

  return isModelContext(navigatorWithModelContext?.modelContext)
    ? navigatorWithModelContext.modelContext
    : undefined;
}

export async function registerWritingTools(signal: AbortSignal): Promise<boolean> {
  const modelContext = getModelContext();
  if (!modelContext || signal.aborted) return false;

  await Promise.all(
    [...writingTools, ...tutorialTools].map((tool) => modelContext.registerTool(tool, { signal })),
  );

  return !signal.aborted;
}
