/**
 * E-Commerce Constants & Metadata
 */

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', slug: 'all' },
  { id: 'Smartphones', name: 'Smartphones & Mobile', slug: 'smartphones' },
  { id: 'Laptops', name: 'Laptops & Computers', slug: 'laptops' },
  { id: 'Audio', name: 'Audio & Headphones', slug: 'audio' },
  { id: 'Wearables', name: 'Smart Wearables & Watches', slug: 'wearables' },
  { id: 'Accessories', name: 'Tech Accessories & Cables', slug: 'accessories' },
  { id: 'Gaming', name: 'Gaming Consoles & Gear', slug: 'gaming' },
  { id: 'Electronics', name: 'Smart Home & Electronics', slug: 'electronics' },
];

export const DEMO_USERS = {
  customer: {
    email: 'user@edkart.com',
    password: 'Password@123',
    fullName: 'Esakki Durai',
    role: 'USER',
  },
  admin: {
    email: 'admin@edkart.com',
    password: 'Admin@123',
    fullName: 'Store Operations Admin',
    role: 'ADMIN',
  },
};

export const PAYMENT_METHODS = [
  { id: 'upi', name: 'Instant UPI / QR Code', description: 'Google Pay, PhonePe, Paytm, BHIM' },
  { id: 'card', name: 'Credit / Debit Card', description: 'Visa, MasterCard, RuPay, Amex' },
  { id: 'netbanking', name: 'Internet Banking', description: 'All Major Indian Banks Supported' },
  { id: 'cod', name: 'Cash on Delivery (COD)', description: 'Pay cash or UPI upon home delivery' },
];

export const COUPONS = {
  EDKART10: { code: 'EDKART10', discountPercent: 10, description: '10% Instant Discount on Tech' },
  SUPER20: { code: 'SUPER20', discountPercent: 20, description: '20% Mega Festive Discount' },
};
