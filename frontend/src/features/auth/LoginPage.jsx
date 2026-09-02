import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card, CardBody } from '../../components/ui/Card';
import { Lock, Mail, ShieldCheck, KeyRound, Sparkles, ShieldAlert } from 'lucide-react';
import { DEMO_CREDENTIALS } from '../../utils/constants';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both your registered email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCustomerFill = () => {
    setEmail(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  const handleQuickAdminFill = () => {
    setEmail('admin@edkart.com');
    setPassword('Admin@123');
    setError(null);
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <Card variant="elevated" className="border-slate-200 dark:border-slate-800">
        <CardBody className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to NetBanking
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Enter your credentials to access accounts or administrative console
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Quick Demo Fill Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickCustomerFill}
              className="py-2 px-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdminFill}
              className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Console</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Registered Email / User ID"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Internet Banking Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<KeyRound className="w-4 h-4" />}
              required
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>Remember User ID</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-brand-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Secure Sign In
            </Button>
          </form>

          {/* Security Notice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Protected by 256-Bit SSL End-to-End Encryption</span>
          </div>
        </CardBody>
      </Card>

      {/* Registration link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
        Not registered for NetBanking yet?{' '}
        <Link to="/register" className="text-brand-600 dark:text-cyan-400 font-bold hover:underline">
          Register Digital Account
        </Link>
      </p>
    </div>
  );
};
