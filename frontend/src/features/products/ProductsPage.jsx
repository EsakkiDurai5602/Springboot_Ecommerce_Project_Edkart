import React, { useState, useEffect } from 'react';
import { productService } from '../../services/bankingServices';
import { BANKING_PRODUCTS_CATALOG } from '../../services/mockData';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { SavingsIllustration, LoanIllustration, SecurityIllustration } from '../../assets/illustrations';

export const ProductsPage = () => {
  const [products, setProducts] = useState(BANKING_PRODUCTS_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [applyingProduct, setApplyingProduct] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'savings', label: 'Savings & Deposits' },
    { id: 'cards', label: 'Credit & Debit Cards' },
    { id: 'loans', label: 'Home & Auto Loans' },
    { id: 'investments', label: 'Wealth & SIP' },
  ];

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory || (selectedCategory === 'savings' && p.category === 'deposits'));

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setApplyingProduct(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Banking Products & Wealth Catalog
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore premier banking instruments, investment vaults, cards, and loan solutions
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === c.id
                ? 'bg-brand-600 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-md shadow-brand-500/20'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <Card key={prod.id} variant="elevated" className="flex flex-col justify-between">
            <div>
              <CardHeader className="bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <Badge variant={prod.recommended ? 'info' : 'neutral'} size="sm">
                    {prod.badge || 'Digital'}
                  </Badge>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 mt-1.5">
                    {prod.name}
                  </h3>
                </div>
              </CardHeader>

              <CardBody className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {prod.tagline}
                </p>

                <div className="p-3.5 rounded-xl bg-brand-50/50 dark:bg-slate-800/80 border border-brand-100 dark:border-slate-700 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-500">Interest / Yield:</span>
                    <span className="font-bold text-brand-700 dark:text-cyan-300">{prod.interestRate}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Terms:</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{prod.minBalance}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {prod.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </div>

            <CardFooter>
              <Button
                onClick={() => setApplyingProduct(prod)}
                variant="primary"
                fullWidth
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Apply Online Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Product Application Modal */}
      <Modal
        isOpen={!!applyingProduct}
        onClose={() => setApplyingProduct(null)}
        title={`Apply for ${applyingProduct?.name}`}
        subtitle="Digital paperless provisioning under your verified customer ID"
      >
        {applySuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Application Submitted!</h4>
            <p className="text-xs text-slate-500">Your relationship manager will reach out within 2 business hours.</p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
            <Input label="Applicant Name" defaultValue="Esakki Durai" disabled />
            <Input label="Customer ID" defaultValue="EDK-990142" disabled />
            <Input label="Contact Phone" defaultValue="+91 98765 43210" />
            <Input label="Annual Income Bracket" placeholder="e.g. ₹15,00,000 - ₹25,00,000" defaultValue="₹18,00,000" />
            <Button type="submit" variant="primary" fullWidth size="lg">
              Confirm & Submit Application
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
