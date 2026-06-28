import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../../components/ads/AdBanner';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiMinimize2, FiCheckCircle } from 'react-icons/fi';

const CompressPdf = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);

  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setOriginalSize(e.target.files[0].size);
      setProcessedUrl(null);
    }
  };

  const compressPdf = async () => {
    if (!file || !canUseTool()) return;
    setIsProcessing(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Load the PDF. pdf-lib automatically decompresses streams to read them.
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove metadata to save some space
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');

      // Save the PDF. By default, pdf-lib uses pako to compress the object streams.
      // While it won't downsample images (which is the main source of size), 
      // it cleans up the structure and removes unused objects.
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      
      setNewSize(pdfBytes.length);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedUrl(URL.createObjectURL(blob));
      incrementUsage();
    } catch (error) {
      console.error(error);
      alert("Error compressing PDF. The file might be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getSavingsPercentage = () => {
    if (originalSize === 0) return 0;
    const savings = ((originalSize - newSize) / originalSize) * 100;
    return savings > 0 ? savings.toFixed(1) : 0;
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-green)' }}>Compress PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Optimize your PDF files for web and email.</p>
      </div>

      {!processedUrl ? (
        <div className="card">
          {!file ? (
            <label className="upload-area" style={{ display: 'block', borderColor: 'var(--color-green)', backgroundColor: 'var(--color-green-light)' }}>
              <div className="upload-icon" style={{ color: 'var(--color-green)' }}><FiUploadCloud /></div>
              <div className="upload-text" style={{ color: 'var(--color-green)' }}>Select PDF file</div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>or drop PDF here</p>
              <input type="file" accept="application/pdf" onChange={onFileChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <FiMinimize2 style={{ fontSize: '4rem', color: 'var(--color-green)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{file.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Original Size: {formatBytes(originalSize)}</p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-green)', padding: '1rem 3rem' }} onClick={compressPdf} disabled={isProcessing}>
                  {isProcessing ? 'Compressing...' : 'Compress PDF'}
                </button>
                <button className="btn btn-outline" onClick={() => setFile(null)} disabled={isProcessing}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--color-green)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>PDF Compressed!</h2>
          
          <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'inline-block' }}>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Original Size</p>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{formatBytes(originalSize)}</p>
              </div>
              <div style={{ color: 'var(--color-green)', fontWeight: '700', fontSize: '1.25rem' }}>
                -{getSavingsPercentage()}%
              </div>
              <div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>New Size</p>
                <p style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--color-green)' }}>{formatBytes(newSize)}</p>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={processedUrl} download="compressed_ewn.pdf" className="btn btn-success" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
              Download PDF
            </a>
            <button className="btn btn-outline" onClick={() => { setFile(null); setProcessedUrl(null); }}>
              Compress Another
            </button>
          </div>
        </div>
      )}
      <AdBanner position="compress-bottom" />
    </div>
  );
};

export default CompressPdf;
