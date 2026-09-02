import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  Wallet,
  Building,
  Plus,
  SendHorizontal,
  FileText,
  Eye,
  EyeOff,
  ChevronRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import { formatCurrency, maskAccountNumber, formatDate } from '../../utils/formatters';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const AccountsPage = () => {
  const { accounts, totalBalance } = useBanking();
  const [unmasked, setUnmasked] = useState({});
  const [isNewAccountModal, setIsNewAccountModal] = useState(false);
  const [accountType, setAccountType] = useState('Savings Account');

  const toggleMask = (id) => {
    setUnmasked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Accounts & Deposits
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your savings accounts, current accounts, and term deposits
          </p>
        </div>

        <Button
          onClick={() => setIsNewAccountModal(true)}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Open New Account / FD
        </Button>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const isVisible = unmasked[acc.id];
          return (
            <Card key={acc.id} variant="elevated" className="flex flex-col justify-between">
              <div>
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{acc.accountType}</h3>
                      <p className="text-[11px] text-slate-400">{acc.nickname || 'Primary'}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" dot>
                    {acc.status}
                  </Badge>
                </CardHeader>

                <CardBody className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Available Balance
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-0.5">
                      {formatCurrency(acc.balance)}
                    </div>
                  </div>

                  <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Account No:</span>
                      <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        <span>{isVisible ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}</span>
                        <button
                          onClick={() => toggleMask(acc.id)}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">IFSC Code:</span>
                      <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{acc.ifsc}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Branch:</span>
                      <span className="text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{acc.branch}</span>
                    </div>

                    {acc.interestRate && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Interest Rate:</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {acc.interestRate}% p.a.
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </div>

              <CardFooter className="gap-2">
                <Link to={`/accounts/${acc.id}`} className="w-full">
                  <Button variant="secondary" size="sm" fullWidth rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                    View Statement
                  </Button>
                </Link>
                <Link to="/transfer" state={{ presetSourceId: acc.id }} className="w-full">
                  <Button variant="primary" size="sm" fullWidth>
                    Transfer
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Open Account Modal */}
      <Modal
        isOpen={isNewAccountModal}
        onClose={() => setIsNewAccountModal(false)}
        title="Open Instant Digital Deposit / Account"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Select the desired product category to instantly provision within your existing KYC profile.
          </p>

          <Select
            label="Account Category"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="Savings Account">Premier High-Yield Savings (4.5% p.a.)</option>
            <option value="Current Account">Commercial Operations Current Account</option>
            <option value="Fixed Deposit">Guaranteed Growth Fixed Deposit (7.6% p.a.)</option>
            <option value="Recurring Deposit">Smart Recurring Monthly Deposit</option>
          </Select>

          <Input label="Initial Deposit Amount (₹)" type="number" defaultValue="25000" />

          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              alert('Account application initiated! Digital verification completed in 10 seconds.');
              setIsNewAccountModal(false);
            }}
          >
            Submit Application
          </Button>
        </div>
      </Modal>
    </div>
  );
};
