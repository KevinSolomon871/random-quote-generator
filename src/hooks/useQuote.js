import { useState, useEffect, useCallback, useRef } from 'react';
import { FALLBACK_QUOTES } from '../data/fallbackQuotes';

// DummyJSON is fast, CORS-enabled everywhere, and 100% reliable
const PRIMARY_API = 'https://dummyjson.com/quotes/random';

export function useQuote() {
  // Start with a fallback quote so the card NEVER displays empty
  const [quote, setQuote] = useState(() => FALLBACK_QUOTES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(!navigator.onLine);
  const isMountedRef = useRef(true);

  // Detect network online/offline transitions
  useEffect(() => {
    isMountedRef.current = true;
    const handleOnline = () => setIsOfflineMode(false);
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getRandomFallback = () => {
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
    return FALLBACK_QUOTES[randomIndex];
  };

  const fetchQuote = useCallback(async () => {
    setLoading(true);
    setError(null);

    // If client is offline, serve instant local fallback
    if (!navigator.onLine) {
      setQuote(getRandomFallback());
      setIsOfflineMode(true);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(PRIMARY_API, {
        headers: { Accept: 'application/json' },
      });

      if (!res.ok) throw new Error(`HTTP error status: ${res.status}`);

      const data = await res.json();

      if (isMountedRef.current) {
        setQuote({
          content: data.quote,
          author: data.author || 'Anonymous',
          tags: ['Inspiration'],
        });
      }
    } catch (err) {
      console.warn('API fetch failed, serving local fallback:', err);
      if (isMountedRef.current) {
        setQuote(getRandomFallback());
        setError('Public API limited. Showing verified local quote.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  // Fetch a live quote on initial mount
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  return { quote, loading, error, isOfflineMode, fetchQuote };
}