import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import {
  CreditCard,
  ShieldCheck,
  Lock,
  Unlock,
  Sliders,
  KeyRound,
  AlertOctagon,
  Sparkles,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { formatCurrency, maskCardNumber } from '../../utils/formatters';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { CardVisual } from '../../assets/illustrations';
import { cardService } from '../../services/bankingServices';

export const CardsPage = () => {
  const { cards, toggleCardFreeze, updateCardLimits } = useBanking();
  const [selectedCardId, setSelectedCardId] = useState(cards[0]?.id || 'crd_01');
  const [showSensitive, setShowSensitive] = useState(false);

  // Modals
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [pinSuccess, setPinSuccess] = useState(false);
  const [error, setError] = useState(null);

  const currentCard = cards.find((c) => c.id === selectedCardId) || cards[0];

  const handleToggleFreeze = async () => {
    if (!currentCard) return;
    const newStatus = currentCard.status === 'FROZEN' ? 'ACTIVE' : 'FROZEN';
    await toggleCardFreeze(currentCard.id, newStatus);
  };

  const handleToggleFeature = async (featureKey) => {
    if (!currentCard) return;
    const updatedVal = !currentCard[featureKey];
    await updateCardLimits(currentCard.id, { [featureKey]: updatedVal });
  };

  const handleLimitChange = async (e) => {
    const val = Number(e.target.value);
    await updateCardLimits(currentCard.id, { dailyLimit: val });
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setError('PIN must be exactly 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }

    try {
      await cardService.changePin(currentCard.id, newPin);
      setPinSuccess(true);
      setTimeout(() => {
        setIsPinModalOpen(false);
        setPinSuccess(false);
        setNewPin('');
        setConfirmPin('');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to update PIN.');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cards Management & Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Control your physical debit/credit cards, manage limits, and generate secure virtual numbers
        </p>
      </div>

      {/* Cards Selector Tabs */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCardId(c.id)}
            className={`px-4 py-3 rounded-2xl border text-left transition-all min-w-[200px] flex items-center justify-between ${
              selectedCardId === c.id
                ? 'border-brand-600 dark:border-cyan-500 bg-brand-50/50 dark:bg-slate-800 shadow-sm'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{c.cardName.split(' ')[0]} {c.cardType}</p>
              <p className="text-[10px] font-mono text-slate-400">•••• {c.cardNumber.slice(-4)}</p>
            </div>
            <Badge variant={c.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">
              {c.status}
            </Badge>
          </button>
        ))}
      </div>

      {/* Card Visual & Control Center Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Card Display */}
        <div className="lg:col-span-6 space-y-4">
          <div className="max-w-md mx-auto">
            <CardVisual
              type={currentCard.tier}
              cardNumber={showSensitive ? currentCard.cardNumber.replace(/(\d{4})/g, '$1 ').trim() : maskCardNumber(currentCard.cardNumber)}
              holderName={currentCard.holderName}
              expiry={currentCard.expiry}
            />
          </div>

          <div className="flex items-center justify-between max-w-md mx-auto pt-2 text-xs">
            <button
              onClick={() => setShowSensitive(!showSensitive)}
              className="flex items-center gap-1.5 font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-cyan-400"
            >
              {showSensitive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showSensitive ? 'Hide Card Details' : 'Reveal Full Card Number & CVV'}</span>
            </button>

            {showSensitive && (
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                CVV: {currentCard.cvv}
              </span>
            )}
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-4">
            <Button
              onClick={handleToggleFreeze}
              variant={currentCard.status === 'FROZEN' ? 'success' : 'secondary'}
              size="sm"
              leftIcon={currentCard.status === 'FROZEN' ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            >
              {currentCard.status === 'FROZEN' ? 'Unfreeze' : 'Freeze Card'}
            </Button>

            <Button
              onClick={() => {
                setError(null);
                setIsPinModalOpen(true);
              }}
              variant="secondary"
              size="sm"
              leftIcon={<KeyRound className="w-4 h-4" />}
            >
              Reset PIN
            </Button>

            <Button
              onClick={() => setIsBlockModalOpen(true)}
              variant="danger"
              size="sm"
              leftIcon={<AlertOctagon className="w-4 h-4" />}
            >
              Report Lost
            </Button>
          </div>
        </div>

        {/* Card Security & Limit Settings */}
        <div className="lg:col-span-6 space-y-6">
          <Card variant="default">
            <CardHeader title="Card Spending Controls & Channels" subtitle="Configure online transactions, POS, ATM, and limits" />
            <CardBody className="space-y-6">
              {/* Daily Limit Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Daily Transaction Limit:</span>
                  <span className="text-brand-600 dark:text-cyan-400 font-mono text-sm">
                    {formatCurrency(currentCard.dailyLimit || 50000)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max={currentCard.limitTotal || 200000}
                  step="5000"
                  value={currentCard.dailyLimit || 50000}
                  onChange={handleLimitChange}
                  className="w-full accent-brand-600 dark:accent-cyan-400 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Min ₹5,000</span>
                  <span>Max {formatCurrency(currentCard.limitTotal || 200000)}</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3 pt-2">
                {[
                  { key: 'domesticOnline', label: 'Domestic Online E-Commerce', desc: 'Allow online shopping in India' },
                  { key: 'internationalOnline', label: 'International Transactions', desc: 'Cross-border foreign currency spends' },
                  { key: 'contactless', label: 'Contactless Tap & Pay (NFC)', desc: 'POS payments up to ₹5,000 without PIN' },
                  { key: 'atmWithdrawal', label: 'ATM Cash Withdrawals', desc: 'ATM access across domestic networks' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between pt-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.label}</h4>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!currentCard[item.key]}
                        onChange={() => handleToggleFeature(item.key)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600 dark:peer-checked:bg-cyan-500" />
                    </label>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Reset PIN Modal */}
      <Modal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        title="Reset 4-Digit Card PIN"
        subtitle={`Set a new ATM & Point-of-Sale PIN for ${currentCard.cardName}`}
      >
        {pinSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">PIN Changed Successfully!</h4>
          </div>
        ) : (
          <form onSubmit={handlePinSubmit} className="space-y-4">
            {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
            <Input
              label="New 4-Digit PIN"
              type="password"
              maxLength={4}
              placeholder="••••"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              required
            />
            <Input
              label="Confirm 4-Digit PIN"
              type="password"
              maxLength={4}
              placeholder="••••"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              required
            />
            <Button type="submit" variant="primary" fullWidth size="lg">
              Update Card PIN
            </Button>
          </form>
        )}
      </Modal>

      {/* Block Lost Card Confirm Dialog */}
      <ConfirmDialog
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={async () => {
          await toggleCardFreeze(currentCard.id, 'BLOCKED');
          setIsBlockModalOpen(false);
          alert('Card permanently blocked. A replacement card has been dispatched.');
        }}
        title="Report Lost or Stolen Card"
        message={`Are you sure you want to permanently block ${currentCard.cardName} (••${currentCard.cardNumber.slice(-4)})? This card will be deactivated immediately.`}
        confirmText="Block Card Immediately"
      />
    </div>
  );
};
