import React, { useState, useEffect } from 'react';
import { transactionService } from '../../services/bankingServices';
import {
  Receipt,
  Search,
  Filter,
  Download,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    transactionService.getTransactions().then((res) => {
      setTransactions(res.transactions || []);
    });
  }, []);

  const filtered = transactions.filter((t) => {
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      t.description.toLowerCase().includes(q) ||
      t.referenceId.toLowerCase().includes(q) ||
      (t.recipient && t.recipient.toLowerCase().includes(q));

    return matchType && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          System-Wide Transaction Oversight
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Real-time settlement surveillance and fraud prevention auditing across all customer accounts
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by reference ID, recipient, narration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
        >
          <option value="all">All Transaction Types</option>
          <option value="DEBIT">Debit Transfers</option>
          <option value="CREDIT">Credit Deposits</option>
        </select>
      </div>

      {/* Transactions Table */}
      <Card variant="default">
        <Table headers={['Reference ID', 'Timestamp', 'Description / Payee', 'Amount', 'Flow', 'Status']}>
          {filtered.map((t) => {
            const isCredit = t.type === 'CREDIT';
            const isHighValue = t.amount >= 100000;
            return (
              <TableRow key={t.id}>
                <TableCell className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {t.referenceId}
                </TableCell>
                <TableCell className="text-xs text-slate-500">{formatDateTime(t.date)}</TableCell>
                <TableCell>
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">{t.description}</span>
                  {t.recipient && <span className="text-[10px] text-slate-400">To: {t.recipient}</span>}
                </TableCell>
                <TableCell className={`font-mono text-xs font-bold ${isCredit ? 'text-emerald-600' : 'text-slate-900 dark:text-slate-100'}`}>
                  {formatCurrency(t.amount)}
                  {isHighValue && (
                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[9px] font-bold">
                      HIGH VALUE
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={isCredit ? 'success' : 'neutral'} size="sm">
                    {t.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="success" size="sm" dot>
                    {t.status}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>
      </Card>
    </div>
  );
};
