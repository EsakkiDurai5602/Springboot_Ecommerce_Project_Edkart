import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  accountService,
  transactionService,
  transferService,
  beneficiaryService,
  cardService,
  loanService,
  notificationService,
} from '../services/bankingServices';

const BankingContext = createContext(null);

export const BankingProvider = ({ children }) => {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [cards, setCards] = useState([]);
  const [loans, setLoans] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  // Load all initial financial data
  const refreshAll = useCallback(async () => {
    setLoading(true);
    try {
      const [accs, txnsData, bens, crds, lns, notifs] = await Promise.all([
        accountService.getAccounts(),
        transactionService.getTransactions({ page: 1, limit: 20 }),
        beneficiaryService.getBeneficiaries(),
        cardService.getCards(),
        loanService.getLoans(),
        notificationService.getNotifications(),
      ]);

      setAccounts(accs || []);
      setTransactions(txnsData.transactions || []);
      setBeneficiaries(bens || []);
      setCards(crds || []);
      setLoans(lns || []);
      setNotifications(notifs || []);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load banking data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Execute transfer and instantly refresh state
  const sendMoney = async (transferPayload) => {
    const result = await transferService.executeTransfer(transferPayload);
    if (result.success) {
      await refreshAll();
    }
    return result;
  };

  // Add Beneficiary
  const addBeneficiary = async (payload) => {
    const result = await beneficiaryService.addBeneficiary(payload);
    if (result.success) {
      await refreshAll();
    }
    return result;
  };

  // Delete Beneficiary
  const deleteBeneficiary = async (id) => {
    const result = await beneficiaryService.deleteBeneficiary(id);
    if (result.success) {
      await refreshAll();
    }
    return result;
  };

  // Card Controls: Freeze / Unfreeze
  const toggleCardFreeze = async (cardId, status) => {
    const result = await cardService.toggleFreeze(cardId, status);
    if (result.success) {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, status } : c))
      );
    }
    return result;
  };

  // Card Limits
  const updateCardLimits = async (cardId, limitsPayload) => {
    const result = await cardService.updateLimits(cardId, limitsPayload);
    if (result.success) {
      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, ...limitsPayload } : c))
      );
    }
    return result;
  };

  // Notifications: Mark Read
  const markNotificationRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Computed total net worth
  const totalBalance = accounts.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const value = {
    accounts,
    transactions,
    beneficiaries,
    cards,
    loans,
    notifications,
    unreadNotifCount,
    totalBalance,
    loading,
    lastRefreshed,
    refreshAll,
    sendMoney,
    addBeneficiary,
    deleteBeneficiary,
    toggleCardFreeze,
    updateCardLimits,
    markNotificationRead,
    markAllNotificationsRead,
  };

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>;
};

export const useBanking = () => {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }
  return context;
};
