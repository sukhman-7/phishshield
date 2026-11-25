import {
  Shield,
  LayoutDashboard,
  MailCheck,
  ScanEye,
  GlobeLock,
  ScrollText,
  Cpu,
  BookOpenCheck,
  X,
} from 'lucide-react';

const PRIMARY_ITEMS = [
  { id: 'home', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'mail', label: 'Mail Scanner', Icon: MailCheck },
  { id: 'qr', label: 'Vision Engine', Icon: ScanEye },
  { id: 'url', label: 'Active Sandbox', Icon: GlobeLock },
  { id: 'history', label: 'Threat Logs', Icon: ScrollText },
];

const RESOURCE_ITEMS = [
  { id: 'about', label: 'System Architecture', Icon: Cpu },
  { id: 'awareness', label: 'Security Awareness', Icon: BookOpenCheck },
];

export function Sidebar({ activeTab, onSelectTab, totalScans, isOpen, onClose }) {
  const renderNavItem = ({ id, label, Icon }) => {
    const isActive = activeTab === id;
    return (
      <button
        key={id}
        type="button"
        className={`nav-item ${isActive ? 'active' : ''}`}
        onClick={() => {
          onSelectTab(id);
          onClose();
        }}
      >
        <span className="nav-item-left">
          <Icon size={17} strokeWidth={1.9} />
          <span>{label}</span>
        </span>
        {id === 'history' && totalScans > 0 && (
          <span className="nav-badge">{totalScans}</span>
        )}
      </button>
    );
  };

  return (
    <>
      <div
        className={`sidebar-backdrop ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <button
            type="button"
            className="brand-trigger"
            onClick={() => {
              onSelectTab('home');
              onClose();
            }}
          >
            <div className="brand-mark">
              <Shield size={18} strokeWidth={2.2} />
            </div>
            <div className="brand-text">
              <span className="brand-name">PhishShield</span>
              <span className="brand-tag">SOC Defense Node</span>
            </div>
          </button>

          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X size={16} />
          </button>
        </div>

        <div className="sidebar-section-label">Operations</div>
        <nav className="sidebar-nav" aria-label="Primary navigation">
          {PRIMARY_ITEMS.map(renderNavItem)}
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-footer">
          <div className="sidebar-section-label">Resources</div>
          <nav className="sidebar-nav" aria-label="System documentation">
            {RESOURCE_ITEMS.map(renderNavItem)}
          </nav>
        </div>
      </aside>
    </>
  );
}
