import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/ecommerceServices';
import { formatCurrency, formatDateTime, getProductImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
} from 'lucide-react';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const loadOrders = async () => {
    const res = await orderService.getOrders();
    setOrders(res || []);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus);
    await loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, orderStatus: newStatus }));
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Orders Management
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Surveillance of all transactions, dispatch fulfillment, and delivery status progression
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
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
          <option value="all">All Order Statuses</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card variant="default">
        <Table headers={['Order Reference', 'Customer', 'Items Count', 'Total Paid', 'Order Date', 'Fulfillment Status', 'Actions']}>
          {filtered.map((ord) => (
            <TableRow key={ord.id}>
              <TableCell className="font-mono font-bold text-xs text-brand-600 dark:text-amber-400">
                {ord.orderNumber}
              </TableCell>

              <TableCell>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">{ord.customerName}</span>
                <span className="text-[10px] text-slate-400">{ord.email}</span>
              </TableCell>

              <TableCell className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {ord.items?.length || 0} Products
              </TableCell>

              <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                {formatCurrency(ord.totalAmount)}
              </TableCell>

              <TableCell className="text-xs text-slate-400 font-mono">
                {formatDateTime(ord.orderDate)}
              </TableCell>

              <TableCell>
                <select
                  value={ord.orderStatus}
                  onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </TableCell>

              <TableCell>
                <Button onClick={() => setSelectedOrder(ord)} variant="secondary" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />}>
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </Table>
      </Card>

      {/* Order Details Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={selectedOrder?.orderNumber}
        subtitle={`Customer: ${selectedOrder?.customerName} (${selectedOrder?.email})`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Shipping Destination</h4>
            <p className="font-bold text-slate-900 dark:text-white">{selectedOrder?.shippingAddress?.fullName} ({selectedOrder?.phone})</p>
            <p className="text-slate-500">{selectedOrder?.shippingAddress?.street}, {selectedOrder?.shippingAddress?.city}, {selectedOrder?.shippingAddress?.state} - {selectedOrder?.shippingAddress?.pincode}</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">Ordered Line Items</h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto pr-1">
              {selectedOrder?.items?.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={getProductImageUrl(item)}
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = CATEGORY_FALLBACK_IMAGES.default;
                      }}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity} × {formatCurrency(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-sm font-black">
            <span>Total Paid Amount</span>
            <span className="text-brand-600 dark:text-amber-400">{formatCurrency(selectedOrder?.totalAmount)}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
};
