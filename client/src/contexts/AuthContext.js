import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Set default authorization header for all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // For now, we'll set a basic user object
      // In a real app, you might want to fetch user data from the server
      setUser({
        name: 'John Doe',
        role: 'Administrator',
        email: 'admin@example.com'
      });
    } else {
      // Clear any existing headers if no token
      delete axios.defaults.headers.common['Authorization'];
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', { 
        email, 
        password 
      });
      
      if (response.data.success && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(response.data.user);
        navigate('/');
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid credentials');
        return false;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      toast.error(errorMessage);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if available
      await axios.post('http://localhost:5000/api/admin/logout');
    } catch (error) {
      // Ignore errors on logout - we still want to clear local state
      console.log('Logout API call failed, but continuing with local logout');
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login');
      toast.success('Logged out successfully');
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 