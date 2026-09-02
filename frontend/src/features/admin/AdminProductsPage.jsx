import React, { useState, useEffect } from 'react';
import { productService } from '../../services/bankingServices';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Alert } from '../../components/ui/Alert';

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
    category: 'savings',
    tagline: '',
    interestRate: '',
    minBalance: '',
    badge: 'Popular',
    recommended: true,
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
    features: 'Instant digital onboarding\nZero maintenance fee\n24/7 Concierge',
  });

  const loadProducts = async () => {
    const list = await productService.getProducts();
    setProducts(list || []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'savings',
      tagline: '',
      interestRate: '',
      minBalance: '',
      badge: 'New Launch',
      recommended: true,
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
      features: 'Instant digital onboarding\nZero maintenance fee\n24/7 Concierge',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      category: prod.category || 'savings',
      tagline: prod.tagline || '',
      interestRate: prod.interestRate || '',
      minBalance: prod.minBalance || '',
      badge: prod.badge || '',
      recommended: !!prod.recommended,
      imageUrl: prod.imageUrl || '',
      features: Array.isArray(prod.features) ? prod.features.join('\n') : '',
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.interestRate) {
      setError('Please provide product name and interest rate.');
      return;
    }

    const payload = {
      ...formData,
      features: formData.features.split('\n').filter((f) => f.trim().length > 0),
    };

    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, payload);
        setSuccessMsg(`Updated ${formData.name}`);
      } else {
        await productService.addProduct(payload);
        setSuccessMsg(`Added ${formData.name} to catalog`);
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
            Banking Products Catalog Management
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Add, update interest rates, manage product images, and configure customer offerings
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
          placeholder="Search products by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((prod) => (
          <Card key={prod.id} variant="default" className="flex flex-col justify-between overflow-hidden">
            <div>
              {/* Product Visual Header */}
              <div className="relative h-44 bg-slate-900 overflow-hidden group">
                <img
                  src={prod.imageUrl || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80'}
                  alt={prod.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant="warning" size="sm">
                    {prod.badge || prod.category.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <CardBody className="p-5 space-y-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{prod.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{prod.tagline}</p>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-400">Rate / ROI:</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">{prod.interestRate}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Min Balance:</span>
                    <span className="text-slate-800 dark:text-slate-200">{prod.minBalance}</span>
                  </div>
                </div>

                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {prod.features?.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <Button onClick={() => handleOpenEdit(prod)} variant="secondary" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
                Edit Details
              </Button>
              <Button onClick={() => setDeletingProduct(prod)} variant="danger" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5" />}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? `Edit ${editingProduct.name}` : 'Add New Banking Product'}
        subtitle="Manage product interest rates, promotional badges, and visual representations"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          <Input
            label="Product Title"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Titanium Metal Wealth Card"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="savings">Savings Account</option>
              <option value="deposits">Fixed Term Deposit</option>
              <option value="cards">Credit / Debit Card</option>
              <option value="loans">Mortgage / Auto Loan</option>
              <option value="investments">Mutual Fund / Wealth SIP</option>
            </Select>

            <Input
              label="Promotional Badge"
              value={formData.badge}
              onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
              placeholder="e.g. Lowest Interest"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Interest Rate / Return"
              value={formData.interestRate}
              onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
              placeholder="e.g. 7.50% p.a."
              required
            />

            <Input
              label="Min Balance / Tenure"
              value={formData.minBalance}
              onChange={(e) => setFormData({ ...formData, minBalance: e.target.value })}
              placeholder="e.g. Starting from ₹5,000"
            />
          </div>

          <Input
            label="Tagline / Description"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. Guaranteed yields with flexible quarterly payout"
          />

          <Input
            label="Product Image URL"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            leftIcon={<ImageIcon className="w-4 h-4" />}
          />

          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 dark:text-slate-300 mb-1.5">
              Key Features (One item per line)
            </label>
            <textarea
              rows={3}
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg">
            {editingProduct ? 'Save Product Updates' : 'Publish Product to Catalog'}
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Banking Product"
        message={`Are you sure you want to delete ${deletingProduct?.name} from the public banking catalog?`}
        confirmText="Delete Product"
      />
    </div>
  );
};
