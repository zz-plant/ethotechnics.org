export function initFilterInput(selector: string): HTMLInputElement | null {
  const element = document.querySelector<HTMLInputElement>(selector);
  return element instanceof HTMLInputElement ? element : null;
}

export function syncUrlParam(key: string, value: string | undefined): string {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(key, value);
  } else {
    url.searchParams.delete(key);
  }
  window.history.replaceState({}, "", url.toString());
  return url.toString();
}

export function updateCount(element: HTMLElement | null, count: number): void {
  if (element) {
    element.textContent = String(count);
  }
}

export function parseFacetParams<T extends string>(
  keys: readonly T[],
): Partial<Record<T, string | undefined>> {
  const params = new URLSearchParams(window.location.search);
  return keys.reduce(
    (acc, key) => {
      acc[key] = params.get(key)?.trim() || undefined;
      return acc;
    },
    {} as Partial<Record<T, string | undefined>>,
  );
}

export function buildFacetUrl<T extends string>(
  facets: Partial<Record<T, string | undefined>>,
  basePath?: string,
): string {
  const url = new URL(window.location.href);
  for (const key of Object.keys(facets) as T[]) {
    const value = facets[key];
    if (value) {
      url.searchParams.set(key, value);
    } else {
      url.searchParams.delete(key);
    }
  }
  if (basePath) {
    return `${basePath}${url.search}${url.hash}`;
  }
  return url.toString();
}
