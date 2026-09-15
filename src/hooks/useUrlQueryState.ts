'use client';

import { useState, useEffect, useCallback, useEffectEvent } from 'react';

/**
 * URLクエリパラメータを型安全にパースする純粋関数
 */
export function parseQueryParam<T extends string | number>(
  rawValue: string | null,
  defaultValue: T,
  type: 'string' | 'number' = typeof defaultValue === 'number' ? 'number' : 'string',
): T {
  if (rawValue === null || rawValue === '') return defaultValue;
  if (type === 'number') {
    const num = parseInt(rawValue, 10);
    return (isNaN(num) ? defaultValue : num) as T;
  }
  return rawValue as T;
}

/**
 * クエリパラメータの更新後のURLサーチ文字列を生成する純粋関数
 */
export function calculateNextSearchString<T extends string | number>(
  currentSearch: string,
  key: string,
  nextValue: T | null | '',
  defaultValue: T,
): string {
  const params = new URLSearchParams(currentSearch);
  if (nextValue === null || nextValue === '' || nextValue === defaultValue) {
    params.delete(key);
  } else {
    params.set(key, String(nextValue));
  }
  const str = params.toString();
  return str ? `?${str}` : '';
}

export interface NavigationTarget {
  navigation: {
    navigate: (url: string, options?: { history?: 'replace' | 'push' }) => void;
  };
}

/**
 * Navigation API 専用ディスパッチャー関数（フォールバック不使用）
 */
export function executeNavigation(targetUrl: string, targetWin?: NavigationTarget): boolean {
  if (!targetWin?.navigation?.navigate) {
    return false;
  }
  targetWin.navigation.navigate(targetUrl, { history: 'replace' });
  return true;
}

/**
 * Navigation API を直接呼び出してURLを更新するヘルパー関数
 */
export function navigateToUrl(targetUrl: string): void {
  if (typeof window === 'undefined') return;
  const navWin = window as unknown as NavigationTarget;
  if (navWin.navigation && typeof navWin.navigation.navigate === 'function') {
    navWin.navigation.navigate(targetUrl, { history: 'replace' });
  }
}

/**
 * useUrlQueryState
 * Navigation API 専用の React 19 URL クエリ状態フック
 */
export function useUrlQueryState<T extends string | number>(
  key: string,
  defaultValue: T,
  type: 'string' | 'number' = typeof defaultValue === 'number' ? 'number' : 'string',
): [T, (nextVal: T | null | '') => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const params = new URLSearchParams(window.location.search);
      return parseQueryParam(params.get(key), defaultValue, type);
    } catch {
      return defaultValue;
    }
  });

  // useEffectEvent: イベントリスナー再購読を防ぎつつ最新の key/defaultValue を参照
  const onLocationChange = useEffectEvent(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      setValue(parseQueryParam(params.get(key), defaultValue, type));
    } catch {
      setValue(defaultValue);
    }
  });

  // Navigation API の currententrychange イベントのみを購読
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nav = (window as unknown as { navigation?: EventTarget }).navigation;
    if (!nav || typeof nav.addEventListener !== 'function') return;

    nav.addEventListener('currententrychange', onLocationChange);
    return () => {
      nav.removeEventListener('currententrychange', onLocationChange);
    };
  }, []);

  const setUrlValue = useCallback(
    (nextVal: T | null | '') => {
      const resolved = nextVal === null || nextVal === '' ? defaultValue : nextVal;
      setValue(resolved);

      if (typeof window !== 'undefined') {
        try {
          const nextSearch = calculateNextSearchString(
            window.location.search,
            key,
            nextVal,
            defaultValue,
          );
          const nextUrl = window.location.pathname + nextSearch + window.location.hash;
          navigateToUrl(nextUrl);
        } catch {
          // Safe fail
        }
      }
    },
    [key, defaultValue],
  );

  return [value, setUrlValue];
}
