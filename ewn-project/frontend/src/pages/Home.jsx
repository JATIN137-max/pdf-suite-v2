import React from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/ads/AdBanner';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText, FiUnlock, FiZap } from 'react-icons/fi';

const tools = [
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into a single, unified document.',
    icon: <FiLayers />,
    path: '/merge-pdf',
    colorClass: 'icon-blue'
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce file size while maintaining the best possible quality.',
    icon: <FiMinimize2 />,
    path: '/compress-pdf',
    colorClass: 'icon-green'
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    description: 'Rotate, reorder, or delete pages from your PDF file.',
    icon: <FiEdit3 />,
    path: '/edit-pdf',
    colorClass: 'icon-red'
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to JPG',
    description: 'Extract pages from a PDF as high-quality JPG images.',
    icon: <FiImage />,
    path: '/pdf-to-image',
    colorClass: 'icon-blue'
  },
  {
    id: 'image-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert your JPG images into a single PDF document.',
    icon: <FiFileText />,
    path: '/image-to-pdf',
    colorClass: 'icon-green'
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert DOCX files into PDF format quickly.',
    icon: <FiFileText />,
    path: '/word-to-pdf',
    colorClass: 'icon-blue'
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Extract text from PDFs into Word format.',
    icon: <FiFileText />,
    path: '/pdf-to-word',
    colorClass: 'icon-red'
  }
];

const Home = () => {
  const { user, remainingUses, setShowLoginModal } = useAuth();

  return (
    <div className="animate-slide-up">
      <SEO
        title="EWN - Free Online PDF Tools | Merge, Compress, Edit & Convert"
        description="Free online PDF tools - merge, compress, edit, and convert PDFs instantly in your browser. No installs, no signup required for your first 10 uses."
        path="/"
      />

      <div className="page-header">
        <h1 className="page-title">Every Tool You Need. In One Place.</h1>
        <p className="page-subtitle">
          EWN provides a comprehensive suite of free, secure, and fast tools. Start by selecting a PDF tool below. More tools coming soon!
        </p>

        {/* Free login callout — only shown to guests */}
        {!user && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginTop: '1.25rem',
            padding: '0.55rem 1.25rem',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #e8f0fe 0%, #fce8e6 100%)',
            border: '1px solid rgba(26, 115, 232, 0.2)',
            fontSize: '0.9rem',
            color: 'var(--color-text-main)',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s, transform 0.2s',
          }}
          onClick={() => setShowLoginModal(true)}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,115,232,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <FiUnlock style={{ color: 'var(--color-blue)', fontSize: '1rem', flexShrink: 0 }} />
            <span>
              <strong style={{ color: 'var(--color-blue)' }}>Free login</strong>
              {' '}for unlimited access
              {remainingUses < 10 && (
                <span style={{ marginLeft: '0.4rem', color: 'var(--color-text-muted)' }}>
                  · {remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining
                </span>
              )}
            </span>
            <FiZap style={{ color: 'var(--color-red)', fontSize: '0.9rem', flexShrink: 0 }} />
          </div>
        )}
      </div>

      <AdBanner position="home-top" />

      <div className="tool-grid">
        {tools.map((tool) => (
          <Link to={tool.path} key={tool.id} className="tool-card">
            <div className={`tool-icon-wrapper ${tool.colorClass}`}>
              {tool.icon}
            </div>
            <h3 className="tool-title">{tool.title}</h3>
            <p className="tool-desc">{tool.description}</p>
          </Link>
        ))}
      </div>
      
      <AdBanner position="home-bottom" />
    </div>
  );
};

export default Home;
