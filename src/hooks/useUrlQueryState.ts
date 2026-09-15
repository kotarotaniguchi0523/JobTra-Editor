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

/** Navigation API 専用ディスパッチャー関数（フォールバック不使用） */
export function executeNavigation(targetUrl: string, targetWin?: NavigationTarget): boolean {
  if (!targetWin?.navigation?.navigate) {
    return false;
  }
  targetWin.navigation.navigate(targetUrl, { history: 'replace' });
  return true;
}
