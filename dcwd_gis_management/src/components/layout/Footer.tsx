import React from 'react';
import '../../styles/Footer.css';

const Footer: React.FC = () => {
  const getCurrentYear = () => {
    return new Date().getFullYear();
  };

  return (
    <div className="footer-container">
      Copyright © DCWD GIS Management System {getCurrentYear()}
    </div>
  );
};

export default Footer;