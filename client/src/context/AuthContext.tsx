import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, api } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  pan: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, pan: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuthToken = (token: string | null) => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setAuthToken(storedToken);
        setToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    const { user, token } = response.data;
    localStorage.setItem('token', token); // Store token
    localStorage.setItem('user', JSON.stringify(user)); // Store user data
    setAuthToken(token);
    setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string, pan: string) => {
    const response = await authAPI.register(name, email, password, pan);
    const { user, token } = response.data;
    localStorage.setItem('token', token); // Store token
    localStorage.setItem('user', JSON.stringify(user)); // Store user data
    setAuthToken(token);
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user data
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
