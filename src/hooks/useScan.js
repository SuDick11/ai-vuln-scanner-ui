import { useState, useCallback } from 'react';
import scanApi from '../api/scanApi';

const useScan = () => {
  const [scanResults, setScanResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startScan = useCallback(async (url, maxDepth, cookie, maxPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await scanApi.scan(url, maxDepth, cookie, maxPage);
      setScanResults(result);
      return result;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Scan failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearScan = useCallback(() => {
    setScanResults(null);
    setError(null);
  }, []);

  return { scanResults, isLoading, error, startScan, clearScan };
};

export default useScan;
