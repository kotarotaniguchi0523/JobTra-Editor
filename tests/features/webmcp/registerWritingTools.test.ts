import { afterEach, describe, expect, it } from 'vitest';
import type { WebMCP } from 'webmcp-types';
import { registerWritingTools } from '@features/webmcp/lib/registerWritingTools';

const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');
const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');

afterEach(() => {
  if (originalDocumentDescriptor) {
    Object.defineProperty(globalThis, 'document', originalDocumentDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, 'document');
  }

  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, 'navigator');
  }
});

describe('registerWritingTools', () => {
  it('registers the writing tools with the lifecycle signal', async () => {
    const registrations: Array<{ name: string; signal?: AbortSignal }> = [];
    const modelContext = {
      registerTool: async (
        tool: WebMCP.ModelContextTool,
        options?: WebMCP.ModelContextRegisterToolOptions,
      ) => {
        registrations.push({ name: tool.name, signal: options?.signal });
      },
    } as WebMCP.ModelContext;

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: { modelContext },
    });

    const controller = new AbortController();
    await expect(registerWritingTools(controller.signal)).resolves.toBe(true);

    expect(registrations.map(({ name }) => name)).toEqual([
      'get_writing_context',
      'analyze_writing',
      'compare_writing_versions',
    ]);
    expect(registrations.every(({ signal }) => signal === controller.signal)).toBe(true);
  });

  it('gracefully does nothing when WebMCP is not supported', async () => {
    Reflect.deleteProperty(globalThis, 'document');

    await expect(registerWritingTools(new AbortController().signal)).resolves.toBe(false);
  });

  it('does not call an incomplete model context', async () => {
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: { modelContext: {} },
    });

    await expect(registerWritingTools(new AbortController().signal)).resolves.toBe(false);
  });

  it('supports the deprecated navigator model context fallback', async () => {
    const registrations: string[] = [];
    const modelContext = {
      registerTool: async (tool: WebMCP.ModelContextTool) => {
        registrations.push(tool.name);
      },
    } as WebMCP.ModelContext;

    Reflect.deleteProperty(globalThis, 'document');
    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: { modelContext },
    });

    await expect(registerWritingTools(new AbortController().signal)).resolves.toBe(true);
    expect(registrations).toHaveLength(3);
  });

  it('skips registration when the lifecycle signal is already aborted', async () => {
    const registerTool = async () => {
      throw new Error('should not register');
    };
    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: { modelContext: { registerTool } },
    });

    const controller = new AbortController();
    controller.abort();

    await expect(registerWritingTools(controller.signal)).resolves.toBe(false);
  });
});
