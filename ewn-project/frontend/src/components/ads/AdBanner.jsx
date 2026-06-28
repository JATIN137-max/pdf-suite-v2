
import React from 'react';
 
const AdBanner = ({ position = 'default', width = '728px', height = '90px' }) => {
  // In a real app, this would fetch the ad configuration from our MERN backend.
  // Rendered as a plain CSS placeholder (no external image request) until
  // real ad creative/markup is wired up - avoids an unoptimized network
  // image hurting LCP/CLS, while still reserving the correct layout space.
  return (
    <div
      className="ad-container animate-fade-in"
      style={{
        width,
        height,
        maxWidth: '100%',
        margin: '2rem auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
        color: 'var(--color-text-muted)',
        fontSize: '0.8rem',
      }}
      aria-label={`Advertisement space - ${position}`}
    >
      Ad space
    </div>
  );
};
 
export default AdBanner;
 
