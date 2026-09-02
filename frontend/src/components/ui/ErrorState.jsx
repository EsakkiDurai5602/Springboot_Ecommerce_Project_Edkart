import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({
  title = 'Failed to load information',
  message = 'We could not fetch data from the banking server. Please check your network and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 ${className}`}>
      <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mt-1 mb-5">
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="danger" leftIcon={<RefreshCw className="w-4 h-4" />}>
          Retry Connection
        </Button>
      )}
    </div>
  );
};
