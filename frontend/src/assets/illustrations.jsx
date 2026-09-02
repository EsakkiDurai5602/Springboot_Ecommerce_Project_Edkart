import React from 'react';

/**
 * Premium Fintech Visual Asset Library (Vector/SVG & 3D Style Renders)
 * Strictly compliant with Section 20, 22, 71 (No real bank logos, pure original art)
 */

export const CardVisual = ({ type = 'titanium', cardNumber = '4532 •••• •••• 8819', holderName = 'ESAKKI DURAI', expiry = '08/29', variant = 'full', className = '' }) => {
  const themes = {
    titanium: {
      bg: 'from-slate-950 via-slate-900 to-indigo-950',
      accent: '#06B6D4',
      badge: 'TITANIUM ELITE',
      chip: '#E2E8F0',
      network: 'VISA INFINITE'
    },
    sapphire: {
      bg: 'from-blue-950 via-blue-900 to-cyan-900',
      accent: '#38BDF8',
      badge: 'SAPPHIRE RESERVE',
      chip: '#FCD34D',
      network: 'MASTERCARD WORLD'
    },
    gold: {
      bg: 'from-amber-950 via-amber-900 to-yellow-800',
      accent: '#FDE047',
      badge: 'PRESTIGE GOLD',
      chip: '#FEF08A',
      network: 'VISA SIGNATURE'
    },
    emerald: {
      bg: 'from-emerald-950 via-emerald-900 to-teal-900',
      accent: '#34D399',
      badge: 'CASHBACK PREMIER',
      chip: '#A7F3D0',
      network: 'RUPAY SELECT'
    },
    business: {
      bg: 'from-purple-950 via-indigo-950 to-slate-900',
      accent: '#C084FC',
      badge: 'BUSINESS PLATINUM',
      chip: '#E9D5FF',
      network: 'MASTERCARD BIZ'
    },
    virtual: {
      bg: 'from-cyan-950 via-teal-900 to-sky-950',
      accent: '#22D3EE',
      badge: 'VIRTUAL SECURE',
      chip: '#67E8F9',
      network: 'VISA VIRTUAL'
    }
  };

  const currentTheme = themes[type] || themes.titanium;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${currentTheme.bg} p-6 text-white shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-fintech-glow border border-white/10 aspect-[1.586/1] flex flex-col justify-between ${className}`}>
      {/* Background Abstract Geometric Glow */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-2xl" />
      <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-indigo-500/20 blur-2xl" />
      <svg className="absolute right-0 bottom-0 opacity-10 pointer-events-none w-64 h-64" viewBox="0 0 200 200" fill="none">
        <circle cx="150" cy="150" r="120" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="150" cy="150" r="80" stroke="white" strokeWidth="1.5" />
        <circle cx="150" cy="150" r="40" stroke="white" strokeWidth="1" />
      </svg>

      {/* Top Card Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-7 w-7 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xs border border-white/30 text-cyan-300">
            EdK
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-200">
            EdKart Bank
          </span>
        </div>
        <span className="text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white/15 backdrop-blur-md text-cyan-300 border border-white/20">
          {currentTheme.badge}
        </span>
      </div>

      {/* EMV Chip & Contactless Wave */}
      <div className="relative z-10 flex items-center space-x-4 my-auto">
        <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 border border-yellow-200/50 shadow-inner flex items-center justify-center p-1">
          <div className="w-full h-full border border-amber-800/40 rounded-[2px] flex flex-col justify-between py-0.5 px-1">
            <div className="h-[1px] bg-amber-800/30 w-full" />
            <div className="h-[1px] bg-amber-800/30 w-full" />
          </div>
        </div>
        <svg className="w-6 h-6 text-white/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 16.5a5 5 0 0 1 0-9" />
          <path d="M12 19a8.5 8.5 0 0 0 0-14" />
          <path d="M15.5 21.5a12 12 0 0 0 0-19" />
        </svg>
      </div>

      {/* Card Number */}
      <div className="relative z-10">
        <div className="font-mono text-lg sm:text-xl tracking-[0.2em] font-medium text-slate-100 drop-shadow-md">
          {cardNumber}
        </div>
      </div>

      {/* Card Footer */}
      <div className="relative z-10 flex items-end justify-between pt-1">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Cardholder</div>
          <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-100 uppercase">{holderName}</div>
        </div>
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Expires</div>
          <div className="text-xs sm:text-sm font-mono font-medium text-slate-100">{expiry}</div>
        </div>
        <div className="text-right">
          <span className="font-bold italic text-sm tracking-tight text-white/90 drop-shadow">
            {currentTheme.network}
          </span>
        </div>
      </div>
    </div>
  );
};

/* -------------------- PRODUCT & FEATURE ILLUSTRATIONS -------------------- */

export const SavingsIllustration = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="80" r="72" fill="#F0F9FF" className="dark:fill-slate-800" />
    <circle cx="80" cy="80" r="56" fill="url(#savings_grad)" />
    <path d="M80 40V120M52 64C52 54 62 46 80 46C98 46 108 54 108 64C108 76 96 82 80 82C64 82 52 88 52 100C52 110 62 118 80 118C98 118 108 110 108 100" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="120" cy="44" r="16" fill="#10B981" />
    <path d="M112 44L118 50L128 38" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="savings_grad" x1="24" y1="24" x2="136" y2="136" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0284C7" />
        <stop offset="1" stopColor="#0369A1" />
      </linearGradient>
    </defs>
  </svg>
);

export const LoanIllustration = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="80" r="72" fill="#F5F3FF" className="dark:fill-slate-800" />
    <rect x="40" y="50" width="80" height="65" rx="10" fill="url(#loan_grad)" />
    <path d="M30 65L80 30L130 65" stroke="#7C3AED" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="52" y="70" width="16" height="20" rx="3" fill="#EDE9FE" />
    <rect x="92" y="70" width="16" height="20" rx="3" fill="#EDE9FE" />
    <rect x="72" y="85" width="16" height="30" rx="2" fill="#EDE9FE" />
    <defs>
      <linearGradient id="loan_grad" x1="40" y1="50" x2="120" y2="115" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6D28D9" />
        <stop offset="1" stopColor="#4C1D95" />
      </linearGradient>
    </defs>
  </svg>
);

export const SecurityIllustration = ({ className = "w-32 h-32" }) => (
  <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="80" cy="80" r="72" fill="#ECFDF5" className="dark:fill-slate-800" />
    <path d="M80 32L120 48V84C120 108 103 126 80 134C57 126 40 108 40 84V48L80 32Z" fill="url(#sec_grad)" />
    <path d="M72 80V72C72 67.5 75.5 64 80 64C84.5 64 88 67.5 88 72V80M66 80H94C96.2 80 98 81.8 98 84V100C98 102.2 96.2 104 94 104H66C63.8 104 62 102.2 62 100V84C62 81.8 63.8 80 66 80Z" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <defs>
      <linearGradient id="sec_grad" x1="40" y1="32" x2="120" y2="134" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10B981" />
        <stop offset="1" stopColor="#047857" />
      </linearGradient>
    </defs>
  </svg>
);

export const HeroFintechIllustration = ({ className = "w-full h-auto max-w-lg" }) => (
  <svg className={className} viewBox="0 0 600 450" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Background Glows */}
    <ellipse cx="300" cy="225" rx="260" ry="180" fill="url(#hero_mesh)" opacity="0.6" />
    
    {/* Floating Card 1 */}
    <g transform="translate(140, 80) rotate(-6)">
      <rect width="280" height="175" rx="16" fill="url(#hero_card_1)" filter="drop-shadow(0 20px 30px rgba(10,25,47,0.35))" />
      <circle cx="230" cy="45" r="16" fill="#06B6D4" opacity="0.8" />
      <rect x="25" y="30" width="36" height="26" rx="4" fill="#FCD34D" />
      <rect x="25" y="105" width="140" height="12" rx="4" fill="white" opacity="0.9" />
      <rect x="25" y="130" width="80" height="8" rx="3" fill="white" opacity="0.5" />
      <rect x="200" y="130" width="50" height="8" rx="3" fill="white" opacity="0.5" />
    </g>

    {/* Floating Card 2 */}
    <g transform="translate(200, 160) rotate(8)">
      <rect width="280" height="175" rx="16" fill="url(#hero_card_2)" filter="drop-shadow(0 25px 40px rgba(10,25,47,0.45))" />
      <circle cx="230" cy="45" r="16" fill="#38BDF8" opacity="0.8" />
      <rect x="25" y="30" width="36" height="26" rx="4" fill="#FCD34D" />
      <rect x="25" y="105" width="140" height="12" rx="4" fill="white" opacity="0.9" />
      <rect x="25" y="130" width="80" height="8" rx="3" fill="white" opacity="0.5" />
      <rect x="200" y="130" width="50" height="8" rx="3" fill="white" opacity="0.5" />
    </g>

    {/* Floating Badges & Metric Pills */}
    <g transform="translate(80, 260)">
      <rect width="160" height="60" rx="14" fill="#0F172A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))" />
      <circle cx="30" cy="30" r="14" fill="#10B981" />
      <path d="M24 30L28 34L36 26" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <text x="54" y="27" fill="#94A3B8" fontSize="10" fontWeight="600">TRANSFER</text>
      <text x="54" y="44" fill="#FFFFFF" fontSize="13" fontWeight="bold">+₹1,25,000</text>
    </g>

    <g transform="translate(380, 60)">
      <rect width="140" height="55" rx="14" fill="#0F172A" stroke="rgba(255,255,255,0.15)" strokeWidth="1" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.3))" />
      <circle cx="28" cy="28" r="12" fill="#0284C7" />
      <path d="M28 20V36M22 26L28 20L34 26" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <text x="50" y="25" fill="#94A3B8" fontSize="9" fontWeight="600">SECURITY</text>
      <text x="50" y="40" fill="#38BDF8" fontSize="12" fontWeight="bold">256-Bit SSL</text>
    </g>

    <defs>
      <radialGradient id="hero_mesh" cx="0.5" cy="0.5" r="0.5">
        <stop stopColor="#0284C7" stopOpacity="0.4" />
        <stop offset="0.7" stopColor="#06B6D4" stopOpacity="0.1" />
        <stop offset="1" stopColor="#0A192F" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="hero_card_1" x1="0" y1="0" x2="280" y2="175" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0A192F" />
        <stop offset="1" stopColor="#1E293B" />
      </linearGradient>
      <linearGradient id="hero_card_2" x1="0" y1="0" x2="280" y2="175" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0369A1" />
        <stop offset="1" stopColor="#0F172A" />
      </linearGradient>
    </defs>
  </svg>
);
