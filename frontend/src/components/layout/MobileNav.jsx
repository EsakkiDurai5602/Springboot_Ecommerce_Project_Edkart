import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  SendHorizontal,
  CreditCard,
  Menu,
} from 'lucide-react';

export const MobileNav = ({ onOpenMore }) => {
  const tabs = [
    { name: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Accounts', path: '/accounts', icon: Wallet },
    { name: 'Transfer', path: '/transfer', icon: SendHorizontal },
    { name: 'Cards', path: '/cards', icon: CreditCard },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold transition-colors
              ${isActive
                ? 'text-brand-600 dark:text-cyan-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }
            `}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{tab.name}</span>
          </NavLink>
        );
      })}

      <button
        onClick={onOpenMore}
        className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        aria-label="More banking options"
      >
        <Menu className="w-5 h-5 mb-0.5" />
        <span>More</span>
      </button>
    </nav>
  );
};
