import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  Globe2,
  ArrowRight,
  Sparkles,
  CreditCard,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { HeroFintechIllustration, CardVisual } from '../../assets/illustrations';
import { Button } from '../../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="space-y-16 sm:space-y-24 py-8 sm:py-12">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800/60 text-cyan-800 dark:text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
              <span>Next-Generation Digital Banking 2.0</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Intelligent Banking for the Modern World.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Experience seamless fund transfers, instant bill payments, virtual card controls, and real-time financial tracking with enterprise-grade encryption.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/login" className="w-full sm:w-auto">
                <Button size="lg" variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Access NetBanking
                </Button>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" fullWidth>
                  Open Digital Account
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">99.99%</p>
                <p className="text-xs text-slate-500">Service Uptime</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-brand-600 dark:text-cyan-400">256-Bit</p>
                <p className="text-xs text-slate-500">End-to-End SSL</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">Zero</p>
                <p className="text-xs text-slate-500">Hidden Fees</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md">
              <HeroFintechIllustration />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="bg-slate-100/70 dark:bg-slate-900/50 py-16 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Engineered for Complete Financial Control
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              State-of-the-art tools designed to make personal and commercial internet banking instantaneous, transparent, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Instant IMPS & NEFT</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Transfer money 24/7 across any Indian bank in seconds with automatic beneficiary verification and real-time transaction receipts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Dynamic Card Controls</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Instantly freeze lost cards, adjust daily ATM/POS limits, generate disposable virtual cards, and reset PINs from your dashboard.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Multi-Layer Security</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Biometric authorization, automated session timeouts, 2FA verification on fund transfers, and real-time fraud monitoring alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Card Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Titanium Elite & Sapphire Cards
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Designed with premium contactless chips, zero international markup options, and tailored cashback rewards across dining, shopping, and travel.
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Zero annual maintenance fee on minimum spend</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Complimentary airport lounge access nationwide</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Instant virtual card provisioning inside mobile & web app</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link to="/products">
                <Button variant="navy" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore Card Products
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-sm">
              <CardVisual type="sapphire" cardNumber="4532 •••• •••• 8819" holderName="ESAKKI DURAI" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
