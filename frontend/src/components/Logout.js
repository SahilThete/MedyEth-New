import React, { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { useNavigate } from 'react-router-dom'; 
import './css/Logout.css'; // Import the CSS file for styling

const Logout = () => {
  const { setToken } = useContext(AuthContext); 
  const navigate = useNavigate();

  useEffect(() => {
    
    setToken(null);
    
    // Remove the token from local storage
    localStorage.removeItem('token');
    localStorage.removeItem('blockchainAddress');
    
    setTimeout(() => navigate('/home'), 1000); // Navigate after 1 second
  }, [navigate, setToken]); 

  return (
    <div className="logout-container">
      <div className="logout-message">Logging out...</div>
    </div>
  );
};

export default Logout;