'use client';
import { useState, useEffect } from 'react';
import './settings.css';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    chapaStatus: 'INACTIVE',
    mode: 'SANDBOX',
    businessLicense: null,
    proofOfAddress: null,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Local state for selected files in UI
  const [licenseFile, setLicenseFile] = useState(null);
  const [addressFile, setAddressFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  // Poll status or transition from UNDER_REVIEW to ACTIVE if it is under review
  useEffect(() => {
    let timer;
    if (settings.chapaStatus === 'UNDER_REVIEW') {
      timer = setTimeout(async () => {
        try {
          const res = await fetch('/api/admin/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chapaStatus: 'ACTIVE' }),
          });
          if (res.ok) {
            const data = await res.json();
            setSettings(data);
            setSuccess('Compliance Approved! Your Chapa account is now ACTIVE and live payments are enabled.');
          }
        } catch (err) {
          console.error('Error auto-approving:', err);
        }
      }, 5000); // 5 seconds review simulation
    }
    return () => clearTimeout(timer);
  }, [settings.chapaStatus]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings');
      if (!res.ok) throw new Error('Failed to load settings.');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = async (e) => {
    const isChecked = e.target.checked;
    const newMode = isChecked ? 'LIVE' : 'SANDBOX';

    if (newMode === 'LIVE' && settings.chapaStatus !== 'ACTIVE') {
      setError('Cannot switch to Live Mode: Chapa Compliance status must be ACTIVE (Approved).');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: newMode }),
      });

      if (!res.ok) throw new Error('Failed to update integration mode.');
      const data = await res.json();
      setSettings(data);
      setSuccess(`Integration mode switched to ${newMode} successfully.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'license') {
      setLicenseFile(file);
    } else {
      setAddressFile(file);
    }
  };

  const handleRemoveFile = (type) => {
    if (type === 'license') {
      setLicenseFile(null);
    } else {
      setAddressFile(null);
    }
  };

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    if (!licenseFile || !addressFile) {
      setError('Please select both required compliance files.');
      return;
    }

    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate file upload metadata update
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapaStatus: 'UNDER_REVIEW',
          businessLicense: { name: licenseFile.name, size: licenseFile.size, uploadedAt: new Date().toISOString() },
          proofOfAddress: { name: addressFile.name, size: addressFile.size, uploadedAt: new Date().toISOString() },
        }),
      });

      if (!res.ok) throw new Error('Failed to submit compliance documents.');
      const data = await res.json();
      setSettings(data);
      setSuccess('Compliance documents submitted successfully. Status updated to: Under Review. Compliance team is checking your documents...');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page flex-center" style={{ justifyContent: 'center', height: '50vh' }}>
        <div className="spinner" style={{ width: '2rem', height: '2rem', borderLeftColor: 'var(--color-primary)' }}></div>
        <span>Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Payment & Integration Settings</h1>
        <p className="admin-page-subtitle">Configure merchant gateway connections and verify business compliance details.</p>
      </div>

      {error && (
        <div className="admin-error" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="admin-success" style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
          ✅ {success}
        </div>
      )}

      <div className="settings-grid">
        
        {/* Left Side: Compliance Settings */}
        <div className="settings-card glass">
          <h2>🔐 Chapa KYC Compliance Status</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            In accordance with National Bank of Ethiopia directives, digital merchants must undergo Know-Your-Customer verification to process live customer payments.
          </p>

          {/* Compliance Status Notification Banner */}
          {settings.chapaStatus === 'INACTIVE' && (
            <div className="compliance-status-banner inactive animate-fade-in">
              <div className="status-indicator inactive"></div>
              <div>
                <strong>Account Inactive</strong> — Compliance documents are missing or rejected. You cannot process live payments.
              </div>
            </div>
          )}

          {settings.chapaStatus === 'UNDER_REVIEW' && (
            <div className="compliance-status-banner under_review animate-pulse">
              <div className="status-indicator under_review"></div>
              <div className="flex-center">
                <div className="spinner" style={{ borderLeftColor: '#f59e0b' }}></div>
                <strong>Under Review</strong> — Compliance documents submitted. Simulating manual validation (completing in 5s)...
              </div>
            </div>
          )}

          {settings.chapaStatus === 'ACTIVE' && (
            <div className="compliance-status-banner active animate-fade-in">
              <div className="status-indicator active"></div>
              <div>
                <strong>Compliance Approved (ACTIVE)</strong> — Verification verified successfully. Live checkout mode is ready.
              </div>
            </div>
          )}

          {/* Form to submit documents */}
          {settings.chapaStatus !== 'ACTIVE' && (
            <form onSubmit={handleKYCSubmit} className="document-upload-zone">
              <div className="upload-group">
                <label>Business License (Renewed) *</label>
                {!licenseFile ? (
                  <div className="custom-file-input">
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'license')} disabled={settings.chapaStatus === 'UNDER_REVIEW'} />
                    <div className="upload-placeholder">
                      <span className="icon">📄</span>
                      <span>Click or drag business license to upload</span>
                      <span style={{ fontSize: '0.7rem' }}>PDF, PNG, JPG up to 10MB</span>
                    </div>
                  </div>
                ) : (
                  <div className="file-selected-state">
                    <div className="file-info">
                      <span>📄</span>
                      <strong>{licenseFile.name}</strong>
                      <small className="text-muted">({Math.round(licenseFile.size / 1024)} KB)</small>
                    </div>
                    {settings.chapaStatus !== 'UNDER_REVIEW' && (
                      <button type="button" className="btn-remove" onClick={() => handleRemoveFile('license')}>✕</button>
                    )}
                  </div>
                )}
              </div>

              <div className="upload-group">
                <label>Business Proof of Address *</label>
                {!addressFile ? (
                  <div className="custom-file-input">
                    <input type="file" accept=".pdf,image/*" onChange={(e) => handleFileChange(e, 'address')} disabled={settings.chapaStatus === 'UNDER_REVIEW'} />
                    <div className="upload-placeholder">
                      <span className="icon">📍</span>
                      <span>Click or drag proof of address to upload</span>
                      <span style={{ fontSize: '0.7rem' }}>Utility Bill, Lease Agreement, Bank Statement</span>
                    </div>
                  </div>
                ) : (
                  <div className="file-selected-state">
                    <div className="file-info">
                      <span>📄</span>
                      <strong>{addressFile.name}</strong>
                      <small className="text-muted">({Math.round(addressFile.size / 1024)} KB)</small>
                    </div>
                    {settings.chapaStatus !== 'UNDER_REVIEW' && (
                      <button type="button" className="btn-remove" onClick={() => handleRemoveFile('address')}>✕</button>
                    )}
                  </div>
                )}
              </div>

              {settings.chapaStatus === 'INACTIVE' && (
                <button type="submit" disabled={actionLoading} className="btn btn-primary w-full mt-4" style={{ borderRadius: 'var(--radius-full)' }}>
                  {actionLoading ? (
                    <span className="flex-center" style={{ justifyContent: 'center' }}>
                      <span className="spinner"></span> Submitting Documents...
                    </span>
                  ) : 'Submit Compliance Documents'}
                </button>
              )}
            </form>
          )}

          {settings.chapaStatus === 'ACTIVE' && (
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.75rem' }}>Submitted Compliance Artifacts</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <li>📄 <strong>Business License:</strong> {settings.businessLicense?.name || 'license.pdf'}</li>
                <li>📍 <strong>Proof of Address:</strong> {settings.proofOfAddress?.name || 'address.pdf'}</li>
                <li className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Submitted: {new Date(settings.businessLicense?.uploadedAt || Date.now()).toLocaleString()}
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-outline w-full mt-4"
                style={{ borderRadius: 'var(--radius-full)', color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                onClick={async () => {
                  if (confirm('Are you sure you want to reset compliance? This will deactivate your live payments.')) {
                    setActionLoading(true);
                    try {
                      const res = await fetch('/api/admin/settings', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          chapaStatus: 'INACTIVE',
                          businessLicense: null,
                          proofOfAddress: null,
                          mode: 'SANDBOX'
                        }),
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setSettings(data);
                        setSuccess('Compliance reset. Integration status returned to Inactive.');
                        setLicenseFile(null);
                        setAddressFile(null);
                      }
                    } catch(err) {
                      setError(err.message);
                    } finally {
                      setActionLoading(false);
                    }
                  }
                }}
              >
                Reset Compliance Verification
              </button>
            </div>
          )}

        </div>

        {/* Right Side: Gateway Settings */}
        <div className="settings-card glass">
          <h2>⚙️ Integration Controls</h2>
          <p className="text-muted" style={{ fontSize: '0.85rem' }}>
            Choose between sandbox mock checkout and real payment processing gateway modes.
          </p>

          <div className="mode-toggle-container">
            <div className="toggle-label">
              <span className="title">Sandbox Payment Simulator</span>
              <span className="desc">Bypasses real Chapa API to use checkout simulation. Recommended for testing.</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.mode === 'LIVE'}
                onChange={handleModeChange}
                disabled={actionLoading || settings.chapaStatus !== 'ACTIVE'}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="mode-info" style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <div>
              <strong>Current Active Mode:</strong>
              <span className={`status-badge ${settings.mode === 'LIVE' ? 'status-completed' : 'status-draft'}`} style={{ marginLeft: '0.5rem' }}>
                {settings.mode === 'LIVE' ? 'Live Production' : 'Sandbox (Simulator)'}
              </span>
            </div>
            <p className="text-muted" style={{ marginTop: '0.5rem', lineHeight: '1.4' }}>
              {settings.mode === 'LIVE'
                ? 'All checkout buttons redirect students to real Chapa checkout. Requires Chapa compliance approval to be Active.'
                : 'All checkout buttons redirect students to our sandbox checkout simulator (/payments/mock-checkout). Lets you test success and failure flows.'}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
