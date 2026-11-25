import {
  AlertTriangle,
  BrainCircuit,
  Eye,
  GlobeLock,
  Link2,
  QrCode,
  ShieldAlert,
} from 'lucide-react';

export function AboutSystemView() {
  return (
    <div className="info-stack">
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">About PhishShield AI Architecture</h1>
          <p className="page-subtitle">
            Operational matrix and multi-layered reasoning pipeline across text, vision, and headless web sandboxing.
          </p>
        </div>
      </div>

      <div className="pillar-grid">
        <div className="pillar-card">
          <span className="kpi-icon-badge blue">
            <BrainCircuit size={18} />
          </span>
          <h3>Cognitive Semantic Analysis</h3>
          <p>
            Uses Gemini contextual reasoning to analyze payload intent, psychological urgency, and sender spoofing rather than brittle static keyword blacklists.
          </p>
        </div>

        <div className="pillar-card">
          <span className="kpi-icon-badge" style={{ backgroundColor: 'var(--purple-tint)', color: 'var(--accent-purple)' }}>
            <Eye size={18} />
          </span>
          <h3>Computer Vision Inspection</h3>
          <p>
            Combines Tesseract OCR extraction with ZBar QR spatial decoding to uncover phishing lures and malicious links concealed inside images.
          </p>
        </div>

        <div className="pillar-card">
          <span className="kpi-icon-badge" style={{ backgroundColor: 'var(--cyan-tint)', color: 'var(--accent-cyan)' }}>
            <GlobeLock size={18} />
          </span>
          <h3>Dynamic Sandbox Forensics</h3>
          <p>
            Spins up an isolated asynchronous Playwright Chromium context, capturing rendered DOM text, full-page screenshots, and background network hosts.
          </p>
        </div>
      </div>

      <div className="surface-card">
        <h2 className="section-heading">Structural Matrix: PhishShield vs. VirusTotal</h2>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Capability Vector</th>
                <th>VirusTotal Aggregator</th>
                <th>PhishShield AI Engine</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>Analysis Paradigm</td>
                <td>
                  Reputational matching using global vendor file hash (<code>MD5</code> /{' '}
                  <code>SHA-256</code>) indices and known domain blocklists.
                </td>
                <td>
                  Contextual cognitive reasoning utilizing LLM semantic evaluation over incoming payloads, augmented by VirusTotal v3 lookup.
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>Zero-Day Tracking</td>
                <td>
                  Limited until a signature or URL report is observed by a commercial security engine and pushed to the repository.
                </td>
                <td>
                  Immediate. Evaluates textual logic, urgency triggers, intent anomalies, and lookalike domain structures on first sight.
                </td>
              </tr>
              <tr>
                <td style={{ color: 'var(--text-main)', fontWeight: 600 }}>Sandbox Scope</td>
                <td>
                  Executes heavy file detonation inside rigid virtual networks, returning static vendor consensus summaries.
                </td>
                <td>
                  Performs lightweight containerized web rendering with real-time network host wiretapping and visual screenshot capture.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AwarenessView() {
  return (
    <div className="info-stack">
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Public Safety &amp; Operational Awareness</h1>
          <p className="page-subtitle">
            Social engineering exploits human cognitive load. Enforce these defensive protocols when evaluating unfamiliar links and messages.
          </p>
        </div>
      </div>

      <div className="awareness-grid">
        <div className="awareness-card">
          <span className="kpi-icon-badge red" style={{ flexShrink: 0 }}>
            <Link2 size={18} />
          </span>
          <div>
            <h4>1. Isolate Absolute Domain Roots</h4>
            <p>
              Attackers chain trusted brand names into subdomains like{' '}
              <code>login.microsoft.com.attacker-node.xyz</code>. Always read the registrable domain directly to the left of the first single slash.
            </p>
          </div>
        </div>

        <div className="awareness-card">
          <span className="kpi-icon-badge blue" style={{ flexShrink: 0 }}>
            <AlertTriangle size={18} />
          </span>
          <div>
            <h4>2. Audit Cognitive Urgency Triggers</h4>
            <p>
              Phrases like &ldquo;Immediate Verification Required&rdquo; or &ldquo;Account Suspended in 24 Hours&rdquo; are engineered to induce panic and bypass deliberate verification.
            </p>
          </div>
        </div>

        <div className="awareness-card">
          <span className="kpi-icon-badge amber" style={{ flexShrink: 0 }}>
            <QrCode size={18} />
          </span>
          <div>
            <h4>3. Verify Visual Asset Traps</h4>
            <p>
              Evasive actors embed phishing text inside PNG graphics or wrap credential-harvesting URLs inside QR codes (quishing) to evade standard email text filters.
            </p>
          </div>
        </div>

        <div className="awareness-card">
          <span className="kpi-icon-badge green" style={{ flexShrink: 0 }}>
            <ShieldAlert size={18} />
          </span>
          <div>
            <h4>4. Inspect Dynamic Call Pathways</h4>
            <p>
              Before entering credentials on an unfamiliar link, run it through the Active Sandbox to inspect hidden third-party hosts and multi-hop redirects safely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
