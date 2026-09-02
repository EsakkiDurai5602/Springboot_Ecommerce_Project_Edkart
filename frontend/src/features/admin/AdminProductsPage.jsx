import React, { useState, useEffect } from 'react';
import { productService } from '../../services/ecommerceServices';
import { formatCurrency, getProductImageUrl, CATEGORY_FALLBACK_IMAGES } from '../../utils/formatters';
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
} from 'lucide-react';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

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
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    ],
    badge: 'Popular',
  });

  const loadProducts = async () => {
    const res = await productService.getProducts();
    setProducts(res.products || []);
  };

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
      description: 'Premium flagship device with pro performance and battery life.',
      images: [
        '/assets/products/iphone16_pro.jpg',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
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

    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      category: prod.category || 'Smartphones',
      seller: prod.seller || '',
      stock: prod.stock || 10,
      description: prod.description || '',
      images: existingImages.slice(0, 5),
      badge: prod.badge || '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (formData.images.length >= 5) {
      setError('You can add up to 5 images per product.');
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
      stock: Number(formData.stock) || 10,
      images: validImages,
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        setSuccessMsg(`Updated "${formData.name}"`);
      } else {
        await productService.createProduct(payload);
        setSuccessMsg(`Added "${formData.name}" to store inventory`);
      }
      setIsModalOpen(false);
      await loadProducts();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setError(err.message || 'Operation failed.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    await productService.deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
    await loadProducts();
    setSuccessMsg('Product removed successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Product Inventory Management (CRUD)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add new products, upload up to 5 multi-angle image URLs, adjust stock levels, and update catalog pricing
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Add New Product
        </Button>
      </div>

      {successMsg && <Alert variant="success" onClose={() => setSuccessMsg(null)}>{successMsg}</Alert>}

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Filter products by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Products Table */}
      <Card variant="default">
        <Table headers={['Product (Up to 5 Images)', 'Category', 'Selling Price', 'Stock Level', 'Customer Rating', 'Actions']}>
          {filtered.map((p) => {
            const imgCount = p.images?.length || 1;
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                      <img
                        src={getProductImageUrl(p)}
                        alt={p.name}
                        onError={(e) => {
                          e.target.src = CATEGORY_FALLBACK_IMAGES[p.category] || CATEGORY_FALLBACK_IMAGES.default;
                        }}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-slate-900/80 text-white text-[9px] font-bold px-1 rounded-md">
                        📷 {imgCount}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate max-w-xs">{p.name}</h4>
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

                <TableCell>
                  <Badge variant={p.stock > 15 ? 'success' : 'danger'} size="sm" dot>
                    {p.stock} units in stock
                  </Badge>
                </TableCell>

                <TableCell className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  ★ {p.rating || 4.8} ({p.numOfReviews || 0})
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
      </Card>

      {/* Add / Edit Product Modal with Up to 5 Images */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Add New E-Commerce Product'}
        subtitle="Specify product title, up to 5 multi-angle images, category, stock, and pricing"
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
              label="Seller / Brand"
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

          {/* Up to 5 Multi-Angle Images Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  Product Image URLs (Up to 5 Images)
                </label>
                <span className="text-[11px] text-slate-400">
                  Add front, back, and detail angle images for high-res store presentation.
                </span>
              </div>

              {formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-amber-400 font-bold text-xs hover:bg-brand-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Image Slot ({formData.images.length}/5)</span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                    <img
                      src={imgUrl || CATEGORY_FALLBACK_IMAGES.default}
                      alt={`Angle ${idx + 1}`}
                      onError={(e) => {
                        e.target.src = CATEGORY_FALLBACK_IMAGES.default;
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    placeholder={`Image ${idx + 1} URL (e.g. /assets/products/iphone16_pro.jpg or https://images.unsplash.com/...)`}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  {formData.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
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
            {editingProduct ? 'Save Product Changes' : 'Publish Product with Multi-Images'}
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Product"
        message={`Are you sure you want to remove "${deletingProduct?.name}" from store inventory?`}
        confirmText="Delete Product"
      />
    </div>
  );
};
