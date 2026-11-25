import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  AtSign,
  Globe,
  ImagePlus,
  Loader2,
  MailCheck,
  RotateCcw,
  ScanEye,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { ResultsPanel } from './ResultsPanel';
import { formatBytes } from '../utils/verdicts';

const MAIL_PRESETS = [
  {
    label: 'Urgent Account Suspension',
    sender: 'security-alert@micros0ft-verify.xyz',
    content:
      'URGENT: Unusual sign-in detected on your corporate mailbox. Your account will be permanently suspended within 2 hours unless you verify your credentials at https://login.microsoft.com.verify-node.xyz/auth immediately.',
  },
  {
    label: 'Benign Billing Notice',
    sender: 'billing@github.com',
    content:
      'Hello, your monthly GitHub Team invoice (#GH-49201) for $12.00 has been processed. You can view your receipt in your organization billing settings.',
  },
];

const URL_PRESETS = [
  {
    label: 'Whitelisted Domain',
    url: 'https://github.com',
  },
  {
    label: 'Suspicious Lookalike URL',
    url: 'https://login.microsoft.com.verify-security-portal.xyz',
  },
];

function InlineError({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div className="inline-alert" role="alert">
      <div className="inline-alert-left">
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>{message}</span>
      </div>
      <button
        type="button"
        className="alert-dismiss-btn"
        onClick={onDismiss}
        aria-label="Dismiss error"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function MailScannerView({
  sender,
  setSender,
  emailContent,
  setEmailContent,
  onAnalyze,
  loading,
  error,
  onClearError,
  result,
  onReset,
}) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Mail &amp; Text Payload Scanner</h1>
          <p className="page-subtitle">
            Cognitive semantic inspection for email bodies, SMS lures, and social-engineering copy.
          </p>
        </div>
      </div>

      <div className="scanner-split">
        <form className="scanner-form-card" onSubmit={onAnalyze}>
          <div className="form-header">
            <div>
              <div className="form-title-row">
                <MailCheck size={18} style={{ color: 'var(--accent-blue)' }} />
                <h2 className="form-title">Payload Input</h2>
              </div>
              <p className="form-subtitle">
                Provide sender metadata and message content for zero-shot NLP evaluation.
              </p>
            </div>
          </div>

          <InlineError message={error} onDismiss={onClearError} />

          <div className="presets-row">
            <span className="presets-label">
              <Sparkles size={12} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
              Samples:
            </span>
            {MAIL_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="preset-chip"
                onClick={() => {
                  onClearError();
                  setSender(preset.sender);
                  setEmailContent(preset.content);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label className="field-label" htmlFor="mail-sender">
                Target Sender Address
              </label>
              <span className="field-hint">Optional</span>
            </div>
            <div className="input-with-icon">
              <AtSign size={15} className="input-leading-icon" />
              <input
                id="mail-sender"
                type="text"
                className="text-input"
                placeholder="e.g., support@paypal.com"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label className="field-label" htmlFor="mail-body">
                Message Body / SMS Payload
              </label>
              <span className="field-hint font-mono">{emailContent.length} chars</span>
            </div>
            <textarea
              id="mail-body"
              className="text-area"
              placeholder="Paste raw email body, headers, or suspicious SMS text..."
              value={emailContent}
              onChange={(e) => {
                if (error) onClearError();
                setEmailContent(e.target.value);
              }}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Analyzing Semantic Threat...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Scan Payload</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="secondary-btn"
              disabled={loading}
              onClick={() => {
                setSender('');
                setEmailContent('');
                onReset();
              }}
              title="Clear inputs and results"
            >
              <RotateCcw size={15} />
              <span>Clear</span>
            </button>
          </div>
        </form>

        <ResultsPanel
          result={result}
          loading={loading}
          loadingLabel="Running Cognitive NLP Analysis..."
          emptyTitle="Ready for Semantic Inspection"
          emptyDescription="Paste an email or pick a sample preset on the left to evaluate phishing intent and sender spoofing."
        />
      </div>
    </div>
  );
}

export function VisionScannerView({
  sender,
  setSender,
  imageFile,
  setImageFile,
  onAnalyze,
  loading,
  error,
  onClearError,
  result,
  onReset,
}) {
  const [dragging, setDragging] = useState(false);
  const [fileError, setFileError] = useState('');

  const previewUrl = useMemo(() => {
    if (!imageFile) return null;
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setFileError('Unsupported file type. Please choose a PNG, JPG, or WEBP image.');
      return;
    }
    setFileError('');
    onClearError();
    setImageFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFileSelect(dropped);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vision Engine (OCR &amp; QR)</h1>
          <p className="page-subtitle">
            Extracts hidden text and decodes embedded QR matrices from suspicious screenshots or flyers.
          </p>
        </div>
      </div>

      <div className="scanner-split">
        <form className="scanner-form-card" onSubmit={onAnalyze}>
          <div className="form-header">
            <div>
              <div className="form-title-row">
                <ScanEye size={18} style={{ color: 'var(--accent-purple)' }} />
                <h2 className="form-title">Visual Asset Upload</h2>
              </div>
              <p className="form-subtitle">
                Drop a PNG, JPG, or screenshot containing text or QR codes.
              </p>
            </div>
          </div>

          <InlineError
            message={fileError || error}
            onDismiss={() => {
              setFileError('');
              onClearError();
            }}
          />

          <div className="field-group">
            <div className="field-label-row">
              <label className="field-label" htmlFor="vision-sender">
                Target Sender Address
              </label>
              <span className="field-hint">Optional</span>
            </div>
            <div className="input-with-icon">
              <AtSign size={15} className="input-leading-icon" />
              <input
                id="vision-sender"
                type="text"
                className="text-input"
                placeholder="e.g., billing@vendor-portal.com"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>
          </div>

          {!imageFile ? (
            <div
              className={`dropzone ${dragging ? 'dragging' : ''}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                className="dropzone-input"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                aria-label="Upload image for OCR and QR scanning"
              />
              <div className="dropzone-icon-wrap">
                <ImagePlus size={22} />
              </div>
              <div className="dropzone-title">
                Drop image here or click to browse
              </div>
              <p className="dropzone-hint">
                Supports PNG, JPEG, WEBP screenshots and QR code graphics
              </p>
            </div>
          ) : (
            <div className="image-preview-card">
              {previewUrl && (
                <div className="image-preview-frame">
                  <img src={previewUrl} alt="Selected asset preview" />
                </div>
              )}
              <div className="image-preview-meta">
                <div className="image-file-info">
                  <div className="image-file-name">{imageFile.name}</div>
                  <div className="image-file-size">{formatBytes(imageFile.size)}</div>
                </div>
                <button
                  type="button"
                  className="secondary-btn"
                  style={{ padding: '0.4rem 0.7rem' }}
                  onClick={() => setImageFile(null)}
                  disabled={loading}
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Extracting Vision Metrics...</span>
                </>
              ) : (
                <>
                  <ScanEye size={16} />
                  <span>Scan Image</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="secondary-btn"
              disabled={loading}
              onClick={() => {
                setImageFile(null);
                onReset();
              }}
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          </div>
        </form>

        <ResultsPanel
          result={result}
          loading={loading}
          loadingLabel="Decoding QR Matrix & OCR Layer..."
          emptyTitle="Awaiting Visual Asset"
          emptyDescription="Upload an image on the left to inspect extracted OCR text, decoded QR links, and threat scoring."
        />
      </div>
    </div>
  );
}

export function UrlSandboxView({
  targetUrl,
  setTargetUrl,
  onAnalyze,
  loading,
  error,
  onClearError,
  result,
  onReset,
  onZoomScreenshot,
}) {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Active URL Sandbox</h1>
          <p className="page-subtitle">
            Detonates links in an isolated headless Chromium browser with VirusTotal lookup &amp; network wiretapping.
          </p>
        </div>
      </div>

      <div className="scanner-split">
        <form className="scanner-form-card" onSubmit={onAnalyze}>
          <div className="form-header">
            <div>
              <div className="form-title-row">
                <Globe size={18} style={{ color: 'var(--accent-cyan)' }} />
                <h2 className="form-title">Target Destination</h2>
              </div>
              <p className="form-subtitle">
                Enter a domain or full URL. The sandbox waits for page settlement and captures visual telemetry.
              </p>
            </div>
          </div>

          <InlineError message={error} onDismiss={onClearError} />

          <div className="presets-row">
            <span className="presets-label">
              <Sparkles size={12} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
              Samples:
            </span>
            {URL_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="preset-chip"
                onClick={() => {
                  onClearError();
                  setTargetUrl(preset.url);
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div className="field-group">
            <div className="field-label-row">
              <label className="field-label" htmlFor="sandbox-url">
                Target URL
              </label>
              <span className="field-hint">HTTP / HTTPS</span>
            </div>
            <div className="input-with-icon">
              <Globe size={15} className="input-leading-icon" />
              <input
                id="sandbox-url"
                type="text"
                className="text-input font-mono"
                placeholder="https://suspicious-link.com/login"
                value={targetUrl}
                onChange={(e) => {
                  if (error) onClearError();
                  setTargetUrl(e.target.value);
                }}
              />
            </div>
          </div>

          <div
            className="surface-card-compact"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              marginBottom: '1.25rem',
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: 'var(--text-main)' }}>Pipeline Stages:</strong> Domain whitelist check → VirusTotal v3 consensus → Headless Chromium rendering (up to 10s settle) → Network host capture → Gemini semantic evaluation.
          </div>

          <div className="form-actions">
            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="spin" />
                  <span>Sandboxing Environment...</span>
                </>
              ) : (
                <>
                  <Globe size={15} />
                  <span>Initiate Sandbox</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="secondary-btn"
              disabled={loading}
              onClick={() => {
                setTargetUrl('');
                onReset();
              }}
            >
              <RotateCcw size={15} />
              <span>Clear</span>
            </button>
          </div>
        </form>

        <ResultsPanel
          result={result}
          loading={loading}
          loadingLabel="Detonating URL in Headless Sandbox..."
          emptyTitle="Sandbox Idle"
          emptyDescription="Enter a suspicious URL on the left to inspect contacted hosts, DOM semantics, and a full-page visual capture."
          onZoomScreenshot={onZoomScreenshot}
        />
      </div>
    </div>
  );
}
