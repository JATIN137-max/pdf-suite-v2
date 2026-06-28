import React from 'react';

const AdBanner = ({ position = 'default', width = '728px', height = '90px' }) => {
  // In a real app, this would fetch the ad configuration from our MERN backend
  return (
    <div className="ad-container animate-fade-in" style={{ width: width, maxWidth: '100%', margin: '2rem auto' }}>
      <a href="https://example.com/affiliate" target="_blank" rel="noopener noreferrer">
        <img 
          src={`https://via.placeholder.com/${width.replace('px','')}x${height.replace('px','')}.png?text=Ad+Space+-+${position}`} 
          alt="Advertisement" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </a>
    </div>
  );
};

export default AdBanner;
