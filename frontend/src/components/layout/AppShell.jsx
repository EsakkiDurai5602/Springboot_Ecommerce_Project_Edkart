import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { Drawer } from '../ui/Drawer';
import { NAV_LINKS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  SendHorizontal,
  Users,
  CreditCard,
  ShieldCheck,
  Banknote,
  Sparkles,
  FileText,
  Lock,
  Headphones,
  Settings,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const iconMap = {
  LayoutDashboard,
  Wallet,
  Receipt,
  SendHorizontal,
  Users,
  CreditCard,
  ShieldCheck,
  Banknote,
  Sparkles,
  FileText,
  Lock,
  Headphones,
  Settings,
};

export const AppShell = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { sessionTimeout, setSessionTimeout, logout } = useAuth();
  const navigate = useNavigate();

  const handleSessionRelogin = () => {
    setSessionTimeout(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <Topbar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav onOpenMore={() => setIsDrawerOpen(true)} />

      {/* Mobile 'More' Drawer Menu */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="All Banking Services"
      >
        <div className="space-y-1">
          {NAV_LINKS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsDrawerOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Icon className="w-5 h-5 text-brand-600 dark:text-cyan-400" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setIsDrawerOpen(false);
                logout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out of NetBanking</span>
            </button>
          </div>
        </div>
      </Drawer>

      {/* Session Timeout / Expired Dialog */}
      <Modal
        isOpen={sessionTimeout}
        onClose={handleSessionRelogin}
        maxWidth="max-w-md"
        showClose={false}
      >
        <div className="text-center p-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-600 mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Banking Session Expired
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
            For your digital safety, banking sessions automatically disconnect after inactivity or token expiration. Please sign in again.
          </p>
          <Button onClick={handleSessionRelogin} fullWidth variant="primary">
            Sign In Again
          </Button>
        </div>
      </Modal>
    </div>
  );
};
