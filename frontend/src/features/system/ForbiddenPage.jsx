import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ForbiddenPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-lg">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white">403 - Access Denied</h2>
      <p className="text-sm text-slate-500 max-w-md">
        You do not have the necessary security authorization to access this digital banking resource.
      </p>
      <Link to="/dashboard">
        <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
