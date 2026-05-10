import React, { useState } from 'react';
import FindingCard from './FindingCard';

const DashboardPanel = ({ scanResults, isLoading, error, onScan }) => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(1);
  const [cookie, setCookie] = useState('');
  const [maxPage, setMaxPage] = useState(100);

  const handleSubmit = () => {
    if (!url.trim()) return;
    onScan(url, depth, cookie, maxPage);
  };

  return (
    <div className="dashboard-panel">
      <div className="dashboard-panel__top-row">
        <div className="dashboard-panel__scan-form retro-card">
          <div className="panel-title">SCAN TARGET</div>
          {error && <div className="retro-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Target URL / IP</label>
            <input
              className="sunken-panel"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cookie (optional, e.g. DVWA PHPSESSID)</label>
            <input
              className="sunken-panel"
              type="text"
              value={cookie}
              onChange={(e) => setCookie(e.target.value)}
              placeholder="your_session_id"
              disabled={isLoading}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Depth</label>
            <div className="depth-selector">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  className={`retro-btn retro-btn--depth${depth === d ? ' retro-btn--depth-active' : ''}`}
                  onClick={() => setDepth(d)}
                  disabled={isLoading}
                  type="button"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Max Pages</label>
            <input
              className="sunken-panel"
              type="number"
              value={maxPage}
              onChange={(e) => setMaxPage(Number(e.target.value))}
              min="1"
              placeholder="100"
              disabled={isLoading}
            />
          </div>
          <button
            className="retro-btn retro-btn--primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'SCANNING...' : 'SCAN'}
          </button>
        </div>
      </div>

      <div className="dashboard-panel__findings retro-card">
        <div className="panel-title">
          ACTIVE VULNERABILITIES ({scanResults?.total_vulnerabilities ?? 0})
        </div>
        <div className="findings-list">
          {isLoading && (
            <div className="retro-loading">
              <div className="retro-loading__title">SCANNING IN PROGRESS</div>
              <div className="retro-loading__subtitle">Analyzing target, please wait...</div>
            </div>
          )}
          {!isLoading && !scanResults && (
            <div className="retro-empty">
              <div className="retro-empty__title">AWAITING SCAN</div>
              <div className="retro-empty__subtitle">Enter a target URL above to begin analysis.</div>
            </div>
          )}
          {!isLoading && scanResults && scanResults.total_vulnerabilities === 0 && (
            <div className="retro-empty">
              <div className="retro-empty__title" style={{ color: '#006600' }}>NO VULNERABILITIES FOUND</div>
              <div className="retro-empty__subtitle">Target appears to be secure.</div>
            </div>
          )}
          {!isLoading && scanResults && scanResults.vulnerabilities && scanResults.vulnerabilities.map((vuln, idx) => (
            <FindingCard key={idx} vuln={vuln} defaultOpen={idx === 0} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
