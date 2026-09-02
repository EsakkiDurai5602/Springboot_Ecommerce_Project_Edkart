import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminRoute = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-950 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 animate-bounce flex items-center justify-center text-slate-950 font-black text-lg">
          ADM
        </div>
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Verifying administrative authorization...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};
