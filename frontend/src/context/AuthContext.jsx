import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Set default auth headers for axios
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Retrieve stored user email
      const email = localStorage.getItem('email');
      const name = localStorage.getItem('name');
      setUser({ email, name });
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        email,
        password
      });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      // We can also extract name from email or set a generic name since registration saves it
      localStorage.setItem('name', email.split('@')[0]);
      
      setToken(token);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    try {
      await axios.post('http://localhost:8080/api/users/register', {
        name,
        email,
        password
      });
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const msg = error.response?.data?.message || 'Registration failed. Email might already exist.';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
