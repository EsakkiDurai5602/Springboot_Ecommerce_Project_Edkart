import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Bell,
  Search,
  Sun,
  Moon,
  Shield,
  User,
  ChevronRight,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import { useTheme } from '../../context/ThemeContext';
import { formatDateTime } from '../../utils/formatters';

export const Topbar = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } = useBanking();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Breadcrumbs title from pathname
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path || path === 'dashboard') return 'Overview Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchOpen(false);
    navigate(`/transactions?search=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Breadcrumb / Path */}
      <div className="flex items-center space-x-2">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider hidden sm:inline">
          EdKart Online
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:inline" />
        <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Search button trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 text-xs transition-colors border border-slate-200 dark:border-slate-700"
          aria-label="Quick Search"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Search transactions, payees...</span>
          <kbd className="hidden md:inline px-1.5 py-0.5 text-[10px] rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 relative transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 animate-slide-up">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</span>
                  {unreadNotifCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                      {unreadNotifCount} new
                    </span>
                  )}
                </div>
                {unreadNotifCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-brand-600 dark:text-cyan-400 hover:underline font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 py-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${n.read ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'bg-brand-50/40 dark:bg-slate-800/80 font-medium'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{formatDateTime(n.timestamp)}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setIsNotifOpen(false)}
                  className="text-xs text-brand-600 dark:text-cyan-400 hover:underline font-semibold"
                >
                  View Notifications Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Trigger */}
        <Link
          to="/profile"
          className="flex items-center space-x-2 pl-2 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {user?.fullName ? user.fullName.charAt(0) : 'U'}
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 hidden md:inline">
            {user?.fullName?.split(' ')[0] || 'Account'}
          </span>
        </Link>
      </div>

      {/* Global Quick Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 animate-slide-up">
            <form onSubmit={handleSearch} className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search transactions, payees, loan IDs, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm focus:outline-none text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </form>

            <div className="pt-3 space-y-2">
              <p className="text-[10px] font-bold uppercase text-slate-400">Quick Suggestions</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {['Salary', 'Tata Power', 'Rahul Sharma', 'Apple Store', 'Mortgage'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/transactions?search=${encodeURIComponent(tag)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
