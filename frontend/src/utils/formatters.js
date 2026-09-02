/**
 * E-Commerce Formatting Utilities
 */

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  const num = Number(amount);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch (e) {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return dateString;
  }
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EDK-ORD-${timestamp}-${random}`;
};

export const calculateDiscount = (originalPrice, discountPercent) => {
  if (!originalPrice || !discountPercent) return originalPrice;
  return originalPrice - (originalPrice * discountPercent) / 100;
};
