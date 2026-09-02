import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useBanking } from '../../context/BankingContext';
import {
  Wallet,
  SendHorizontal,
  CreditCard,
  Receipt,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  Zap,
  Building,
} from 'lucide-react';
import { formatCurrency, formatDate, maskAccountNumber } from '../../utils/formatters';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CardVisual } from '../../assets/illustrations';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { accounts, transactions, beneficiaries, cards, totalBalance, loading } = useBanking();
  const [hideBalances, setHideBalances] = useState(false);
  const [quickAmount, setQuickAmount] = useState('');
  const [quickBenId, setQuickBenId] = useState(beneficiaries[0]?.id || '');
  const navigate = useNavigate();

  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];
  const primaryCard = cards[0];
  const recentTxns = transactions.slice(0, 5);

  const handleQuickTransfer = (e) => {
    e.preventDefault();
    if (!quickAmount) return;
    navigate('/transfer', { state: { presetBenId: quickBenId, presetAmount: quickAmount } });
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-fintech-navy via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
              {user?.accountTier || 'Premier Banking'}
            </span>
            <span className="text-xs text-slate-400">Customer ID: {user?.customerId || 'EDK-990142'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.fullName || 'Valued Customer'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            All services operational with 256-bit encrypted NetBanking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/transfer">
            <Button variant="cyan" leftIcon={<SendHorizontal className="w-4 h-4" />}>
              Transfer Money
            </Button>
          </Link>
          <Link to="/bill-payments">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20" leftIcon={<Zap className="w-4 h-4" />}>
              Pay Bills
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial Summary & Balance Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Total Wealth Widget */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Net Balance
              </span>
              <button
                onClick={() => setHideBalances(!hideBalances)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={hideBalances ? 'Show Balances' : 'Hide Balances'}
                aria-label="Toggle balance visibility"
              >
                {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {hideBalances ? '₹ ••••••••' : formatCurrency(totalBalance)}
              </span>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <TrendingUp className="w-3.5 h-3.5" /> +4.2% monthly interest accrued
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400 truncate max-w-[140px] font-medium">
                  {acc.accountType} ({maskAccountNumber(acc.accountNumber).slice(-4)})
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {hideBalances ? '••••' : formatCurrency(acc.balance)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Primary Digital Card Preview */}
        <div className="md:col-span-4 flex flex-col justify-center">
          {primaryCard ? (
            <CardVisual
              type={primaryCard.tier}
              cardNumber={primaryCard.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
              holderName={primaryCard.holderName}
              expiry={primaryCard.expiry}
            />
          ) : (
            <div className="h-full bg-slate-100 dark:bg-slate-900 rounded-2xl p-6 flex items-center justify-center text-slate-400">
              No active card
            </div>
          )}
        </div>

        {/* Quick Transfer Box */}
        <div className="md:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <SendHorizontal className="w-4 h-4 text-brand-600 dark:text-cyan-400" />
                <span>Quick Transfer</span>
              </h3>
              <Link to="/beneficiaries" className="text-[11px] text-brand-600 dark:text-cyan-400 hover:underline font-semibold">
                + Add Payee
              </Link>
            </div>

            <form onSubmit={handleQuickTransfer} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Select Beneficiary</label>
                <select
                  value={quickBenId}
                  onChange={(e) => setQuickBenId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.bankName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500 focus:outline-none font-bold"
                />
              </div>

              <Button type="submit" size="sm" variant="primary" fullWidth className="mt-2">
                Instant Transfer Now
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Transactions & Spend Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-8">
          <Card variant="default">
            <CardHeader
              title="Recent Activity"
              subtitle="Latest processed transfers, bill payments, and deposits"
              action={
                <Link to="/transactions" className="text-xs text-brand-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTxns.map((txn) => {
                const isCredit = txn.type === 'CREDIT';
                return (
                  <Link
                    key={txn.id}
                    to={`/transactions/${txn.id}`}
                    className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors block"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isCredit
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                          {txn.description}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formatDate(txn.date)} • Ref: {txn.referenceId}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs sm:text-sm font-black tracking-tight ${
                          isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                      </span>
                      <div className="mt-0.5">
                        <Badge variant={txn.status === 'COMPLETED' ? 'success' : 'warning'} size="sm">
                          {txn.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Quick Banking Shortcuts & Spending Overview */}
        <div className="lg:col-span-4 space-y-6">
          <Card variant="default">
            <CardHeader title="Spending by Category" subtitle="August - September 2026" />
            <CardBody className="space-y-4">
              {[
                { label: 'Shopping & Retail', amount: '₹45,990', percent: 42, color: 'bg-brand-500' },
                { label: 'Fund Transfers', amount: '₹25,000', percent: 23, color: 'bg-cyan-500' },
                { label: 'Bills & Utilities', amount: '₹4,549', percent: 12, color: 'bg-amber-500' },
                { label: 'Dining & Food', amount: '₹1,840', percent: 6, color: 'bg-emerald-500' },
              ].map((cat, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">{cat.label}</span>
                    <span className="text-slate-900 dark:text-slate-100">{cat.amount}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>

          {/* Promotional Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 via-brand-900 to-slate-900 text-white shadow-lg space-y-3 border border-indigo-700/40">
            <div className="inline-flex p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-300" />
            </div>
            <h4 className="font-bold text-sm">Grow with High-Yield FD Vault</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Earn guaranteed interest up to 8.10% p.a. with zero penalty on emergency digital liquidation.
            </p>
            <Link to="/products" className="inline-block pt-1">
              <Button size="sm" variant="cyan">
                Invest in FD Vault →
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
