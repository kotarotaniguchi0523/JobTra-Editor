import { describe, expect, it } from 'vitest';
import {
  parseCloudGuideInput,
  parseTutorialExampleInput,
  parseTutorialExampleOutput,
  parseTutorialGuideOutput,
  parseTutorialStageInput,
} from '@features/webmcp/model/tutorialToolSchemas';

describe('WebMCP tutorial tool schemas', () => {
  it('accepts valid guide inputs and rejects unknown stages', () => {
    expect(parseTutorialStageInput({ stage: 'review' })).toEqual({ stage: 'review' });
    expect(parseTutorialStageInput({ stage: 'unknown' })).toBeNull();
    expect(parseCloudGuideInput({})).toEqual({});
    expect(parseCloudGuideInput({ unexpected: true })).toBeNull();
  });

  it('requires explicit confirmation for tutorial example input', () => {
    expect(
      parseTutorialExampleInput({ exampleId: 'gakuchika', mode: 'replace_empty', confirm: true }),
    ).toEqual({ exampleId: 'gakuchika', mode: 'replace_empty', confirm: true });
    expect(parseTutorialExampleInput({ exampleId: 'gakuchika', mode: 'replace_empty' })).toBeNull();
  });

  it('accepts structured success and failure outputs', () => {
    expect(
      parseTutorialGuideOutput({
        ok: true,
        topic: 'jobtra-tutorial',
        stage: null,
        contentType: 'text/markdown',
        source: '/ai/jobtra-tutorial.ja.md',
        markdown: '# Tutorial',
      }),
    ).not.toBeNull();
    expect(
      parseTutorialExampleOutput({
        ok: false,
        error: { code: 'confirmation_required', message: '確認が必要です。' },
      }),
    ).not.toBeNull();
  });
});
