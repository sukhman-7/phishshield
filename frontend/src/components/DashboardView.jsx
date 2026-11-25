import {
  Activity,
  ArrowRight,
  ChevronRight,
  Gauge,
  GlobeLock,
  MailCheck,
  ScanEye,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { getVectorMeta, getVerdictMeta } from '../utils/verdicts';

const DEFENSE_MODULES = [
  {
    id: 'mail',
    title: 'Zero-Shot NLP Mail Scanner',
    description:
      'Analyzes email & SMS intent, social urgency, and sender anomalies contextually to catch zero-day phishing.',
    tone: 'blue',
    Icon: MailCheck,
  },
  {
    id: 'qr',
    title: 'Vision AI (OCR & QR)',
    description:
      'Extracts embedded text via Tesseract OCR and decodes ZBar QR payloads hidden inside suspicious graphics.',
    tone: 'purple',
    Icon: ScanEye,
  },
  {
    id: 'url',
    title: 'Active Playwright Sandbox',
    description:
      'Detonates suspicious URLs in a headless Chromium environment, capturing screenshots and background hosts.',
    tone: 'cyan',
    Icon: GlobeLock,
  },
];

export function DashboardView({ scanHistory, onNavigate, onSelectLog }) {
  const totalScans = scanHistory.length;
  const suspiciousCount = scanHistory.filter((l) => l.verdict === 'SUSPICIOUS').length;
  const safeCount = scanHistory.filter((l) => l.verdict === 'SAFE').length;
  const otherCount = Math.max(0, totalScans - suspiciousCount - safeCount);
  const avgThreatScore =
    totalScans > 0
      ? Math.round(
          scanHistory.reduce((acc, curr) => acc + (Number(curr.threat_score) || 0), 0) /
            totalScans
        )
      : 0;

  const emailCount = scanHistory.filter((l) => l.scan_type === 'email').length;
  const imageCount = scanHistory.filter((l) => l.scan_type === 'image').length;
  const urlCount = scanHistory.filter((l) => l.scan_type === 'url').length;

  const safePct = totalScans > 0 ? (safeCount / totalScans) * 100 : 0;
  const suspPct = totalScans > 0 ? (suspiciousCount / totalScans) * 100 : 0;
  const otherPct = totalScans > 0 ? (otherCount / totalScans) * 100 : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Security Operations Center</h1>
          <p className="page-subtitle">
            Real-time multi-layered phishing telemetry across NLP, Vision, and Sandbox nodes.
          </p>
        </div>
        <button
          type="button"
          className="secondary-btn"
          onClick={() => onNavigate('history')}
        >
          <span>View All Logs</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Total Scans</span>
            <span className="kpi-icon-badge blue">
              <Activity size={16} />
            </span>
          </div>
          <div className="kpi-value">{totalScans}</div>
          <div className="kpi-meta">Persisted in audit store</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Threats Blocked</span>
            <span className="kpi-icon-badge red">
              <ShieldAlert size={16} />
            </span>
          </div>
          <div className="kpi-value">{suspiciousCount}</div>
          <div className="kpi-meta">
            {totalScans > 0
              ? `${Math.round((suspiciousCount / totalScans) * 100)}% detection rate`
              : 'No interceptions yet'}
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Safe Clearance</span>
            <span className="kpi-icon-badge green">
              <ShieldCheck size={16} />
            </span>
          </div>
          <div className="kpi-value">{safeCount}</div>
          <div className="kpi-meta">Verified benign payloads</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <span className="kpi-label">Avg Threat Index</span>
            <span className="kpi-icon-badge amber">
              <Gauge size={16} />
            </span>
          </div>
          <div className="kpi-value">{avgThreatScore}%</div>
          <div className="kpi-meta">Mean risk score (0–100)</div>
        </div>
      </div>

      <div className="telemetry-card">
        <div>
          <div className="breakdown-header">
            <span className="breakdown-title">Verdict Distribution</span>
            <span className="breakdown-caption">
              {totalScans} total {totalScans === 1 ? 'record' : 'records'}
            </span>
          </div>
          <div className="segmented-bar" role="img" aria-label="Verdict distribution bar">
            {totalScans > 0 ? (
              <>
                {safePct > 0 && <div className="seg-safe" style={{ width: `${safePct}%` }} />}
                {suspPct > 0 && (
                  <div className="seg-suspicious" style={{ width: `${suspPct}%` }} />
                )}
                {otherPct > 0 && <div className="seg-other" style={{ width: `${otherPct}%` }} />}
              </>
            ) : null}
          </div>
          <div className="breakdown-legend">
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--accent-green)' }} />
              Safe ({safeCount})
            </span>
            <span className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: 'var(--accent-red)' }} />
              Suspicious ({suspiciousCount})
            </span>
            {otherCount > 0 && (
              <span className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: 'var(--accent-amber)' }} />
                Exceptions ({otherCount})
              </span>
            )}
          </div>
        </div>

        <div className="vector-mix-pills">
          <div className="vector-stat-box">
            <span className="vector-stat-label">Mail / NLP</span>
            <span className="vector-stat-count">{emailCount}</span>
          </div>
          <div className="vector-stat-box">
            <span className="vector-stat-label">Vision / QR</span>
            <span className="vector-stat-count">{imageCount}</span>
          </div>
          <div className="vector-stat-box">
            <span className="vector-stat-label">URL Sandbox</span>
            <span className="vector-stat-count">{urlCount}</span>
          </div>
        </div>
      </div>

      <h2 className="section-heading">Active Defense Modules</h2>
      <div className="module-grid">
        {DEFENSE_MODULES.map(({ id, title, description, tone, Icon }) => (
          <button
            key={id}
            type="button"
            className="module-card"
            onClick={() => onNavigate(id)}
          >
            <div className="module-card-header">
              <span className={`module-icon ${tone}`}>
                <Icon size={20} />
              </span>
              <ArrowRight size={16} className="module-arrow" />
            </div>
            <div className="module-title">{title}</div>
            <p className="module-desc">{description}</p>
          </button>
        ))}
      </div>

      <h2 className="section-heading">Recent Interceptions</h2>
      <div className="table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Vector</th>
                <th>Target Signature</th>
                <th>Score</th>
                <th>Verdict</th>
                <th aria-label="Inspect" />
              </tr>
            </thead>
            <tbody>
              {scanHistory.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    No scan history yet. Launch a Mail, Vision, or URL Sandbox scan to populate telemetry.
                  </td>
                </tr>
              ) : (
                scanHistory.slice(0, 5).map((log) => {
                  const vector = getVectorMeta(log.scan_type);
                  const verdict = getVerdictMeta(log.verdict);
                  return (
                    <tr
                      key={log.id}
                      className="clickable-row"
                      onClick={() => onSelectLog(log)}
                    >
                      <td className="cell-timestamp">{log.timestamp}</td>
                      <td>
                        <span className={`vector-badge ${vector.key}`}>{vector.short}</span>
                      </td>
                      <td className="cell-target" title={log.target}>
                        {log.target}
                      </td>
                      <td>
                        <div className="score-bar-cell">
                          <div className="mini-bar-track">
                            <div
                              className="mini-bar-fill"
                              style={{
                                width: `${Math.min(100, Math.max(0, log.threat_score))}%`,
                                backgroundColor: verdict.color,
                              }}
                            />
                          </div>
                          <span>{log.threat_score}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`verdict-pill ${verdict.tone}`}>{verdict.label}</span>
                      </td>
                      <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                        <ChevronRight size={15} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
