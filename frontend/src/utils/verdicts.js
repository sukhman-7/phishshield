import { ShieldCheck, ShieldAlert, AlertTriangle, Mail, Eye, Globe } from 'lucide-react';

/**
 * Normalizes a backend verdict string into a UI tone and metadata.
 * @param {string} verdict
 * @returns {{ tone: 'safe' | 'suspicious' | 'warning', color: string, label: string, Icon: React.ComponentType }}
 */
export function getVerdictMeta(verdict = '') {
  const normalized = verdict.toUpperCase();
  if (normalized === 'SAFE') {
    return {
      tone: 'safe',
      color: 'var(--accent-green)',
      label: 'SAFE',
      headline: 'No malicious indicators or phishing intent detected.',
      Icon: ShieldCheck,
    };
  }
  if (normalized === 'SUSPICIOUS') {
    return {
      tone: 'suspicious',
      color: 'var(--accent-red)',
      label: 'SUSPICIOUS',
      headline: 'High-risk threat signals intercepted in payload.',
      Icon: ShieldAlert,
    };
  }
  return {
    tone: 'warning',
    color: 'var(--accent-amber)',
    label: normalized || 'WARNING',
    headline: 'Analysis halted or target returned a diagnostic exception.',
    Icon: AlertTriangle,
  };
}

/**
 * Returns icon and label metadata for a scan vector type.
 * @param {string} scanType
 */
export function getVectorMeta(scanType = '') {
  const normalized = scanType.toLowerCase();
  if (normalized === 'email') {
    return { key: 'email', label: 'Email / Text', short: 'MAIL', Icon: Mail };
  }
  if (normalized === 'image') {
    return { key: 'image', label: 'Vision / OCR', short: 'VISION', Icon: Eye };
  }
  return { key: 'url', label: 'URL Sandbox', short: 'URL', Icon: Globe };
}

/**
 * Formats file bytes into a readable string.
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
