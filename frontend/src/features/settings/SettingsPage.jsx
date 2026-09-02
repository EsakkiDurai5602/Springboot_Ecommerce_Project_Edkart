import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Lock,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';

export const SettingsPage = () => {
  const { theme, toggleTheme, currency, changeCurrency } = useTheme();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [sessionTimeoutMins, setSessionTimeoutMins] = useState('15');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Application Preferences
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize display tokens, currency presentation, and communication channels
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance Settings */}
        <Card variant="default">
          <CardHeader title="Appearance & Visual Theme" subtitle="Toggle light or dark fintech themes" />
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">Interface Theme</h4>
                <p className="text-xs text-slate-500">Current mode: {theme === 'dark' ? 'Dark Navy' : 'Light Slate'}</p>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Currency & Regional Preferences */}
        <Card variant="default">
          <CardHeader title="Currency & Locale Formatting" />
          <CardBody className="space-y-4">
            <div className="max-w-xs">
              <Select
                label="Base Presentation Currency"
                value={currency}
                onChange={(e) => changeCurrency(e.target.value)}
              >
                <option value="INR">₹ INR - Indian Rupee (Default)</option>
                <option value="USD">$ USD - US Dollar</option>
                <option value="EUR">€ EUR - Euro</option>
                <option value="GBP">£ GBP - British Pound</option>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Notification Alert Preferences */}
        <Card variant="default">
          <CardHeader title="Transactional Alert Channels" subtitle="Choose how you receive transaction and debit alerts" />
          <CardBody className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
            <div className="flex items-center justify-between pt-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Instant Email Advisories</h4>
                <p className="text-[11px] text-slate-400">Receive digital receipts for every credit & debit</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">SMS Real-time Gateway</h4>
                <p className="text-[11px] text-slate-400">SMS updates delivered to your registered mobile number</p>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={() => setSmsAlerts(!smsAlerts)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved
            </span>
          )}
          <Button type="submit" variant="primary" leftIcon={<Save className="w-4 h-4" />}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
