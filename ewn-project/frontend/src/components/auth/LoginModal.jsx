import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiX } from 'react-icons/fi';

const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const action = isLogin ? login : register;
    const res = await action(email, password);
    
    if (res.success) {
      setShowLoginModal(false);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '400px', position: 'relative' }}>
        <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
          <FiX />
        </button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--color-blue)' }}>
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          You've used all 10 free attempts. {isLogin ? 'Log in' : 'Sign up'} for <strong>free unlimited access</strong> to all EWN tools.
        </p>

        {error && <div style={{ backgroundColor: 'var(--color-red-light)', color: 'var(--color-red)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="you@example.com" />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="••••••••" />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }} disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontWeight: '600', cursor: 'pointer' }}>
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
