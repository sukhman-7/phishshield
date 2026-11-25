import { useEffect } from 'react';
import { X } from 'lucide-react';

export function ScreenshotModal({ screenshotBase64, onClose }) {
  useEffect(() => {
    if (!screenshotBase64) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [screenshotBase64, onClose]);

  if (!screenshotBase64) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="drawer-title">Headless Sandbox Snapshot (1920 × 1080)</span>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close screenshot preview"
          >
            <X size={16} />
          </button>
        </div>
        <div className="modal-image-wrap">
          <img
            src={`data:image/png;base64,${screenshotBase64}`}
            alt="Full resolution sandbox screenshot"
          />
        </div>
      </div>
    </div>
  );
}
