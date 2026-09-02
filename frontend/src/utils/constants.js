/**
 * Banking Constants, Navigation, Categories, & Catalog Metadata
 */

export const BANK_CONFIG = {
  BANK_NAME: 'EdKart Premier Digital Bank',
  BANK_SHORT: 'EdKart Bank',
  BANK_CODE: 'EDKB0001092',
  SUPPORT_EMAIL: 'support@edkartbank.com',
  SUPPORT_PHONE: '1800-425-3344',
  VERSION: 'v2.4.0 (Enterprise)',
};

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { name: 'Accounts', path: '/accounts', icon: 'Wallet' },
  { name: 'Transactions', path: '/transactions', icon: 'Receipt' },
  { name: 'Transfer Money', path: '/transfer', icon: 'SendHorizontal' },
  { name: 'Beneficiaries', path: '/beneficiaries', icon: 'Users' },
  { name: 'Bill Payments', path: '/bill-payments', icon: 'CreditCard' },
  { name: 'Cards', path: '/cards', icon: 'ShieldCheck' },
  { name: 'Loans & EMI', path: '/loans', icon: 'Banknote' },
  { name: 'Products Catalog', path: '/products', icon: 'Sparkles' },
  { name: 'Documents', path: '/documents', icon: 'FileText' },
  { name: 'Security Center', path: '/security', icon: 'Lock' },
  { name: 'Customer Support', path: '/support', icon: 'Headphones' },
  { name: 'Settings', path: '/settings', icon: 'Settings' },
];

export const TRANSACTION_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'transfer', label: 'Fund Transfers' },
  { id: 'shopping', label: 'Shopping & E-Commerce' },
  { id: 'bills', label: 'Bill Payments & Utilities' },
  { id: 'salary', label: 'Salary & Income' },
  { id: 'food', label: 'Dining & Groceries' },
  { id: 'investment', label: 'Investments & Deposits' },
  { id: 'entertainment', label: 'Entertainment' },
];

export const BILLER_CATEGORIES = [
  { id: 'electricity', name: 'Electricity', icon: 'Zap', billers: ['Tata Power', 'Adani Electricity', 'BESCOM', 'TANGEDCO', 'State Power Corp'] },
  { id: 'mobile', name: 'Mobile Postpaid & Prepaid', icon: 'Smartphone', billers: ['Jio Infocomm', 'Airtel Postpaid', 'Vodafone Idea (Vi)', 'BSNL Mobile'] },
  { id: 'broadband', name: 'Broadband & Fiber', icon: 'Wifi', billers: ['Airtel Xstream', 'JioFiber', 'ACT Fibernet', 'Tata Play Fiber'] },
  { id: 'water', name: 'Water Utilities', icon: 'Droplets', billers: ['Municipal Water Board', 'Delhi Jal Board', 'BWSSB Bangalore', 'Chennai Metro Water'] },
  { id: 'gas', name: 'Piped Gas & LPG', icon: 'Flame', billers: ['Indraprastha Gas (IGL)', 'Mahanagar Gas', 'Adani Total Gas', 'Gujarat Gas'] },
  { id: 'creditcard', name: 'Credit Card Bill', icon: 'CreditCard', billers: ['EdKart Sapphire Card', 'Titanium Elite Card', 'HDFC Bank Card', 'ICICI Card'] },
  { id: 'insurance', name: 'Insurance Premium', icon: 'Shield', billers: ['EdKart Life Shield', 'LIC of India', 'HDFC ERGO', 'ICICI Lombard'] },
];

export const DEMO_CREDENTIALS = {
  username: 'durai@edkart.com',
  password: 'Password@123',
};
