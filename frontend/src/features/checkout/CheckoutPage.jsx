import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services/ecommerceServices';
import { formatCurrency } from '../../utils/formatters';
import { PAYMENT_METHODS } from '../../utils/constants';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Alert } from '../../components/ui/Alert';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

export const CheckoutPage = () => {
  const { cartItems, subtotal, discountAmount, shippingFee, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingData, setShippingData] = useState({
    fullName: user?.fullName || 'Esakki Durai',
    email: user?.email || 'user@edkart.com',
    phone: '+91 98765 43210',
    street: 'No. 42, Tech Park Boulevard',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560100',
  });

  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add products to your cart before proceeding to checkout.</p>
        <Link to="/shop">
          <Button variant="primary" size="md">
            Go to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError(null);

    if (!shippingData.fullName || !shippingData.street || !shippingData.city || !shippingData.pincode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        email: shippingData.email,
        shippingAddress: shippingData,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        subtotal,
        discount: discountAmount,
        shippingFee,
        totalAmount,
        paymentMethod: PAYMENT_METHODS.find((p) => p.id === selectedPayment)?.name || 'UPI',
      };

      const res = await orderService.createOrder(orderPayload);
      clearCart();
      navigate(`/orders/success/${res.orderNo || res.order?.orderNumber || 'CONFIRMED'}`);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Secure Express Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">Complete your delivery address and instant payment selection</p>
      </div>

      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping + Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* 1. Shipping Address */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Shipping & Delivery Address</h3>
                <p className="text-[11px] text-slate-400">Where should we deliver your items?</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                required
                value={shippingData.fullName}
                onChange={(e) => setShippingData({ ...shippingData, fullName: e.target.value })}
              />

              <Input
                label="Mobile Phone Number"
                type="tel"
                required
                value={shippingData.phone}
                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
              />
            </div>

            <Input
              label="Street Address / Building / Flat"
              required
              value={shippingData.street}
              onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="City"
                required
                value={shippingData.city}
                onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
              />

              <Input
                label="State"
                required
                value={shippingData.state}
                onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
              />

              <Input
                label="Pincode"
                required
                value={shippingData.pincode}
                onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
              />
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Payment Options</h3>
                <p className="text-[11px] text-slate-400">All transactions are encrypted and insured</p>
              </div>
            </div>

            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPayment === method.id;
                return (
                  <label
                    key={method.id}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/50 dark:bg-slate-800/80 dark:border-amber-400'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={isSelected}
                        onChange={() => setSelectedPayment(method.id)}
                        className="text-brand-600"
                      />
                      <div>
                        <span className="font-bold text-xs text-slate-900 dark:text-white block">
                          {method.name}
                        </span>
                        <span className="text-[11px] text-slate-400 block">{method.description}</span>
                      </div>
                    </div>

                    {method.id === 'upi' && <QrCode className="w-5 h-5 text-brand-600 dark:text-amber-400" />}
                    {method.id === 'card' && <CreditCard className="w-5 h-5 text-slate-400" />}
                    {method.id === 'netbanking' && <Building2 className="w-5 h-5 text-slate-400" />}
                    {method.id === 'cod' && <Banknote className="w-5 h-5 text-emerald-500" />}
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Place Order */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 sticky top-24">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Order Summary</h3>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1 space-y-2 text-xs">
              {cartItems.map((item) => (
                <div key={item.productId} className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white font-mono flex-shrink-0">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : formatCurrency(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-100 dark:border-slate-800">
                <span>Total Amount</span>
                <span className="text-brand-600 dark:text-amber-400">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              leftIcon={<Lock className="w-4 h-4" />}
            >
              Place Order ({formatCurrency(totalAmount)})
            </Button>

            <div className="text-center text-[10px] text-slate-400">
              By placing your order, you agree to EdKart's Terms and Conditions.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
