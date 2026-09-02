import apiClient from './apiClient';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './ecommerceData';
import { DEMO_USERS } from '../utils/constants';
import { generateOrderNumber } from '../utils/formatters';

const getStored = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`edkart_ec_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(`edkart_ec_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error', e);
  }
};

// Initialize persistent storage
if (!localStorage.getItem('edkart_ec_products')) setStored('products', INITIAL_PRODUCTS);
if (!localStorage.getItem('edkart_ec_orders')) setStored('orders', INITIAL_ORDERS);

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================= PRODUCT SERVICES ================= */
export const productService = {
  getProducts: async (params = {}) => {
    try {
      const res = await apiClient.get('/products', { params });
      if (res.data && res.data.products) {
        return {
          products: res.data.products.map(normalizeProduct),
          total: res.data['total products'] || res.data.products.length,
        };
      }
    } catch (e) {
      // fallback
    }

    await delay(150);
    let list = getStored('products', INITIAL_PRODUCTS);

    if (params.category && params.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === params.category.toLowerCase());
    }
    if (params.keyword) {
      const q = params.keyword.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params.minPrice) {
      list = list.filter((p) => p.price >= Number(params.minPrice));
    }
    if (params.maxPrice) {
      list = list.filter((p) => p.price <= Number(params.maxPrice));
    }
    if (params.rating) {
      list = list.filter((p) => p.rating >= Number(params.rating));
    }
    if (params.inStock) {
      list = list.filter((p) => p.stock > 0);
    }

    // Sorting
    if (params.sortBy === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params.sortBy === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return {
      products: list,
      total: list.length,
    };
  },

  getProductById: async (id) => {
    try {
      const res = await apiClient.get(`/products/${id}`);
      if (res.data) return normalizeProduct(res.data);
    } catch (e) {
      // fallback
    }

    await delay(100);
    const products = getStored('products', INITIAL_PRODUCTS);
    const found = products.find((p) => String(p.id) === String(id));
    if (!found) throw { status: 404, message: 'Product not found.' };
    return found;
  },

  createProduct: async (productData) => {
    try {
      const res = await apiClient.post('/products', productData);
      if (res.data) return normalizeProduct(res.data);
    } catch (e) {
      // fallback
    }

    await delay(250);
    const products = getStored('products', INITIAL_PRODUCTS);
    const newProd = {
      id: Date.now(),
      name: productData.name,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : Number(productData.price) * 1.15,
      seller: productData.seller || 'EdKart Verified Merchant',
      description: productData.description || 'Premium quality verified tech product.',
      category: productData.category || 'Electronics',
      stock: Number(productData.stock) || 10,
      rating: 5.0,
      numOfReviews: 0,
      images: Array.isArray(productData.images)
        ? productData.images.map((url, i) => ({ id: i, url: typeof url === 'string' ? url : url.url }))
        : [{ id: 1, url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80' }],
      reviews: [],
      featured: !!productData.featured,
      badge: productData.badge || 'New Launch',
    };

    products.unshift(newProd);
    setStored('products', products);
    return newProd;
  },

  updateProduct: async (id, updatedFields) => {
    try {
      const res = await apiClient.put(`/products/${id}`, updatedFields);
      if (res.data) return normalizeProduct(res.data);
    } catch (e) {
      // fallback
    }

    await delay(200);
    const products = getStored('products', INITIAL_PRODUCTS);
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updatedFields };
      setStored('products', products);
      return products[index];
    }
    throw { status: 404, message: 'Product not found' };
  },

  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (e) {
      // fallback
    }

    await delay(150);
    let products = getStored('products', INITIAL_PRODUCTS);
    products = products.filter((p) => String(p.id) !== String(id));
    setStored('products', products);
    return { success: true };
  },

  addReview: async (productId, reviewData) => {
    try {
      await apiClient.post(`/products/${productId}/reviews`, reviewData);
    } catch (e) {
      // fallback
    }

    await delay(200);
    const products = getStored('products', INITIAL_PRODUCTS);
    const product = products.find((p) => String(p.id) === String(productId));
    if (product) {
      const newReview = {
        id: Date.now(),
        user: reviewData.user || 'Verified Buyer',
        rating: Number(reviewData.rating) || 5,
        comment: reviewData.comment,
        date: new Date().toISOString().split('T')[0],
      };
      product.reviews.unshift(newReview);
      product.numOfReviews = product.reviews.length;
      const totalStars = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.rating = Number((totalStars / product.reviews.length).toFixed(1));
      setStored('products', products);
      return newReview;
    }
  },
};

