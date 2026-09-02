import { useState, useEffect, useCallback } from 'react';
import { useBanking } from '../context/BankingContext';

export const useBankingSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return {
    query,
    setQuery,
    debouncedQuery,
  };
};

export const useAccountBalance = (accountId) => {
  const { accounts } = useBanking();
  const account = accounts.find((a) => a.id === accountId);

  return {
    account,
    balance: account?.balance || 0,
    formattedBalance: account ? `₹${account.balance.toLocaleString('en-IN')}` : '₹0.00',
  };
};
