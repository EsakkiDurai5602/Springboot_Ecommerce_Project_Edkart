import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/bankingServices';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const ResetPasswordPage = () => {
  const [token, setToken] = useState('rst_token_demo_982');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Password strength calculation
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (strength < 3) {
      setError('Please choose a stronger password with uppercase, numbers, and symbols.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <Card variant="elevated">
        <CardBody className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create New Password</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Set a strong password for your online NetBanking account
            </p>
          </div>

          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Password Successfully Reset!
              </p>
              <p className="text-xs text-slate-500">
                You can now log in using your newly configured NetBanking password.
              </p>
              <Button onClick={() => navigate('/login')} variant="primary" fullWidth className="mt-4">
                Sign In Now
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                placeholder="Min. 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              {/* Strength Meter */}
              {newPassword && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>Password Strength:</span>
                    <span className="font-semibold">
                      {strength === 4 ? 'Very Strong' : strength === 3 ? 'Good' : strength === 2 ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 h-1.5">
                    {[1, 2, 3, 4].map((bar) => (
                      <div
                        key={bar}
                        className={`rounded-full ${
                          strength >= bar
                            ? strength >= 3
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                            : 'bg-slate-200 dark:bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />

              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                Update NetBanking Password
              </Button>
            </form>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
