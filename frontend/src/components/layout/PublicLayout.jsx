import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Building2, ShieldCheck, Lock, PhoneCall, HelpCircle } from 'lucide-react';
import { BANK_CONFIG } from '../../utils/constants';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Public Header */}
      <header className="sticky top-0 z-30 bg-fintech-navy text-white border-b border-slate-800/80 px-4 sm:px-8 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-fintech-glow text-white group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-tight">
                {BANK_CONFIG.BANK_SHORT}
              </span>
              <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">
                Internet Banking Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center space-x-3 sm:space-x-6 text-xs sm:text-sm">
            <div className="hidden md:flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>256-Bit SSL Secured</span>
            </div>

            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold transition-all shadow-md shadow-brand-600/30"
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="hidden sm:inline-flex px-4 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium transition-all"
            >
              Open Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1 flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-fintech-navyDark text-slate-400 text-xs border-t border-slate-800/60 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Official digital banking system for authenticated users. All transactions are logged and protected.</span>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/support" className="hover:text-slate-200">Security Guidelines</Link>
            <Link to="/support" className="hover:text-slate-200">Help & Support</Link>
            <span>{BANK_CONFIG.VERSION}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
