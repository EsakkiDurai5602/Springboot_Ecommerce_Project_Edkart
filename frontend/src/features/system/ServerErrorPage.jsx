import React from 'react';
import { RefreshCw, ServerCrash } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ServerErrorPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-lg">
        <ServerCrash className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white">500 - Server Error</h2>
      <p className="text-sm text-slate-500 max-w-md">
        The core banking server encountered an unexpected situation. Our systems team is actively monitoring.
      </p>
      <Button
        onClick={() => window.location.reload()}
        variant="primary"
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Retry Connection
      </Button>
    </div>
  );
};
