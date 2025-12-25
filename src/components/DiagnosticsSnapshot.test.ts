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

  it('updates snapshot and clears refreshing state after a successful manual refresh', async () => {
    const abortControllerRef = { current: null } as SnapshotRef<AbortController | null>;
    const isFetchingRef = { current: false } as SnapshotRef<boolean>;
    const isMountedRef = { current: true } as SnapshotRef<boolean>;

    const setSnapshot = vi.fn();
    const setError = vi.fn();
    const setIsRefreshing = vi.fn();

    const nextSnapshot = {
      cacheControl: 'no-store',
      headers: [],
      method: 'GET',
      origin: 'https://ethotechnics.org',
      path: '/diagnostics',
      renderedAt: '2024-04-01T00:00:00.000Z',
      requestId: 'abc-123',
    };

    const fetchMock = vi.fn(async (_url: string, options?: RequestInit) => {
      const signal = options?.signal as AbortSignal | undefined;

      expect(signal).toBeInstanceOf(AbortSignal);

      return {
        ok: true,
        json: async () => nextSnapshot,
      } as Response;
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

    await refreshSnapshot('manual');

    expect(setIsRefreshing).toHaveBeenCalledWith(true);
    expect(setSnapshot).toHaveBeenCalledWith(nextSnapshot);
    expect(setError).toHaveBeenCalledWith(null);
    expect(setIsRefreshing).toHaveBeenCalledWith(false);
    expect(isFetchingRef.current).toBe(false);
    expect(abortControllerRef.current).toBeNull();
  });

  it('surfaces errors and resets refreshing flags when a manual refresh fails', async () => {
    const abortControllerRef = { current: null } as SnapshotRef<AbortController | null>;
    const isFetchingRef = { current: false } as SnapshotRef<boolean>;
    const isMountedRef = { current: true } as SnapshotRef<boolean>;

    const setSnapshot = vi.fn();
    const setError = vi.fn();
    const setIsRefreshing = vi.fn();

    global.fetch = vi.fn(async () => ({
      ok: false,
      json: async () => ({}),
    } as Response)) as unknown as typeof fetch;

    const refreshSnapshot = createRefreshSnapshot({
      abortControllerRef,
      isFetchingRef,
      isMountedRef,
      refreshUrl,
      setError,
      setIsRefreshing,
      setSnapshot,
    });

    await refreshSnapshot('manual');

    expect(setError).toHaveBeenCalledWith(null);
    expect(setError).toHaveBeenCalledWith('Unable to refresh snapshot. Please try again.');
    expect(setSnapshot).not.toHaveBeenCalled();
    expect(setIsRefreshing).toHaveBeenCalledWith(true);
    expect(setIsRefreshing).toHaveBeenCalledWith(false);
    expect(isFetchingRef.current).toBe(false);
    expect(abortControllerRef.current).toBeNull();
  });

  it('skips interval refreshes that overlap with an in-flight request', async () => {
    const abortControllerRef = { current: null } as SnapshotRef<AbortController | null>;
    const isFetchingRef = { current: true } as SnapshotRef<boolean>;
    const isMountedRef = { current: true } as SnapshotRef<boolean>;

    const setSnapshot = vi.fn();
    const setError = vi.fn();
    const setIsRefreshing = vi.fn();

    const refreshSnapshot = createRefreshSnapshot({
      abortControllerRef,
      isFetchingRef,
      isMountedRef,
      refreshUrl,
      setError,
      setIsRefreshing,
      setSnapshot,
    });

    await refreshSnapshot('interval');

    expect(setError).not.toHaveBeenCalled();
    expect(setSnapshot).not.toHaveBeenCalled();
    expect(setIsRefreshing).not.toHaveBeenCalled();
    expect(isFetchingRef.current).toBe(true);
    expect(abortControllerRef.current).toBeNull();
  });
});
