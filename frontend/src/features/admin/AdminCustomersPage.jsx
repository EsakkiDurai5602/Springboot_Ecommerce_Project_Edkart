import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/bankingServices';
import {
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const loadCustomers = async () => {
    const list = await adminService.getCustomers();
    setCustomers(list || []);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleUpdateKYC = async (customerId, newStatus) => {
    await adminService.updateCustomerKYC(customerId, newStatus);
    await loadCustomers();
  };

  const handleToggleLock = async (customerId, currentLocked) => {
    await adminService.toggleCustomerLock(customerId, !currentLocked);
    await loadCustomers();
  };

  const filtered = customers.filter((c) => {
    const matchStatus = statusFilter === 'all' || c.kycStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.fullName.toLowerCase().includes(q) ||
      c.customerId.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.panNumber.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Management & KYC Approval Queue
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review customer identity compliance, approve/reject KYC, and manage account locks
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by customer name, PAN, ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        >
          <option value="all">All KYC Statuses</option>
          <option value="PENDING">Pending Verification</option>
          <option value="VERIFIED">Verified & Active</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Customer Table */}
      <Card variant="default">
        <Table headers={['Customer Name & ID', 'Contact / Email', 'PAN Number', 'Total Deposits', 'KYC Status', 'Account Access', 'Actions']}>
          {filtered.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.fullName}</h4>
                  <span className="font-mono text-[10px] text-slate-400">{c.customerId}</span>
                </div>
              </TableCell>

              <TableCell className="text-xs">
                <span className="text-slate-700 dark:text-slate-300 block">{c.email}</span>
                <span className="text-[10px] text-slate-400">{c.phone}</span>
              </TableCell>

              <TableCell className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                {c.panNumber}
              </TableCell>

              <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(c.balance || 0)}
              </TableCell>

              <TableCell>
                <Badge
                  variant={c.kycStatus === 'VERIFIED' ? 'success' : c.kycStatus === 'PENDING' ? 'warning' : 'danger'}
                  size="sm"
                  dot
                >
                  {c.kycStatus}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge variant={c.isLocked ? 'danger' : 'success'} size="sm">
                  {c.isLocked ? 'LOCKED' : 'ACTIVE'}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1.5">
                  {c.kycStatus === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => handleUpdateKYC(c.customerId, 'VERIFIED')}
                        variant="success"
                        size="sm"
                        leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleUpdateKYC(c.customerId, 'REJECTED')}
                        variant="danger"
                        size="sm"
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  <Button
                    onClick={() => handleToggleLock(c.customerId, c.isLocked)}
                    variant={c.isLocked ? 'success' : 'outline'}
                    size="sm"
                    leftIcon={c.isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  >
                    {c.isLocked ? 'Unlock' : 'Lock'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
