import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../../services/bankingServices';
import { Card, CardBody } from '../../components/ui/Card';
import { OtpInput } from '../../components/ui/OtpInput';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { ShieldAlert, RefreshCw, ArrowLeft } from 'lucide-react';

export const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.destination || '/dashboard';

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await authService.verifyOtp(otp);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setTimer(45);
    setCanResend(false);
    setError(null);
    setOtp('');
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-8">
      <Card variant="elevated">
        <CardBody className="p-8 space-y-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Two-Factor Verification</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter the 6-digit OTP code sent to your registered phone & email
            </p>
          </div>

          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          <div className="py-2">
            <OtpInput value={otp} onChange={setOtp} onComplete={() => handleVerify()} />
          </div>

          <div className="text-xs text-slate-500">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-brand-600 dark:text-cyan-400 font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resend OTP Code</span>
              </button>
            ) : (
              <span>Resend code in <strong className="text-slate-700 dark:text-slate-200">{timer}s</strong></span>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            onClick={handleVerify}
          >
            Authorize & Continue
          </Button>

          <div className="pt-2">
            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
