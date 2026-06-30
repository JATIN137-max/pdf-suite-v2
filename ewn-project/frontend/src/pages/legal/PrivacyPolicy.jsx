import React from 'react';
import SEO from '../../components/SEO';

// TODO: replace with your real support email before going live
const SUPPORT_EMAIL = 'support@yourdomain.com';
const LAST_UPDATED = 'June 30, 2026';

const h2Style = { fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' };
const h3Style = { fontSize: '1.15rem', marginTop: '1.75rem', marginBottom: '0.75rem' };
const pStyle = { marginBottom: '1.25rem', lineHeight: 1.75, color: 'var(--color-text-main)' };
const ulStyle = { marginBottom: '1.25rem', paddingLeft: '1.5rem', lineHeight: 1.75 };
const liStyle = { marginBottom: '0.5rem' };
const noteStyle = {
  backgroundColor: 'var(--color-blue-light)',
  border: '1px solid var(--color-blue)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem 1.25rem',
  marginBottom: '1.5rem',
  fontSize: '0.92rem',
  color: 'var(--color-text-main)',
};

const PrivacyPolicy = () => {
  return (
    <div className="animate-slide-up" style={{ maxWidth: '760px', margin: '0 auto', paddingTop: '1rem' }}>
      <SEO
        title="Privacy Policy | EWN"
        description="How EWN collects, uses, and protects your information and uploaded files."
        path="/privacy"
      />

      <div className="page-header">
        <h1 className="page-title">Privacy Policy</h1>
        <p className="page-subtitle">Last updated: {LAST_UPDATED}</p>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '1.02rem' }}>
        <p style={pStyle}>
          This Privacy Policy explains what information EWN ("we," "us," or "our")
          collects when you use our website and tools, how we use it, and the choices
          you have. By using the Service, you agree to the practices described here.
        </p>

        <h2 style={h2Style}>1. Information We Collect</h2>

        <h3 style={h3Style}>Account Information</h3>
        <p style={pStyle}>
          If you create an account, we collect your email address and a securely
          hashed version of your password. We never store your password in plain
          text.
        </p>

        <h3 style={h3Style}>Files You Upload</h3>
        <p style={pStyle}>
          When you use a tool like merge, compress, or convert, we process the file
          you upload in order to perform the requested action. Uploaded files are
          used only to generate your result and are not reviewed by our team or used
          for any purpose beyond completing your request.
        </p>

        <h3 style={h3Style}>Usage and Technical Data</h3>
        <p style={pStyle}>
          We automatically collect basic technical information, such as your browser
          type, general device information, and pages visited, through analytics
          tools, to help us understand how the Service is used and to improve
          performance and reliability.
        </p>

        <h2 style={h2Style}>2. How We Use Your Information</h2>
        <ul style={ulStyle}>
          <li style={liStyle}>To provide, operate, and maintain the Service.</li>
          <li style={liStyle}>To process the files you upload and deliver your requested result.</li>
          <li style={liStyle}>To manage your account, including free-usage limits and any upgrades.</li>
          <li style={liStyle}>To respond to support requests sent to us directly.</li>
          <li style={liStyle}>To monitor, analyze, and improve the performance and security of the Service.</li>
        </ul>

        <h2 style={h2Style}>3. File Retention</h2>
        <div style={noteStyle}>
          Note for the site owner: confirm this section accurately reflects how long
          files actually persist on your servers before publishing, this text assumes
          short-lived, processing-only storage.
        </div>
        <p style={pStyle}>
          Files you upload are processed to generate your result and are not kept
          longer than necessary to complete that process. We don't use your uploaded
          files to train any AI model, and we don't sell or share file contents with
          third parties.
        </p>

        <h2 style={h2Style}>4. Cookies and Analytics</h2>
        <p style={pStyle}>
          We use cookies and similar technologies to keep you logged in, remember
          your preferences, and understand aggregate usage patterns through analytics
          tools. You can control cookies through your browser settings, though
          disabling them may affect parts of the Service, like staying logged in.
        </p>

        <h2 style={h2Style}>5. Advertising</h2>
        <p style={pStyle}>
          The Service may display advertisements. Ad providers may use cookies or
          similar technologies to deliver relevant ads. We don't share your uploaded
          file contents with advertisers.
        </p>

        <h2 style={h2Style}>6. Third-Party Service Providers</h2>
        <p style={pStyle}>
          We rely on trusted third-party infrastructure providers to operate the
          Service, including hosting and database providers for our website,
          backend, and account data. These providers process data on our behalf and
          are bound by their own security and privacy commitments.
        </p>

        <h2 style={h2Style}>7. Data Security</h2>
        <p style={pStyle}>
          We use reasonable technical and organizational measures, including
          encrypted connections and password hashing, to protect your information.
          No method of transmission or storage is completely secure, so we can't
          guarantee absolute security, but we work to keep your data protected.
        </p>

        <h2 style={h2Style}>8. Children's Privacy</h2>
        <p style={pStyle}>
          The Service is not directed at children, and we don't knowingly collect
          personal information from children under 13 (or the relevant age of
          digital consent in your region). If you believe a child has provided us
          with personal information, please contact us so we can remove it.
        </p>

        <h2 style={h2Style}>9. Your Rights and Choices</h2>
        <p style={pStyle}>
          You can request access to, correction of, or deletion of your account
          information at any time by emailing us. If you'd like your account and
          associated data removed entirely, let us know and we'll process that
          request within a reasonable timeframe.
        </p>

        <h2 style={h2Style}>10. Changes to This Policy</h2>
        <p style={pStyle}>
          We may update this Privacy Policy from time to time. If we make material
          changes, we'll update the "Last updated" date above. We encourage you to
          review this page periodically.
        </p>

        <h2 style={h2Style}>11. Contact Us</h2>
        <p style={pStyle}>
          Questions about this Privacy Policy or how we handle your data? Reach us
          at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--color-blue)' }}>
            {SUPPORT_EMAIL}
          </a>{' '}
          or visit our <a href="/contact" style={{ color: 'var(--color-blue)' }}>Contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
