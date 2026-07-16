/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Inicializar estado de forma síncrona para evitar múltiples renders en el useEffect
const getInitialState = () => {
  const savedToken = localStorage.getItem('auth_token');
  const savedUser = localStorage.getItem('auth_user');
  if (savedToken && savedUser) {
    // Configurar cabeceras iniciales de Axios
    api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    return {
      isAuthenticated: true,
      token: savedToken,
      user: JSON.parse(savedUser) as User,
    };
  }
  return {
    isAuthenticated: false,
    token: null,
    user: null,
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(getInitialState);
  // Al inicializar el estado síncronamente, no ocupamos un useEffect para setIsLoading(false).
  // Iniciamos directamente en false si recupera los datos o si está vacío.
  const [isLoading] = useState<boolean>(false);

  const logout = React.useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    delete api.defaults.headers.common['Authorization'];
  }, []);

  // Interceptor para redirección en caso de 401 (Sesión expirada o inválida)
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  const login = async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (email === 'admin@aeisc.org' && password === '12345678') {
      const mockToken = 'mock-jwt-token-xyz-12345';
      const mockUser = { email, role: 'staff' };

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      setState({
        isAuthenticated: true,
        token: mockToken,
        user: mockUser,
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      return true;
    }

    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
