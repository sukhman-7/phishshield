import { useMemo, useState } from 'react';
import { ChevronRight, RefreshCw, Search } from 'lucide-react';
import { getVectorMeta, getVerdictMeta } from '../utils/verdicts';

const VECTOR_FILTERS = [
  { id: 'all', label: 'All Vectors' },
  { id: 'email', label: 'Email' },
  { id: 'image', label: 'Vision' },
  { id: 'url', label: 'URL' },
];

const VERDICT_FILTERS = [
  { id: 'all', label: 'All Verdicts' },
  { id: 'SAFE', label: 'Safe' },
  { id: 'SUSPICIOUS', label: 'Suspicious' },
];

export function ThreatLogsView({ scanHistory, onSelectLog, onRefresh, refreshing }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [vectorFilter, setVectorFilter] = useState('all');
  const [verdictFilter, setVerdictFilter] = useState('all');

  const filteredLogs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return scanHistory.filter((log) => {
      if (vectorFilter !== 'all' && log.scan_type?.toLowerCase() !== vectorFilter) {
        return false;
      }
      if (verdictFilter !== 'all' && log.verdict?.toUpperCase() !== verdictFilter) {
        return false;
      }
      if (!q) return true;
      const inTarget = (log.target || '').toLowerCase().includes(q);
      const inDetails = Array.isArray(log.analysis_details)
        ? log.analysis_details.some((d) => String(d).toLowerCase().includes(q))
        : false;
      return inTarget || inDetails;
    });
  }, [scanHistory, searchQuery, vectorFilter, verdictFilter]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Enterprise Security Audit Log</h1>
          <p className="page-subtitle">
            Click any scan record to inspect triggered intelligence flags and network telemetry.
          </p>
        </div>
        <button
          type="button"
          className="secondary-btn"
          onClick={onRefresh}
          disabled={refreshing}
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="toolbar-row">
        <div className="search-box">
          <div className="input-with-icon">
            <Search size={15} className="input-leading-icon" />
            <input
              type="text"
              className="text-input"
              placeholder="Search target, sender, domain, or flag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-groups">
          <div className="filter-pill-group" role="group" aria-label="Filter by vector">
            {VECTOR_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-pill ${vectorFilter === f.id ? 'active' : ''}`}
                onClick={() => setVectorFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="filter-pill-group" role="group" aria-label="Filter by verdict">
            {VERDICT_FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`filter-pill ${verdictFilter === f.id ? 'active' : ''}`}
                onClick={() => setVerdictFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Vector</th>
                <th>Target Signature</th>
                <th>Threat Index</th>
                <th>Verdict</th>
                <th aria-label="Inspect" />
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="table-empty-cell">
                    {scanHistory.length === 0
                      ? 'No security records found inside SQLite audit storage.'
                      : 'No logs match the current search or filter criteria.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
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
