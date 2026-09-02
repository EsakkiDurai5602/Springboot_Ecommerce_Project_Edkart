import React, { useState, useEffect } from 'react';
import { documentService } from '../../services/bankingServices';
import {
  FileText,
  Download,
  Search,
  Filter,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';

export const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    documentService.getDocuments().then(setDocuments);
  }, []);

  const handleDownload = (doc) => {
    setDownloadingId(doc.id);
    setTimeout(() => {
      setDownloadingId(null);
      // Create mock download
      const element = document.createElement('a');
      const file = new Blob([`EdKart Bank Official e-Document\nTitle: ${doc.title}\nAccount: ${doc.accountNumber}\nDate: ${doc.date}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${doc.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 600);
  };

  const filtered = documents.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          e-Documents & Statements
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Download monthly account statements, interest certificates, and official tax receipts
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search statements, tax certificates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Documents Table */}
      <Card variant="default">
        <Table headers={['Document Title', 'Associated Account', 'Format / Type', 'Issued Date', 'Action']}>
          {filtered.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{doc.title}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{doc.size}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                ••{doc.accountNumber.slice(-4)}
              </TableCell>
              <TableCell>
                <Badge variant="info" size="sm">
                  {doc.type}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-500">{formatDate(doc.date)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => handleDownload(doc)}
                  variant="outline"
                  size="sm"
                  isLoading={downloadingId === doc.id}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>
    </div>
  );
};
