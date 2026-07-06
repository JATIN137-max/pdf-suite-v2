import React, { useState } from 'react';
import axios from 'axios';
import AdBanner from '../../components/ads/AdBanner';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pdf-suite-v2.onrender.com';
const MAX_FILE_SIZE = 15 * 1024 * 1024; // keep in sync with backend/multer + sidecar limits

const WordToPdf = () => {
  const { canUseTool, incrementUsage, limitMessage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      setError('That file is over the 15MB limit. Please try a smaller document.');
      return;
    }
    setFile(selected);
    setProcessedUrl(null);
    setError('');
  };

  const convertToPdf = async () => {
    if (!file || !canUseTool()) return;

    setIsProcessing(true);
    setError('');
    setProgress('Uploading document...');

    // Free-tier sidecar spins down when idle - a cold start can take
    // 30-60s, so let the user know instead of it looking stuck.
    const wakeupTimer = setTimeout(() => {
      setProgress('Still working - the converter may be waking up from idle...');
    }, 6000);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE}/api/pdf/word-to-pdf`, formData, {
        responseType: 'blob',
        timeout: 100000,
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      setProcessedUrl(URL.createObjectURL(blob));
      incrementUsage();
    } catch (err) {
      let message = 'Conversion failed. Please check your connection and try again.';
      if (err.response?.data) {
        try {
          const text = await err.response.data.text();
          message = JSON.parse(text).message || message;
        } catch {
          /* response wasn't JSON - keep default message */
        }
      }
      setError(message);
    } finally {
      clearTimeout(wakeupTimer);
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <SEO
        title="Convert Word to PDF Online Free | EWN"
        description="Convert Word documents (.docx) to PDF for free, with accurate formatting, fonts, and layout preserved."
        path="/word-to-pdf"
      />

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>Word to PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Convert DOCX files to PDF with accurate formatting, fonts, and layout preserved.
        </p>
      </div>

      {limitMessage && (
        <p style={{ color: '#e53e3e', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>
          {limitMessage}
        </p>
      )}

      {!processedUrl ? (
        <div className="card">
          {!file ? (
            <label className="upload-area" style={{ display: 'block', cursor: 'pointer' }}>
              <div className="upload-icon" style={{ color: 'var(--color-blue)' }}><FiUploadCloud /></div>
              <div className="upload-text" style={{ color: 'var(--color-blue)' }}>Select Word (.docx) file</div>
              <input
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={onFileChange}
                style={{ display: 'none' }}
              />
            </label>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <FiFileText style={{ fontSize: '4rem', color: 'var(--color-blue)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{file.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>

              {isProcessing && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <div
                    style={{
                      display: 'inline-block', width: '32px', height: '32px',
                      border: '3px solid var(--color-border)', borderTop: '3px solid var(--color-blue)',
                      borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '0.75rem',
                    }}
                  ></div>
                  <p style={{ color: 'var(--color-text-muted)' }}>{progress}</p>
                </div>
              )}

              {error && <p style={{ color: '#e53e3e', marginBottom: '1rem' }}>{error}</p>}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={convertToPdf} disabled={isProcessing}>
                  {isProcessing ? 'Converting...' : 'Convert to PDF'}
                </button>
                <button className="btn btn-outline" onClick={() => { setFile(null); setError(''); }} disabled={isProcessing}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--color-green)', marginBottom: '1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Converted Successfully!</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <a href={processedUrl} download="converted_ewn.pdf" className="btn btn-success" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
              Download PDF
            </a>
            <button className="btn btn-outline" onClick={() => { setFile(null); setProcessedUrl(null); }}>
              Convert Another
            </button>
          </div>
        </div>
      )}
      <AdBanner position="word-to-pdf-bottom" />
    </div>
  );
};

export default WordToPdf;