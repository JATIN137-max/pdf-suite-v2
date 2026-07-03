import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiChevronDown, FiChevronRight, FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText, FiCpu } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const MOBILE_BREAKPOINT = 768;

const toolCategories = [
  {
    id: 'pdf',
    label: 'PDF Tools',
    icon: <FiFileText />,
    colorClass: 'icon-blue',
    tools: [
      { title: 'Merge PDF', path: '/merge-pdf', icon: <FiLayers />, colorClass: 'icon-blue' },
      { title: 'Compress PDF', path: '/compress-pdf', icon: <FiMinimize2 />, colorClass: 'icon-green' },
      { title: 'Edit PDF', path: '/edit-pdf', icon: <FiEdit3 />, colorClass: 'icon-red' },
      { title: 'PDF to JPG', path: '/pdf-to-image', icon: <FiImage />, colorClass: 'icon-blue' },
      { title: 'JPG to PDF', path: '/image-to-pdf', icon: <FiFileText />, colorClass: 'icon-green' },
      { title: 'Word to PDF', path: '/word-to-pdf', icon: <FiFileText />, colorClass: 'icon-blue' },
      { title: 'PDF to Word', path: '/pdf-to-word', icon: <FiFileText />, colorClass: 'icon-red' },
    ],
  },
  {
    id: 'ai',
    label: 'AI Tools',
    icon: <FiCpu />,
    colorClass: 'icon-green',
    tools: [
      { title: 'Solvent AI', path: '/solvent-ai', icon: <FiCpu />, colorClass: 'icon-green' },
    ],
  },
];

