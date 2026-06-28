
import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import AdBanner from '../../components/ads/AdBanner';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiMinimize2, FiCheckCircle, FiInfo } from 'react-icons/fi';
 
// Vite-safe worker setup: resolves the worker file at build time instead of
// relying on a hardcoded public path, which breaks across pdfjs-dist versions.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();
 
// Quality presets. "scale" controls render resolution (applied to the PDF's
// declared point size, so 1.0 = 72dpi-equivalent page size, 1.5 = sharper/bigger).
// "jpegQuality" controls the canvas->JPEG re-encode quality (0-1).
const QUALITY_PRESETS = {
  high: { label: 'Low compression (best quality)', scale: 2.0, jpegQuality: 0.85 },
  medium: { label: 'Medium compression (recommended)', scale: 1.5, jpegQuality: 0.7 },
  low: { label: 'High compression (smallest file)', scale: 1.0, jpegQuality: 0.5 },
};
 
const CompressPdf = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [newSize, setNewSize] = useState(0);
  const [quality, setQuality] = useState('medium');
  const [estimates, setEstimates] = useState(null); // { high: bytes, medium: bytes, low: bytes }
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const fileBufferRef = useRef(null); // cache the arrayBuffer so estimate + compress don't re-read the file
 
  const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };
 
  // Renders a single page to a canvas at the given scale, returns a JPEG blob.
  const renderPageToJpeg = async (pdf, pageNumber, scale, jpegQuality) => {
    const page = await pdf.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
 
    const canvas = document.createElement('canvas');
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const ctx = canvas.getContext('2d');
 
    // White background avoids transparent PDFs producing black JPEG backgrounds.
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
 
    await page.render({ canvasContext: ctx, viewport }).promise;
 
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', jpegQuality)
    );
 
    const widthPt = page.getViewport({ scale: 1 }).width;
    const heightPt = page.getViewport({ scale: 1 }).height;
 
    page.cleanup();
    return { blob, widthPt, heightPt };
  };
 
  // Estimates achievable size per quality level by fully rendering just the
  // first page (representative sample) at each preset and scaling by page count.
  // This is an estimate, not exact - actual results vary with per-page content.
  const estimateSizes = async (arrayBuffer) => {
    setIsEstimating(true);
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }).promise;
      const pageCount = pdf.numPages;
 
      const results = {};
      for (const key of Object.keys(QUALITY_PRESETS)) {
        const { scale, jpegQuality } = QUALITY_PRESETS[key];
        const { blob } = await renderPageToJpeg(pdf, 1, scale, jpegQuality);
        // Rough per-page-average estimate. PDF container overhead is small
        // relative to image data, so this stays reasonably close for
        // documents with visually similar pages.
        results[key] = blob.size * pageCount + 2000;
      }
 
      if (typeof pdf.destroy === 'function') {
        pdf.destroy();
      }
      setEstimates(results);
    } catch (err) {
      console.error('Estimate error:', err);
      // Non-fatal - compression itself can still proceed without an estimate.
      setEstimates(null);
    } finally {
      setIsEstimating(false);
    }
  };
 
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setOriginalSize(selected.size);
      setProcessedUrl(null);
      setEstimates(null);
 
      const arrayBuffer = await selected.arrayBuffer();
      fileBufferRef.current = arrayBuffer;
      estimateSizes(arrayBuffer);
    }
  };
 
  const compressPdf = async () => {
    if (!file || !canUseTool() || !fileBufferRef.current) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: 0 });
 
    try {
      const { scale, jpegQuality } = QUALITY_PRESETS[quality];
      const pdf = await pdfjsLib.getDocument({ data: fileBufferRef.current.slice(0) }).promise;
      const pageCount = pdf.numPages;
      setProgress({ current: 0, total: pageCount });
 
      const newPdf = await PDFDocument.create();
 
      for (let i = 1; i <= pageCount; i++) {
        const { blob, widthPt, heightPt } = await renderPageToJpeg(pdf, i, scale, jpegQuality);
        const jpegBytes = await blob.arrayBuffer();
        const jpegImage = await newPdf.embedJpg(jpegBytes);
 
        const newPage = newPdf.addPage([widthPt, heightPt]);
        newPage.drawImage(jpegImage, {
          x: 0,
          y: 0,
          width: widthPt,
          height: heightPt,
        });
 
        setProgress({ current: i, total: pageCount });
      }
 
      if (typeof pdf.destroy === 'function') {
        pdf.destroy();
      }
 
      const pdfBytes = await newPdf.save({ useObjectStreams: true });
 
      setNewSize(pdfBytes.length);
      const resultBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      setProcessedUrl(URL.createObjectURL(resultBlob));
      incrementUsage();
    } catch (error) {
      console.error(error);
      alert('Error compressing PDF. The file might be encrypted, corrupted, or password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };
 
  const getSavingsPercentage = (size) => {
    if (originalSize === 0 || !size) return 0;
    const savings = ((originalSize - size) / originalSize) * 100;
    return savings > 0 ? savings.toFixed(0) : 0;
  };
 
  const resetAll = () => {
    setFile(null);
    setProcessedUrl(null);
    setEstimates(null);
    fileBufferRef.current = null;
  };
 
  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-green)' }}>Compress PDF</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Shrink file size by re-rendering pages as optimized images.</p>
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
              <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>Original size: {formatBytes(originalSize)}</p>
 
              {/* Important behavior notice - this is a real tradeoff, not fine print */}
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.6rem', textAlign: 'left',
                backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: '#9a3412',
              }}>
                <FiInfo style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                <span>This compressor re-renders each page as an image to shrink file size. Text will no longer be selectable or searchable in the output. For text-heavy PDFs you need to keep editable/searchable, this trade-off may not be worth it.</span>
              </div>
 
              {/* Quality selector with live, per-option size estimate */}
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ fontWeight: '600', marginBottom: '0.75rem', textAlign: 'left' }}>Choose compression level</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {Object.entries(QUALITY_PRESETS).map(([key, preset]) => (
                    <label
                      key={key}
                      style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
                        border: quality === key ? '2px solid var(--color-green)' : '1px solid var(--color-border)',
                        backgroundColor: quality === key ? 'var(--color-green-light)' : 'transparent',
                        cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input
                          type="radio"
                          name="quality"
                          value={key}
                          checked={quality === key}
                          onChange={() => setQuality(key)}
                        />
                        {preset.label}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                        {isEstimating
                          ? 'Estimating...'
                          : estimates
                            ? `~${formatBytes(estimates[key])} (-${getSavingsPercentage(estimates[key])}%)`
                            : '—'}
                      </span>
                    </label>
                  ))}
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '0.5rem', textAlign: 'left' }}>
                  Estimates are based on your first page and may vary if other pages differ significantly in content.
                </p>
              </div>
 
              {isProcessing && progress.total > 0 && (
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Processing page {progress.current} of {progress.total}...
                </p>
              )}
 
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" style={{ backgroundColor: 'var(--color-green)', padding: '1rem 3rem' }} onClick={compressPdf} disabled={isProcessing || isEstimating}>
                  {isProcessing ? 'Compressing...' : 'Compress PDF'}
                </button>
                <button className="btn btn-outline" onClick={resetAll} disabled={isProcessing}>
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
                -{getSavingsPercentage(newSize)}%
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
            <button className="btn btn-outline" onClick={resetAll}>
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
 
