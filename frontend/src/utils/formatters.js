/**
 * E-Commerce Formatting Utilities
 */

export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '₹0.00';
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
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch (e) {
    return String(dateString);
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return String(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return String(dateString);
  }
};

export const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `EDK-ORD-${timestamp}-${random}`;
};

export const calculateDiscount = (originalPrice, discountPercent) => {
  if (!originalPrice || !discountPercent) return originalPrice;
  return Number(originalPrice) - (Number(originalPrice) * Number(discountPercent)) / 100;
};

export const CATEGORY_FALLBACK_IMAGES = {
  Smartphones: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
  Phone: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
  Laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
  Audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  Wearables: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  Gaming: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
  Accessories: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
  Electronics: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
  Cloth: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  Fashion: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
  default: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
};

export const getProductImageUrl = (product, index = 0) => {
  if (!product) return CATEGORY_FALLBACK_IMAGES.default;
  
  let rawUrl = '';
  if (typeof product === 'string') {
    rawUrl = product;
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    const imgItem = product.images[index] || product.images[0];
    rawUrl = typeof imgItem === 'string' ? imgItem : imgItem.url || imgItem.publicId || '';
  } else if (product.imageUrl) {
    rawUrl = product.imageUrl;
  } else if (product.image) {
    rawUrl = product.image;
  }

  if (typeof rawUrl === 'string' && rawUrl.trim().length > 0) {
    let cleanUrl = rawUrl.trim();
    if (cleanUrl.startsWith('/uploads/http')) {
      cleanUrl = cleanUrl.replace('/uploads/', '');
    }
    if (
      cleanUrl.startsWith('http://') ||
      cleanUrl.startsWith('https://') ||
      cleanUrl.startsWith('/') ||
      cleanUrl.startsWith('assets/') ||
      cleanUrl.startsWith('data:image/')
    ) {
      return cleanUrl;
    }
  }

  const category = (typeof product === 'object' && product.category) ? product.category : 'default';
  return CATEGORY_FALLBACK_IMAGES[category] || CATEGORY_FALLBACK_IMAGES.default;
};
