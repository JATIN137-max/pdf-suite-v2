import React from 'react';
import SEO from '../../components/SEO';
import { FiMail, FiClock, FiHelpCircle } from 'react-icons/fi';

// TODO: replace with your real support email before going live
const SUPPORT_EMAIL = 'support@yourdomain.com';

const cardStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '1rem',
  padding: '1.5rem',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  marginBottom: '1.25rem',
};

const iconWrapStyle = {
  flexShrink: 0,
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'var(--color-blue-light)',
  color: 'var(--color-blue)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
};

const Contact = () => {
  return (
    <div className="animate-slide-up" style={{ maxWidth: '760px', margin: '0 auto', paddingTop: '1rem' }}>
      <SEO
        title="Contact Us | EWN"
        description="Get in touch with the EWN team for support, feedback, or business inquiries."
        path="/contact"
      />

      <div className="page-header">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">
          Questions, bug reports, or feedback, we'd genuinely like to hear it.
        </p>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={cardStyle}>
          <div style={iconWrapStyle}><FiMail /></div>
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Email Support</h2>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
              The fastest way to reach us. We read every message.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              style={{ color: 'var(--color-blue)', fontWeight: '600', textDecoration: 'none' }}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconWrapStyle}><FiClock /></div>
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Response Time</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              We typically reply within 1-2 business days. For account or billing issues,
              please include the email address associated with your account so we can look
              into it quickly.
            </p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={iconWrapStyle}><FiHelpCircle /></div>
          <div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Before You Email Us</h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              If your question is about how we handle your files or personal data, our{' '}
              <a href="/privacy" style={{ color: 'var(--color-blue)' }}>Privacy Policy</a>{' '}
              may already have your answer. For questions about acceptable use of the
              site, check our{' '}
              <a href="/terms" style={{ color: 'var(--color-blue)' }}>Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
