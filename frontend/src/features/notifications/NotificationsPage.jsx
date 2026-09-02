import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  Bell,
  CheckCheck,
  Shield,
  Receipt,
  Zap,
  Info,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const NotificationsPage = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useBanking();
  const [filterCat, setFilterCat] = useState('all');

  const filtered = filterCat === 'all'
    ? notifications
    : notifications.filter((n) => n.category === filterCat);

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time security alerts, transaction notices, and account updates
          </p>
        </div>

        <Button
          onClick={markAllNotificationsRead}
          variant="outline"
          size="sm"
          leftIcon={<CheckCheck className="w-4 h-4" />}
        >
          Mark All as Read
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'security', label: 'Security & Access' },
          { id: 'transaction', label: 'Transactions & Salary' },
          { id: 'bills', label: 'Bill Reminders' },
          { id: 'system', label: 'System Notices' },
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCat(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              filterCat === c.id
                ? 'bg-brand-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <Card variant="default">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              No notifications found in this category.
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-5 sm:px-6 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  n.read
                    ? 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
                    : 'bg-brand-50/30 dark:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      n.category === 'security'
                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                        : n.category === 'transaction'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                        : 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400'
                    }`}
                  >
                    {n.category === 'security' ? <Shield className="w-5 h-5" /> : <Receipt className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                        {n.title}
                      </h4>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-brand-600 dark:bg-cyan-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {n.message}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-2 block font-mono">
                      {formatDateTime(n.timestamp)}
                    </span>
                  </div>
                </div>

                {n.actionLink && (
                  <Link
                    to={n.actionLink}
                    className="p-2 text-slate-400 hover:text-brand-600 dark:hover:text-cyan-400 flex-shrink-0"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
