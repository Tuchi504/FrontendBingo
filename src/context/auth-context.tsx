/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  username: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

interface LoginResponse {
  username: string;
  access_token: string;
  refresh_token: string;
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

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<LoginResponse>('/auth/login/', {
        username: emailOrUsername.trim(),
        password,
      });

      const { access_token, username } = response.data;
      const loggedUser = { username };

      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(loggedUser));

      setState({
        isAuthenticated: true,
        token: access_token,
        user: loggedUser,
      });

      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      return true;
    } catch (err) {
      console.error('Error de login en API:', err);
      return false;
    }
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
