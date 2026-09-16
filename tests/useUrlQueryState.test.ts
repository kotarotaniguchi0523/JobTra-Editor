import { describe, it, expect, vi } from 'vitest';
import {
  parseQueryParam,
  calculateNextSearchString,
  executeNavigation,
  NavigationTarget,
} from '../src/hooks/useUrlQueryState';

describe('useUrlQueryState Navigation API Exclusive Logic - AAA Tests', () => {
  describe('parseQueryParam', () => {
    it('nullまたは空文字の場合、指定のデフォルト値を返すこと', () => {
      expect(parseQueryParam(null, 'write')).toBe('write');
      expect(parseQueryParam('', 'write')).toBe('write');
      expect(parseQueryParam(null, 400)).toBe(400);
      expect(parseQueryParam('', 400)).toBe(400);
    });

    it('文字列のパラメータを正しく取得できること', () => {
      const raw = 'structure';
      const result = parseQueryParam(raw, 'write');
      expect(result).toBe('structure');
    });

    it('数値型のパラメータを正しく数値に変換すること', () => {
      const raw = '800';
      const result = parseQueryParam(raw, 400, 'number');
      expect(result).toBe(800);
    });

    it('数値型でNaNになる不正な文字列の場合はデフォルト値を返すこと', () => {
      const raw = 'invalid-number';
      const result = parseQueryParam(raw, 400, 'number');
      expect(result).toBe(400);
    });

    it('数値の後ろに余分な文字がある場合はデフォルト値を返すこと', () => {
      expect(parseQueryParam('800px', 400, 'number')).toBe(400);
    });
  });

  describe('calculateNextSearchString', () => {
    it('新しいパラメータを追加または更新した検索文字列を生成すること', () => {
      const currentSearch = '?draft=abc';
      const nextSearch = calculateNextSearchString(currentSearch, 'mode', 'preview', 'write');
      expect(nextSearch).toContain('draft=abc');
      expect(nextSearch).toContain('mode=preview');
    });

    it('値がデフォルト値または空文字になった場合、パラメータを削除すること', () => {
      const currentSearch = '?draft=abc&mode=preview';
      const nextSearch1 = calculateNextSearchString(currentSearch, 'mode', 'write', 'write');
      expect(nextSearch1).toBe('?draft=abc');

      const nextSearch2 = calculateNextSearchString(nextSearch1, 'draft', '', '');
      expect(nextSearch2).toBe('');
    });
  });

  describe('executeNavigation - Pure Navigation API (No fallback)', () => {
    it('Navigation API (target.navigation.navigate) が存在する場合、navigateを実行してtrueを返すこと', () => {
      // Arrange
      const mockNavigate = vi.fn();
      const target: NavigationTarget = {
        navigation: { navigate: mockNavigate },
      };

      // Act
      const result = executeNavigation('/test?mode=structure', target);

      // Assert
      expect(result).toBe(true);
      expect(mockNavigate).toHaveBeenCalledWith('/test?mode=structure', { history: 'replace' });
    });

    it('Navigation API が存在しない場合、falseを返し余計なフォールバックを行わないこと', () => {
      // Arrange & Act & Assert
      expect(executeNavigation('/test', undefined)).toBe(false);
      expect(executeNavigation('/test', {} as NavigationTarget)).toBe(false);
    });
  });
});
