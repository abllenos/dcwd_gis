
import React from 'react';

const Header: React.FC = () => {
  const handleProfileClick = () => {
    alert('Profile clicked!');
    // Later: navigate to profile or show dropdown
  };

  return (
    <header style={styles.header}>
      <div style={styles.title}>System Title</div>
      <div style={styles.profileWrapper} onClick={handleProfileClick}>
        <img
          src="/dcwd.jpg"
          alt="Profile"
          style={styles.profileImage}
        />
      </div>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    width: '100%',
    height: '60px',
    backgroundColor: '#113983ff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
  },
  profileWrapper: {
    cursor: 'pointer',
  },
  profileImage: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
};

export default Header;
