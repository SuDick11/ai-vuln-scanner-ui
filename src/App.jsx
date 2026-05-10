import React, { useState, useCallback } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardPanel from './components/scan/DashboardPanel';
import useScan from './hooks/useScan';
import './styles/retro.css';
import './App.css';

const App = () => {
  const { scanResults, isLoading, error, startScan } = useScan();

  const handleScan = useCallback(async (url, depth, cookie, maxPage) => {
    await startScan(url, depth, cookie, maxPage);
  }, [startScan]);

  return (
    <div className="app-shell">
      <Header />
      <main className="app-shell__main">
        <DashboardPanel
          scanResults={scanResults}
          isLoading={isLoading}
          error={error}
          onScan={handleScan}
        />
      </main>
      <Footer />
    </div>
  );
};

export default App;
