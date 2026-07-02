import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/ads/AdBanner';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText, FiUnlock, FiZap } from 'react-icons/fi';

const MOBILE_BREAKPOINT = 768;

const tools = [
  {
    id: 'merge-pdf',
    title: 'Merge PDF',
    description: 'Combine multiple PDFs into one unified document.',
    icon: <FiLayers />,
    path: '/merge-pdf',
    colorClass: 'icon-blue',
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    id: 'compress-pdf',
    title: 'Compress PDF',
    description: 'Reduce file size while keeping the best quality.',
    icon: <FiMinimize2 />,
    path: '/compress-pdf',
    colorClass: 'icon-green',
    accent: '#10b981',
    bg: '#d1fae5',
  },
  {
    id: 'edit-pdf',
    title: 'Edit PDF',
    description: 'Rotate, reorder, or delete pages visually.',
    icon: <FiEdit3 />,
    path: '/edit-pdf',
    colorClass: 'icon-red',
    accent: '#ef4444',
    bg: '#fef2f2',
  },
  {
    id: 'pdf-to-image',
    title: 'PDF to JPG',
    description: 'Extract pages as high-quality JPG images.',
    icon: <FiImage />,
    path: '/pdf-to-image',
    colorClass: 'icon-blue',
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    id: 'image-to-pdf',
    title: 'JPG to PDF',
    description: 'Convert images into a single PDF document.',
    icon: <FiFileText />,
    path: '/image-to-pdf',
    colorClass: 'icon-green',
    accent: '#10b981',
    bg: '#d1fae5',
  },
  {
    id: 'word-to-pdf',
    title: 'Word to PDF',
    description: 'Convert DOCX files into PDF format quickly.',
    icon: <FiFileText />,
    path: '/word-to-pdf',
    colorClass: 'icon-blue',
    accent: '#2563eb',
    bg: '#eff6ff',
  },
  {
    id: 'pdf-to-word',
    title: 'PDF to Word',
    description: 'Extract text from PDFs into Word format.',
    icon: <FiFileText />,
    path: '/pdf-to-word',
    colorClass: 'icon-red',
    accent: '#ef4444',
    bg: '#fef2f2',
  }
];

const Home = () => {
  const { user, remainingUses, setShowLoginModal } = useAuth();
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          <div
            style={{
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

      {isMobile ? (
        /* ── MOBILE: horizontal swipeable carousel ── */
        <div>
          {/* Hint text */}
          <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', textAlign: 'center', letterSpacing: '0.01em' }}>
            Swipe to browse all tools →
          </p>

          {/* Scroll container */}
          <div style={{
            display: 'flex',
            gap: '0.9rem',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: '1rem',
            paddingLeft: '0.25rem',
            paddingRight: '1rem',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            /* Hide scrollbar visually but keep it functional */
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            {tools.map((tool) => (
              <Link
                key={tool.id}
                to={tool.path}
                style={{
                  flexShrink: 0,
                  width: '155px',
                  scrollSnapAlign: 'start',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1.25rem 0.75rem 1rem',
                  backgroundColor: 'var(--color-white)',
                  borderRadius: 'var(--radius-xl)',
                  border: `1px solid ${tool.bg}`,
                  boxShadow: 'var(--shadow-sm)',
                  color: 'var(--color-text-main)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onTouchStart={e => e.currentTarget.style.transform = 'scale(0.97)'}
                onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                {/* Accent top bar */}
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${tool.accent}, ${tool.accent}88)`,
                }} />

                {/* Icon */}
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: tool.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  color: tool.accent,
                  marginBottom: '0.75rem',
                }}>
                  {tool.icon}
                </div>

                <span style={{ fontWeight: '700', fontSize: '0.85rem', marginBottom: '0.35rem', lineHeight: 1.2 }}>
                  {tool.title}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  {tool.description}
                </span>
              </Link>
            ))}
          </div>

          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
            {tools.map((tool) => (
              <div key={tool.id} style={{
                width: '6px', height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-border)',
              }} />
            ))}
          </div>
        </div>
      ) : (
        /* ── DESKTOP: original grid ── */
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
      )}

      <AdBanner position="home-bottom" />
    </div>
  );
};

export default Home;
