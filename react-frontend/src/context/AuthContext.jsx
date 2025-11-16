import { createContext, useState, useContext, useEffect } from 'react';
import api, { getCsrfToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in by fetching user data
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const savedUser = sessionStorage.getItem('user');
      if (savedUser) {
        // Verify session is still valid
        const response = await api.get('/me');
        setUser(response.data);
        sessionStorage.setItem('user', JSON.stringify(response.data));
      }
    } catch (error) {
      // Session expired or invalid
      sessionStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // Get CSRF token first
    await getCsrfToken();
    
    const response = await api.post('/login', { email, password });
    const { user } = response.data;
    
    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return user;
  };

  const register = async (name, email, password, password_confirmation, role, security_question_1, security_answer_1, security_question_2, security_answer_2) => {
    // Get CSRF token first
    await getCsrfToken();
    
    const response = await api.post('/register', {
      name,
      email,
      password,
      password_confirmation,
      role,
      security_question_1,
      security_answer_1,
      security_question_2,
      security_answer_2,
    });
    const { user } = response.data;
    
    sessionStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    sessionStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const switchRole = async (role) => {
    const response = await api.post('/switch-role', { role });
    updateUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
