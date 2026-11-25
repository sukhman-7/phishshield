import { useEffect } from 'react';
import { X, CheckCircle2, Network } from 'lucide-react';
import { ThreatGauge } from './ThreatGauge';
import { getVectorMeta, getVerdictMeta } from '../utils/verdicts';

export function LogDetailDrawer({ log, onClose }) {
  useEffect(() => {
    if (!log) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [log, onClose]);

  if (!log) return null;

  const { tone, label, headline, Icon: VerdictIcon } = getVerdictMeta(log.verdict);
  const vector = getVectorMeta(log.scan_type);
  const details = Array.isArray(log.analysis_details) ? log.analysis_details : [];
  const networkMap = Array.isArray(log.network_map) ? log.network_map : [];

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <div className="drawer-title">Incident Forensic Record #{log.id}</div>
            <div className="cell-timestamp" style={{ marginTop: '2px' }}>
              {log.timestamp}
            </div>
          </div>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close forensic drawer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="results-top-summary">
            <div className="verdict-meta">
              <span className="verdict-eyebrow">Recorded Verdict</span>
              <span className={`verdict-pill ${tone}`}>
                <VerdictIcon size={14} />
                <span>{label}</span>
              </span>
              <p className="verdict-headline">{headline}</p>
            </div>
            <ThreatGauge score={log.threat_score} verdict={log.verdict} />
          </div>

          <div className="drawer-meta-grid">
            <div className="meta-tile">
              <div className="meta-tile-label">Vector Type</div>
              <div className="meta-tile-value">
                <span className={`vector-badge ${vector.key}`}>{vector.label}</span>
              </div>
            </div>
            <div className="meta-tile">
              <div className="meta-tile-label">Target Signature</div>
              <div className="meta-tile-value font-mono">{log.target}</div>
            </div>
          </div>

          <div className="forensic-block">
            <div className="forensic-block-title">
              <span>Intelligence Flags</span>
              <span className="forensic-count">{details.length}</span>
            </div>
            {details.length > 0 ? (
              <ul className="flags-list">
                {details.map((detail, idx) => (
                  <li key={idx} className="flag-item">
                    <CheckCircle2 size={15} className="flag-item-icon" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                No intelligence flags recorded for this scan.
              </p>
            )}
          </div>

          {networkMap.length > 0 && (
            <div className="forensic-block">
              <div className="forensic-block-title">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Network size={14} />
                  Contacted Network Hosts
                </span>
                <span className="forensic-count">{networkMap.length}</span>
              </div>
              <div className="network-scroll">
                {networkMap.map((domain, idx) => (
                  <span key={idx} className="network-pill">
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
