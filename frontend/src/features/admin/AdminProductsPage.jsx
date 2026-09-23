import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, productLogService } from '../../services/ecommerceServices';
import { INITIAL_PRODUCTS, INITIAL_PRODUCT_LOGS } from '../../services/ecommerceData';
import { formatCurrency, getProductImageUrl, CATEGORY_FALLBACK_IMAGES, getCategorySvgFallback } from '../../utils/formatters';
import { CATEGORIES } from '../../utils/constants';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Alert } from '../../components/ui/Alert';
import { Table, TableRow, TableCell } from '../../components/ui/Table';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  X,
  Upload,
  AlertTriangle,
  History,
  Minus,
  ArrowUpDown,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
} from 'lucide-react';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('ALL'); // 'ALL' | 'OUT_OF_STOCK' | 'LOW_STOCK' | 'IN_STOCK'
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const loadProducts = async () => {
    const res = await productService.getProducts();
    const list = res.products || [];
    setProducts(list);

    // Scan for out of stock products and issue console alerts
    const outOfStock = list.filter((p) => p.stock <= 0);
    if (outOfStock.length > 0) {
      console.warn(
        `%c[EdKart Admin Console Alert]: ${outOfStock.length} product(s) are currently OUT OF STOCK!`,
        'color: #ef4444; font-weight: bold; font-size: 13px;',
        outOfStock.map((p) => `ID #${p.id}: ${p.name} (Category: ${p.category})`)
      );
    }
  };

  const handleResyncAll = async () => {
    localStorage.removeItem('edkart_ec_catalog_version');
    localStorage.removeItem('edkart_ec_products');
    localStorage.removeItem('edkart_ec_product_logs');
    localStorage.setItem('edkart_ec_catalog_version', 'v3_525_real_photos');
    localStorage.setItem('edkart_ec_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('edkart_ec_product_logs', JSON.stringify(INITIAL_PRODUCT_LOGS));
    await loadProducts();
    setSuccessMsg('Successfully synchronized all 105 real photorealistic products & 109 admin logs!');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Smartphones',
    seller: 'EdKart Authorized Seller',
    stock: 20,
    description: '',
    images: [
      '/assets/products/iphone16_pro.jpg',
      '/assets/products/samsung_s24_ultra.jpg',
      '/assets/products/pixel_9_pro.jpg',
      '/assets/products/oneplus_12.jpg',
      '/assets/products/watch_ultra.jpg',
    ],
    badge: 'Popular',
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: 'Smartphones',
      seller: 'EdKart Authorized Store',
      stock: 25,
      description: 'Premium flagship device with pro performance, distinct metallic finish, and multi-angle camera system.',
      images: [
        '/assets/products/iphone16_pro.jpg',
        '/assets/products/samsung_s24_ultra.jpg',
        '/assets/products/pixel_9_pro.jpg',
        '/assets/products/oneplus_12.jpg',
        '/assets/products/watch_ultra.jpg',
      ],
      badge: 'New Launch',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    const existingImages =
      prod.images && prod.images.length > 0
        ? prod.images.map((img) => (typeof img === 'string' ? img : img.url))
        : [CATEGORY_FALLBACK_IMAGES[prod.category] || CATEGORY_FALLBACK_IMAGES.default];

    while (existingImages.length < 5) {
      existingImages.push(CATEGORY_FALLBACK_IMAGES[prod.category] || CATEGORY_FALLBACK_IMAGES.default);
    }

    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      category: prod.category || 'Smartphones',
      seller: prod.seller || '',
      stock: prod.stock !== undefined ? prod.stock : 10,
      description: prod.description || '',
      images: existingImages.slice(0, 5),
      badge: prod.badge || '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (formData.images.length >= 5) {
      setError('You can add up to 5 multi-angle images per product.');
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, ''],
    });
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData({ ...formData, images: updated });
  };

  const handleRemoveImage = (index) => {
    if (formData.images.length <= 1) {
      setError('At least 1 product image is required.');
      return;
    }
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updated });
  };

  // Stock Quick Adjustment Controls
  const handleQuickStockChange = async (prod, delta) => {
    const newStock = Math.max(0, (prod.stock || 0) + delta);
    await productService.updateStock(prod.id, newStock);
    await loadProducts();
    setSuccessMsg(`Stock for "${prod.name}" updated to ${newStock} units.`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleDirectStockInput = async (prod, newStockStr) => {
    const val = parseInt(newStockStr, 10);
    if (isNaN(val) || val < 0) return;
    await productService.updateStock(prod.id, val);
    await loadProducts();
    setSuccessMsg(`Stock for "${prod.name}" updated to ${val} units.`);
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError('Please provide product title and price.');
      return;
    }

    const validImages = formData.images.filter((img) => img && img.trim().length > 0);
    if (validImages.length === 0) {
      setError('Please provide at least one valid image URL.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price) * 1.15,
      stock: Number(formData.stock) >= 0 ? Number(formData.stock) : 10,
      images: validImages,
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        setSuccessMsg(`Updated "${formData.name}" and recorded admin audit log.`);
      } else {
        await productService.createProduct(payload);
        setSuccessMsg(`Inserted "${formData.name}" to inventory with 5-angle gallery & logged action.`);
      }
      setIsModalOpen(false);
      await loadProducts();
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    await productService.deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
    await loadProducts();
    setSuccessMsg('Product removed successfully and recorded in admin history.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const outOfStockCount = products.filter((p) => p.stock <= 0).length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 15).length;

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.seller || '').toLowerCase().includes(search.toLowerCase()) ||
      String(p.id).includes(search);

    const matchCategory = categoryFilter === 'ALL' || p.category.toLowerCase() === categoryFilter.toLowerCase();

    let matchStock = true;
    if (stockFilter === 'OUT_OF_STOCK') matchStock = p.stock <= 0;
    else if (stockFilter === 'LOW_STOCK') matchStock = p.stock > 0 && p.stock <= 15;
    else if (stockFilter === 'IN_STOCK') matchStock = p.stock > 15;

    return matchSearch && matchCategory && matchStock;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Product Inventory & Stock Manager
            </h2>
            <Badge variant="brand" size="md">
              {products.length} Authenticated SKUs
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Admin console for managing 100+ items with 5 unique perspective images each, instant inline stock adjustments, and out-of-stock monitoring.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button onClick={handleResyncAll} variant="secondary" size="md" className="border-amber-500/50 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20" leftIcon={<RotateCcw className="w-4 h-4" />}>
            Re-Sync All 105 SKUs
          </Button>

          <Link to="/admin/product-logs">
            <Button variant="secondary" size="md" leftIcon={<History className="w-4 h-4 text-amber-500" />}>
              Product Insertion History Logs
            </Button>
          </Link>

          <Button onClick={handleOpenAdd} variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
            Insert New Product SKU
          </Button>
        </div>
      </div>

      {/* Out of Stock Critical Alert Banner */}
      {outOfStockCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-300 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500 text-white font-black animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-rose-700 dark:text-rose-400">
                CRITICAL INVENTORY ALERT: {outOfStockCount} Product{outOfStockCount > 1 ? 's are' : ' is'} OUT OF STOCK (0 Units)!
              </h4>
              <p className="text-[11px] text-rose-600 dark:text-rose-300">
                Customers cannot purchase out-of-stock items. Use the inline stock manager below to replenish units.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setStockFilter(stockFilter === 'OUT_OF_STOCK' ? 'ALL' : 'OUT_OF_STOCK');
              setCurrentPage(1);
            }}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold whitespace-nowrap transition-colors"
          >
            {stockFilter === 'OUT_OF_STOCK' ? 'Show All Products' : `Filter ${outOfStockCount} Out-of-Stock SKUs`}
          </button>
        </div>
      )}

      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      {/* Search & Stock Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto flex-1">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by title, SKU #, category, seller..."
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

        {/* Stock Level Quick Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          <button
            onClick={() => {
              setStockFilter('ALL');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              stockFilter === 'ALL'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All ({products.length})
          </button>

          <button
            onClick={() => {
              setStockFilter('OUT_OF_STOCK');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
              stockFilter === 'OUT_OF_STOCK'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-rose-600 border border-rose-200 dark:border-rose-900/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Out of Stock ({outOfStockCount})
          </button>

          <button
            onClick={() => {
              setStockFilter('LOW_STOCK');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              stockFilter === 'LOW_STOCK'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-amber-600 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>

          <button
            onClick={() => {
              setStockFilter('IN_STOCK');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              stockFilter === 'IN_STOCK'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            Healthy Stock ({products.length - outOfStockCount - lowStockCount})
          </button>
        </div>
      </div>

      {/* Products Table */}
      <Card variant="default">
        <Table headers={['Product (5 Unique Studio Assets)', 'Category', 'Selling Price', 'Admin Stock Manager', 'Status', 'Actions']}>
          {paginatedProducts.map((p) => {
            const imgCount = p.images?.length || 1;
            const isZeroStock = p.stock <= 0;
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                      <img
                        src={getProductImageUrl(p, 0)}
                        alt={p.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CATEGORY_FALLBACK_IMAGES[p.category] || getCategorySvgFallback(p.category, p.name);
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded-md">
                        📷 {imgCount}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">#{p.id}</span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-xs">{p.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Seller: {p.seller || 'EdKart Verified'}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="brand" size="sm">
                    {p.category}
                  </Badge>
                </TableCell>

                <TableCell className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                  {formatCurrency(p.price)}
                </TableCell>

                {/* Admin Interactive Stock Adjuster */}
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleQuickStockChange(p, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Decrease stock by 1"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <input
                      type="number"
                      min="0"
                      value={p.stock}
                      onChange={(e) => handleDirectStockInput(p, e.target.value)}
                      className={`w-14 text-center text-xs font-mono font-black py-1 px-1.5 rounded-lg border focus:outline-none focus:ring-2 ${
                        isZeroStock
                          ? 'border-rose-400 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 focus:ring-rose-500'
                          : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-amber-500'
                      }`}
                      title="Type to set exact warehouse stock"
                    />

                    <button
                      type="button"
                      onClick={() => handleQuickStockChange(p, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center text-xs font-bold transition-colors"
                      title="Increase stock by 1"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </TableCell>

                <TableCell>
                  {isZeroStock ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-900 animate-pulse">
                      OUT OF STOCK
                    </span>
                  ) : p.stock <= 15 ? (
                    <Badge variant="warning" size="sm" dot>
                      Low Stock ({p.stock})
                    </Badge>
                  ) : (
                    <Badge variant="success" size="sm" dot>
                      In Stock ({p.stock})
                    </Badge>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Button onClick={() => handleOpenEdit(p)} variant="secondary" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                      Edit
                    </Button>
                    <Button onClick={() => setDeletingProduct(p)} variant="danger" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </Table>

        {/* Pagination Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500">
            Showing <strong className="text-slate-800 dark:text-slate-200">{Math.min(filtered.length, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
            <strong className="text-slate-800 dark:text-slate-200">{Math.min(filtered.length, currentPage * itemsPerPage)}</strong> of{' '}
            <strong className="text-slate-800 dark:text-slate-200">{filtered.length}</strong> products
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Insert New E-Commerce Product SKU'}
        subtitle="Manage product specifications, pricing, warehouse stock units, and 5 multi-angle studio photos"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          <Input
            label="Product Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Apple iPhone 16 Pro Max 256GB"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>

            <Input
              label="Seller / Brand Hub"
              value={formData.seller}
              onChange={(e) => setFormData({ ...formData, seller: e.target.value })}
              placeholder="e.g. Apple Authorized Store"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Selling Price (₹)"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="144900"
              required
            />

            <Input
              label="Warehouse Stock Units"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="25"
              required
            />
          </div>

          {/* 5 Multi-Angle Images Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  5 Multi-Angle Product Images (Front, Side, Back, Details, In-Box)
                </label>
                <span className="text-[11px] text-slate-400">
                  Provide 5 distinct angle photos for Amazon-style slide gallery on the product page.
                </span>
              </div>

              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-amber-400 font-bold text-xs hover:bg-brand-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Angle Slot ({formData.images.length}/5)</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {formData.images.map((imgUrl, idx) => {
                const angleLabels = ['1. Front Angle', '2. Side Profile', '3. Rear / Camera', '4. Ports & Details', '5. Lifestyle / Box'];
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700 relative group">
                      <img
                        src={imgUrl || CATEGORY_FALLBACK_IMAGES.default}
                        alt={`Angle ${idx + 1}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = CATEGORY_FALLBACK_IMAGES.default;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-0.5 left-0.5 bg-slate-900/80 text-white text-[8px] font-bold px-1 rounded">
                        #{idx + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-slate-400 block mb-0.5">
                        {angleLabels[idx] || `Angle ${idx + 1}`}
                      </span>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder={`Image URL for ${angleLabels[idx] || `Angle ${idx + 1}`}`}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 mt-3"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Product Description & Specifications
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg">
            {editingProduct ? 'Save Product Changes' : 'Insert Product with 5 Multi-Angle Images'}
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Product"
        message={`Are you sure you want to permanently remove "${deletingProduct?.name}" from the store? This action will be logged in admin history.`}
        confirmText="Delete Product"
      />
    </div>
  );
};
