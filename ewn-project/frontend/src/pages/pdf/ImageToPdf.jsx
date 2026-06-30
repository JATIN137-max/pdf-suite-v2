import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import AdBanner from '../../components/ads/AdBanner';
import SEO from '../../components/SEO';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiImage, FiTrash2, FiCheckCircle } from 'react-icons/fi';

const ImageToPdf = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [files, setFiles] = useState([]);
  const [isConverting, setIsConverting] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      setFiles(prev => [...prev, ...newFiles]);
      setPdfUrl(null);
      setError(null);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Loads a File as an <img>, draws it to canvas, and returns clean JPEG bytes.
  // This sidesteps malformed/mislabeled files (e.g. a renamed WebP, a HEIC
  // saved with a .jpg extension, or a WhatsApp image with non-standard
  // encoding) since the browser's native image decoder - not pdf-lib's
  // strict byte-level JPEG parser - handles the actual decoding.
  const normalizeImageToJpeg = (file) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        // White background avoids transparent PNGs producing a black
        // background once flattened to JPEG.
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            if (!blob) {
              reject(new Error('Could not re-encode image'));
              return;
            }
            resolve({ blob, width: canvas.width, height: canvas.height });
          },
          'image/jpeg',
          0.92
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Browser could not decode this image - it may be corrupted or an unsupported format'));
      };

      img.src = objectUrl;
    });
  };

  const convertToPdf = async () => {
    if (files.length === 0 || !canUseTool()) return;
    setIsConverting(true);
    setError(null);

    const failedFiles = [];

    try {
      const pdfDoc = await PDFDocument.create();
      
      for (const file of files) {
        try {
          const { blob, width, height } = await normalizeImageToJpeg(file);
          const jpegBytes = await blob.arrayBuffer();
          const image = await pdfDoc.embedJpg(jpegBytes);

          const page = pdfDoc.addPage([width, height]);
          page.drawImage(image, {
            x: 0,
            y: 0,
            width,
            height,
          });
        } catch (fileErr) {
          console.error(`Failed to process ${file.name}:`, fileErr);
          failedFiles.push(file.name);
        }
      }

      if (pdfDoc.getPageCount() === 0) {
        setError('None of the selected images could be converted. They may be corrupted or an unsupported format.');
        setIsConverting(false);
        return;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      if (failedFiles.length > 0) {
        setError(`Note: ${failedFiles.length} file(s) could not be processed and were skipped: ${failedFiles.join(', ')}`);
      }

      incrementUsage();
    } catch (err) {
      console.error(err);
      setError("An error occurred during conversion.");
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <SEO
        title="Convert JPG to PDF Online Free | EWN"
        description="Combine JPG or PNG images into a single PDF file for free, right in your browser."
        path="/image-to-pdf"
      />

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-green)' }}>JPG/PNG to PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Convert your images to a single PDF document.</p>
      </div>

      {!pdfUrl ? (
        <div className="card">
          <label className="upload-area" style={{ display: 'block' }}>
            <div className="upload-icon"><FiUploadCloud /></div>
            <div className="upload-text">Select Images</div>
            <input 
              type="file" 
              multiple 
              accept="image/jpeg, image/png" 
              onChange={handleFileChange} 
              style={{ display: 'none' }} 
            />
          </label>

          {error && <div style={{ color: 'var(--color-red)', textAlign: 'center', margin: '1rem 0' }}>{error}</div>}

          {files.length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {files.map((file, index) => (
                  <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: 'var(--color-bg-light)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FiImage style={{ color: 'var(--color-green)', fontSize: '1.5rem' }} />
                      <span style={{ fontWeight: '500' }}>{file.name}</span>
                    </div>
                    <button onClick={() => removeFile(index)} style={{ background: 'none', border: 'none', color: 'var(--color-red)', cursor: 'pointer' }}>
                      <FiTrash2 />
                    </button>
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <button className="btn btn-primary" onClick={convertToPdf} disabled={isConverting}>
                  {isConverting ? 'Converting...' : 'Convert to PDF'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <FiCheckCircle style={{ fontSize: '5rem', color: 'var(--color-green)', margin: '0 auto 1.5rem' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Converted Successfully!</h2>
          {error && (
            <div style={{ color: 'var(--color-red)', backgroundColor: 'var(--color-red-light)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.875rem', textAlign: 'left' }}>
              {error}
            </div>
          )}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={pdfUrl} download="images_ewn.pdf" className="btn btn-success" style={{ textDecoration: 'none' }}>Download PDF</a>
            <button className="btn btn-outline" onClick={() => { setFiles([]); setPdfUrl(null); }}>Convert More</button>
          </div>
        </div>
      )}
      <AdBanner position="image-to-pdf-bottom" />
    </div>
  );
};

export default ImageToPdf;
