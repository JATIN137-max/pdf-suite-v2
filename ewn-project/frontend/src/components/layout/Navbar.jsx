import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, remainingUses, setShowLoginModal, logout } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header style={{ backgroundColor: 'var(--color-white)', borderBottom: '1px solid var(--color-border)', position: 'sticky', top: 0, zIndex: 50, boxShadow: 'var(--shadow-sm)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <div style={{ backgroundColor: 'var(--color-blue)', color: 'white', fontWeight: '800', fontSize: '1.5rem', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-md)' }}>
            EWN
          </div>
          <span style={{ fontWeight: '700', fontSize: '1.25rem', color: 'var(--color-text-main)' }}>Everything What's Needed</span>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--color-blue)'} onMouseOut={e => e.target.style.color = 'var(--color-text-main)'}>Home</Link>
          <Link to="/merge-pdf" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--color-blue)'} onMouseOut={e => e.target.style.color = 'var(--color-text-main)'}>Merge PDF</Link>
          <Link to="/edit-pdf" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: '500', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = 'var(--color-blue)'} onMouseOut={e => e.target.style.color = 'var(--color-text-main)'}>Edit PDF</Link>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Hi, <strong style={{ color: 'var(--color-blue)' }}>{user.email.split('@')[0]}</strong>
              </span>
              <button onClick={logout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Badge turns red when running low */}
              <span style={{
                fontSize: '0.8rem', fontWeight: '600', padding: '0.25rem 0.65rem',
                borderRadius: '999px',
                backgroundColor: remainingUses <= 3 ? 'var(--color-red)' : 'var(--color-blue)',
                color: 'white',
                transition: 'background-color 0.3s'
              }}>
                {remainingUses} free {remainingUses === 1 ? 'use' : 'uses'} left
              </span>
              <button className="btn btn-primary" onClick={() => setShowLoginModal(true)} style={{ padding: '0.5rem 1rem' }}>Login</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
