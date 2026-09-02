import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Calendar,
  CreditCard,
  Edit,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { formatDate } from '../../utils/formatters';

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [address, setAddress] = useState(user?.address || 'No. 42, Tech Park Boulevard, Silicon City, Bangalore - 560100');
  const [isSaved, setIsSaved] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await updateProfile({ phone, address });
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setIsEditModalOpen(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Customer Profile & KYC Information
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your verified customer details and communication preferences
        </p>
      </div>

      {/* KYC Summary Card */}
      <Card variant="elevated">
        <CardBody className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-md shadow-brand-500/20">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.fullName}</h3>
                  <Badge variant="success" size="sm" dot>
                    KYC {user?.kycStatus || 'VERIFIED'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Customer Identifier: <strong className="font-mono text-slate-700 dark:text-slate-300">{user?.customerId}</strong>
                </p>
              </div>
            </div>

            <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm" leftIcon={<Edit className="w-3.5 h-3.5" />}>
              Edit Contact Info
            </Button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 text-xs">
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Registered Email</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{user?.email}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Mobile Phone</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{user?.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Date of Birth</span>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(user?.dob)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Permanent Account Number (PAN)</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.panNumber}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Aadhaar (Masked)</span>
                <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">{user?.aadhaarMasked}</p>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Communication Address</span>
                <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">{user?.address}</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Edit Contact Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Contact Details"
        subtitle="Changes require SMS OTP confirmation"
      >
        {isSaved ? (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">Contact Details Updated!</h4>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <Input
              label="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <Input
              label="Communication Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" fullWidth size="lg">
              Save Changes
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
