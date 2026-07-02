import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX, FiChevronDown, FiLayers, FiMinimize2, FiEdit3, FiImage, FiFileText } from 'react-icons/fi';

const MOBILE_BREAKPOINT = 768;

// Desktop-only "Tools" mega-menu contents. Merge PDF and Edit PDF now live
// here instead of as flat top-level links — reachable in one hover/click,
// same as before, just no longer eating horizontal nav space permanently.
const desktopTools = [
  { title: 'Merge PDF', path: '/merge-pdf', icon: <FiLayers />, colorClass: 'icon-blue' },
  { title: 'Compress PDF', path: '/compress-pdf', icon: <FiMinimize2 />, colorClass: 'icon-green' },
  { title: 'Edit PDF', path: '/edit-pdf', icon: <FiEdit3 />, colorClass: 'icon-red' },
  { title: 'PDF to JPG', path: '/pdf-to-image', icon: <FiImage />, colorClass: 'icon-blue' },
  { title: 'JPG to PDF', path: '/image-to-pdf', icon: <FiFileText />, colorClass: 'icon-green' },
  { title: 'Word to PDF', path: '/word-to-pdf', icon: <FiFileText />, colorClass: 'icon-blue' },
  { title: 'PDF to Word', path: '/pdf-to-word', icon: <FiFileText />, colorClass: 'icon-red' },
];

const Navbar = () => {
  const { user, remainingUses, setShowLoginModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Desktop-only: close the Tools mega-menu on outside click (covers
  // trackpad taps that don't fire mouseleave) and on Escape.
  useEffect(() => {
    if (!toolsOpen) return;
    const handleClick = (e) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
    };
    const handleKey = (e) => { if (e.key === 'Escape') setToolsOpen(false); };
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

  // Desktop-only auth treatment: mobile keeps the plain text+button pairing
  // above (authBlock), but that combination reads as crowded/misaligned at
  // desktop sizes, so desktop gets a single grouped "chip" instead — one
  // consistent-height pill instead of two mismatched elements sitting apart.
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
        style={{ backgroundColor: remainingUses <= 3 ? 'var(--color-red)' : 'var(--color-blue)' }}
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
        {/* Logo - left padding on mobile makes room for the sidebar's hamburger button */}
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

        {/* Desktop Nav — link cluster (Home/Tools/Blog) and the auth chip are
            grouped together and pushed to the right, right after the logo.
            No more space-between gap in the middle. Mobile is untouched. */}
        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '3rem', flex: 1, justifyContent: 'flex-end', marginLeft: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
              <Link to="/" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Home</Link>

              <div
                ref={toolsRef}
                style={{ position: 'relative' }}
                onMouseEnter={() => setToolsOpen(true)}
                onMouseLeave={() => setToolsOpen(false)}
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
                    {desktopTools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        className="nav-tools-item"
                        role="menuitem"
                        onClick={() => setToolsOpen(false)}
                      >
                        <span className={`nav-tools-icon ${tool.colorClass}`}>{tool.icon}</span>
                        {tool.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/blog" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Blog</Link>
            </div>

            {desktopAuthBlock}
          </nav>
        )}

        {/* Mobile: compact auth block + hamburger for nav links */}
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

      {/* Mobile dropdown panel — unchanged */}
      {isMobile && isOpen && (
        <div style={{
          borderTop: '1px solid var(--color-border)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          backgroundColor: 'var(--color-white)',
        }}>
          <Link to="/" style={navLinkStyle} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/merge-pdf" style={navLinkStyle} onClick={() => setIsOpen(false)}>Merge PDF</Link>
          <Link to="/edit-pdf" style={navLinkStyle} onClick={() => setIsOpen(false)}>Edit PDF</Link>
          <Link to="/blog" style={navLinkStyle} onClick={() => setIsOpen(false)}>Blog</Link>
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            {authBlock}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;