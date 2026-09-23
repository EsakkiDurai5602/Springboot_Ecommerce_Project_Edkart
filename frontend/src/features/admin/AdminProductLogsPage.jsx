import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productLogService, productService } from '../../services/ecommerceServices';
import { INITIAL_PRODUCTS, INITIAL_PRODUCT_LOGS } from '../../services/ecommerceData';
import { formatCurrency, formatDateTime, getProductImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import {
  History,
  Search,
  PlusCircle,
  RefreshCw,
  Trash2,
  AlertTriangle,
  Package,
  Layers,
  ShieldCheck,
  Filter,
  CheckCircle2,
  Sparkles,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';

export const AdminProductLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Inspect Log Modal State
  const [inspectLog, setInspectLog] = useState(null);
  const [inspectProduct, setInspectProduct] = useState(null);
  const [quickStockInput, setQuickStockInput] = useState(0);
  const [updateMsg, setUpdateMsg] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    const data = await productLogService.getProductLogs();
    setLogs(data || []);
    setLoading(false);
  };

  const handleResyncAll = async () => {
    localStorage.removeItem('edkart_ec_catalog_version');
    localStorage.removeItem('edkart_ec_products');
    localStorage.removeItem('edkart_ec_product_logs');
    localStorage.setItem('edkart_ec_catalog_version', 'v3_525_real_photos');
    localStorage.setItem('edkart_ec_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('edkart_ec_product_logs', JSON.stringify(INITIAL_PRODUCT_LOGS));
    await loadLogs();
    setUpdateMsg('Successfully refreshed and synchronized all 105 real photorealistic products & 109 admin logs!');
    setTimeout(() => setUpdateMsg(null), 3500);
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleInspect = async (log) => {
    setInspectLog(log);
    if (log.productId) {
      const prod = await productService.getProductById(log.productId);
      setInspectProduct(prod || null);
      if (prod) setQuickStockInput(prod.stock || 0);
    } else {
      setInspectProduct(null);
    }
  };

  const handleQuickRestock = async () => {
    if (!inspectProduct) return;
    const newStock = Number(quickStockInput);
    if (isNaN(newStock) || newStock < 0) return;
    await productService.updateStock(inspectProduct.id, newStock);
    setInspectProduct({ ...inspectProduct, stock: newStock });
    setUpdateMsg(`Warehouse stock updated to ${newStock} units and audit log created!`);
    await loadLogs();
    setTimeout(() => setUpdateMsg(null), 3000);
  };

  // Export audit log to CSV
  const handleExportCsv = () => {
    if (logs.length === 0) return;
    const headers = ['Log ID', 'Action', 'Product ID', 'Product Title', 'Category', 'Price', 'Stock', 'Admin Email', 'Details', 'Timestamp'];
    const rows = logs.map((l) => [
      l.id,
      l.action,
      l.productId || '',
      `"${(l.productName || '').replace(/"/g, '""')}"`,
      l.category || '',
      l.price || 0,
      l.stock || 0,
      l.adminEmail || 'admin@edkart.com',
      `"${(l.details || '').replace(/"/g, '""')}"`,
      l.timestamp,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `edkart_product_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = logs.filter((l) => {
    const matchAction = actionFilter === 'ALL' || l.action === actionFilter;
    const matchCategory = categoryFilter === 'ALL' || (l.category && l.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchSearch =
      !search ||
      (l.productName && l.productName.toLowerCase().includes(search.toLowerCase())) ||
      (l.category && l.category.toLowerCase().includes(search.toLowerCase())) ||
      (l.adminEmail && l.adminEmail.toLowerCase().includes(search.toLowerCase())) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
      String(l.productId || '').includes(search);

    return matchAction && matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getActionBadge = (action) => {
    switch (action) {
      case 'INSERTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <PlusCircle className="w-3 h-3" /> INSERTED (SKU)
          </span>
        );
      case 'UPDATED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-800">
            <RefreshCw className="w-3 h-3" /> UPDATED
          </span>
        );
      case 'STOCK_ADJUSTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <Package className="w-3 h-3" /> STOCK ADJUSTED
          </span>
        );
      case 'OUT_OF_STOCK_ALERT':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800 animate-pulse">
            <AlertTriangle className="w-3 h-3" /> OUT OF STOCK ALERT
          </span>
        );
      case 'DELETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <Trash2 className="w-3 h-3" /> DELETED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700">
            {action}
          </span>
        );
    }
  };

  const totalInserted = logs.filter((l) => l.action === 'INSERTED').length;
  const totalStockAlerts = logs.filter((l) => l.action === 'OUT_OF_STOCK_ALERT').length;
  const totalUpdated = logs.filter((l) => l.action === 'UPDATED' || l.action === 'STOCK_ADJUSTED').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Product Insertion & Audit Management Log
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="brand" size="sm">
                  {logs.length} Total Audit Records
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Managed by <strong className="text-slate-800 dark:text-slate-200">admin@edkart.com</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button onClick={handleResyncAll} variant="secondary" size="sm" className="border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20" leftIcon={<RotateCcw className="w-4 h-4" />}>
            Re-Sync All 105 SKUs & Logs
          </Button>

          <Button onClick={handleExportCsv} variant="secondary" size="sm" leftIcon={<Download className="w-4 h-4 text-emerald-500" />}>
            Export Audit Log (.CSV)
          </Button>

          <Button onClick={loadLogs} variant="secondary" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
            Refresh Feed
          </Button>

          <Link to="/admin/products">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Insert Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Admin-Inserted SKUs</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalInserted}</p>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Stock & Specs Updates</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{totalUpdated}</p>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Out of Stock Alerts</span>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">{totalStockAlerts}</p>
          </div>
        </Card>

        <Card variant="default" className="p-4 flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Audited Catalog Items</span>
            <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">{logs.length}</p>
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, SKU #, admin, details..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Action Type Filter Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end">
          {['ALL', 'INSERTED', 'UPDATED', 'STOCK_ADJUSTED', 'OUT_OF_STOCK_ALERT', 'DELETED'].map((act) => (
            <button
              key={act}
              onClick={() => {
                setActionFilter(act);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                actionFilter === act
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {act === 'ALL' ? `All (${logs.length})` : act.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <Card variant="default">
        <Table headers={['Audit Action', 'Product SKU Info', 'Stock Level', 'Price (INR)', 'Admin Actor', 'Operation Details', 'Timestamp', 'Inspect']}>
          {paginatedLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{getActionBadge(log.action)}</TableCell>

              <TableCell>
                <div className="min-w-0 max-w-xs">
                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                    {log.productName}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono">ID: #{log.productId}</span>
                    <Badge variant="brand" size="sm">
                      {log.category}
                    </Badge>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                      📷 5 Unique Angles
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span
                  className={`font-mono text-xs font-black px-2 py-0.5 rounded-md ${
                    log.stock === 0
                      ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900'
                      : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {log.stock === 0 ? '0 (Out of Stock)' : `${log.stock} units`}
                </span>
              </TableCell>

              <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                {log.price ? formatCurrency(log.price) : '—'}
              </TableCell>

              <TableCell>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{log.adminName || 'Store Admin'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.adminEmail || 'admin@edkart.com'}</span>
                </div>
              </TableCell>

              <TableCell className="text-xs text-slate-600 dark:text-slate-400 max-w-xs">
                {log.details || 'Administrative catalog synchronization'}
              </TableCell>

              <TableCell className="text-[11px] text-slate-400 font-mono whitespace-nowrap">
                {formatDateTime(log.timestamp)}
              </TableCell>

              <TableCell>
                <Button onClick={() => handleInspect(log)} variant="secondary" size="sm" leftIcon={<Eye className="w-3.5 h-3.5 text-amber-500" />}>
                  Inspect
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800 dark:text-slate-200">{Math.min(filteredLogs.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-slate-800 dark:text-slate-200">{Math.min(filteredLogs.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{filteredLogs.length}</strong> entries
          </span>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              variant="secondary"
              size="sm"
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <span className="px-3 py-1 font-mono font-bold text-xs bg-slate-100 dark:bg-slate-800 rounded-lg">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              variant="secondary"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* Inspect & Manage Modal */}
      {inspectLog && (
        <Modal
          isOpen={!!inspectLog}
          onClose={() => setInspectLog(null)}
          title={`Audit Log Record: ${inspectLog.id}`}
          subtitle={`Recorded on ${formatDateTime(inspectLog.timestamp)} by ${inspectLog.adminEmail}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-5 text-xs">
            {updateMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-300 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{updateMsg}</span>
              </div>
            )}

            {/* Top metadata grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Action Type</span>
                <p className="mt-1">{getActionBadge(inspectLog.action)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Product SKU</span>
                <p className="font-bold text-slate-900 dark:text-white mt-1">ID #{inspectLog.productId}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Recorded Price</span>
                <p className="font-mono font-black text-slate-900 dark:text-white mt-1">{formatCurrency(inspectLog.price)}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Logged Stock</span>
                <p className="font-mono font-black text-slate-900 dark:text-white mt-1">{inspectLog.stock} units</p>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Product Title</label>
              <h3 className="font-black text-base text-slate-900 dark:text-white">{inspectLog.productName}</h3>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 mb-1">Administrative Audit Details</label>
              <p className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs">
                {inspectLog.details}
              </p>
            </div>

            {/* 5 Multi-Angle Assets Preview */}
            {inspectProduct && inspectProduct.images && inspectProduct.images.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-slate-400">
                    5 Distinct Multi-Angle Studio Assets (Verified Non-Duplicate)
                  </span>
                  <Badge variant="brand" size="sm">5 Perspectives</Badge>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {inspectProduct.images.map((img, idx) => {
                    const angleNames = ['Front View', 'Side (45°)', 'Rear Array', 'Ports & Details', 'Retail Box'];
                    return (
                      <div key={idx} className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 aspect-square group">
                        <img
                          src={getProductImageUrl(inspectProduct, idx)}
                          alt={angleNames[idx] || `Angle ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[8px] font-bold py-0.5 text-center truncate px-0.5">
                          {angleNames[idx] || `#${idx + 1}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Live Stock Management Bar */}
            {inspectProduct && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-xs text-amber-900 dark:text-amber-300">Quick Warehouse Restock Control</h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400">Adjust active inventory level directly from this audit log.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickStockInput(Math.max(0, Number(quickStockInput) - 1))}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-200"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={quickStockInput}
                    onChange={(e) => setQuickStockInput(e.target.value)}
                    className="w-16 text-center text-xs font-mono font-black py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />

                  <button
                    type="button"
                    onClick={() => setQuickStockInput(Number(quickStockInput) + 1)}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border text-slate-700 dark:text-slate-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>

                  <Button onClick={handleQuickRestock} variant="primary" size="sm">
                    Update Stock
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
