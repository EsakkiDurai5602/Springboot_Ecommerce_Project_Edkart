import React from 'react';
import { Wrench, ShieldCheck } from 'lucide-react';
import { BANK_CONFIG } from '../../utils/constants';

export const MaintenancePage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg">
        <Wrench className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 dark:text-white">Scheduled System Maintenance</h2>
      <p className="text-sm text-slate-500 max-w-md">
        We are currently deploying core infrastructure upgrades to enhance NetBanking security and performance.
      </p>
      <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
        Expected Resumption: Sunday 04:00 AM IST
      </div>
      <p className="text-xs text-slate-400">
        For critical card blocks or urgent assistance, call {BANK_CONFIG.SUPPORT_PHONE}.
      </p>
    </div>
  );
};
