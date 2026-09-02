import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBanking } from '../../context/BankingContext';
import {
  Users,
  Plus,
  Trash2,
  SendHorizontal,
  Search,
  Building,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, maskAccountNumber } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Alert } from '../../components/ui/Alert';

export const BeneficiariesPage = () => {
  const { beneficiaries, addBeneficiary, deleteBeneficiary } = useBanking();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [benToDelete, setBenToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    confirmAccountNumber: '',
    bankName: 'HDFC Bank',
    ifsc: '',
    dailyLimit: '200000',
    nickname: '',
  });

  const filtered = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.bankName.toLowerCase().includes(search.toLowerCase()) ||
      b.accountNumber.includes(search)
  );

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError('Account numbers do not match.');
      return;
    }
    if (formData.ifsc.length < 5) {
      setError('Please provide a valid 11-character IFSC code.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await addBeneficiary(formData);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        accountNumber: '',
        confirmAccountNumber: '',
        bankName: 'HDFC Bank',
        ifsc: '',
        dailyLimit: '200000',
        nickname: '',
      });
    } catch (err) {
      setError(err.message || 'Failed to add beneficiary.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!benToDelete) return;
    try {
      await deleteBeneficiary(benToDelete.id);
      setBenToDelete(null);
    } catch (err) {
      alert('Failed to remove beneficiary.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Beneficiary Payees
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage registered accounts for instant funds transfers and periodic payouts
          </p>
        </div>

        <Button
          onClick={() => {
            setError(null);
            setIsAddModalOpen(true);
          }}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Beneficiary
        </Button>
      </div>

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search by name, bank, or account..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Beneficiaries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ben) => (
          <Card key={ben.id} variant="default" className="flex flex-col justify-between">
            <CardBody className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {ben.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{ben.name}</h3>
                    <p className="text-[11px] text-slate-400">{ben.nickname || ben.bankName}</p>
                  </div>
                </div>

                <Badge variant="success" size="sm" dot>
                  {ben.status}
                </Badge>
              </div>

              <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ben.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account No:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {maskAccountNumber(ben.accountNumber)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IFSC Code:</span>
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">{ben.ifsc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Transfer Limit:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(ben.dailyLimit)}
                  </span>
                </div>
              </div>
            </CardBody>

            <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setBenToDelete(ben)}
                className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Remove Payee"
                aria-label="Remove payee"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <Link to="/transfer" state={{ presetBenId: ben.id }} className="flex-1">
                <Button variant="primary" size="sm" fullWidth leftIcon={<SendHorizontal className="w-3.5 h-3.5" />}>
                  Transfer Funds
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Payee Beneficiary"
        subtitle="Added beneficiaries are immediately active for transfers up to ₹2,00,000/day"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}

          <Input
            label="Beneficiary Full Legal Name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Select
            label="Destination Bank"
            value={formData.bankName}
            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
          >
            <option value="HDFC Bank">HDFC Bank</option>
            <option value="ICICI Bank">ICICI Bank</option>
            <option value="State Bank of India">State Bank of India (SBI)</option>
            <option value="Axis Bank">Axis Bank</option>
            <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
            <option value="EdKart Premier Bank">EdKart Premier Bank (Internal)</option>
          </Select>

          <Input
            label="Account Number"
            placeholder="e.g. 50100981234912"
            value={formData.accountNumber}
            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
            required
          />

          <Input
            label="Re-enter Account Number"
            placeholder="Confirm account number"
            value={formData.confirmAccountNumber}
            onChange={(e) => setFormData({ ...formData, confirmAccountNumber: e.target.value })}
            required
          />

          <Input
            label="Bank IFSC Code"
            placeholder="e.g. HDFC0000128"
            value={formData.ifsc}
            onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
            required
          />

          <Input
            label="Daily Transfer Limit (₹)"
            type="number"
            value={formData.dailyLimit}
            onChange={(e) => setFormData({ ...formData, dailyLimit: e.target.value })}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isSubmitting}>
            Verify & Register Beneficiary
          </Button>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!benToDelete}
        onClose={() => setBenToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Beneficiary"
        message={`Are you sure you want to remove ${benToDelete?.name} from your registered beneficiaries list?`}
        confirmText="Remove Payee"
      />
    </div>
  );
};
