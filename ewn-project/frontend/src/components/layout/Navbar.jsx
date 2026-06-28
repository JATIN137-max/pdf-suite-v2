import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const MOBILE_BREAKPOINT = 768;

const Navbar = () => {
  const { user, remainingUses, setShowLoginModal, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= MOBILE_BREAKPOINT : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
            gap: '0.5rem',
            cursor: 'pointer',
            minWidth: 0,
            paddingLeft: isMobile ? '44px' : 0,
            flexShrink: 0,
          }}
        >
          <div style={{ backgroundColor: 'var(--color-blue)', color: 'white', fontWeight: '800', fontSize: isMobile ? '1.15rem' : '1.5rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-md)', flexShrink: 0 }}>
            EWN
          </div>
          {!isMobile && (
            <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
              Everything What's Needed
            </span>
          )}
        </a>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link to="/" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Home</Link>
            <Link to="/merge-pdf" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Merge PDF</Link>
            <Link to="/edit-pdf" style={navLinkStyle} onMouseOver={linkHover} onMouseOut={linkOut}>Edit PDF</Link>
            {authBlock}
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

      {/* Mobile dropdown panel */}
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
          <div style={{ paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            {authBlock}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

