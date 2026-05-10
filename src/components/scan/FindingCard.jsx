import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

const FindingCard = ({ vuln, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="finding-card outset">
      <button className="finding-card__header" onClick={() => setIsOpen(!isOpen)}>
        <span className="finding-card__type">{vuln.vulnerability_type || 'Unknown'}</span>
        <span className="finding-card__url">{vuln.target_endpoint || ''}</span>
        <span className="finding-card__arrow">{isOpen ? '\u25B2' : '\u25BC'}</span>
      </button>

      {isOpen && (
        <div className="finding-card__body sunken-panel">
          <div className="finding-card__field">
            <span className="finding-card__field-label">Vulnerability Type:</span>
            <code>{vuln.vulnerability_type || 'N/A'}</code>
          </div>

          <div className="finding-card__field">
            <span className="finding-card__field-label">Target Endpoint:</span>
            <code>{vuln.target_endpoint || 'N/A'}</code>
          </div>

          <div className="finding-card__field">
            <span className="finding-card__field-label">HTTP Method:</span>
            <code>{vuln.method || 'N/A'}</code>
          </div>

          <div className="finding-card__field">
            <span className="finding-card__field-label">Vulnerable Parameter:</span>
            <code>{vuln.vulnerable_parameter || 'N/A'}</code>
          </div>

          <div className="finding-card__field">
            <span className="finding-card__field-label">Payload:</span>
            <code className="finding-card__payload">{vuln.payload || 'N/A'}</code>
          </div>

          <div className="finding-card__field">
            <span className="finding-card__field-label">Evidence:</span>
            <pre className="finding-card__evidence">{vuln.evidence || 'No evidence available.'}</pre>
          </div>

          {vuln.llm_explanation && (
            <div className="finding-card__field">
              <span className="finding-card__field-label">LLM Explanation:</span>
              <pre className="finding-card__evidence">{vuln.llm_explanation}</pre>
            </div>
          )}

          {vuln.remediation_code && (
            <div className="finding-card__field">
              <span className="finding-card__field-label">Remediation:</span>
              <SyntaxHighlighter
                language="python"
                style={atomOneLight}
                customStyle={{ borderRadius: '4px', padding: '12px', fontSize: '13px', backgroundColor: '#ffffff' }}
              >
                {vuln.remediation_code
                  .replace(/^```[\w]*\n?/, '')
                  .replace(/```$/, '')
                  .trim()}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindingCard;
