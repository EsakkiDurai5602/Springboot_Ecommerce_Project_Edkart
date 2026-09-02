import apiClient from './apiClient';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS } from './ecommerceData';
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
if (!localStorage.getItem('edkart_ec_users')) setStored('users', INITIAL_USERS);

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================= PRODUCT SERVICES ================= */
export const productService = {
  getProducts: async (params = {}) => {
    let list = [];
    try {
      const endpoint = params.keyword || (params.category && params.category !== 'all') ? '/products/search' : '/products';
      const res = await apiClient.get(endpoint, { params });
      if (res.data) {
        const raw = res.data.products || (Array.isArray(res.data) ? res.data : []);
        if (raw.length > 0) {
          list = raw.map(normalizeProduct);
        }
      }
    } catch (e) {
      // fallback to storage
    }

    if (!list || list.length === 0) {
      await delay(50);
      list = getStored('products', INITIAL_PRODUCTS);
    }

    if (params.category && params.category !== 'all') {
      const catLower = params.category.toLowerCase();
      list = list.filter((p) => {
        const pCat = (p.category || '').toLowerCase();
        return pCat === catLower || (catLower === 'smartphones' && pCat === 'phone');
      });
    }
    if (params.keyword) {
      const q = params.keyword.toLowerCase();
      list = list.filter((p) => (p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q));
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
      if (res.data) {
        const prod = normalizeProduct(res.data);
        const storedProducts = getStored('products', INITIAL_PRODUCTS);
        const stored = storedProducts.find((p) => String(p.id) === String(id));
        if (stored) {
          prod.stock = stored.stock ?? prod.stock;
          prod.reviews = stored.reviews || prod.reviews || [];
          prod.numOfReviews = prod.reviews.length;
        }
        return prod;
      }
    } catch (e) {
      // fallback
    }

    await delay(50);
    const products = getStored('products', INITIAL_PRODUCTS);
    const found = products.find((p) => String(p.id) === String(id));
    if (!found) throw { status: 404, message: 'Product not found.' };
    return found;
  },

  createProduct: async (productData) => {
    try {
      const res = await apiClient.post('/products', productData);
      if (res.data) {
        const normalized = normalizeProduct(res.data);
        const products = getStored('products', INITIAL_PRODUCTS);
        products.unshift(normalized);
        setStored('products', products);
        return normalized;
      }
    } catch (e) {
      // fallback
    }

    await delay(150);
    const products = getStored('products', INITIAL_PRODUCTS);

    // Format up to 5 images
    let images = [];
    if (Array.isArray(productData.images) && productData.images.length > 0) {
      images = productData.images.slice(0, 5).map((img, i) => ({
        id: i + 1,
        url: typeof img === 'string' ? img : img.url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
      }));
    } else if (productData.imageUrl) {
      images = [{ id: 1, url: productData.imageUrl }];
    } else {
      images = [{ id: 1, url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80' }];
    }

    const newProd = {
      id: Date.now(),
      name: productData.name,
      price: Number(productData.price),
      originalPrice: Number(productData.originalPrice || productData.price * 1.15),
      seller: productData.seller || 'EdKart Verified Merchant',
      description: productData.description || 'Premium quality verified tech product.',
      category: productData.category || 'Electronics',
      stock: Number(productData.stock) || 10,
      rating: 5.0,
      numOfReviews: 0,
      images,
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

    await delay(150);
    const products = getStored('products', INITIAL_PRODUCTS);
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      // If images array is provided, format cleanly
      let images = products[index].images;
      if (Array.isArray(updatedFields.images)) {
        images = updatedFields.images.slice(0, 5).map((img, i) => ({
          id: i + 1,
          url: typeof img === 'string' ? img : img.url,
        }));
      }

      products[index] = {
        ...products[index],
        ...updatedFields,
        price: updatedFields.price !== undefined ? Number(updatedFields.price) : products[index].price,
        stock: updatedFields.stock !== undefined ? Number(updatedFields.stock) : products[index].stock,
        images,
      };
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

    await delay(150);
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
    images = p.images.slice(0, 5).map((img, idx) => ({
      id: idx + 1,
      url: typeof img === 'string' ? img : img.url || img.publicId || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
    }));
  } else {
    images = [{ id: 1, url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80' }];
  }

  const categoryMap = {
    phone: 'Smartphones',
    phones: 'Smartphones',
    smartphones: 'Smartphones',
    laptop: 'Laptops',
    laptops: 'Laptops',
    audio: 'Audio',
    wearable: 'Wearables',
    wearables: 'Wearables',
    gaming: 'Gaming',
    accessories: 'Accessories',
    electronics: 'Electronics',
    cloth: 'Accessories',
    fashion: 'Accessories',
  };
  const rawCat = (p.category || '').toLowerCase();
  const category = categoryMap[rawCat] || p.category || 'Electronics';

  return {
    id: p.id,
    name: p.name,
    price: Number(p.price || 0),
    originalPrice: p.originalPrice || Number(p.price || 0) * 1.15,
    seller: p.seller || 'EdKart Verified Store',
    description: p.description || '',
    category,
    stock: p.stock !== undefined ? p.stock : 10,
    rating: Number(p.rating || p.ratings || 4.5),
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
      if (res.data) {
        // synchronize local storage
        const orders = getStored('orders', INITIAL_ORDERS);
        const orderNo = res.data.orderNo || res.data.order?.orderNumber || generateOrderNumber();
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

        const products = getStored('products', INITIAL_PRODUCTS);
        orderPayload.items.forEach((item) => {
          const prod = products.find((p) => p.id === item.productId);
          if (prod && prod.stock >= item.quantity) {
            prod.stock -= item.quantity;
          }
        });
        setStored('products', products);

        return { orderNo, order: newOrder };
      }
    } catch (e) {
      // fallback
    }

    await delay(150);
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
      if (res.data && Array.isArray(res.data) && res.data.length > 0) return res.data;
    } catch (e) {
      // fallback
    }

    await delay(100);
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

    await delay(100);
    const orders = getStored('orders', INITIAL_ORDERS);
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.orderStatus = newStatus;
      setStored('orders', orders);
      return order;
    }
    const fallbackOrder = {
      id: orderId,
      orderNumber: orderId,
      orderStatus: newStatus,
    };
    orders.unshift(fallbackOrder);
    setStored('orders', orders);
    return fallbackOrder;
  },
};

/* ================= AUTH SERVICES WITH 5 SEEDED USERS ================= */
export const authService = {
  login: async (email, password) => {
    await delay(150);
    const cleanEmail = (email || '').trim().toLowerCase();
    
    // Check Admin Credentials
    if (
      (cleanEmail === 'admin@edkart.com' || cleanEmail === 'admin') &&
      (password === 'Admin@123' || password === 'admin123' || password === 'admin' || password === 'Password@123')
    ) {
      const user = {
        id: 'usr_admin',
        email: 'admin@edkart.com',
        fullName: 'Store Operations Admin',
        role: 'ADMIN',
      };
      const token = 'jwt_mock_admin_token_' + Date.now();
      localStorage.setItem('edkart_auth_token', token);
      localStorage.setItem('edkart_user', JSON.stringify(user));
      return { success: true, token, user };
    }

    // Check Seeded & Dynamically Registered Users
    const storedUsers = getStored('users', INITIAL_USERS);
    const existingUser = storedUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existingUser) {
      const token = 'jwt_mock_user_token_' + Date.now();
      localStorage.setItem('edkart_auth_token', token);
      localStorage.setItem('edkart_user', JSON.stringify(existingUser));
      return { success: true, token, user: existingUser };
    }

    // Auto-create & persist newly registered customer
    if (password === 'Password@123' || password === 'user123' || password.length >= 6) {
      const newUser = {
        id: 'usr_' + Date.now(),
        email: cleanEmail,
        fullName: cleanEmail.includes('@') ? cleanEmail.split('@')[0].toUpperCase() : cleanEmail.toUpperCase(),
        role: 'USER',
        joinedDate: new Date().toISOString().split('T')[0],
      };
      storedUsers.push(newUser);
      setStored('users', storedUsers);

      const token = 'jwt_mock_user_token_' + Date.now();
      localStorage.setItem('edkart_auth_token', token);
      localStorage.setItem('edkart_user', JSON.stringify(newUser));
      return { success: true, token, user: newUser };
    }

    throw { status: 401, message: 'Invalid email or password. Please check your credentials.' };
  },

  getUsers: async () => {
    return getStored('users', INITIAL_USERS);
  },

  logout: async () => {
    localStorage.removeItem('edkart_auth_token');
    localStorage.removeItem('edkart_user');
  },
};
