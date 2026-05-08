import { useEffect, useState } from "react";

const cache = new Map();
const inFlight = new Map();

export function usePageContent(page) {
  const [sections, setSections] = useState(() => cache.get(page) || null);
  const [loading, setLoading] = useState(!cache.has(page));
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (cache.has(page)) {
      setSections(cache.get(page));
      setLoading(false);
      return;
    }

    setLoading(true);

    const promise =
      inFlight.get(page) ||
      fetch(`/api/admin/pages/${page}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
        .then((doc) => {
          const next = doc?.sections || {};
          cache.set(page, next);
          inFlight.delete(page);
          return next;
        })
        .catch((e) => {
          inFlight.delete(page);
          throw e;
        });

    inFlight.set(page, promise);

    promise
      .then((next) => {
        if (cancelled) return;
        setSections(next);
        setLoading(false);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(e);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page]);

  return { sections, loading, error };
}

export function invalidatePageContent(page) {
  if (page) cache.delete(page);
  else cache.clear();
}
