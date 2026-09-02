/**
 * Financial & Data Formatting Utilities
 */

export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0.00';
  }
  
  const num = Number(amount);
  
  try {
    if (currency === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (e) {
    return `₹${num.toFixed(2)}`;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '—';
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
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(d);
  } catch (e) {
    return dateString;
  }
};

export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber) return '•••• ••••';
  const str = String(accountNumber).replace(/\s+/g, '');
  if (str.length <= 4) return str;
  const last4 = str.slice(-4);
  return `•••• •••• ${last4}`;
};

export const maskCardNumber = (cardNumber) => {
  if (!cardNumber) return '•••• •••• •••• ••••';
  const str = String(cardNumber).replace(/\s+/g, '');
  if (str.length <= 4) return str;
  const first4 = str.slice(0, 4);
  const last4 = str.slice(-4);
  return `${first4} •••• •••• ${last4}`;
};

export const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email;
  const [user, domain] = email.split('@');
  if (user.length <= 2) return `${user}***@${domain}`;
  return `${user.substring(0, 2)}••••${user.slice(-1)}@${domain}`;
};

export const maskPhone = (phone) => {
  if (!phone) return phone;
  const clean = String(phone).replace(/\D/g, '');
  if (clean.length <= 4) return phone;
  return `+91 ••••• •${clean.slice(-4)}`;
};

export const calculateEMI = (principal, annualRatePercent, tenureMonths) => {
  const p = Number(principal) || 0;
  const r = (Number(annualRatePercent) || 0) / 12 / 100;
  const n = Number(tenureMonths) || 1;

  if (p <= 0 || n <= 0) return { emi: 0, totalPayment: 0, totalInterest: 0 };
  if (r === 0) {
    const emi = p / n;
    return { emi, totalPayment: p, totalInterest: 0 };
  }

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
  };
};

export const generateReferenceId = (prefix = 'TXN') => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${timestamp}${random}`;
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
