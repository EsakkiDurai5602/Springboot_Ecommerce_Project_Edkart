import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/bankingServices';
import { Card, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier) {
      setError('Please provide your registered email or Customer ID.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.forgotPassword(identifier);
      setIsSuccess(true);
    } catch (err) {
      setError(err.message || 'Recovery request failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <Card variant="elevated">
        <CardBody className="p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recover Password</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              We'll send password reset instructions to your registered contact channel
            </p>
          </div>

          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Recovery Instructions Dispatched
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                A secure reset token has been delivered to your email/phone. Please follow the instructions to set a new password.
              </p>
              <Link to="/reset-password">
                <Button variant="primary" fullWidth className="mt-4">
                  Proceed to Reset Password
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email or Customer ID"
                type="text"
                placeholder="durai@edkart.com or EDK-990142"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />

              <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
                Send Recovery Link
              </Button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
