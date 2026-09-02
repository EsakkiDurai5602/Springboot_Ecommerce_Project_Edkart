import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../../services/ecommerceServices';
import { formatCurrency, formatDateTime, getProductImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowRight,
  Truck,
  ShoppingBag,
} from 'lucide-react';

export const OrderSuccessPage = () => {
  const { orderNo } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    orderService.getOrderById(orderNo).then(setOrder).catch(() => {});
  }, [orderNo]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-8">
      {/* Success Badge */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Thank you for choosing EdKart. We have received your order and our fulfillment warehouse is packaging your items.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>Order ID:</span>
          <span className="text-brand-600 dark:text-amber-400">{orderNo}</span>
        </div>
      </div>

      {/* Order Details Voucher */}
      {order && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs text-slate-400">Order Placed On:</span>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{formatDateTime(order.orderDate)}</p>
            </div>
            <Badge variant="success" size="md" dot>
              {order.orderStatus}
            </Badge>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Purchased Items</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getProductImageUrl(item)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = CATEGORY_FALLBACK_IMAGES.default;
                      }}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-400">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address & Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <h4 className="font-bold uppercase tracking-wider text-slate-400 mb-1">Delivery Address</h4>
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p className="text-slate-500">{order.shippingAddress?.street}</p>
              <p className="text-slate-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>

            <div className="space-y-1.5 text-right sm:text-right">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Total Paid:</span>
                <span className="text-brand-600 dark:text-amber-400">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action CTA buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print Tax Invoice</span>
        </button>

        <Link to="/orders" className="w-full sm:w-auto">
          <Button variant="secondary" size="lg" fullWidth leftIcon={<Package className="w-4 h-4" />}>
            View All Orders
          </Button>
        </Link>

        <Link to="/shop" className="w-full sm:w-auto">
          <Button variant="primary" size="lg" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};
