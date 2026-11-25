import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { DashboardView } from './components/DashboardView';
import {
  MailScannerView,
  UrlSandboxView,
  VisionScannerView,
} from './components/ScannerViews';
import { ThreatLogsView } from './components/ThreatLogsView';
import { AboutSystemView, AwarenessView } from './components/InfoViews';
import { LogDetailDrawer } from './components/LogDetailDrawer';
import { ScreenshotModal } from './components/ScreenshotModal';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scanner inputs
  const [sender, setSender] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [targetUrl, setTargetUrl] = useState('');

  // Telemetry & Execution State
  const [scanHistory, setScanHistory] = useState([]);
  const [apiStatus, setApiStatus] = useState('checking');
  const [refreshingHistory, setRefreshingHistory] = useState(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals / Drawers
  const [selectedLog, setSelectedLog] = useState(null);
  const [zoomedScreenshot, setZoomedScreenshot] = useState(null);

  const loadHistory = useCallback(async () => {
    setRefreshingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/history`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setScanHistory(Array.isArray(data) ? data : []);
      setApiStatus('online');
    } catch (err) {
      console.error('Failed to retrieve SOC audit logs:', err);
      setApiStatus('offline');
    } finally {
      setRefreshingHistory(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'home' && activeTab !== 'history') return undefined;
    let cancelled = false;

    const syncHistory = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/history`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setScanHistory(Array.isArray(data) ? data : []);
          setApiStatus('online');
        }
      } catch (err) {
        console.error('Failed to retrieve SOC audit logs:', err);
        if (!cancelled) {
          setApiStatus('offline');
        }
      }
    };

    syncHistory();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setLoading(false);
    setErrorMsg('');
  };

  const submitAnalysis = async (endpoint, options) => {
    setLoading(true);
    setResult(null);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error('Backend Error Details:', errData);
        setErrorMsg(
          errData?.detail
            ? `Backend Error (${response.status}): ${errData.detail}`
            : `Backend Error: Server returned HTTP ${response.status}. Check backend logs.`
        );
        return;
      }

      const data = await response.json();
      setResult(data);
      setApiStatus('online');
      loadHistory();
    } catch (error) {
      console.error('Network Error:', error);
      setApiStatus('offline');
      setErrorMsg(
        'Could not connect to the FastAPI server at http://127.0.0.1:8000. Ensure the backend is running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalyze = (e) => {
    e.preventDefault();
    if (!emailContent.trim()) {
      setErrorMsg('Please enter email or SMS text to scan.');
      return;
    }

    submitAnalysis('analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: emailContent, sender: sender.trim() }),
    });
  };

  const handleImageAnalyze = (e) => {
    e.preventDefault();
    if (!imageFile) {
      setErrorMsg('Please select or drop an image file first.');
      return;
    }

    const formData = new FormData();
    formData.append('sender', sender.trim());
    formData.append('file', imageFile);

    submitAnalysis('scan-image', {
      method: 'POST',
      body: formData,
    });
  };

  const handleUrlAnalyze = (e) => {
    e.preventDefault();
    if (!targetUrl.trim()) {
      setErrorMsg('Please enter a URL to sandbox.');
      return;
    }

    submitAnalysis('scan-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl.trim() }),
    });
  };

  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        totalScans={scanHistory.length}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-shell">
        <TopHeader
          activeTab={activeTab}
          apiStatus={apiStatus}
          onOpenSidebar={() => setSidebarOpen(true)}
          onQuickScan={() => handleTabChange('url')}
          onRefreshStatus={loadHistory}
          refreshing={refreshingHistory}
        />

        <main className="workspace-content">
          {activeTab === 'home' && (
            <DashboardView
              scanHistory={scanHistory}
              onNavigate={handleTabChange}
              onSelectLog={setSelectedLog}
            />
          )}

          {activeTab === 'mail' && (
            <MailScannerView
              sender={sender}
              setSender={setSender}
              emailContent={emailContent}
              setEmailContent={setEmailContent}
              onAnalyze={handleTextAnalyze}
              loading={loading}
              error={errorMsg}
              onClearError={() => setErrorMsg('')}
              result={result}
              onReset={() => {
                setResult(null);
                setErrorMsg('');
              }}
            />
          )}

          {activeTab === 'qr' && (
            <VisionScannerView
              sender={sender}
              setSender={setSender}
              imageFile={imageFile}
              setImageFile={setImageFile}
              onAnalyze={handleImageAnalyze}
              loading={loading}
              error={errorMsg}
              onClearError={() => setErrorMsg('')}
              result={result}
              onReset={() => {
                setResult(null);
                setErrorMsg('');
              }}
            />
          )}

          {activeTab === 'url' && (
            <UrlSandboxView
              targetUrl={targetUrl}
              setTargetUrl={setTargetUrl}
              onAnalyze={handleUrlAnalyze}
              loading={loading}
              error={errorMsg}
              onClearError={() => setErrorMsg('')}
              result={result}
              onReset={() => {
                setResult(null);
                setErrorMsg('');
              }}
              onZoomScreenshot={setZoomedScreenshot}
            />
          )}

          {activeTab === 'history' && (
            <ThreatLogsView
              scanHistory={scanHistory}
              onSelectLog={setSelectedLog}
              onRefresh={loadHistory}
              refreshing={refreshingHistory}
            />
          )}

          {activeTab === 'about' && <AboutSystemView />}
          {activeTab === 'awareness' && <AwarenessView />}
        </main>
      </div>

      <LogDetailDrawer log={selectedLog} onClose={() => setSelectedLog(null)} />
      <ScreenshotModal
        screenshotBase64={zoomedScreenshot}
        onClose={() => setZoomedScreenshot(null)}
      />
    </div>
  );
}

export default App;
