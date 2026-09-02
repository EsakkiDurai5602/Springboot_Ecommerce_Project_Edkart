import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../../services/ecommerceServices';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Package,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrders().then((res) => {
      setOrders(res || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-600 animate-bounce flex items-center justify-center text-white font-black">
          EK
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Your Order History
        </h1>
        <p className="text-xs text-slate-500 mt-1">Track delivery packages and review past electronics invoices</p>
      </div>

      {orders.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Orders Found</h3>
          <p className="text-xs text-slate-500">You haven't placed any orders yet. Start exploring our latest electronics drops.</p>
          <Link to="/shop">
            <Button variant="primary" size="md">
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm"
            >
              {/* Top Order Metadata Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Order Reference</span>
                  <p className="font-mono font-bold text-sm text-slate-900 dark:text-white">{ord.orderNumber}</p>
                </div>

                <div className="space-y-1 sm:text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Date Placed</span>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{formatDateTime(ord.orderDate)}</p>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Paid</span>
                  <p className="font-mono font-black text-sm text-brand-600 dark:text-amber-400">
                    {formatCurrency(ord.totalAmount)}
                  </p>
                </div>

                <Badge
                  variant={
                    ord.orderStatus === 'DELIVERED'
                      ? 'success'
                      : ord.orderStatus === 'SHIPPED'
                      ? 'brand'
                      : 'warning'
                  }
                  size="md"
                  dot
                >
                  {ord.orderStatus}
                </Badge>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {ord.items?.map((item, i) => (
                  <div key={i} className="py-3 first:pt-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <Link to={`/product/${item.productId}`}>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate hover:text-brand-600">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-[11px] text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <Truck className="w-4 h-4 text-brand-500" />
                  <span>Delivery to: <strong className="text-slate-800 dark:text-slate-200">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</strong></span>
                </div>

                <Link to={`/orders/success/${ord.orderNumber}`}>
                  <Button variant="secondary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    View Tax Invoice
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
