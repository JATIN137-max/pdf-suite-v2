import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import JSZip from 'jszip';
import AdBanner from '../../components/ads/AdBanner';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiImage, FiCheckCircle, FiDownload } from 'react-icons/fi';

const PdfToImage = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipUrl, setZipUrl] = useState(null);
  const [imageCount, setImageCount] = useState(0);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setZipUrl(null);
      setProgress(0);
    }
  };

  const convertToImages = async () => {
    if (!file || !canUseTool()) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      setImageCount(totalPages);
      
      const zip = new JSZip();
      
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        // Standard scale, can be adjusted for higher quality
        const viewport = page.getViewport({ scale: 2.0 }); 
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        
        // Extract base64 without the data URL prefix
        const imgData = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
        
        const fileName = `page_${i.toString().padStart(3, '0')}.jpg`;
        zip.file(fileName, imgData, { base64: true });
        
        setProgress(Math.round((i / totalPages) * 100));
      }
      
      const zipContent = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipContent);
      setZipUrl(url);
      incrementUsage();
    } catch (error) {
      console.error("Error converting PDF to images", error);
      alert("Failed to convert PDF. Please try a different file.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <SEO
        title="Convert PDF to JPG Online Free | EWN"
        description="Turn PDF pages into JPG images instantly. Free, fast, and processed entirely in your browser."
        path="/pdf-to-image"
      />

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>PDF to JPG</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Convert every page of a PDF into high-quality JPG images.</p>
      </div>

      {!zipUrl ? (
        <div className="card">
          {!file ? (
            <label className="upload-area" style={{ display: 'block' }}>
              <div className="upload-icon" style={{ color: 'var(--color-blue)' }}><FiUploadCloud /></div>
              <div className="upload-text" style={{ color: 'var(--color-blue)' }}>Select PDF file</div>
              <input type="file" accept="application/pdf" onChange={onFileChange} style={{ display: 'none' }} />
            </label>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <FiImage style={{ fontSize: '4rem', color: 'var(--color-blue)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>{file.name}</h3>
              
              {isProcessing && (
                <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '400px', margin: '0 auto 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                    <span>Extracting pages...</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-blue)', transition: 'width 0.2s' }}></div>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={convertToImages} disabled={isProcessing}>
                  {isProcessing ? 'Converting...' : 'Convert to JPG'}
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
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Conversion Complete!</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Successfully extracted {imageCount} images from your PDF.</p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={zipUrl} download="extracted_images.zip" className="btn btn-success" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
              <FiDownload style={{ marginRight: '0.5rem' }} /> Download ZIP file
            </a>
            <button className="btn btn-outline" onClick={() => { setFile(null); setZipUrl(null); }}>
              Convert Another
            </button>
          </div>
        </div>
      )}
      <AdBanner position="pdf-to-image-bottom" />
    </div>
  );
};

export default PdfToImage;
