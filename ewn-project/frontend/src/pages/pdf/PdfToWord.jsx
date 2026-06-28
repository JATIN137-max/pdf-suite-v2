import React, { useState } from 'react';
import { pdfjs } from 'react-pdf';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import AdBanner from '../../components/ads/AdBanner';
import { useAuth } from '../../context/AuthContext';
import { FiUploadCloud, FiFileText, FiCheckCircle } from 'react-icons/fi';

const PdfToWord = () => {
  const { canUseTool, incrementUsage } = useAuth();
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [wordUrl, setWordUrl] = useState(null);

  const onFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setWordUrl(null);
      setProgress(0);
    }
  };

  const convertToWord = async () => {
    if (!file || !canUseTool()) return;
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      
      const docChildren = [];
      
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Combine text items into lines based on their vertical position (y coordinate)
        // This is a very basic heuristic for text extraction
        const strings = textContent.items.map(item => item.str);
        const fullText = strings.join(' ');
        
        docChildren.push(
          new Paragraph({
            children: [new TextRun({ text: `--- Page ${i} ---`, bold: true })],
          }),
          new Paragraph({
            children: [new TextRun(fullText)],
          }),
          new Paragraph({ text: "" }) // empty line
        );
        
        setProgress(Math.round((i / totalPages) * 100));
      }
      
      const doc = new Document({
        sections: [{
          properties: {},
          children: docChildren,
        }]
      });
      
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      setWordUrl(url);
      incrementUsage();
    } catch (error) {
      console.error("Error converting PDF to Word", error);
      alert("Failed to convert PDF. The file might be encrypted or corrupted.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-blue)' }}>PDF to Word</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Extract text from your PDF into a Word document.</p>
      </div>

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
                <div style={{ marginBottom: '2rem', width: '100%', maxWidth: '400px', margin: '0 auto 2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600' }}>
                    <span>Extracting text...</span>
                    <span>{progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', backgroundColor: 'var(--color-blue)', transition: 'width 0.2s' }}></div>
                  </div>
                </div>
              )}
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-primary" style={{ padding: '1rem 3rem' }} onClick={convertToWord} disabled={isProcessing}>
                  {isProcessing ? 'Converting...' : 'Convert to Word'}
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
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Text has been extracted into a .docx file.</p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <a href={wordUrl} download="extracted_text.docx" className="btn btn-success" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
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