/* Helper to normalize backend DTO format to standard UI format */
const normalizeProduct = (p) => {
  let images = [];
  if (p.images && p.images.length > 0) {
    images = p.images.map((img, idx) => ({
      id: idx,
      url: typeof img === 'string' ? img : img.url || img.publicId || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    }));
  } else {
    images = [{ id: 1, url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80' }];
  }

  return {
    id: p.id,
    name: p.name,
    price: Number(p.price || 0),
    originalPrice: p.originalPrice || Number(p.price || 0) * 1.15,
    seller: p.seller || 'EdKart Verified Store',
    description: p.description || '',
    category: p.category || 'Electronics',
    stock: p.stock !== undefined ? p.stock : 10,
    rating: Number(p.rating || 4.5),
    numOfReviews: p.numOfReviews || (p.reviews ? p.reviews.length : 0),
    images,
    reviews: p.reviews || [],
    featured: p.featured || false,
    badge: p.badge || (p.rating >= 4.8 ? 'Best Seller' : ''),
  };
};

/* ================= ORDER SERVICES ================= */
export const orderService = {
  createOrder: async (orderPayload) => {
    try {
      const res = await apiClient.post('/orders', orderPayload);
      if (res.data) return res.data;
    } catch (e) {
      // fallback
    }

    await delay(300);
    const orders = getStored('orders', INITIAL_ORDERS);
    const orderNo = generateOrderNumber();
    const newOrder = {
      id: 'ord_' + Date.now(),
      orderNumber: orderNo,
      customerName: orderPayload.shippingAddress?.fullName || 'Customer',
      email: orderPayload.email || 'user@edkart.com',
      phone: orderPayload.shippingAddress?.phone || '+91 98765 43210',
      shippingAddress: orderPayload.shippingAddress,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      tax: orderPayload.tax || 0,
      shippingFee: orderPayload.shippingFee || 0,
      discount: orderPayload.discount || 0,
      totalAmount: orderPayload.totalAmount,
      paymentMethod: orderPayload.paymentMethod || 'Online Payment',
      paymentStatus: 'PAID',
      orderStatus: 'PROCESSING',
      orderDate: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    setStored('orders', orders);

    // Deduct stocks
    const products = getStored('products', INITIAL_PRODUCTS);
    orderPayload.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stock >= item.quantity) {
        prod.stock -= item.quantity;
      }
    });
    setStored('products', products);

    return { orderNo, order: newOrder };
  },

  getOrders: async () => {
    try {
      const res = await apiClient.get('/orders');
      if (res.data) return res.data;
    } catch (e) {
      // fallback
    }

    await delay(150);
    return getStored('orders', INITIAL_ORDERS);
  },

  getOrderById: async (orderNo) => {
    try {
      const res = await apiClient.get(`/orders/${orderNo}`);
      if (res.data) return res.data;
    } catch (e) {
      // fallback
    }

    await delay(100);
    const orders = getStored('orders', INITIAL_ORDERS);
    const found = orders.find((o) => o.orderNumber === orderNo || o.id === orderNo);
    if (!found) throw { status: 404, message: 'Order not found' };
    return found;
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await apiClient.put(`/orders/${orderId}/status`, { status: newStatus });
    } catch (e) {
      // fallback
    }

    await delay(200);
    const orders = getStored('orders', INITIAL_ORDERS);
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.orderStatus = newStatus;
      setStored('orders', orders);
      return order;
    }
    throw { status: 404, message: 'Order not found' };
  },
};

/* ================= AUTH SERVICES ================= */
export const authService = {
  login: async (email, password) => {
    await delay(200);
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Check Admin Credentials
    if (
      (cleanEmail === 'admin@edkart.com' || cleanEmail === 'admin') &&
      (password === 'Admin@123' || password === 'admin123' || password === 'admin' || password === 'Password@123')
    ) {
      const user = {
        ...DEMO_USERS.admin,
        email: 'admin@edkart.com',
        role: 'ADMIN',
      };
      const token = 'jwt_mock_admin_token_' + Date.now();
      localStorage.setItem('edkart_auth_token', token);
      localStorage.setItem('edkart_user', JSON.stringify(user));
      return { success: true, token, user };
    }

    // Customer Authentication
    if (password === 'Password@123' || password === 'user123' || password.length >= 6) {
      const user = {
        id: 'usr_' + Date.now(),
        email: cleanEmail,
        fullName: cleanEmail.includes('@') ? cleanEmail.split('@')[0].toUpperCase() : cleanEmail.toUpperCase(),
        role: 'USER',
      };
      const token = 'jwt_mock_user_token_' + Date.now();
      localStorage.setItem('edkart_auth_token', token);
      localStorage.setItem('edkart_user', JSON.stringify(user));
      return { success: true, token, user };
    }

    throw { status: 401, message: 'Invalid email or password. Please check your credentials.' };
  },

  logout: async () => {
    localStorage.removeItem('edkart_auth_token');
    localStorage.removeItem('edkart_user');
  },
};
