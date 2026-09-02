import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  SendHorizontal,
  Wallet,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  PlusCircle,
  Receipt,
} from 'lucide-react';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { OtpInput } from '../../components/ui/OtpInput';

export const TransferPage = () => {
  const { accounts, beneficiaries, sendMoney } = useBanking();
  const location = useLocation();
  const navigate = useNavigate();

  const presetSourceId = location.state?.presetSourceId || accounts[0]?.id;
  const presetBenId = location.state?.presetBenId || beneficiaries[0]?.id;
  const presetAmount = location.state?.presetAmount || '';

  const [sourceAccountId, setSourceAccountId] = useState(presetSourceId);
  const [beneficiaryId, setBeneficiaryId] = useState(presetBenId);
  const [amount, setAmount] = useState(presetAmount);
  const [transferMode, setTransferMode] = useState('IMPS');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  // Review & OTP states
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState(null);

  const selectedSource = accounts.find((a) => a.id === sourceAccountId) || accounts[0];
  const selectedBeneficiary = beneficiaries.find((b) => b.id === beneficiaryId) || beneficiaries[0];

  const handleReview = (e) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid transfer amount.');
      return;
    }

    if (!selectedSource) {
      setError('Please select a source account.');
      return;
    }

    if (!selectedBeneficiary) {
      setError('Please select a valid registered beneficiary.');
      return;
    }

    if (numAmount > selectedSource.balance) {
      setError(`Insufficient account balance. Available: ${formatCurrency(selectedSource.balance)}`);
      return;
    }

    if (numAmount > (selectedBeneficiary.dailyLimit || 1000000)) {
      setError(`Amount exceeds beneficiary daily limit of ${formatCurrency(selectedBeneficiary.dailyLimit)}.`);
      return;
    }

    setIsReviewOpen(true);
  };

  const handleConfirmAndProceedToOtp = () => {
    setIsReviewOpen(false);
    setIsOtpOpen(true);
  };

  const handleExecuteTransfer = async () => {
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const res = await sendMoney({
        sourceAccountId,
        beneficiaryId,
        amount: Number(amount),
        transferMode,
        note: note || 'Fund Transfer via NetBanking',
      });

      if (res.success) {
        setIsOtpOpen(false);
        setSuccessReceipt(res.transaction);
      }
    } catch (err) {
      setError(err.message || 'Transfer failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setAmount('');
    setNote('');
    setSuccessReceipt(null);
    setOtpCode('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Domestic Fund Transfer
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Instant 24/7 IMPS, NEFT, and RTGS transfers with 2FA authorization
        </p>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      {/* Success Receipt State */}
      {successReceipt ? (
        <Card variant="elevated" className="border-emerald-200 dark:border-emerald-900/60 p-6 sm:p-8 space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center ring-8 ring-emerald-500/10 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Transfer Completed Successfully
            </span>
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(successReceipt.amount)}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Reference: <strong className="font-mono text-slate-800 dark:text-slate-200">{successReceipt.referenceId}</strong>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs space-y-2 text-left max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Transferred To:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{successReceipt.recipient}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Debited Account:</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{selectedSource?.accountType} (••{selectedSource?.accountNumber.slice(-4)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mode:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{transferMode}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button onClick={resetForm} variant="secondary">
              Make Another Transfer
            </Button>
            <Link to={`/transactions/${successReceipt.id}`}>
              <Button variant="primary" leftIcon={<Receipt className="w-4 h-4" />}>
                View Full Receipt Voucher
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Transfer Form */
        <Card variant="default">
          <CardBody className="p-6 sm:p-8">
            <form onSubmit={handleReview} className="space-y-6">
              {/* Source Account Selection */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                  1. Select Source Account
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {accounts.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => setSourceAccountId(acc.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        sourceAccountId === acc.id
                          ? 'border-brand-600 dark:border-cyan-500 bg-brand-50/40 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{acc.accountType}</span>
                        <span className="font-mono text-[11px] text-slate-400">••{acc.accountNumber.slice(-4)}</span>
                      </div>
                      <div className="text-lg font-black text-slate-900 dark:text-slate-100 mt-2">
                        {formatCurrency(acc.balance)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Beneficiary Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                    2. Select Beneficiary Payee
                  </label>
                  <Link to="/beneficiaries" className="text-xs text-brand-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Manage Beneficiaries</span>
                  </Link>
                </div>

                <Select
                  value={beneficiaryId}
                  onChange={(e) => setBeneficiaryId(e.target.value)}
                >
                  {beneficiaries.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.bankName} (A/C: {maskAccountNumber(b.accountNumber)})
                    </option>
                  ))}
                </Select>
              </div>

              {/* Transfer Mode */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-2">
                  3. Transfer Protocol
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'IMPS', title: 'IMPS', desc: 'Instant 24/7 (₹5 fee)' },
                    { id: 'NEFT', title: 'NEFT', desc: 'Batch settlement (Free)' },
                    { id: 'RTGS', title: 'RTGS', desc: 'High value (> ₹2L)' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTransferMode(mode.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        transferMode === mode.id
                          ? 'border-brand-600 dark:border-cyan-500 bg-brand-50/40 dark:bg-slate-800'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-slate-100">{mode.title}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{mode.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Entry & Quick Pills */}
              <div>
                <Input
                  label="4. Transfer Amount (₹)"
                  type="number"
                  placeholder="Enter amount (e.g. 15000)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />

                <div className="flex flex-wrap gap-2 mt-2">
                  {[1000, 5000, 10000, 25000, 50000].map((quickVal) => (
                    <button
                      key={quickVal}
                      type="button"
                      onClick={() => setAmount(quickVal.toString())}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                    >
                      +₹{quickVal.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note / Narration */}
              <Input
                label="Remark / Note (Optional)"
                placeholder="e.g. Office advance, Invoice payment"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />

              <Button type="submit" variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                Review & Confirm Transfer
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Review Modal (Spec 16, 47, 48) */}
      <Modal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        title="Review Fund Transfer Details"
        subtitle="Please review the transaction summary before final authorization"
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Transfer Amount:</span>
              <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">
                {formatCurrency(amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBeneficiary?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Beneficiary Bank:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedBeneficiary?.bankName} ({selectedBeneficiary?.ifsc})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Debiting Account:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{selectedSource?.accountType} (••{selectedSource?.accountNumber.slice(-4)})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transfer Mode:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{transferMode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated Fee:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {transferMode === 'IMPS' ? '₹5.00' : '₹0.00'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsReviewOpen(false)} className="w-full">
              Modify
            </Button>
            <Button variant="primary" onClick={handleConfirmAndProceedToOtp} className="w-full">
              Authorize with 2FA OTP
            </Button>
          </div>
        </div>
      </Modal>

      {/* OTP Authorization Modal */}
      <Modal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        title="2FA Transaction Authorization"
        subtitle={`Enter 6-digit OTP code sent to authorize ${formatCurrency(amount)}`}
      >
        <div className="space-y-6 text-center py-2">
          <OtpInput value={otpCode} onChange={setOtpCode} onComplete={handleExecuteTransfer} />

          <p className="text-xs text-slate-400">
            For security, do not share this OTP with anyone, including bank representatives.
          </p>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isProcessing}
            onClick={handleExecuteTransfer}
          >
            Confirm & Send Money
          </Button>
        </div>
      </Modal>
    </div>
  );
};
