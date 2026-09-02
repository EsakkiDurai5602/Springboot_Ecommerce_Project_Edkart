import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getProductImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Alert } from '../../components/ui/Alert';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  ArrowLeft,
  X,
} from 'lucide-react';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingFee,
    totalAmount,
    totalItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);
  const navigate = useNavigate();

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
    setCouponInput('');
  };

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-lg">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our latest flagship smartphones, M3 MacBooks, Sony audio, and gaming gear.
        </p>
        <Link to="/shop">
          <Button variant="primary" size="lg">
            Explore Electronics Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Shopping Cart ({totalItems} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your tech products before instant checkout</p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Cart</span>
        </button>
      </div>

      {couponMsg && (
        <Alert
          variant={couponMsg.success ? 'success' : 'error'}
          onClose={() => setCouponMsg(null)}
        >
          {couponMsg.message}
        </Alert>
      )}

      {/* Main Grid: Cart Items + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="p-4 rounded-3xl bg-brand-50 dark:bg-slate-900 border border-brand-100 dark:border-slate-800 text-xs">
            <div className="flex items-center justify-between font-bold text-xs mb-2">
              <span className="flex items-center gap-2 text-brand-700 dark:text-amber-400">
                <Truck className="w-4 h-4" />
                {remainingForFreeShipping > 0
                  ? `Add ${formatCurrency(remainingForFreeShipping)} more to qualify for FREE Express Shipping!`
                  : '🎉 Congratulations! You have unlocked FREE Express Delivery.'}
              </span>
              <span className="font-mono text-slate-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Line items */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-center gap-4">
                <Link to={`/product/${item.productId}`} className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = CATEGORY_FALLBACK_IMAGES[item.category] || CATEGORY_FALLBACK_IMAGES.default;
                    }}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-amber-400">
                    {item.category}
                  </span>
                  <Link to={`/product/${item.productId}`}>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate hover:text-brand-600 transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="text-[11px] text-slate-400">Seller: {item.seller || 'EdKart Verified'}</p>
                </div>

                {/* Price & Quantity Controls */}
                <div className="flex items-center gap-6">
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-xs font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[90px]">
                    <span className="font-black text-sm text-slate-900 dark:text-white block">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        ({formatCurrency(item.price)} each)
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs">
            <Link to="/shop" className="text-brand-600 dark:text-amber-400 font-bold flex items-center gap-1.5 hover:underline">
              <ArrowLeft className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="font-black text-base text-slate-900 dark:text-white">Order Summary</h3>

            {/* Coupon Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-brand-500" />
                <span>Promo Code</span>
              </label>

              {appliedCoupon ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-black font-mono text-emerald-800 dark:text-emerald-300">
                      {appliedCoupon.code}
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                      {appliedCoupon.discountPercent}% Discount Applied
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="p-1 text-slate-400 hover:text-rose-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Try EDKART10"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 uppercase font-mono font-bold focus:outline-none"
                  />
                  <Button type="submit" variant="secondary" size="md">
                    Apply
                  </Button>
                </form>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2.5 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Savings</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span>
                  {shippingFee === 0 ? <strong className="text-emerald-500 font-bold">FREE</strong> : formatCurrency(shippingFee)}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-brand-600 dark:text-amber-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Link to="/checkout" className="block">
              <Button variant="primary" fullWidth size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Proceed to Checkout
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>256-Bit SSL Encrypted & Insured Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
