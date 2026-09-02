import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calculator, Sparkles, CheckCircle2, PieChart } from 'lucide-react';
import { formatCurrency, calculateEMI } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export const LoanCalculatorPage = () => {
  const [principal, setPrincipal] = useState(2500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);

  const tenureMonths = tenureYears * 12;
  const { emi, totalPayment, totalInterest } = calculateEMI(principal, interestRate, tenureMonths);

  const principalPercent = totalPayment > 0 ? Math.round((principal / totalPayment) * 100) : 50;
  const interestPercent = 100 - principalPercent;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link to="/loans" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Loans</span>
        </Link>
      </div>

      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Interactive EMI & Amortization Calculator
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Estimate monthly installments, total interest charges, and tenure flexibility
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7">
          <Card variant="default">
            <CardBody className="p-6 sm:p-8 space-y-6">
              {/* Principal Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">Loan Principal Amount</label>
                  <span className="font-mono text-base font-extrabold text-brand-600 dark:text-cyan-400">
                    {formatCurrency(principal)}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="10000000"
                  step="50000"
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full accent-brand-600 dark:accent-cyan-400 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹50,000</span>
                  <span>₹1.00 Crore</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">Interest Rate (% p.a.)</label>
                  <span className="font-mono text-base font-extrabold text-purple-600 dark:text-purple-400">
                    {interestRate.toFixed(2)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="6.5"
                  max="18.0"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-purple-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>6.5%</span>
                  <span>18.0%</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold">
                  <label className="text-slate-700 dark:text-slate-300 uppercase tracking-wider">Repayment Tenure</label>
                  <span className="font-mono text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                    {tenureYears} Years ({tenureMonths} Months)
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Results Voucher Panel */}
        <div className="lg:col-span-5 space-y-6">
          <Card variant="navy" className="p-6 sm:p-8 space-y-6 text-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                Estimated Monthly Repayment
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
                {formatCurrency(emi)}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 block">per month for {tenureMonths} installments</span>
            </div>

            <div className="space-y-3 text-xs text-left bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Principal Sanctioned:</span>
                <span className="font-bold text-white">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Interest Payable:</span>
                <span className="font-bold text-amber-400">{formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-800">
                <span className="text-slate-300 font-semibold">Total Amount Repayable:</span>
                <span className="font-bold text-cyan-300">{formatCurrency(totalPayment)}</span>
              </div>
            </div>

            {/* Principal vs Interest Proportion Bar */}
            <div className="space-y-1.5 text-left">
              <div className="flex justify-between text-[10px] font-bold text-slate-400">
                <span>Principal ({principalPercent}%)</span>
                <span>Interest ({interestPercent}%)</span>
              </div>
              <div className="w-full h-3 bg-amber-500 rounded-full flex overflow-hidden">
                <div className="bg-cyan-500 h-full" style={{ width: `${principalPercent}%` }} />
              </div>
            </div>

            <Link to="/loans" className="block pt-2">
              <Button variant="cyan" fullWidth size="md">
                Apply with this Estimate
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};
