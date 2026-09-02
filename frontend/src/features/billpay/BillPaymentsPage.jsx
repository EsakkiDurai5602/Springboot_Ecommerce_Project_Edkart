import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  Zap,
  Smartphone,
  Wifi,
  Droplets,
  Flame,
  CreditCard,
  Shield,
  CheckCircle2,
  Receipt,
  ArrowRight,
  Search,
} from 'lucide-react';
import { BILLER_CATEGORIES } from '../../utils/constants';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Alert } from '../../components/ui/Alert';

const iconMap = {
  Zap,
  Smartphone,
  Wifi,
  Droplets,
  Flame,
  CreditCard,
  Shield,
};

export const BillPaymentsPage = () => {
  const { accounts, sendMoney } = useBanking();
  const [selectedCat, setSelectedCat] = useState(BILLER_CATEGORIES[0]);
  const [selectedBiller, setSelectedBiller] = useState(BILLER_CATEGORIES[0].billers[0]);
  const [consumerNumber, setConsumerNumber] = useState('');
  const [fetchedBill, setFetchedBill] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [sourceAccountId, setSourceAccountId] = useState(accounts[0]?.id);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);
  const [error, setError] = useState(null);

  const handleCategoryChange = (cat) => {
    setSelectedCat(cat);
    setSelectedBiller(cat.billers[0]);
    setFetchedBill(null);
    setConsumerNumber('');
    setError(null);
  };

  const handleFetchBill = (e) => {
    e.preventDefault();
    if (!consumerNumber) {
      setError('Please provide your Consumer ID / Account Number.');
      return;
    }

    setIsFetching(true);
    setError(null);

    setTimeout(() => {
      setIsFetching(false);
      // Generate simulated bill
      const billAmount = Math.floor(800 + Math.random() * 4500);
      setFetchedBill({
        billerName: selectedBiller,
        consumerNumber,
        consumerName: 'ESAKKI DURAI',
        billPeriod: 'Aug - Sept 2026',
        amount: billAmount,
        dueDate: '2026-09-18',
        billStatus: 'UNPAID',
      });
    }, 600);
  };

  const handlePayBill = async () => {
    if (!fetchedBill) return;
    setIsPaying(true);
    setError(null);

    try {
      const res = await sendMoney({
        sourceAccountId,
        beneficiaryId: 'ben_03',
        amount: fetchedBill.amount,
        transferMode: 'BILL_PAY',
        note: `Bill Payment - ${fetchedBill.billerName} (${fetchedBill.consumerNumber})`,
      });

      if (res.success) {
        setIsPayModalOpen(false);
        setSuccessReceipt(res.transaction);
        setFetchedBill(null);
      }
    } catch (err) {
      setError(err.message || 'Payment failed.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Bill Payments & Utility Center
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pay utility bills, mobile recharges, fiber broadband, and taxes with instant confirmation
        </p>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* Success Receipt */}
      {successReceipt && (
        <Card variant="elevated" className="border-emerald-200 dark:border-emerald-900/60 p-6 sm:p-8 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">Bill Payment Successful!</h3>
          <p className="text-sm text-slate-500">
            Paid <strong className="text-slate-900 dark:text-slate-100">{formatCurrency(successReceipt.amount)}</strong>. Ref: <span className="font-mono">{successReceipt.referenceId}</span>
          </p>
          <Button onClick={() => setSuccessReceipt(null)} variant="primary" size="sm">
            Pay Another Bill
          </Button>
        </Card>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {BILLER_CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Zap;
          const isSelected = selectedCat.id === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat)}
              className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                isSelected
                  ? 'border-brand-600 dark:border-cyan-500 bg-brand-50/50 dark:bg-slate-800 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-brand-600 dark:bg-cyan-500 text-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {cat.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bill Fetch Form */}
      <Card variant="default">
        <CardHeader title={`Pay ${selectedCat.name}`} subtitle="Select provider and enter your account identifier" />
        <CardBody className="p-6 space-y-6">
          <form onSubmit={handleFetchBill} className="space-y-4">
            <Select
              label="Select Service Provider / Board"
              value={selectedBiller}
              onChange={(e) => {
                setSelectedBiller(e.target.value);
                setFetchedBill(null);
              }}
            >
              {selectedCat.billers.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>

            <Input
              label="Consumer ID / Account Number / Phone"
              placeholder="e.g. 10928340192"
              value={consumerNumber}
              onChange={(e) => {
                setConsumerNumber(e.target.value);
                setFetchedBill(null);
              }}
              required
            />

            <Button type="submit" variant="primary" size="md" isLoading={isFetching} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Fetch Outstanding Bill
            </Button>
          </form>

          {/* Fetched Bill Voucher */}
          {fetchedBill && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4 animate-slide-up">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-600 dark:text-cyan-400">
                    Verified Digital Bill Voucher
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{fetchedBill.billerName}</h4>
                  <p className="text-xs text-slate-400">Consumer: {fetchedBill.consumerName} ({fetchedBill.consumerNumber})</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400">Bill Amount</span>
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {formatCurrency(fetchedBill.amount)}
                  </div>
                  <span className="text-[11px] text-rose-500 font-semibold">Due: {formatDate(fetchedBill.dueDate)}</span>
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={() => setIsPayModalOpen(true)} variant="cyan" fullWidth size="lg">
                  Pay Now {formatCurrency(fetchedBill.amount)}
                </Button>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Payment Confirmation Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Confirm Utility Bill Payment"
        subtitle={`Authorize payment of ${fetchedBill ? formatCurrency(fetchedBill.amount) : ''}`}
      >
        <div className="space-y-4 text-xs">
          <Select
            label="Debiting Bank Account"
            value={sourceAccountId}
            onChange={(e) => setSourceAccountId(e.target.value)}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.accountType} (••{acc.accountNumber.slice(-4)}) — Balance: {formatCurrency(acc.balance)}
              </option>
            ))}
          </Select>

          <Button onClick={handlePayBill} variant="primary" size="lg" fullWidth isLoading={isPaying}>
            Confirm & Pay {fetchedBill ? formatCurrency(fetchedBill.amount) : ''}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
