import apiClient from './apiClient';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_USERS, INITIAL_PRODUCT_LOGS } from './ecommerceData';
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

const CATALOG_VERSION = 'v3_525_real_photos';
const currentVersion = localStorage.getItem('edkart_ec_catalog_version');

// Always ensure 105 real photography products & 109 admin logs are synchronized
if (currentVersion !== CATALOG_VERSION) {
  setStored('products', INITIAL_PRODUCTS);
  setStored('product_logs', INITIAL_PRODUCT_LOGS);
  localStorage.setItem('edkart_ec_catalog_version', CATALOG_VERSION);
  console.log('[EdKart Store]: Synchronized 105 real photorealistic products & 109 admin logs (v3).');
}

if (!localStorage.getItem('edkart_ec_orders')) setStored('orders', INITIAL_ORDERS);
if (!localStorage.getItem('edkart_ec_users')) setStored('users', INITIAL_USERS);

const delay = (ms = 50) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================= PRODUCT AUDIT LOGS SERVICE ================= */
export const productLogService = {
  getProductLogs: async () => {
    await delay(20);
    let logs = getStored('product_logs', null);
    if (!logs || logs.length < 100) {
      logs = INITIAL_PRODUCT_LOGS;
      setStored('product_logs', logs);
    }
    return logs;
  },

  addLog: async (logEntry) => {
    const logs = getStored('product_logs', INITIAL_PRODUCT_LOGS);
    const newLog = {
      id: 'plog_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      adminEmail: 'admin@edkart.com',
      adminName: 'Store Operations Admin',
      ...logEntry,
    };
    logs.unshift(newLog);
    setStored('product_logs', logs);
    return newLog;
  },

  clearLogs: async () => {
    setStored('product_logs', []);
    return [];
  },
};

