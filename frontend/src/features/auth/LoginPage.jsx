import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card, CardBody } from '../../components/ui/Card';
import { ShoppingBag, Lock, Mail, KeyRound, Sparkles, ShieldCheck, ShieldAlert } from 'lucide-react';
import { DEMO_USERS } from '../../utils/constants';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter your registered email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login(email, password);
      if (res.user?.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickCustomer = () => {
    setEmail(DEMO_USERS.customer.email);
    setPassword(DEMO_USERS.customer.password);
    setError(null);
  };

  const handleQuickAdmin = () => {
    setEmail(DEMO_USERS.admin.email);
    setPassword(DEMO_USERS.admin.password);
    setError(null);
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16">
      <Card variant="elevated">
        <CardBody className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Sign In to EdKart
            </h2>
            <p className="text-xs text-slate-500">
              Access your saved cart, orders, and personalized tech drops
            </p>
          </div>

          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          {/* Quick Demo Fill Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="py-2 px-3 rounded-xl bg-brand-50 dark:bg-slate-800 border border-brand-200 dark:border-slate-700 text-brand-700 dark:text-amber-400 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-brand-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-500" />
              <span>Customer Demo</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAdmin}
              className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Store Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@edkart.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<KeyRound className="w-4 h-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              className="mt-2"
            >
              Sign In to Account
            </Button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="text-brand-600 dark:text-amber-400 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
