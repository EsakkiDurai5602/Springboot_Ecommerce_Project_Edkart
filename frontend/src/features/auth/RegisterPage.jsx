import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Alert } from '../../components/ui/Alert';
import { Card, CardBody } from '../../components/ui/Card';
import { OtpInput } from '../../components/ui/OtpInput';
import { User, Mail, Phone, Lock, CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export const RegisterPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    panNumber: '',
    dob: '',
    password: '',
    confirmPassword: '',
    consent: false,
  });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError('Please fill in all personal details.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep2 = () => {
    if (!formData.panNumber || !formData.dob) {
      setError('Please provide your PAN and date of birth for identity verification.');
      return false;
    }
    setError(null);
    return true;
  };

  const validateStep3 = () => {
    if (otp.length !== 6) {
      setError('Please enter the 6-digit verification code sent to your phone/email.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters with a combination of uppercase, numbers, and symbols.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!formData.consent) {
      setError('You must accept the NetBanking terms and conditions to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto px-4 py-8">
      <Card variant="elevated">
        <CardBody className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Open Digital Banking Account
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete the paperless digital KYC verification in 4 quick steps
            </p>
          </div>

          {/* Stepper Indicator */}
          <div className="flex items-center justify-between px-2 pt-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step === s
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30 ring-4 ring-brand-500/20'
                      : step > s
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 4 && (
                  <div
                    className={`h-1 w-8 sm:w-14 mx-1 rounded ${
                      step > s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          {/* Step 1: Personal Details */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <Input
                label="Full Legal Name (as per Govt ID)"
                name="fullName"
                placeholder="e.g. Esakki Durai"
                value={formData.fullName}
                onChange={handleInputChange}
                leftIcon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Email Address"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                leftIcon={<Mail className="w-4 h-4" />}
                required
              />
              <Input
                label="Mobile Number"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                leftIcon={<Phone className="w-4 h-4" />}
                required
              />
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={() => validateStep1() && setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Continue to KYC Identity
              </Button>
            </div>
          )}

          {/* Step 2: KYC & Identifiers */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <Input
                label="PAN Card Number"
                name="panNumber"
                placeholder="ABCDE1234F"
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                required
              />
              <Input
                label="Date of Birth"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleInputChange}
                required
              />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => validateStep2() && setStep(3)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Send Verification OTP
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: OTP Verification */}
          {step === 3 && (
            <div className="space-y-6 text-center animate-fade-in">
              <p className="text-xs text-slate-500">
                Enter the 6-digit OTP code sent to <strong className="text-slate-800 dark:text-slate-200">{formData.phone || '+91 98765 43210'}</strong>
              </p>
              <OtpInput value={otp} onChange={setOtp} />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(2)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => validateStep3() && setStep(4)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Verify & Proceed
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Password & Terms */}
          {step === 4 && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
              <Input
                label="Create NetBanking Password"
                name="password"
                type="password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleInputChange}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                leftIcon={<Lock className="w-4 h-4" />}
                required
              />
              <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                />
                <span>
                  I agree to the Digital NetBanking Terms of Service, Privacy Policy, and electronic account operations guidelines.
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" onClick={() => setStep(3)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button type="submit" variant="primary" fullWidth size="lg" isLoading={isLoading}>
                  Complete Registration
                </Button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link to="/login" className="text-xs text-brand-600 dark:text-cyan-400 font-bold hover:underline">
              Sign In to NetBanking
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
