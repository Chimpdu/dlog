import React, { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Method to check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/users/auth', {
        credentials: 'include', // Necessary to include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch auth status');
      }
      const data = await response.json();
      /* test whether authentication is done */
      /* console.log(data.isAuthenticated); */
      setIsAuthenticated(data.isAuthenticated); // Update based on response
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
