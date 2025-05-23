import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { User, AuthState } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isAdmin: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ sub: string; role: string }>(token);
        const user = {
          id: 1, // This will be replaced with actual id from backend
          username: decoded.sub,
          email: '', // This will be replaced with actual email from backend
          role: decoded.role as 'USER' | 'ADMIN',
        };
        
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'ADMIN',
        });
        
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // This would be an actual API call in a real application
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode<{ sub: string; role: string }>(token);
      const user: User = {
        id: 1, // This will be replaced with actual id from backend
        username: decoded.sub,
        email: '', // This will be replaced with actual email from backend
        role: decoded.role as 'USER' | 'ADMIN',
      };
      
      setAuthState({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === 'ADMIN',
      });
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // This would be an actual API call in a real application
      await api.post('/auth/register', { username, email, password });
      // After successful registration, log the user in
      await login(username, password);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};