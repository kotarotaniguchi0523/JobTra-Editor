import {
  parseQueryValue,
  parseSearchParamKey,
  parseSearchParamValue,
  parseSearchParams,
} from '../validation/schemas';

/** URLクエリパラメータをValibotで検証して型安全にパースする純粋関数 */
export function parseQueryParam<T extends string | number>(
  rawValue: unknown,
  defaultValue: T,
  type: 'string' | 'number' = typeof defaultValue === 'number' ? 'number' : 'string',
): T {
  if (rawValue === null || rawValue === '') return defaultValue;

  const parsedValue = parseQueryValue(rawValue, type);
  return (parsedValue ?? defaultValue) as T;
}

/** Valibotで現在値・キー・次値を検証し、更新後のURLサーチ文字列を生成する純粋関数 */
export function calculateNextSearchString<T extends string | number>(
  currentSearch: string,
  key: string,
  nextValue: T | null | '',
  defaultValue: T,
): string {
  const params = new URLSearchParams(parseSearchParams(currentSearch));
  const parsedKey = parseSearchParamKey(key);

  if (!parsedKey) return params.toString() ? `?${params.toString()}` : '';

  if (nextValue === null || nextValue === '' || nextValue === defaultValue) {
    params.delete(parsedKey);
  } else {
    const parsedValue = parseQueryValue(
      String(nextValue),
      typeof defaultValue === 'number' ? 'number' : 'string',
    );
    const serializedValue = parseSearchParamValue(
      parsedValue === null ? null : String(parsedValue),
    );
    if (serializedValue !== null) params.set(parsedKey, serializedValue);
  }

  const str = params.toString();
  return str ? `?${str}` : '';
}

export interface NavigationTarget {
  navigation: {
    navigate: (url: string, options?: { history?: 'replace' | 'push' }) => void;
  };
}

/** Navigation API専用ディスパッチャー関数（フォールバック不使用） */
export function executeNavigation(targetUrl: string, targetWin?: NavigationTarget): boolean {
  if (!targetWin?.navigation?.navigate) {
    return false;
  }
  targetWin.navigation.navigate(targetUrl, { history: 'replace' });
  return true;
}
