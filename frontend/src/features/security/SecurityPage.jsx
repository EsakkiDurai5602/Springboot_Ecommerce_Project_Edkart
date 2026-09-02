import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/bankingServices';
import {
  ShieldCheck,
  KeyRound,
  Smartphone,
  Laptop,
  Lock,
  LogOut,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';

export const SecurityPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled ?? true);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    profileService.getSessions().then(setSessions);
  }, []);

  const handleTerminateSession = async (sessionId) => {
    await profileService.terminateSession(sessionId);
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPwd.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPwd !== confirmPwd) {
      setError('Passwords do not match.');
      return;
    }

    setPwdSuccess(true);
    setTimeout(() => {
      setPwdSuccess(false);
      setIsPasswordModalOpen(false);
      setCurrentPwd('');
      setNewPwd('');
      setConfirmPwd('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Security & Access Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage 2FA authorization, active logins, passwords, and audit sessions
        </p>
      </div>

      {/* Security Health Indicator */}
      <Card variant="navy" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Security Posture: Excellent</h3>
              <p className="text-xs text-slate-400 mt-0.5">Two-factor authentication and device binding enabled</p>
            </div>
          </div>
          <Badge variant="success" size="md">
            PROTECTED
          </Badge>
        </div>
      </Card>

      {/* Security Settings List */}
      <Card variant="default">
        <CardHeader title="Authentication Controls" />
        <CardBody className="divide-y divide-slate-100 dark:divide-slate-800 space-y-4">
          <div className="flex items-center justify-between pt-2">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">NetBanking Password</h4>
              <p className="text-xs text-slate-500">Last changed 45 days ago</p>
            </div>
            <Button onClick={() => setIsPasswordModalOpen(true)} variant="outline" size="sm" leftIcon={<KeyRound className="w-4 h-4" />}>
              Change Password
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Two-Factor Authentication (2FA)</h4>
              <p className="text-xs text-slate-500">Mandatory OTP for all high-value fund transfers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={() => setTwoFactor(!twoFactor)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600 dark:peer-checked:bg-cyan-500" />
            </label>
          </div>
        </CardBody>
      </Card>

      {/* Active Device Sessions */}
      <Card variant="default">
        <CardHeader title="Active Device Logins" subtitle="Audit and terminate sessions across other phones or laptops" />
        <CardBody className="divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.map((sess) => (
            <div key={sess.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {sess.device.includes('iPhone') ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">{sess.device}</h4>
                    {sess.isCurrent && <Badge variant="info" size="sm">Current Session</Badge>}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {sess.location} • IP: {sess.ip} • <span className="text-slate-500">{sess.lastActive}</span>
                  </p>
                </div>
              </div>

              {!sess.isCurrent && (
                <Button
                  onClick={() => handleTerminateSession(sess.id)}
                  variant="ghost"
                  size="sm"
                  className="text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change NetBanking Password"
        subtitle="Ensure your new password differs from past credentials"
      >
        {pwdSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Password Changed Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={handlePasswordChange} className="space-y-4 text-xs">
            {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
            <Input
              label="Current Password"
              type="password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" fullWidth size="lg">
              Save New Password
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
