import React from 'react';
import SEO from '../../components/SEO';

// TODO: replace with your real support email before going live
const SUPPORT_EMAIL = 'support@yourdomain.com';
const LAST_UPDATED = 'June 30, 2026';

const h2Style = { fontSize: '1.4rem', marginTop: '2.5rem', marginBottom: '1rem' };
const pStyle = { marginBottom: '1.25rem', lineHeight: 1.75, color: 'var(--color-text-main)' };
const ulStyle = { marginBottom: '1.25rem', paddingLeft: '1.5rem', lineHeight: 1.75 };
const liStyle = { marginBottom: '0.5rem' };

const TermsOfService = () => {
  return (
    <div className="animate-slide-up" style={{ maxWidth: '760px', margin: '0 auto', paddingTop: '1rem' }}>
      <SEO
        title="Terms of Service | EWN"
        description="The terms and conditions governing your use of EWN's PDF tools and blog."
        path="/terms"
      />

      <div className="page-header">
        <h1 className="page-title">Terms of Service</h1>
        <p className="page-subtitle">Last updated: {LAST_UPDATED}</p>
      </div>

      <div style={{ marginTop: '1.5rem', fontSize: '1.02rem' }}>
        <p style={pStyle}>
          These Terms of Service ("Terms") govern your access to and use of EWN
          ("we," "us," or "our"), including our website, PDF tools, and blog
          (collectively, the "Service"). By using the Service, you agree to these
          Terms. If you don't agree, please don't use the Service.
        </p>

        <h2 style={h2Style}>1. Description of Service</h2>
        <p style={pStyle}>
          EWN provides browser-based tools for working with PDF and document files,
          including merging, compressing, converting, and editing, along with related
          informational content on our blog. Some features may require an account or
          be limited by a free-usage allowance, with additional usage available through
          an upgraded plan where offered.
        </p>

        <h2 style={h2Style}>2. Your Account</h2>
        <p style={pStyle}>
          If you create an account, you're responsible for keeping your login
          credentials secure and for all activity that happens under your account.
          Let us know right away if you suspect unauthorized access. You're
          responsible for providing accurate information when registering.
        </p>

        <h2 style={h2Style}>3. Acceptable Use</h2>
        <p style={pStyle}>You agree not to use the Service to:</p>
        <ul style={ulStyle}>
          <li style={liStyle}>Upload, process, or distribute content that is illegal, infringing, or that you don't have the rights to use.</li>
          <li style={liStyle}>Attempt to disrupt, overload, or gain unauthorized access to our systems or other users' accounts.</li>
          <li style={liStyle}>Use automated scripts or bots to bypass usage limits or scrape the Service at scale without our written permission.</li>
          <li style={liStyle}>Use the Service to generate, process, or distribute malicious software, fraudulent documents, or content intended to deceive or harm others.</li>
        </ul>
        <p style={pStyle}>
          We reserve the right to suspend or terminate access for accounts that
          violate these terms.
        </p>

        <h2 style={h2Style}>4. Your Files and Content</h2>
        <p style={pStyle}>
          You retain all ownership rights to the files you upload or create using the
          Service. We don't claim ownership over your content. You're solely
          responsible for ensuring you have the legal right to upload and process any
          file you submit. For details on how uploaded files are handled and stored,
          see our <a href="/privacy" style={{ color: 'var(--color-blue)' }}>Privacy Policy</a>.
        </p>

        <h2 style={h2Style}>5. Intellectual Property</h2>
        <p style={pStyle}>
          The EWN name, logo, website design, and underlying software are our
          property or that of our licensors, and are protected by applicable
          intellectual property laws. You may not copy, modify, or redistribute our
          software or branding without permission.
        </p>

        <h2 style={h2Style}>6. Third-Party Services and Advertising</h2>
        <p style={pStyle}>
          The Service may display advertisements or link to third-party websites and
          services. We don't control and aren't responsible for the content, policies,
          or practices of any third party. Interactions with advertisers or linked
          sites are solely between you and that third party.
        </p>

        <h2 style={h2Style}>7. Disclaimer of Warranties</h2>
        <p style={pStyle}>
          The Service is provided "as is" and "as available," without warranties of
          any kind, whether express or implied. We don't guarantee the Service will
          be uninterrupted, error-free, or that any file processed through it will be
          free of loss or corruption. We recommend keeping your own backup of any
          important file before processing it.
        </p>

        <h2 style={h2Style}>8. Limitation of Liability</h2>
        <p style={pStyle}>
          To the fullest extent permitted by law, EWN and its team won't be liable for
          any indirect, incidental, special, or consequential damages, including loss
          of data, revenue, or business opportunities, arising from your use of the
          Service.
        </p>

        <h2 style={h2Style}>9. Termination</h2>
        <p style={pStyle}>
          You may stop using the Service or delete your account at any time. We may
          suspend or terminate access to the Service, with or without notice, for
          conduct that violates these Terms or that we believe is harmful to other
          users or to the Service itself.
        </p>

        <h2 style={h2Style}>10. Changes to These Terms</h2>
        <p style={pStyle}>
          We may update these Terms from time to time. If we make material changes,
          we'll update the "Last updated" date above. Continued use of the Service
          after changes take effect means you accept the revised Terms.
        </p>

        <h2 style={h2Style}>11. Governing Law</h2>
        <p style={pStyle}>
          These Terms are governed by the laws of India, without regard to conflict
          of law principles, unless otherwise required by the laws applicable to your
          location.
        </p>

        <h2 style={h2Style}>12. Contact</h2>
        <p style={pStyle}>
          Questions about these Terms? Reach us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: 'var(--color-blue)' }}>
            {SUPPORT_EMAIL}
          </a>{' '}
          or visit our <a href="/contact" style={{ color: 'var(--color-blue)' }}>Contact page</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
