import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  Heart,
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      {/* Value Proposition Bar */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Free Express Shipping</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">On all orders above ₹1,000</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Genuine Products</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Brand warranty & verification</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Easy 30-Day Returns</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Hassle-free instant refund</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 Tech Concierge</h4>
              <p className="text-slate-500 text-[11px] mt-0.5">Dedicated customer support</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Brand Column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-black text-xl text-white tracking-tight">
              Ed<span className="text-brand-500">Kart</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            India's most trusted next-generation marketplace for premium laptops, smartphones, gaming consoles, and authentic tech accessories.
          </p>
          <div className="flex items-center gap-2 text-slate-300">
            <Mail className="w-4 h-4 text-brand-400" />
            <span>support@edkart.com</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-3">Categories</h4>
          <ul className="space-y-2">
            <li><Link to="/shop?category=Smartphones" className="hover:text-white transition-colors">Flagship Smartphones</Link></li>
            <li><Link to="/shop?category=Laptops" className="hover:text-white transition-colors">Pro Laptops & MacBooks</Link></li>
            <li><Link to="/shop?category=Audio" className="hover:text-white transition-colors">Noise Cancelling Audio</Link></li>
            <li><Link to="/shop?category=Wearables" className="hover:text-white transition-colors">Smartwatches & Bands</Link></li>
            <li><Link to="/shop?category=Gaming" className="hover:text-white transition-colors">PlayStation & Gaming</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-3">Customer Desk</h4>
          <ul className="space-y-2">
            <li><Link to="/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Cart</Link></li>
            <li><a href="#faq" className="hover:text-white transition-colors">Shipping & Returns</a></li>
            <li><a href="#terms" className="hover:text-white transition-colors">Terms of Service</a></li>
            <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter Box */}
        <div>
          <h4 className="text-white font-bold uppercase text-[11px] tracking-wider mb-3">Get VIP Tech Deals</h4>
          <p className="text-[11px] text-slate-400 mb-3">Subscribe for exclusive launch drops and flash discount codes.</p>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full text-xs px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
            <button
              type="submit"
              className="w-full text-xs font-bold py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl transition-colors"
            >
              Subscribe Free
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-6 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 EdKart Technologies Pvt Ltd. All rights reserved.</p>
          <p className="flex items-center justify-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for tech enthusiasts
          </p>
        </div>
      </div>
    </footer>
  );
};