/* ================= PRODUCT SERVICES ================= */
export const productService = {
  getProducts: async (params = {}) => {
    let list = [];
    try {
      const endpoint = params.keyword || (params.category && params.category !== 'all') ? '/products/search' : '/products';
      const res = await apiClient.get(endpoint, { params });
      if (res.data) {
        const raw = res.data.products || (Array.isArray(res.data) ? res.data : []);
        if (raw.length >= 100) {
          list = raw.map(normalizeProduct);
        }
      }
    } catch (e) {
      // fallback to storage
    }

    if (!list || list.length < 100) {
      await delay(30);
      list = getStored('products', INITIAL_PRODUCTS).map(normalizeProduct);
    }

    // Check inventory and trigger console alert for out of stock products
    const outOfStockItems = list.filter((p) => p.stock <= 0);
    if (outOfStockItems.length > 0) {
      console.warn(
        `%c[EdKart Admin Inventory Alert] ⚠️ Found ${outOfStockItems.length} OUT OF STOCK products in catalog:`,
        'color: #ef4444; font-weight: bold; font-size: 12px;',
        outOfStockItems.map((p) => ({ id: p.id, name: p.name, category: p.category, stock: p.stock }))
      );
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

    await delay(40);
    const products = getStored('products', INITIAL_PRODUCTS);
    const found = products.find((p) => String(p.id) === String(id));
    if (!found) throw { status: 404, message: 'Product not found.' };
    return normalizeProduct(found);
  },

  createProduct: async (productData) => {
    try {
      const res = await apiClient.post('/products', productData);
      if (res.data) {
        const normalized = normalizeProduct(res.data);
        const products = getStored('products', INITIAL_PRODUCTS);
        products.unshift(normalized);
        setStored('products', products);

        // Record Admin Insertion Log
        productLogService.addLog({
          action: 'INSERTED',
          productId: normalized.id,
          productName: normalized.name,
          category: normalized.category,
          price: normalized.price,
          stock: normalized.stock,
          imagesCount: normalized.images?.length || 1,
          details: `Admin published new SKU "${normalized.name}" with ${normalized.images?.length || 1} multi-angle photo assets.`,
        });

        return normalized;
      }
    } catch (e) {
      // fallback
    }

    await delay(100);
    const products = getStored('products', INITIAL_PRODUCTS);

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

    // Record Admin Insertion Log
    productLogService.addLog({
      action: 'INSERTED',
      productId: newProd.id,
      productName: newProd.name,
      category: newProd.category,
      price: newProd.price,
      stock: newProd.stock,
      imagesCount: newProd.images.length,
      details: `Admin inserted "${newProd.name}" (${newProd.category}) with ${newProd.images.length} multi-angle sides.`,
    });

    return newProd;
  },

  updateProduct: async (id, updatedFields) => {
    try {
      const res = await apiClient.put(`/products/${id}`, updatedFields);
      if (res.data) return normalizeProduct(res.data);
    } catch (e) {
      // fallback
    }

    await delay(100);
    const products = getStored('products', INITIAL_PRODUCTS);
    const index = products.findIndex((p) => String(p.id) === String(id));
    if (index !== -1) {
      let images = products[index].images;
      if (Array.isArray(updatedFields.images)) {
        images = updatedFields.images.slice(0, 5).map((img, i) => ({
          id: i + 1,
          url: typeof img === 'string' ? img : img.url,
        }));
      }

      const prevStock = products[index].stock;
      const newStock = updatedFields.stock !== undefined ? Number(updatedFields.stock) : products[index].stock;

      products[index] = {
        ...products[index],
        ...updatedFields,
        price: updatedFields.price !== undefined ? Number(updatedFields.price) : products[index].price,
        stock: newStock,
        images,
      };
      setStored('products', products);

      // Record Admin Update Log
      productLogService.addLog({
        action: newStock === 0 ? 'OUT_OF_STOCK_ALERT' : 'UPDATED',
        productId: products[index].id,
        productName: products[index].name,
        category: products[index].category,
        price: products[index].price,
        stock: newStock,
        imagesCount: images.length,
        details: newStock === 0
          ? `WARNING: Stock dropped to 0 for "${products[index].name}". Console alert dispatched.`
          : `Admin updated product details & pricing for "${products[index].name}".`,
      });

      if (newStock === 0) {
        console.warn(
          `%c[EdKart Admin Console Alert]: Product "${products[index].name}" is OUT OF STOCK (0 units remaining)!`,
          'color: #ef4444; font-weight: bold;'
        );
      }

      return normalizeProduct(products[index]);
    }
    throw { status: 404, message: 'Product not found' };
  },

  updateStock: async (id, newStock) => {
    const stockVal = Math.max(0, Number(newStock));
    const products = getStored('products', INITIAL_PRODUCTS);
    const prod = products.find((p) => String(p.id) === String(id));
    if (prod) {
      prod.stock = stockVal;
      setStored('products', products);

      // Log stock adjustment
      productLogService.addLog({
        action: stockVal === 0 ? 'OUT_OF_STOCK_ALERT' : 'STOCK_ADJUSTED',
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        price: prod.price,
        stock: stockVal,
        imagesCount: prod.images?.length || 1,
        details: stockVal === 0
          ? `ALERT: Stock level set to 0. Product marked OUT OF STOCK.`
          : `Admin adjusted stock level to ${stockVal} units.`,
      });

      if (stockVal === 0) {
        console.warn(
          `%c[EdKart Admin Console Alert]: Product "${prod.name}" (ID: ${prod.id}) is OUT OF STOCK!`,
          'color: #ef4444; font-weight: bold; font-size: 13px;'
        );
      }

      return prod;
    }
    throw { status: 404, message: 'Product not found' };
  },

  deleteProduct: async (id) => {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (e) {
      // fallback
    }

    await delay(100);
    let products = getStored('products', INITIAL_PRODUCTS);
    const target = products.find((p) => String(p.id) === String(id));
    products = products.filter((p) => String(p.id) !== String(id));
    setStored('products', products);

    if (target) {
      // Record Admin Deletion Log
      productLogService.addLog({
        action: 'DELETED',
        productId: target.id,
        productName: target.name,
        category: target.category,
        price: target.price,
        stock: target.stock,
        imagesCount: target.images?.length || 1,
        details: `Admin permanently removed product "${target.name}" from catalog inventory.`,
      });
    }

    return { success: true };
  },

  addReview: async (productId, reviewData) => {
    try {
      await apiClient.post(`/products/${productId}/reviews`, reviewData);
    } catch (e) {
      // fallback
    }

    await delay(100);
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
  if (!p) return null;
  let images = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images.slice(0, 5).map((img, idx) => {
      let url = typeof img === 'string' ? img : img.url || img.publicId || '';
      if (typeof url === 'string' && url.startsWith('/uploads/http')) {
        url = url.replace('/uploads/', '');
      }
      return {
        id: idx + 1,
        url: url || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=800&auto=format&fit=crop&q=80',
      };
    });
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
    originalPrice: p.originalPrice ? Number(p.originalPrice) : Number(p.price || 0) * 1.15,
    seller: p.seller || 'EdKart Verified Store',
    description: p.description || '',
    category,
    stock: p.stock !== undefined ? Number(p.stock) : 10,
    rating: Number(p.rating || p.ratings || 4.8),
    numOfReviews: p.numOfReviews || (p.reviews ? p.reviews.length : 0),
    images,
    reviews: p.reviews || [],
    featured: p.featured || false,
    badge: p.badge || (Number(p.rating || p.ratings || 0) >= 4.8 ? 'Best Seller' : ''),
  };
};

/* Helper to normalize backend Order format to unified UI format */
const normalizeOrder = (o) => {
  if (!o) return null;
  const rawItems = o.items || o.orderItem || [];
  const items = rawItems.map((item, idx) => {
    let rawImg = item.imageUrl || item.image || '';
    if (typeof rawImg === 'string' && rawImg.startsWith('/uploads/http')) {
      rawImg = rawImg.replace('/uploads/', '');
    }
    return {
      id: item.id || idx + 1,
      productId: item.productId || item.product?.id || item.id,
      name: item.name || 'EdKart Verified Item',
      price: Number(item.price || 0),
      quantity: Number(item.quantity || 1),
      imageUrl: rawImg || '/assets/products/iphone16_pro.jpg',
    };
  });

  const subtotal = Number(o.subtotal || o.totalItemAmount || o.totalAmount || 0);
  const totalAmount = Number(
    o.totalAmount !== undefined && o.totalAmount !== null
      ? o.totalAmount
      : subtotal + Number(o.tax || 0) + Number(o.shippingFee || 0) - Number(o.discount || 0)
  );

  return {
    id: o.id || o.orderNo || 'ord_' + Date.now(),
    orderNumber: o.orderNumber || o.orderNo || `EDK-ORD-${o.id}`,
    customerName: o.customerName || o.shippingAddress?.fullName || 'Valued Customer',
    email: o.email || 'customer@edkart.com',
    phone: o.phone || o.shippingAddress?.phone || '+91 98765 43210',
    shippingAddress: o.shippingAddress || {
      fullName: o.customerName || 'Valued Customer',
      phone: o.phone || '+91 98765 43210',
      street: '42 Silicon Boulevard',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560100',
    },
    items,
    subtotal,
    tax: Number(o.tax || 0),
    shippingFee: Number(o.shippingFee || 0),
    discount: Number(o.discount || 0),
    totalAmount,
    paymentMethod: o.paymentMethod || 'Online Payment (UPI/Card)',
    paymentStatus: o.paymentStatus || 'PAID',
    orderStatus: o.orderStatus || o.status || 'PROCESSING',
    orderDate: o.orderDate || o.createdAt || new Date().toISOString(),
  };
};

/* ================= ORDER SERVICES ================= */
export const orderService = {
  createOrder: async (orderPayload) => {
    try {
      const res = await apiClient.post('/orders', orderPayload);
      if (res.data) {
        const orderNo = res.data.orderNo || res.data.order?.orderNumber || generateOrderNumber();
        const normalized = normalizeOrder({
          ...res.data,
          orderNo,
          customerName: orderPayload.shippingAddress?.fullName || 'Customer',
          email: orderPayload.email || 'user@edkart.com',
          phone: orderPayload.shippingAddress?.phone || '+91 98765 43210',
          shippingAddress: orderPayload.shippingAddress,
          items: orderPayload.items,
          subtotal: orderPayload.subtotal,
          totalAmount: orderPayload.totalAmount,
        });

        const orders = getStored('orders', INITIAL_ORDERS).map(normalizeOrder);
        orders.unshift(normalized);
        setStored('orders', orders);

        const products = getStored('products', INITIAL_PRODUCTS);
        orderPayload.items.forEach((item) => {
          const prod = products.find((p) => p.id === item.productId);
          if (prod && prod.stock >= item.quantity) {
            prod.stock -= item.quantity;
          }
        });
        setStored('products', products);

        return { orderNo, order: normalized };
      }
    } catch (e) {
      // fallback
    }

    await delay(100);
    const orders = getStored('orders', INITIAL_ORDERS).map(normalizeOrder);
    const orderNo = generateOrderNumber();
    const newOrder = normalizeOrder({
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
    });

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
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        return res.data.map(normalizeOrder);
      }
    } catch (e) {
      // fallback
    }

    await delay(60);
    return getStored('orders', INITIAL_ORDERS).map(normalizeOrder);
  },

  getOrderById: async (orderNo) => {
    try {
      const res = await apiClient.get(`/orders/${orderNo}`);
      if (res.data) return normalizeOrder(res.data);
    } catch (e) {
      // fallback
    }

    await delay(50);
    const orders = getStored('orders', INITIAL_ORDERS).map(normalizeOrder);
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

    await delay(60);
    const orders = getStored('orders', INITIAL_ORDERS).map(normalizeOrder);
    const order = orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (order) {
      order.orderStatus = newStatus;
      setStored('orders', orders);
      return order;
    }
    const fallbackOrder = normalizeOrder({
      id: orderId,
      orderNumber: orderId,
      orderStatus: newStatus,
    });
    orders.unshift(fallbackOrder);
    setStored('orders', orders);
    return fallbackOrder;
  },
};

/* ================= AUTH SERVICES WITH 5 SEEDED USERS ================= */
export const authService = {
  login: async (email, password) => {
    await delay(100);
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
