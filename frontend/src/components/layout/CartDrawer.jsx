import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency, getProductImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/formatters';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from 'lucide-react';

export const CartDrawer = () => {
  const {
    cartItems,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalAmount,
    discountAmount,
    shippingFee,
    totalItems,
  } = useCart();

  const freeShippingThreshold = 1000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <Drawer
      isOpen={isCartDrawerOpen}
      onClose={() => setIsCartDrawerOpen(false)}
      title={`Your Shopping Cart (${totalItems})`}
      position="right"
    >
      <div className="flex flex-col h-full -mx-4 -my-4 p-4 text-slate-900 dark:text-slate-100">
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Your cart is empty</h3>
              <p className="text-xs text-slate-500 mt-1">Discover trending tech products and flagship deals.</p>
            </div>
            <Link to="/shop" onClick={() => setIsCartDrawerOpen(false)}>
              <Button variant="primary" size="sm">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Free Shipping Progress Indicator */}
            <div className="p-3 mb-3 rounded-2xl bg-brand-50 dark:bg-slate-800/80 border border-brand-100 dark:border-slate-700 text-xs">
              <div className="flex items-center justify-between font-bold text-[11px] mb-1.5">
                <span className="flex items-center gap-1.5 text-brand-700 dark:text-amber-400">
                  <Truck className="w-3.5 h-3.5" />
                  {remainingForFreeShipping > 0
                    ? `Add ${formatCurrency(remainingForFreeShipping)} more for FREE Shipping`
                    : '🎉 You have unlocked FREE Express Delivery!'}
                </span>
                <span className="font-mono text-slate-500">{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-500 to-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Line Items List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-2">
              {cartItems.map((item) => (
                <div key={item.productId} className="py-3 flex gap-3 items-center">
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = CATEGORY_FALLBACK_IMAGES[item.category] || CATEGORY_FALLBACK_IMAGES.default;
                    }}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="font-bold text-xs text-brand-600 dark:text-amber-400 mt-0.5">
                      {formatCurrency(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-xs font-mono">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Drawer Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900 mt-2">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount Applied</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span>Estimated Shipping</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-500">FREE</strong> : formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total Due</span>
                  <span className="text-brand-600 dark:text-amber-400">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/cart"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full"
                >
                  <Button variant="secondary" fullWidth size="md">
                    View Cart
                  </Button>
                </Link>

                <Link
                  to="/checkout"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" fullWidth size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};
