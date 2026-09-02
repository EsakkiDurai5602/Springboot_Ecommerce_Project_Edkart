import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, productService } from '../../services/bankingServices';
import {
  Users,
  Package,
  Receipt,
  Headphones,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { StatCard } from '../../components/ui/StatCard';

export const AdminDashboardPage = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    Promise.all([
      adminService.getCustomers(),
      productService.getProducts(),
      adminService.getTickets(),
      adminService.getSystemLogs(),
    ]).then(([c, p, t, l]) => {
      setCustomers(c || []);
      setProducts(p || []);
      setTickets(t || []);
      setLogs(l || []);
    });
  }, []);

  const pendingKycCount = customers.filter((c) => c.kycStatus === 'PENDING').length;
  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;
  const totalCustomerBalances = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 shadow-xl">
        <div className="space-y-2">
          <Badge variant="warning" size="sm">
            BANK TREASURY & RISK CONTROL
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Central Banking Administration
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Monitor real-time liquidity, KYC compliance pipeline, product catalogs, and dispute resolution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="cyan" leftIcon={<Package className="w-4 h-4" />}>
              Add Product
            </Button>
          </Link>
          <Link to="/admin/customers">
            <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
              Review KYC ({pendingKycCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Deposits Managed"
          value={formatCurrency(totalCustomerBalances)}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          trend={{ value: '+8.4%', isPositive: true }}
        />

        <StatCard
          title="Registered Customers"
          value={customers.length.toString()}
          icon={<Users className="w-5 h-5 text-brand-500" />}
          subtext={`${pendingKycCount} KYC verifications pending`}
        />

        <StatCard
          title="Active Products Catalog"
          value={products.length.toString()}
          icon={<Package className="w-5 h-5 text-amber-500" />}
          subtext="Cards, Savings, Loans & SIPs"
        />

        <StatCard
          title="Open Dispute Tickets"
          value={openTicketsCount.toString()}
          icon={<Headphones className="w-5 h-5 text-rose-500" />}
          subtext="Customer resolution desk"
        />
      </div>

      {/* Main Grid: Pending KYC Queue & Recent System Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Customer KYC Approvals */}
        <div className="lg:col-span-6">
          <Card variant="default">
            <CardHeader
              title="Customer KYC Verification Queue"
              subtitle="Review uploaded PAN & identity documentation"
              action={
                <Link to="/admin/customers" className="text-xs text-brand-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {customers.slice(0, 4).map((c) => (
                <div key={c.id} className="p-4 sm:px-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">{c.fullName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {c.customerId} • PAN: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{c.panNumber}</span>
                    </p>
                  </div>

                  <Badge
                    variant={c.kycStatus === 'VERIFIED' ? 'success' : c.kycStatus === 'PENDING' ? 'warning' : 'danger'}
                    size="sm"
                    dot
                  >
                    {c.kycStatus}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        {/* Security & Audit Events */}
        <div className="lg:col-span-6">
          <Card variant="default">
            <CardHeader
              title="Real-Time Security & Audit Feed"
              subtitle="Latest system transfers, logins, and permission changes"
              action={
                <Link to="/admin/logs" className="text-xs text-brand-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1">
                  <span>Audit Logs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              }
            />
            <CardBody className="divide-y divide-slate-100 dark:divide-slate-800 p-0">
              {logs.slice(0, 4).map((log) => (
                <div key={log.id} className="p-4 sm:px-6 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{log.event}</span>
                      <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'} size="sm">
                        {log.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 mt-0.5">{log.details || `Triggered by ${log.user}`}</p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{formatDateTime(log.timestamp)}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
