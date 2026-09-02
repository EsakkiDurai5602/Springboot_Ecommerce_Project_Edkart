import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/bankingServices';
import {
  ShieldAlert,
  Search,
  Download,
  CheckCircle2,
  AlertTriangle,
  Server,
  Lock,
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const AdminSystemLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminService.getSystemLogs().then(setLogs);
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.event.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.ip.includes(search)
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Security & System Audit Logs
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Cryptographically recorded security logs, IP origin tracking, and administrative audit trails
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter logs by event, user, IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Logs Table */}
      <Card variant="default">
        <Table headers={['Audit Event', 'User ID / Email', 'IP Address', 'Details', 'Timestamp', 'Status']}>
          {filtered.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                {log.event}
              </TableCell>
              <TableCell className="text-xs text-slate-700 dark:text-slate-300">{log.user}</TableCell>
              <TableCell className="font-mono text-xs text-slate-500">{log.ip}</TableCell>
              <TableCell className="text-xs text-slate-600 dark:text-slate-400">
                {log.details || 'System automated verification'}
              </TableCell>
              <TableCell className="text-xs text-slate-400 font-mono">{formatDateTime(log.timestamp)}</TableCell>
              <TableCell>
                <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'} size="sm" dot>
                  {log.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
