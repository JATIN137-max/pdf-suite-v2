import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-white)', borderTop: '1px solid var(--color-border)', padding: '3rem 0', marginTop: 'auto' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-blue)', color: 'white', fontWeight: '800', fontSize: '1.25rem', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
            EWN
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>Everything What's Needed</span>
        </div>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '500px' }}>
          The ultimate suite of tools for all your daily needs. Fast, secure, and right in your browser.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
          <Link to="/" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>Contact</Link>
        </div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '2rem' }}>
          &copy; {new Date().getFullYear()} EWN. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
