import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, orderService } from '../../services/ecommerceServices';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    Promise.all([productService.getProducts(), orderService.getOrders()]).then(([p, o]) => {
      setProducts(p.products || []);
      setOrders(o || []);
    });
  }, []);

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const lowStockProducts = products.filter((p) => p.stock <= 15);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <Badge variant="warning" size="sm">
            STORE OPERATIONS COMMAND
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            EdKart E-Commerce Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Real-time sales revenue, inventory tracking, and pending customer order fulfillment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="cyan" leftIcon={<Plus className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
          <Link to="/admin/orders">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Manage Orders ({orders.length})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Sales Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block font-mono">
            {formatCurrency(totalRevenue)}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold">+18.4% this week</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Customer Orders</span>
            <ShoppingBag className="w-4 h-4 text-brand-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block font-mono">
            {orders.length}
          </span>
          <span className="text-[11px] text-slate-400">Lifetime purchases</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Products</span>
            <Package className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block font-mono">
            {products.length}
          </span>
          <span className="text-[11px] text-slate-400">Across 8 categories</span>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Low Stock Warnings</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block font-mono">
            {lowStockProducts.length}
          </span>
          <span className="text-[11px] text-rose-500 font-bold">Needs restock</span>
        </div>
      </div>

      {/* Grid: Recent Orders + Inventory status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7">
          <Card variant="default">
            <CardHeader
              title="Recent Customer Orders"
              subtitle="Latest transactions requiring packaging & dispatch"
              action={
                <Link to="/admin/orders" className="text-xs text-brand-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {orders.slice(0, 4).map((o) => (
                <div key={o.id} className="p-4 sm:px-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{o.customerName}</h4>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">{o.orderNumber} • {formatDateTime(o.orderDate)}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-xs text-slate-900 dark:text-white block">
                      {formatCurrency(o.totalAmount)}
                    </span>
                    <Badge variant={o.orderStatus === 'DELIVERED' ? 'success' : 'warning'} size="sm">
                      {o.orderStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Low Stock Items Alert */}
        <div className="lg:col-span-5">
          <Card variant="default">
            <CardHeader
              title="Inventory Low-Stock Alerts"
              subtitle="Products with 15 or fewer units in warehouse"
            />
            <CardBody className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {lowStockProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="p-4 sm:px-6 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.images?.[0]?.url} alt={p.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{p.name}</h4>
                      <span className="text-[10px] text-slate-400">{p.category}</span>
                    </div>
                  </div>

                  <Badge variant="danger" size="sm">
                    {p.stock} units left
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
