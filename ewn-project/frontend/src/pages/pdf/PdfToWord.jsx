import React, { useState } from 'react';
import axios from 'axios';
import AdBanner from '../../components/ads/AdBanner';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'https://pdf-suite-v2.onrender.com';
const MAX_FILE_SIZE = 15 * 1024 * 1024; // keep in sync with backend/multer + sidecar limits

const PdfToWord = () => {
  const { canUseTool, incrementUsage, limitMessage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [wordUrl, setWordUrl] = useState(null);
  const [error, setError] = useState('');

  const onFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    if (selected.size > MAX_FILE_SIZE) {
      setError('That file is over the 15MB limit. Please try a smaller PDF.');
      return;
    }
    setFile(selected);
    setWordUrl(null);
    setError('');
  };

  const convertToWord = async () => {
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

      const response = await axios.post(`${API_BASE}/api/pdf/pdf-to-word`, formData, {
        responseType: 'blob',
        timeout: 100000,
      });

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      setWordUrl(URL.createObjectURL(blob));
      incrementUsage();
    } catch (err) {
      let message = 'Failed to convert PDF. Please check your connection and try again.';
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
        title="Convert PDF to Word Online Free | EWN"
        description="Convert PDF files into editable Word documents for free, with tables, headings, and layout preserved."
        path="/pdf-to-word"
      />

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>PDF to Word</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Convert your PDF into an editable Word document.</p>
      </div>

      {limitMessage && (
        <p style={{ color: '#e53e3e', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>
          {limitMessage}
        </p>
      )}

      {!wordUrl ? (
        <div className="card">
          {!file ? (
            <label className="upload-area" style={{ display: 'block' }}>
              <div className="upload-icon" style={{ color: 'var(--color-blue)' }}><FiUploadCloud /></div>
              <div className="upload-text" style={{ color: 'var(--color-blue)' }}>Select PDF file</div>
              <input type="file" accept="application/pdf" onChange={onFileChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <FiFileText style={{ fontSize: '4rem', color: 'var(--color-blue)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{file.name}</h3>

              {isProcessing && (
                <div style={{ marginBottom: '2rem' }}>
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
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={convertToWord} disabled={isProcessing}>
                  {isProcessing ? 'Converting...' : 'Convert to Word'}
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
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--color-green)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Conversion Complete!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Your PDF has been converted into an editable .docx file.</p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={wordUrl} download="converted.docx" className="btn btn-success" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
              Download Word File
            </a>
            <button className="btn btn-outline" onClick={() => { setFile(null); setWordUrl(null); }}>
              Convert Another
            </button>
          </div>
        </div>
      )}
      <AdBanner position="pdf-to-word-bottom" />
    </div>
  );
};

export default PdfToWord;