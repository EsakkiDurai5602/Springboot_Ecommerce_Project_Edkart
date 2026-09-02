import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  Banknote,
  Calculator,
  Plus,
  Calendar,
  Percent,
  CheckCircle2,
  FileText,
  Building,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { loanService } from '../../services/bankingServices';

export const LoansPage = () => {
  const { loans } = useBanking();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(null);

  const [formData, setFormData] = useState({
    loanType: 'Home Mortgage Loan',
    requestedAmount: '2500000',
    tenureMonths: '120',
    purpose: 'Residential Property Purchase',
  });

  const handleApply = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await loanService.applyLoan(formData);
      setApplySuccess(res);
    } catch (err) {
      alert('Application error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loans & Credit Facilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track active EMI amortizations, repayment schedules, and apply for digital credit lines
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/loans/calculator">
            <Button variant="outline" leftIcon={<Calculator className="w-4 h-4" />}>
              EMI Calculator
            </Button>
          </Link>
          <Button
            onClick={() => {
              setApplySuccess(null);
              setIsApplyModalOpen(true);
            }}
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Apply for Loan
          </Button>
        </div>
      </div>

      {/* Active Loans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loans.map((loan) => {
          const progressPercent = Math.round(((loan.totalPrincipal - loan.outstandingPrincipal) / loan.totalPrincipal) * 100);
          return (
            <Card key={loan.id} variant="elevated" className="flex flex-col justify-between">
              <div>
                <CardHeader className="bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{loan.loanType}</h3>
                      <p className="text-[11px] font-mono text-slate-400">{loan.loanNumber}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm" dot>
                    {loan.status}
                  </Badge>
                </CardHeader>

                <CardBody className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">Outstanding Principal</span>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                      {formatCurrency(loan.outstandingPrincipal)}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>Total Sanctioned: {formatCurrency(loan.totalPrincipal)}</span>
                      <span className="font-semibold text-brand-600 dark:text-cyan-400">{progressPercent}% Repaid</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-brand-600 dark:bg-cyan-500 h-full rounded-full" style={{ width: `${progressPercent}%` }} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Monthly EMI</span>
                      <p className="font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{formatCurrency(loan.monthlyEmi)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Interest Rate</span>
                      <p className="font-extrabold text-purple-600 dark:text-purple-400 mt-0.5">{loan.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Next EMI Due</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(loan.nextPaymentDate)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Tenure Paid</span>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{loan.monthsPaid} of {loan.tenureMonths} mos</p>
                    </div>
                  </div>
                </CardBody>
              </div>

              <CardFooter className="gap-2">
                <Link to="/documents" className="w-full">
                  <Button variant="secondary" size="sm" fullWidth leftIcon={<FileText className="w-3.5 h-3.5" />}>
                    Amortization PDF
                  </Button>
                </Link>
                <Link to="/transfer" className="w-full">
                  <Button variant="primary" size="sm" fullWidth>
                    Pay Advance EMI
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Apply Loan Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Pre-Approved Digital Credit"
        subtitle="Instant in-principle approval based on your existing NetBanking account history"
      >
        {applySuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{applySuccess.message}</h4>
            <p className="text-xs text-slate-400">Application Ref: <strong className="font-mono text-slate-700 dark:text-slate-200">{applySuccess.referenceNumber}</strong></p>
            <Button onClick={() => setIsApplyModalOpen(false)} variant="primary" size="sm">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            <Select
              label="Loan Product"
              value={formData.loanType}
              onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
            >
              <option value="Home Mortgage Loan">Home Mortgage Loan (8.35% p.a.)</option>
              <option value="Personal Express Loan">Personal Express Credit (10.5% p.a.)</option>
              <option value="Executive Auto Loan">Executive Auto Loan (8.90% p.a.)</option>
              <option value="Education Loan">Global Education Loan (9.20% p.a.)</option>
            </Select>

            <Input
              label="Requested Amount (₹)"
              type="number"
              value={formData.requestedAmount}
              onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
              required
            />

            <Select
              label="Repayment Tenure"
              value={formData.tenureMonths}
              onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
            >
              <option value="12">12 Months (1 Year)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="60">60 Months (5 Years)</option>
              <option value="120">120 Months (10 Years)</option>
              <option value="240">240 Months (20 Years)</option>
            </Select>

            <Input
              label="Purpose of Loan"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              required
            />

            <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
              Submit Digital Application
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
