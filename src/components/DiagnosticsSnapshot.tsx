import { useEffect, useRef, useState } from 'react';

type HeaderEntry = { key: string; value: string };

type Snapshot = {
  renderedAt: string;
  requestId: string;
  method: string;
  path: string;
  origin: string;
  cacheControl: string;
  headers: HeaderEntry[];
};

type SnapshotProps = {
  initialSnapshot: Snapshot;
  refreshUrl: string;
  intervalMs?: number;
};

export default function DiagnosticsSnapshot({
  initialSnapshot,
  refreshUrl,
  intervalMs = 15000,
}: SnapshotProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isFetchingRef = useRef(false);

  const refreshSnapshot = async (reason: 'manual' | 'interval') => {
    if (isFetchingRef.current && reason === 'interval') {
      return;
    }

    if (reason === 'manual') {
      setIsRefreshing(true);
    }

    isFetchingRef.current = true;
    setError(null);

    try {
      const response = await fetch(refreshUrl, {
        headers: { accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Unable to refresh snapshot');
      }

      const data = (await response.json()) as Snapshot;
      setSnapshot(data);
    } catch {
      setError('Unable to refresh snapshot. Please try again.');
    } finally {
      isFetchingRef.current = false;

      if (reason === 'manual') {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      void refreshSnapshot('interval');
    }, intervalMs);

    return () => window.clearInterval(id);
  }, [intervalMs, refreshUrl]);

  const handleCopy = async (fieldKey: string, value: string) => {
    setError(null);

    if (!navigator?.clipboard) {
      setError('Copy is not available in this browser.');
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldKey);

      window.setTimeout(() => {
        setCopiedField((current) => (current === fieldKey ? null : current));
      }, 1500);
    } catch {
      setError('Copy failed. Please try again.');
    }
  };

  const refreshCopyLabel = isRefreshing ? 'Refreshing snapshot' : 'Refresh snapshot';
  const intervalSeconds = Math.round(intervalMs / 1000);

  return (
    <div className="snapshot">
      <div className="snapshot__controls">
        <div>
          <p className="muted">Runtime snapshot</p>
          <h2>Per-request values</h2>
        </div>
        <div className="snapshot__actions">
          <button
            className="button primary"
            type="button"
            onClick={() => void refreshSnapshot('manual')}
            disabled={isRefreshing}
          >
            {refreshCopyLabel}
          </button>
          <p className="muted snapshot__hint">Auto-refreshes every {intervalSeconds} seconds.</p>
        </div>
      </div>

      {error && (
        <p className="snapshot__status" role="status" aria-live="polite">
          {error}
        </p>
      )}

      <dl className="grid grid--two snapshot__list">
        <div>
          <dt className="muted">Rendered at (UTC)</dt>
          <dd className="snapshot__value">
            <span className="snapshot__text">{snapshot.renderedAt}</span>
            <button
              className="copy-button"
              type="button"
              onClick={() => void handleCopy('rendered-at', snapshot.renderedAt)}
              aria-label="Copy rendered timestamp"
            >
              {copiedField === 'rendered-at' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        <div>
          <dt className="muted">Request ID</dt>
          <dd className="snapshot__value">
            <span className="snapshot__text">{snapshot.requestId}</span>
            <button
              className="copy-button"
              type="button"
              onClick={() => void handleCopy('request-id', snapshot.requestId)}
              aria-label="Copy request ID"
            >
              {copiedField === 'request-id' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        <div>
          <dt className="muted">Method</dt>
          <dd className="snapshot__value">
            <span className="snapshot__text">{snapshot.method}</span>
            <button
              className="copy-button"
              type="button"
              onClick={() => void handleCopy('method', snapshot.method)}
              aria-label="Copy method"
            >
              {copiedField === 'method' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        <div>
          <dt className="muted">Path</dt>
          <dd className="snapshot__value">
            <span className="snapshot__text">{snapshot.path}</span>
            <button
              className="copy-button"
              type="button"
              onClick={() => void handleCopy('path', snapshot.path)}
              aria-label="Copy path"
            >
              {copiedField === 'path' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        <div>
          <dt className="muted">Origin header</dt>
          <dd className="snapshot__value">
            <span className="snapshot__text">{snapshot.origin}</span>
            <button
              className="copy-button"
              type="button"
              onClick={() => void handleCopy('origin', snapshot.origin)}
              aria-label="Copy origin header"
            >
              {copiedField === 'origin' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
        <div>
          <dt className="muted">Cache-control</dt>
          <dd className="snapshot__value">
            <span className="snapshot__text">{snapshot.cacheControl}</span>
            <button
              className="copy-button"
              type="button"
              onClick={() => void handleCopy('cache-control', snapshot.cacheControl)}
              aria-label="Copy cache-control header"
            >
              {copiedField === 'cache-control' ? 'Copied' : 'Copy'}
            </button>
          </dd>
        </div>
      </dl>

      <div className="snapshot__headers">
        <div className="section__header">
          <p className="eyebrow">Headers</p>
          <h2>Request headers received</h2>
          <p className="muted">Values refresh automatically and on demand.</p>
        </div>
        <div className="grid grid--two">
          {snapshot.headers.map(({ key, value }) => (
            <article className="card snapshot__card" key={key}>
              <div className="card__glow" aria-hidden="true" />
              <p className="muted snapshot__header-key">{key}</p>
              <div className="snapshot__value">
                <span className="snapshot__text">{value}</span>
                <button
                  className="copy-button"
                  type="button"
                  onClick={() => void handleCopy(key, value)}
                  aria-label={`Copy ${key} header`}
                >
                  {copiedField === key ? 'Copied' : 'Copy'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
