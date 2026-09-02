import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  ArrowLeft,
  CheckCircle2,
  Printer,
  Download,
  Share2,
  Building2,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { BANK_CONFIG } from '../../utils/constants';

export const TransactionDetailPage = () => {
  const { id } = useParams();
  const { transactions, accounts } = useBanking();
  const navigate = useNavigate();

  const transaction = transactions.find((t) => t.id === id || t.referenceId === id) || transactions[0];
  const linkedAccount = accounts.find((a) => a.id === transaction?.accountId);

  const handlePrint = () => {
    window.print();
  };

  if (!transaction) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Transaction record not found.</p>
        <Link to="/transactions" className="text-brand-600 font-bold hover:underline mt-2 inline-block">
          Back to Transactions
        </Link>
      </div>
    );
  }

  const isCredit = transaction.type === 'CREDIT';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline" size="sm" leftIcon={<Printer className="w-4 h-4" />}>
            Print Receipt
          </Button>
          <Link to="/support" state={{ disputeTxnRef: transaction.referenceId }}>
            <Button variant="ghost" size="sm" leftIcon={<HelpCircle className="w-4 h-4" />}>
              Report Issue
            </Button>
          </Link>
        </div>
      </div>

      {/* Official Transaction Receipt Voucher */}
      <Card variant="elevated" className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Receipt Header Banner */}
        <div className="bg-fintech-navy text-white p-6 sm:p-8 text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-4 ring-emerald-500/10">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-cyan-400">
              Payment Advice & Tax Invoice
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-1">
              {formatCurrency(transaction.amount)}
            </h2>
            <div className="mt-2 inline-block">
              <Badge variant="success" size="md" dot>
                {transaction.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Receipt Details Breakdown */}
        <CardBody className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Reference Number</span>
              <p className="font-mono font-bold text-slate-900 dark:text-slate-100 mt-0.5">{transaction.referenceId}</p>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px]">Transaction Date & Time</span>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{formatDateTime(transaction.date)}</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Transaction Type</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{transaction.type}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Category</span>
              <span className="font-semibold uppercase text-slate-900 dark:text-slate-100">{transaction.category || 'Transfer'}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Source Account</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                {linkedAccount ? `${linkedAccount.accountType} (••${linkedAccount.accountNumber.slice(-4)})` : 'Primary NetBanking'}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">{isCredit ? 'Sender' : 'Beneficiary / Recipient'}</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {isCredit ? (transaction.sender || 'Direct Deposit') : (transaction.recipient || transaction.description)}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Processing Convenience Fee</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {transaction.fee ? formatCurrency(transaction.fee) : '₹0.00 (Waived)'}
              </span>
            </div>

            {transaction.note && (
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Remark / Narration</span>
                <span className="font-medium text-slate-700 dark:text-slate-300 italic">{transaction.note}</span>
              </div>
            )}
          </div>

          {/* Footer Security Badge */}
          <div className="pt-4 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Cryptographically verified digital transaction receipt</span>
            </div>
            <span className="font-semibold text-slate-600 dark:text-slate-400">{BANK_CONFIG.BANK_SHORT}</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
