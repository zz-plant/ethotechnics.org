import { describe, expect, it, vi } from 'vitest';

import { createRefreshSnapshot, type SnapshotRef } from './DiagnosticsSnapshot';

describe('createRefreshSnapshot', () => {
  const refreshUrl = '/api/diagnostics';
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('aborts refreshes and skips updates after unmount', async () => {
    const abortControllerRef = { current: null } as SnapshotRef<AbortController | null>;
    const isFetchingRef = { current: false } as SnapshotRef<boolean>;
    const isMountedRef = { current: true } as SnapshotRef<boolean>;

    const setSnapshot = vi.fn();
    const setError = vi.fn();
    const setIsRefreshing = vi.fn();

    const fetchMock = vi.fn((_url: string, options?: RequestInit) => {
      const signal = options?.signal as AbortSignal | undefined;

      return new Promise<Response>((_, reject) => {
        signal?.addEventListener('abort', () => {
          const abortError = new Error('Aborted');
          (abortError as Error & { name: string }).name = 'AbortError';
          reject(abortError);
        });
      });
    });

    global.fetch = fetchMock as unknown as typeof fetch;

    const refreshSnapshot = createRefreshSnapshot({
      abortControllerRef,
      isFetchingRef,
      isMountedRef,
      refreshUrl,
      setError,
      setIsRefreshing,
      setSnapshot,
    });

    const refreshPromise = refreshSnapshot('manual');

    expect(setIsRefreshing).toHaveBeenCalledWith(true);
    expect(isFetchingRef.current).toBe(true);

    isMountedRef.current = false;
    abortControllerRef.current?.abort();

    await refreshPromise;

    expect(fetchMock).toHaveBeenCalledWith(
      refreshUrl,
      expect.objectContaining({
        headers: { accept: 'application/json' },
        signal: expect.any(AbortSignal),
      }),
    );
    expect(setSnapshot).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith(null);
    expect(setError).not.toHaveBeenCalledWith('Unable to refresh snapshot. Please try again.');
    expect(setIsRefreshing).toHaveBeenCalledTimes(1);
    expect(isFetchingRef.current).toBe(false);
    expect(abortControllerRef.current).toBeNull();
  });
});
