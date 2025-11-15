import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../../axios.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => token ? jwtDecode(token) : null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get('/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user', error);
        setToken(null); // Invalid token
      }
    };

    if (token) {
      localStorage.setItem('token', token);
      setUser(jwtDecode(token));
      fetchUser();
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/login', { email, password });
      if (response.data.access_token) {
        setToken(response.data.access_token);
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error);
      // Here you would typically set an error state to show to the user
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await apiClient.post('/register', { name, email, password, role });
      if (response.data.access_token) {
        setToken(response.data.access_token);
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response && error.response.data) {
        // You can set an error state here to show validation messages to the user
        console.error('Validation errors:', error.response.data.errors);
      }
    }
  };

  const logout = () => {
    setToken(null);
    navigate('/login');
    apiClient.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).finally(() => {
      setToken(null);
      setUser(null);
      navigate('/login');
    });
  };

  const contextData = {
    user,
    token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export default AuthContext;
