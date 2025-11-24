import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Inicializar diretamente do localStorage para evitar flash
    return !!localStorage.getItem('auth_token');
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se existe token salvo no localStorage
    const token = localStorage.getItem('auth_token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): boolean => {
    // Mock authentication - aceita qualquer email com senha "admin123"
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('auth_email', email);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_email');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
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
