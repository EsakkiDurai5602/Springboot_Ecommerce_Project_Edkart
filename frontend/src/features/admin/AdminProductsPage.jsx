import React, { useState, useEffect } from 'react';
import { productService } from '../../services/ecommerceServices';
import { formatCurrency } from '../../utils/formatters';
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
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
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
      imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
      badge: 'New Launch',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || '',
      category: prod.category || 'Smartphones',
      seller: prod.seller || '',
      stock: prod.stock || 10,
      description: prod.description || '',
      imageUrl: prod.images?.[0]?.url || '',
      badge: prod.badge || '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setError('Please provide product title and price.');
      return;
    }

    const payload = {
      ...formData,
      images: [formData.imageUrl],
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        setSuccessMsg(`Updated ${formData.name}`);
      } else {
        await productService.createProduct(payload);
        setSuccessMsg(`Added ${formData.name} to store inventory`);
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
            Add new products, manage image URLs, adjust stock quantities, and update catalog pricing
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
        <Table headers={['Product Information', 'Category', 'Price', 'Stock Level', 'Rating', 'Actions']}>
          {filtered.map((p) => (
            <TableRow key={p.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img src={p.images?.[0]?.url} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{p.name}</h4>
                    <span className="text-[10px] text-slate-400">Seller: {p.seller}</span>
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
                  {p.stock} in stock
                </Badge>
              </TableCell>

              <TableCell className="text-xs font-bold text-slate-800 dark:text-slate-200">
                ★ {p.rating} ({p.numOfReviews})
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
          ))}
        </Table>
      </Card>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Add New E-Commerce Product'}
        subtitle="Specify product title, image URL, category, stock, and pricing"
        maxWidth="max-w-xl"
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
              label="Stock Units"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              placeholder="25"
              required
            />
          </div>

          <Input
            label="High-Resolution Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            leftIcon={<ImageIcon className="w-4 h-4" />}
            required
          />

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
            {editingProduct ? 'Save Changes' : 'Publish Product to Store'}
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
