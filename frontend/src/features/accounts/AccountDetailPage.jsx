import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  Wallet,
  ArrowLeft,
  Download,
  SendHorizontal,
  Calendar,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Printer,
  Share2,
} from 'lucide-react';
import { formatCurrency, formatDate, formatDateTime, maskAccountNumber } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const AccountDetailPage = () => {
  const { id } = useParams();
  const { accounts, transactions } = useBanking();
  const [statementMonth, setStatementMonth] = useState('August 2026');

  const account = accounts.find((a) => a.id === id || a.accountNumber === id) || accounts[0];
  const accountTxns = transactions.filter((t) => t.accountId === account?.id);

  const handleDownloadStatement = () => {
    alert(`Downloading e-Statement PDF for ${account.accountType} (${statementMonth})...`);
  };

  if (!account) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Account not found.</p>
        <Link to="/accounts" className="text-brand-600 font-bold hover:underline mt-2 inline-block">
          Back to Accounts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/accounts" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Accounts</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button onClick={handleDownloadStatement} variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Download PDF
          </Button>
          <Link to="/transfer" state={{ presetSourceId: account.id }}>
            <Button variant="primary" size="sm" leftIcon={<SendHorizontal className="w-4 h-4" />}>
              Transfer from Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Balance Card */}
      <Card variant="navy" className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-2">
            <Badge variant="info" size="sm">
              {account.accountType}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {formatCurrency(account.balance)}
            </h2>
            <p className="text-xs text-slate-400">
              Account No: <span className="font-mono text-slate-200">{account.accountNumber}</span>
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-300 border-l border-slate-800 pl-0 md:pl-6">
            <p><strong className="text-white">IFSC Code:</strong> {account.ifsc}</p>
            <p><strong className="text-white">Branch:</strong> {account.branch}</p>
            <p><strong className="text-white">Opened On:</strong> {formatDate(account.openedDate)}</p>
          </div>

          <div className="space-y-2 text-xs text-slate-300 border-l border-slate-800 pl-0 md:pl-6">
            <p><strong className="text-white">Status:</strong> <span className="text-emerald-400 font-bold">{account.status}</span></p>
            <p><strong className="text-white">Interest Yield:</strong> {account.interestRate}% p.a.</p>
            <p><strong className="text-white">Currency:</strong> INR (Indian Rupee)</p>
          </div>
        </div>
      </Card>

      {/* Account Transactions History */}
      <Card variant="default">
        <CardHeader
          title="Account Transaction Statement"
          subtitle={`Showing ${accountTxns.length} transaction records for this account`}
          action={
            <div className="flex items-center gap-2">
              <select
                value={statementMonth}
                onChange={(e) => setStatementMonth(e.target.value)}
                className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="September 2026">September 2026</option>
                <option value="August 2026">August 2026</option>
                <option value="July 2026">July 2026</option>
                <option value="Custom Range">Custom Range</option>
              </select>
            </div>
          }
        />

        <Table headers={['Date & Time', 'Transaction Reference', 'Description', 'Type', 'Amount', 'Status']}>
          {accountTxns.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-8 text-xs text-slate-400">
                No transaction records found for this account.
              </td>
            </tr>
          ) : (
            accountTxns.map((t) => {
              const isCredit = t.type === 'CREDIT';
              return (
                <TableRow key={t.id}>
                  <TableCell className="text-xs text-slate-500">{formatDateTime(t.date)}</TableCell>
                  <TableCell className="font-mono text-xs font-semibold text-brand-600 dark:text-cyan-400">
                    <Link to={`/transactions/${t.id}`}>{t.referenceId}</Link>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                    {t.description}
                  </TableCell>
                  <TableCell>
                    <Badge variant={isCredit ? 'success' : 'neutral'} size="sm">
                      {t.type}
                    </Badge>
                  </TableCell>
                  <TableCell className={`font-mono text-xs font-bold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm" dot>
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </Table>
      </Card>
    </div>
  );
};
