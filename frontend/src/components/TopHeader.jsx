import { Menu, Plus, RefreshCw } from 'lucide-react';

const TAB_LABELS = {
  home: 'Security Operations Center',
  mail: 'Mail & Text Scanner',
  qr: 'Vision Engine (OCR / QR)',
  url: 'Active URL Sandbox',
  history: 'Threat Audit Logs',
  about: 'System Architecture',
  awareness: 'Public Security Awareness',
};

export function TopHeader({
  activeTab,
  apiStatus,
  onOpenSidebar,
  onQuickScan,
  onRefreshStatus,
  refreshing,
}) {
  const title = TAB_LABELS[activeTab] || 'Workspace';

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          type="button"
          className="mobile-menu-btn"
          onClick={onOpenSidebar}
          aria-label="Open navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="breadcrumb-trail">
          <span className="breadcrumb-root">PhishShield</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current">{title}</span>
        </div>
      </div>

      <div className="header-actions">
        <div
          className={`status-pill ${apiStatus}`}
          title={
            apiStatus === 'online'
              ? 'FastAPI Threat Engine reachable'
              : apiStatus === 'offline'
                ? 'Could not reach FastAPI Threat Engine at 127.0.0.1:8000'
                : 'Checking FastAPI Threat Engine...'
          }
        >
          <span className="status-dot" />
          <span>
            {apiStatus === 'online'
              ? 'Engine Online'
              : apiStatus === 'offline'
                ? 'Engine Offline'
                : 'Checking...'}
          </span>
        </div>

        <button
          type="button"
          className="icon-btn"
          onClick={onRefreshStatus}
          title="Refresh telemetry & engine status"
          aria-label="Refresh telemetry"
        >
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
        </button>

        {activeTab !== 'url' && (
          <button
            type="button"
            className="header-cta-btn"
            onClick={onQuickScan}
          >
            <Plus size={14} />
            <span>Sandbox URL</span>
          </button>
        )}
      </div>
    </header>
  );
}
