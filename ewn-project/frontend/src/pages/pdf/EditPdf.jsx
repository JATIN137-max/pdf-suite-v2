import React, { useState, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Document, Page, pdfjs } from 'react-pdf';
import AdBanner from '../../components/ads/AdBanner';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiTrash2, FiRotateCw, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up the worker for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const EditPdf = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pages, setPages] = useState([]); // [{ id: 1, originalIndex: 0, rotation: 0, deleted: false }]
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setProcessedUrl(null);
      setPages([]);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    const initialPages = Array.from({ length: numPages }, (_, i) => ({
      id: `page-${i}`,
      originalIndex: i,
      rotation: 0,
      deleted: false
    }));
    setPages(initialPages);
  };

  const rotatePage = (index) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const toggleDeletePage = (index) => {
    setPages(prev => prev.map((p, i) => i === index ? { ...p, deleted: !p.deleted } : p));
  };

  const movePage = (index, direction) => {
    if (direction === -1 && index === 0) return;
    if (direction === 1 && index === pages.length - 1) return;
    
    setPages(prev => {
      const newPages = [...prev];
      const temp = newPages[index];
      newPages[index] = newPages[index + direction];
      newPages[index + direction] = temp;
      return newPages;
    });
  };

  const handleApplyChanges = async () => {
    if (!file || !canUseTool()) return;
    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const newPdf = await PDFDocument.create();
      
      const activePages = pages.filter(p => !p.deleted);
      const copiedPages = await newPdf.copyPages(pdfDoc, activePages.map(p => p.originalIndex));
      
      copiedPages.forEach((page, i) => {
        const rotation = activePages[i].rotation;
        if (rotation !== 0) {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees(currentRotation + rotation));
        }
        newPdf.addPage(page);
      });
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedUrl(URL.createObjectURL(blob));
      incrementUsage();
    } catch (error) {
      console.error(error);
      alert("Error saving PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-red)' }}>Edit PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Rotate, reorder, and delete pages visually.</p>
      </div>

      {!processedUrl ? (
        <div className="card">
          {!file ? (
            <label className="upload-area" style={{ display: 'block' }}>
              <div className="upload-icon" style={{ color: 'var(--color-red)' }}><FiUploadCloud /></div>
              <div className="upload-text" style={{ color: 'var(--color-red)' }}>Select PDF file</div>
              <input type="file" accept="application/pdf" onChange={onFileChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{file.name}</h3>
                <button className="btn btn-outline" onClick={() => setFile(null)}>Change File</button>
              </div>

              <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <Document file={file} onLoadSuccess={onDocumentLoadSuccess} loading={<div style={{textAlign: 'center', padding: '2rem'}}>Loading PDF...</div>}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem' }}>
                    {pages.map((pageData, index) => (
                      <div key={pageData.id} style={{ 
                        position: 'relative', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        opacity: pageData.deleted ? 0.4 : 1,
                        transition: 'var(--transition-all)'
                      }}>
                        <div style={{ 
                          boxShadow: 'var(--shadow-md)', 
                          border: pageData.deleted ? '2px solid var(--color-red)' : '2px solid transparent',
                          borderRadius: '8px', 
                          overflow: 'hidden',
                          transform: `rotate(${pageData.rotation}deg)`,
                          transition: 'transform 0.3s ease',
                          marginBottom: '1rem',
                          backgroundColor: 'white'
                        }}>
                          <Page 
                            pageNumber={pageData.originalIndex + 1} 
                            width={150} 
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                          />
                        </div>
                        
                        <div style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--color-text-muted)' }}>
                          Page {index + 1}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: 'var(--color-white)', padding: '0.25rem', borderRadius: '2rem', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--color-border)' }}>
                          <button onClick={() => movePage(index, -1)} disabled={index === 0} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: index === 0 ? 'not-allowed' : 'pointer', color: 'var(--color-text-main)' }} title="Move Left"><FiChevronLeft /></button>
                          <button onClick={() => rotatePage(index)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-blue)' }} title="Rotate"><FiRotateCw /></button>
                          <button onClick={() => toggleDeletePage(index)} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-red)' }} title={pageData.deleted ? "Restore" : "Delete"}>{pageData.deleted ? <FiCheckCircle /> : <FiTrash2 />}</button>
                          <button onClick={() => movePage(index, 1)} disabled={index === pages.length - 1} style={{ padding: '0.5rem', background: 'none', border: 'none', cursor: index === pages.length - 1 ? 'not-allowed' : 'pointer', color: 'var(--color-text-main)' }} title="Move Right"><FiChevronRight /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Document>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-red)', fontSize: '1.25rem', padding: '1rem 3rem' }} onClick={savePdf} disabled={isProcessing || !pages.some(p => !p.deleted)}>
                  {isProcessing ? 'Processing...' : 'Apply Changes & Download'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--color-green)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>PDF Edited Successfully!</h2>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
            <a href={processedUrl} download="edited_ewn.pdf" className="btn btn-success" style={{ textDecoration: 'none', fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Download PDF
            </a>
            <button className="btn btn-outline" onClick={() => { setFile(null); setProcessedUrl(null); }}>
              Edit Another
            </button>
          </div>
        </div>
      )}
      <AdBanner position="edit-bottom" />
    </div>
  );
};

export default EditPdf;
