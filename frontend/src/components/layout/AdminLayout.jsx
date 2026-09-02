import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Sun,
  Moon,
  LogOut,
  ArrowLeft,
  Menu,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Drawer } from '../../components/ui/Drawer';
import { Badge } from '../../components/ui/Badge';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { name: 'Store Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Product Inventory (CRUD)', path: '/admin/products', icon: Package },
    { name: 'Customer Orders', path: '/admin/orders', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 h-screen sticky top-0 flex-shrink-0 z-30 select-none">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-black shadow-lg">
              ADM
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block">EdKart Store Admin</span>
              <span className="text-[10px] uppercase font-semibold text-amber-400 tracking-wider">E-Commerce Console</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Store Management</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Store Admin'}</p>
              <p className="text-[10px] text-amber-400">ROLE_STORE_ADMIN</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Badge variant="warning" size="sm">
              STORE MANAGEMENT ACTIVE
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Store Operations Menu"
      >
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="w-5 h-5 text-amber-500" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </Drawer>
    </div>
  );
};
