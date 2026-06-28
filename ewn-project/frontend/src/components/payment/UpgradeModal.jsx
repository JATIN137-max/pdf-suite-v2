import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiX, FiCheckCircle } from 'react-icons/fi';

const UpgradeModal = () => {
  const { showUpgradeModal, setShowUpgradeModal, upgrade } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!showUpgradeModal) return null;

  const handlePayment = async () => {
    setLoading(true);
    // Simulate payment gateway delay (e.g. Stripe / Razorpay)
    setTimeout(async () => {
      await upgrade();
      setLoading(false);
      setShowUpgradeModal(false);
      alert('Payment Successful! You are now a Premium user.');
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="card animate-slide-up" style={{ width: '100%', maxWidth: '450px', position: 'relative' }}>
        <button onClick={() => setShowUpgradeModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
          <FiX />
        </button>
        
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'var(--color-green-light)', color: 'var(--color-green)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>
            👑
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--color-text-main)' }}>Upgrade to Premium</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Unlock unlimited PDF processing.</p>
        </div>
        
        <div style={{ backgroundColor: 'var(--color-bg-light)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontWeight: '600' }}>Unlimited Monthly</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-blue)' }}>₹100<span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: '400' }}>/mo</span></span>
          </div>
          
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FiCheckCircle color="var(--color-green)" /> Unlimited tool usage</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FiCheckCircle color="var(--color-green)" /> Ad-free experience</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FiCheckCircle color="var(--color-green)" /> Priority processing speed</li>
          </ul>
        </div>
        
        <button onClick={handlePayment} className="btn btn-primary" style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }} disabled={loading}>
          {loading ? 'Processing Payment...' : 'Pay with Razorpay / Stripe'}
        </button>
        
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
          This is a simulated payment gateway. No real charges will be made.
        </p>
      </div>
    </div>
  );
};

export default UpgradeModal;
