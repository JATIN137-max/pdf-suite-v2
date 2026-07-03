import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import AdBanner from '../components/ads/AdBanner';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText, FiUnlock, FiZap, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Single flat list — the source of truth for every tool card in the
// scrolling row below. Adding a new tool (PDF or otherwise, now or later)
// is just pushing another object in here; nothing else needs to change.
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

const ToolCard = ({ tool }) => (
  <Link to={tool.path} className="tool-card">
    <div className={`tool-icon-wrapper ${tool.colorClass}`}>
      {tool.icon}
    </div>
    <h3 className="tool-title">{tool.title}</h3>
    <p className="tool-desc">{tool.description}</p>
  </Link>
);

// One section, one scrollable row — same component tree on phone and
// laptop. Mobile gets native swipe with snap; desktop additionally gets
// hover-revealed arrow buttons that nudge the same scroll container.
const ToolSection = ({ title, sectionTools }) => {
  const rowRef = useRef(null);

  const scrollByAmount = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    const cardWidth = row.firstChild ? row.firstChild.offsetWidth + 24 : 280;
    row.scrollBy({ left: direction * cardWidth * 2, behavior: 'smooth' });
  };

  return (
    <section className="tool-section">
      <div className="tool-section-header">
        <h2 className="tool-section-title">{title}</h2>
        <div className="tool-section-arrows">
          <button
            type="button"
            className="tool-scroll-arrow"
            aria-label="Scroll left"
            onClick={() => scrollByAmount(-1)}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className="tool-scroll-arrow"
            aria-label="Scroll right"
            onClick={() => scrollByAmount(1)}
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="tool-scroll-row" ref={rowRef}>
        {sectionTools.map((tool) => (
          <div className="tool-scroll-item" key={tool.id}>
            <ToolCard tool={tool} />
          </div>
        ))}
      </div>
    </section>
  );
};

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

        {/* Free login callout — only shown to guests. Styling now lives in
            .free-login-callout (index.css) instead of inline styles, so
            dark mode can give it its own tinted/glowing gradient. */}
        {!user && (
          <div
            className="free-login-callout"
            onClick={() => setShowLoginModal(true)}
          >
            <FiUnlock className="free-login-icon-unlock" />
            <span>
              <strong style={{ color: 'var(--color-blue)' }}>Free login</strong>
              {' '}for unlimited access
              {remainingUses < 10 && (
                <span style={{ marginLeft: '0.4rem', color: 'var(--color-text-muted)' }}>
                  · {remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} remaining
                </span>
              )}
            </span>
            <FiZap className="free-login-icon-zap" />
          </div>
        )}
      </div>

      <AdBanner position="home-top" />

      {/* Single unified row today — when non-PDF tools are added later,
          this becomes ToolSection title="PDF Tools" + another ToolSection
          right below it, no restructuring needed. */}
      <ToolSection title="PDF Tools" sectionTools={tools} />

      <AdBanner position="home-bottom" />
    </div>
  );
};

export default Home;