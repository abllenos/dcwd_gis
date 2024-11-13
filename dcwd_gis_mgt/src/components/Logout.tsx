import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  useEffect(() => {
    logout(); 
  }, [logout]);

  return <div>Logging out...</div>;
};

export default Logout;
