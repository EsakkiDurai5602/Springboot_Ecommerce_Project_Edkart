import React from 'react';
import { NavLink } from 'react-router-dom';
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
  Building2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';

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

export const Sidebar = () => {
  const { logout, user } = useAuth();
  const { unreadNotifCount } = useBanking();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Accounts', path: '/accounts', icon: 'Wallet' },
    { name: 'Transactions', path: '/transactions', icon: 'Receipt' },
    { name: 'Transfer Funds', path: '/transfer', icon: 'SendHorizontal' },
    { name: 'Beneficiaries', path: '/beneficiaries', icon: 'Users' },
    { name: 'Bill Payments', path: '/bill-payments', icon: 'CreditCard' },
    { name: 'Cards Control', path: '/cards', icon: 'ShieldCheck' },
    { name: 'Loans & EMI', path: '/loans', icon: 'Banknote' },
    { name: 'Products Catalog', path: '/products', icon: 'Sparkles' },
    { name: 'e-Documents', path: '/documents', icon: 'FileText' },
    { name: 'Security Center', path: '/security', icon: 'Lock' },
    { name: 'Customer Support', path: '/support', icon: 'Headphones' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-fintech-navy text-slate-300 border-r border-slate-800/80 h-screen sticky top-0 flex-shrink-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-400 flex items-center justify-center shadow-fintech-glow text-white">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight block">EdKart Bank</span>
            <span className="text-[10px] uppercase font-semibold text-cyan-400 tracking-wider">Digital Premier</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Banking Menu</p>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </div>
            </NavLink>
          );
        })}
      </div>

      {/* User Card & Logout in Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-cyan-400 text-sm flex-shrink-0">
              {user?.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.fullName || 'Customer'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.customerId || 'Verified'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
