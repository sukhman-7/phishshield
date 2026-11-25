import {
  Activity,
  CheckCircle2,
  FileText,
  Maximize2,
  Network,
  Shield,
} from 'lucide-react';
import { ThreatGauge } from './ThreatGauge';
import { getVerdictMeta } from '../utils/verdicts';

export function ResultsPanel({
  result,
  loading,
  loadingLabel = 'Running threat analysis...',
  emptyTitle = 'Awaiting Payload',
  emptyDescription = 'Submit an email, image, or URL on the left to inspect cognitive flags, hidden redirects, and sandbox telemetry.',
  onZoomScreenshot,
}) {
  if (loading) {
    return (
      <div className="results-card">
        <div className="scanning-state">
          <div className="pulse-ring">
            <Activity size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-main)', marginBottom: '0.25rem' }}>
              {loadingLabel}
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Evaluating semantic intent, heuristic signals, and network telemetry...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-card">
        <div className="results-empty">
          <div className="empty-icon-ring">
            <Shield size={24} />
          </div>
          <h4>{emptyTitle}</h4>
          <p>{emptyDescription}</p>
        </div>
      </div>
    );
  }

  const { tone, label, headline, Icon } = getVerdictMeta(result.verdict);
  const details = Array.isArray(result.analysis_details) ? result.analysis_details : [];
  const networkMap = Array.isArray(result.network_map) ? result.network_map : [];

  return (
    <div className="results-card">
      <div className="results-top-summary">
        <div className="verdict-meta">
          <span className="verdict-eyebrow">Forensic Verdict</span>
          <span className={`verdict-pill ${tone}`}>
            <Icon size={14} />
            <span>{label}</span>
          </span>
          <p className="verdict-headline">{headline}</p>
        </div>
        <ThreatGauge score={result.threat_score} verdict={result.verdict} />
      </div>

      {result.extracted_payload && (
        <div className="forensic-block">
          <div className="forensic-block-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} />
              Extracted Visual Payload
            </span>
          </div>
          <div className="extracted-box">{result.extracted_payload}</div>
        </div>
      )}

      <div className="forensic-block">
        <div className="forensic-block-title">
          <span>Triggered Intelligence Flags</span>
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
            No specific diagnostic flags were returned.
          </p>
        )}
      </div>

      {networkMap.length > 0 && (
        <div className="forensic-block">
          <div className="forensic-block-title">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              <Network size={14} />
              Network Forensics
            </span>
            <span className="forensic-count">{networkMap.length} hosts</span>
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

      {result.screenshot && (
        <div className="forensic-block">
          <div className="forensic-block-title">
            <span>Sandbox Visual Intel</span>
          </div>
          <button
            type="button"
            className="screenshot-thumb-btn"
            onClick={() => onZoomScreenshot && onZoomScreenshot(result.screenshot)}
            title="Click to inspect full-resolution screenshot"
          >
            <img
              src={`data:image/png;base64,${result.screenshot}`}
              alt="Sandbox Snapshot"
            />
            <span className="screenshot-zoom-hint">
              <Maximize2 size={12} />
              Inspect Full Size
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
