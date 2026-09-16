import { describe, expect, it } from 'vitest';
import {
  parseDraft,
  parseExportFilenamePart,
  parseMarkdownYamlString,
  parseSearchQuery,
  parseWorkspaceSearchParams,
  withDraftId,
} from '../src/validation/schemas';

describe('Valibot validation boundaries', () => {
  it('ファイル名の危険な文字をスキーマの変換で置換すること', () => {
    expect(parseExportFilenamePart('  A/B:C  ', 'fallback')).toBe('A_B_C');
    expect(parseExportFilenamePart('', 'fallback')).toBe('fallback');
  });

  it('Markdown YAMLの文字列をスキーマの変換でエスケープすること', () => {
    const value = parseMarkdownYamlString('タイトル"\\\n本文');

    expect(value).not.toContain('\n');
    expect(value).toContain('\\"');
    expect(value).toContain('\\\\');
  });

  it('検索語をトリム・小文字化し、上限超過を空文字にすること', () => {
    expect(parseSearchQuery('  React  ')).toBe('react');
    expect(parseSearchQuery('x'.repeat(201))).toBe('');
  });

  it('URL検索パラメータをスキーマで検証し、draft idだけを許可すること', () => {
    expect(parseWorkspaceSearchParams('?id=draft_123&mode=write')).toEqual({ id: 'draft_123' });
    expect(parseWorkspaceSearchParams('?id=../unsafe&mode=write')).toEqual({});
  });

  it('URL検索パラメータの更新時に既存の安全な値を保持すること', () => {
    expect(withDraftId('?mode=write', 'draft_123').toString()).toBe('mode=write&id=draft_123');
    expect(withDraftId('?mode=write&id=draft_123', '../unsafe').toString()).toBe('mode=write');
  });

  it('永続化データをドラフトスキーマで検証すること', () => {
    expect(parseDraft({ id: '../unsafe' })).toBeNull();
    expect(
      parseDraft({
        id: 'draft_123',
        title: 'タイトル',
        companyName: '',
        category: 'gakuchika',
        content: '',
        isBlockMode: false,
        targetCount: 400,
        createdAt: 1,
        updatedAt: 1,
        tags: [],
      }),
    ).toMatchObject({ id: 'draft_123', category: 'gakuchika' });
  });
});
