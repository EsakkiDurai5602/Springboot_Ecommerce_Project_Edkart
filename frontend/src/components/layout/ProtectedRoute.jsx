import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from '../ui/Skeleton';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 animate-bounce flex items-center justify-center text-white font-bold text-lg shadow-fintech-glow">
          EdK
        </div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Authenticating secure banking session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
