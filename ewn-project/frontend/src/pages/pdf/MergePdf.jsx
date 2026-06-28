import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../../components/ads/AdBanner';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiFile, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const MergePdf = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
      setFiles(prev => [...prev, ...newFiles]);
      setMergedPdfUrl(null);
      setError(null);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      setError("Please upload at least 2 PDF files to merge.");
      return;
    }
    
    if (!canUseTool()) {
      setError("You have reached your daily usage limit. Please sign up for more.");
      return;
    }
    
    setIsMerging(true);
    setError(null);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (const file of files) {
        const fileArrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
      incrementUsage();
    } catch (err) {
      console.error(err);
      setError("An error occurred while merging the PDFs. Ensure they are valid PDF files.");
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>Merge PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Combine multiple PDF files into one easily.</p>
      </div>

      {!mergedPdfUrl ? (
        <div className="card">
          <label className="upload-area" style={{ display: 'block' }}>
            <div className="upload-icon"><FiUploadCloud /></div>
            <div className="upload-text">Select PDF files</div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>or drop PDFs here</p>
            <input 
              type="file" 
              multiple 
              accept="application/pdf" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </label>

          {error && (
            <div style={{ backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {files.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Selected Files ({files.length})</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {files.map((file, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FiFile style={{ color: 'var(--color-blue)', fontSize: '1.5rem' }} />
                      <span style={{ fontWeight: '500' }}>{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)} style={{ background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer', padding: '0.5rem', fontSize: '1.25rem' }}>
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
              
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}
                  onClick={mergePdfs}
                  disabled={isMerging || files.length < 2}
                >
                  {isMerging ? 'Merging...' : 'Merge PDFs'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--color-green)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>PDFs Merged Successfully!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Your files have been combined into a single document.</p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={mergedPdfUrl} download="merged_ewn.pdf" className="btn btn-success" style={{ fontSize: '1.1rem', padding: '1rem 2rem', textDecoration: 'none' }}>
              Download Merged PDF
            </a>
            <button className="btn btn-outline" onClick={() => { setFiles([]); setMergedPdfUrl(null); }}>
              Merge More
            </button>
          </div>
        </div>
      )}

      <AdBanner position="merge-bottom" />
    </div>
  );
};

export default MergePdf;
