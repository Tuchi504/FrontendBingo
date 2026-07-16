import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { MainLayout } from './main-layout';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0071ba] border-t-transparent"></div>
      </div>
    );
  }

  // Si está autenticado, renderiza el layout general con el Outlet interno.
  // Si no, redirige al Login.
  return isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />;
};
