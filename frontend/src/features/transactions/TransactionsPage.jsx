import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  Receipt,
  Search,
  Filter,
  Download,
  Calendar,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { TRANSACTION_CATEGORIES } from '../../utils/constants';

export const TransactionsPage = () => {
  const { transactions, accounts } = useBanking();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchAccount = selectedAccount === 'all' || t.accountId === selectedAccount;
      const matchType = selectedType === 'all' || t.type === selectedType;
      const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        t.description.toLowerCase().includes(q) ||
        t.referenceId.toLowerCase().includes(q) ||
        (t.recipient && t.recipient.toLowerCase().includes(q)) ||
        (t.sender && t.sender.toLowerCase().includes(q));

      return matchAccount && matchType && matchCategory && matchSearch;
    });
  }, [transactions, selectedAccount, selectedType, selectedCategory, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleExportCSV = () => {
    const csvHeader = 'Reference,Date,Description,Type,Category,Amount,Status\n';
    const csvRows = filtered
      .map(
        (t) =>
          `"${t.referenceId}","${t.date}","${t.description}","${t.type}","${t.category}","${t.amount}","${t.status}"`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_export_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Transaction History
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Search, filter, and audit all incoming and outgoing financial transactions
          </p>
        </div>

        <Button
          onClick={handleExportCSV}
          variant="outline"
          leftIcon={<Download className="w-4 h-4" />}
        >
          Export CSV Records
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card variant="default">
        <CardBody className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search query input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search reference, recipient..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Account filter */}
            <select
              value={selectedAccount}
              onChange={(e) => {
                setSelectedAccount(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Linked Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.accountType} ({acc.accountNumber.slice(-4)})
                </option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Flow Types</option>
              <option value="DEBIT">Debit (Money Out)</option>
              <option value="CREDIT">Credit (Money In)</option>
            </select>

            {/* Category filter */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {TRANSACTION_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </CardBody>
      </Card>

      {/* Transactions Table */}
      <Card variant="default">
        <Table headers={['Date & Time', 'Reference ID', 'Description', 'Category', 'Amount', 'Status', 'Action']}>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-12 text-xs text-slate-400">
                No matching transactions found with current filters.
              </td>
            </tr>
          ) : (
            paginated.map((txn) => {
              const isCredit = txn.type === 'CREDIT';
              return (
                <TableRow key={txn.id}>
                  <TableCell className="text-xs text-slate-500">{formatDateTime(txn.date)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-brand-600 dark:text-cyan-400">
                    {txn.referenceId}
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 block">
                      {txn.description}
                    </span>
                    {txn.recipient && (
                      <span className="text-[10px] text-slate-400">To: {txn.recipient}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                      {txn.category || 'General'}
                    </span>
                  </TableCell>
                  <TableCell className={`font-mono text-xs font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={txn.status === 'COMPLETED' ? 'success' : 'warning'} size="sm" dot>
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/transactions/${txn.id}`}
                      className="text-xs text-brand-600 dark:text-cyan-400 hover:underline font-semibold flex items-center gap-0.5"
                    >
                      <span>Receipt</span>
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </Table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
        />
      </Card>
    </div>
  );
};
