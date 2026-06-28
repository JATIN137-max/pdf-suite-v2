import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import AdBanner from '../../components/ads/AdBanner';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';

const WordToPdf = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [progress, setProgress] = useState('');
  const hiddenDivRef = useRef(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProcessedUrl(null);
    }
  };

  const convertToPdf = async () => {
    if (!file) return;
    if (!canUseTool()) return;

    setIsProcessing(true);
    setProgress('Parsing Word document...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      const html = result.value;

      // Inject into hidden div for canvas rendering
      if (hiddenDivRef.current) {
        hiddenDivRef.current.innerHTML = `
          <div style="width:794px; padding:60px; font-family:Arial, sans-serif; font-size:13px; line-height:1.6; color:#000; background:#fff;">
            ${html}
          </div>`;

        setProgress('Rendering pages...');
        const canvas = await html2canvas(hiddenDivRef.current, { scale: 1.5, useCORS: true });

        setProgress('Generating PDF...');
        const imgData = canvas.toDataURL('image/jpeg', 0.92);
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position -= pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
          heightLeft -= pdfHeight;
        }

        const blob = pdf.output('blob');
        setProcessedUrl(URL.createObjectURL(blob));
        incrementUsage();
      }
    } catch (error) {
      console.error(error);
      alert('Error converting Word to PDF. The file might be corrupted or too complex.');
    } finally {
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>Word to PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Convert DOCX files to PDF entirely in your browser — no uploads, no servers.
        </p>
      </div>

      {/* Hidden render area for html2canvas */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', overflow: 'hidden' }}>
        <div ref={hiddenDivRef}></div>
      </div>

      {!processedUrl ? (
        <div className="card">
          {!file ? (
            <label className="upload-area" style={{ display: 'block', cursor: 'pointer' }}>
              <div className="upload-icon" style={{ color: 'var(--color-blue)' }}><FiUploadCloud /></div>
              <div className="upload-text" style={{ color: 'var(--color-blue)' }}>Select Word (.docx) file</div>
              <input type="file" accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFileChange} style={{ display: 'none' }} />
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
                  <div style={{ display: 'inline-block', width: '32px', height: '32px', border: '3px solid var(--color-border)', borderTop: '3px solid var(--color-blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '0.75rem' }}></div>
                  <p style={{ color: 'var(--color-text-muted)' }}>{progress}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={convertToPdf} disabled={isProcessing}>
                  {isProcessing ? 'Converting...' : 'Convert to PDF'}
                </button>
                <button className="btn btn-outline" onClick={() => setFile(null)} disabled={isProcessing}>Cancel</button>
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
