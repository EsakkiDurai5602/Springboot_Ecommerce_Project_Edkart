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
  Smartphones: '/assets/products/iphone16_pro.jpg',
  Phone: '/assets/products/iphone16_pro.jpg',
  Laptops: '/assets/products/macbook_pro.jpg',
  Audio: '/assets/products/sony_headphones.jpg',
  Wearables: '/assets/products/watch_ultra.jpg',
  Gaming: '/assets/products/ps5_console.jpg',
  Accessories: '/assets/products/mx_master_mouse.jpg',
  Electronics: '/assets/products/sony_oled_tv.jpg',
  Cloth: '/assets/products/watch_ultra.jpg',
  Fashion: '/assets/products/watch_ultra.jpg',
  default: '/assets/products/iphone16_pro.jpg',
};

// Generates an inline SVG data URI as a guaranteed zero-latency fallback
export const getCategorySvgFallback = (category = 'Electronics', title = '') => {
  const cat = category || 'Electronics';
  const label = (title || cat).slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g)" rx="24"/>
    <circle cx="200" cy="180" r="70" fill="#f59e0b" fill-opacity="0.15"/>
    <text x="200" y="190" font-family="system-ui, sans-serif" font-size="44" font-weight="900" fill="#f59e0b" text-anchor="middle">EK</text>
    <text x="200" y="270" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#e2e8f0" text-anchor="middle">${label}</text>
    <text x="200" y="295" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#94a3b8" text-anchor="middle">${cat.toUpperCase()}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const getProductImageUrl = (product, index = 0) => {
  if (!product) return CATEGORY_FALLBACK_IMAGES.default;
  
  let rawUrl = '';
  if (typeof product === 'string') {
    rawUrl = product;
  } else if (Array.isArray(product.images) && product.images.length > 0) {
    const imgItem = product.images[index] || product.images[0];
    rawUrl = typeof imgItem === 'string' ? imgItem : imgItem?.url || imgItem?.publicId || '';
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
