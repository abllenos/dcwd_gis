import React from 'react';

const Footer: React.FC = () => {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      textAlign: 'center',
      padding: '12px 0',
      backgroundColor: 'white',
      borderTop: '1px solid #d9d9d9',
      color: '#8c8c8c',
      fontSize: '14px',
      zIndex: 500
    }}>
      Copyright © DCWD GIS Management System 2025
    </div>
  );
};

export default Footer;