const Navbar = () => {
  const { user, remainingUses, setShowLoginModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null); 
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(null); 
  const toolsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!toolsOpen) return;
    const handleClick = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
        setActiveCategory(null);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setToolsOpen(false);
        setActiveCategory(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [toolsOpen]);

  const navLinkStyle = {
    textDecoration: 'none',
    color: 'var(--color-text-main)',
    fontWeight: '500',
    transition: 'color 0.2s',
  };

  const linkHover = (e) => e.target.style.color = 'var(--color-blue)';
  const linkOut = (e) => e.target.style.color = 'var(--color-text-main)';

  const authBlock = user ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        Hi, <strong style={{ color: 'var(--color-blue)' }}>{user.email.split('@')[0]}</strong>
      </span>
      <button onClick={() => { logout(); setIsOpen(false); }} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Logout</button>
    </div>
  ) : (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <span style={{
        fontSize: '0.8rem', fontWeight: '600', padding: '0.25rem 0.65rem',
        borderRadius: '999px',
        backgroundColor: remainingUses <= 3 ? 'var(--color-red)' : 'var(--color-blue)',
        color: 'white',
        transition: 'background-color 0.3s',
        whiteSpace: 'nowrap',
      }}>
        {remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} left
      </span>
      <button className="btn btn-primary" onClick={() => { setShowLoginModal(true); setIsOpen(false); }} style={{ padding: '0.5rem 1rem' }}>Login</button>
    </div>
  );

  const desktopAuthBlock = user ? (
    <div className="nav-user-chip">
      <div className="nav-user-avatar">{user.email.charAt(0).toUpperCase()}</div>
      <span className="nav-user-name">{user.email.split('@')[0]}</span>
      <span className="nav-user-divider" />
      <button onClick={logout} className="nav-user-logout">Logout</button>
    </div>
  ) : (
    <div className="nav-guest-chip">
      <span
        className="nav-guest-badge"
        style={{ backgroundColor: remainingUses <= 3 ? 'var(--color-red-light)' : 'var(--color-bg-light)', color: remainingUses <= 3 ? 'var(--color-red)' : 'var(--color-text-main)' }}
      >
        {remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} left
      </span>
      <button className="btn btn-primary" style={{ padding: '0.5rem 1.1rem' }} onClick={() => setShowLoginModal(true)}>
        Login
      </button>
    </div>
  );

  return (
    <header style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', gap: '0.75rem' }}>
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}
          style={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.4rem' : '0.5rem',
            cursor: 'pointer',
            minWidth: 0,
            paddingLeft: isMobile ? '38px' : 0,
            flexShrink: 0,
          }}
        >
          <div style={{ backgroundColor: 'var(--color-blue)', color: 'white', fontWeight: '800', fontSize: isMobile ? '1.1rem' : '1.5rem', padding: isMobile ? '0.2rem 0.5rem' : '0.2rem 0.6rem', borderRadius: 'var(--radius-md)', flexShrink: 0, letterSpacing: '0.02em' }}>
            EWN
          </div>
          {isMobile ? (
            <span style={{
              fontSize: '0.62rem',
              fontWeight: '700',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              lineHeight: '1.15',
              whiteSpace: 'nowrap',
              borderLeft: '2px solid var(--color-border)',
              paddingLeft: '0.4rem',
            }}>
              Everything<br />What's Needed
            </span>
          ) : (
            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
              Everything What's Needed
            </span>
          )}
        </a>

        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '3rem', flex: 1, justifyContent: 'flex-end', marginLeft: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
              <Link to="/" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Home</Link>

              {/* FIX APPLIED HERE: Removed onMouseEnter and onMouseLeave */}
              <div
                ref={toolsRef}
                style={{ position: 'relative' }}
              >
                <button
                  className="nav-link-btn"
                  aria-expanded={toolsOpen}
                  aria-haspopup="true"
                  onClick={() => setToolsOpen((o) => !o)}
                >
                  Tools
                  <FiChevronDown style={{ transform: toolsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', fontSize: '0.85rem' }} />
                </button>

                {toolsOpen && (
                  <div className="nav-tools-panel" role="menu">
                    {toolCategories.map((category) => (
                      <div
                        key={category.id}
                        className="nav-tools-category-wrap"
                        onMouseEnter={() => setActiveCategory(category.id)}
                      >
                        <button
                          type="button"
                          className={`nav-tools-category-row ${activeCategory === category.id ? 'is-active' : ''}`}
                          onClick={() => setActiveCategory((c) => (c === category.id ? null : category.id))}
                          aria-expanded={activeCategory === category.id}
                        >
                          <span className={`nav-tools-icon ${category.colorClass}`}>{category.icon}</span>
                          <span className="nav-tools-category-label">{category.label}</span>
                          <FiChevronRight className="nav-tools-category-chevron" />
                        </button>

                        {activeCategory === category.id && (
                          <div className="nav-tools-subpanel" role="menu">
                            {category.tools.map((tool) => (
                              <Link
                                key={tool.path}
                                to={tool.path}
                                className="nav-tools-item"
                                role="menuitem"
                                onClick={() => { setToolsOpen(false); setActiveCategory(null); }}
                              >
                                <span className={`nav-tools-icon ${tool.colorClass}`}>{tool.icon}</span>
                                {tool.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/blog" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Blog</Link>
            </div>

            <ThemeToggle />

            {desktopAuthBlock}
          </nav>
        )}

        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <span style={{
              fontSize: '0.7rem', fontWeight: '600', padding: '0.2rem 0.5rem',
              borderRadius: '999px',
              backgroundColor: !user && remainingUses <= 3 ? 'var(--color-red)' : 'var(--color-blue)',
              color: 'white',
              whiteSpace: 'nowrap',
              display: user ? 'none' : 'inline-block',
            }}>
              {remainingUses} left
            </span>
            <ThemeToggle style={{ width: '34px', height: '34px' }} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.4rem',
                color: 'var(--color-text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.25rem',
              }}
            >
              {isOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        )}
      </div>

      {isMobile && isOpen && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          backgroundColor: 'var(--color-white)',
        }}>
          <Link
            to="/"
            style={{ ...navLinkStyle, padding: '0.6rem 0' }}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>

          {toolCategories.map((category) => (
            <div key={category.id} style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.25rem', marginTop: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setMobileCategoryOpen((c) => (c === category.id ? null : category.id))}
                aria-expanded={mobileCategoryOpen === category.id}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'none',
                  border: 'none',
                  padding: '0.6rem 0',
                  fontFamily: 'Outfit, sans-serif',
                  fontWeight: '600',
                  fontSize: '1rem',
                  color: 'var(--color-text-main)',
                  cursor: 'pointer',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span className={`nav-tools-icon ${category.colorClass}`}>{category.icon}</span>
                  {category.label}
                </span>
                <FiChevronDown style={{
                  transform: mobileCategoryOpen === category.id ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s',
                  color: 'var(--color-text-muted)',
                }} />
              </button>

              {mobileCategoryOpen === category.id && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', paddingLeft: '0.5rem', paddingBottom: '0.5rem' }}>
                  {category.tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.5rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        color: 'var(--color-text-main)',
                        fontSize: '0.92rem',
                      }}
                    >
                      <span className={`nav-tools-icon ${tool.colorClass}`} style={{ width: '26px', height: '26px', fontSize: '0.85rem' }}>{tool.icon}</span>
                      {tool.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link
            to="/blog"
            style={{ ...navLinkStyle, padding: '0.6rem 0', borderTop: '1px solid var(--color-border)', marginTop: '0.25rem' }}
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', marginTop: '0.25rem' }}>
            {authBlock}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;