import apiClient from './apiClient';
import {
  INITIAL_USER,
  INITIAL_ADMIN,
  INITIAL_CUSTOMERS,
  INITIAL_ACCOUNTS,
  INITIAL_TRANSACTIONS,
  INITIAL_BENEFICIARIES,
  INITIAL_CARDS,
  INITIAL_LOANS,
  BANKING_PRODUCTS_CATALOG,
  INITIAL_NOTIFICATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_SESSIONS,
  INITIAL_TICKETS,
  INITIAL_SYSTEM_LOGS,
} from './mockData';
import { generateReferenceId } from '../utils/formatters';

const getStored = (key, defaultVal) => {
  try {
    const item = localStorage.getItem(`edkart_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStored = (key, val) => {
  try {
    localStorage.setItem(`edkart_${key}`, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error', e);
  }
};

// Initialize default storage on first load if empty
if (!localStorage.getItem('edkart_accounts')) setStored('accounts', INITIAL_ACCOUNTS);
if (!localStorage.getItem('edkart_transactions')) setStored('transactions', INITIAL_TRANSACTIONS);
if (!localStorage.getItem('edkart_beneficiaries')) setStored('beneficiaries', INITIAL_BENEFICIARIES);
if (!localStorage.getItem('edkart_cards')) setStored('cards', INITIAL_CARDS);
if (!localStorage.getItem('edkart_loans')) setStored('loans', INITIAL_LOANS);
if (!localStorage.getItem('edkart_notifications')) setStored('notifications', INITIAL_NOTIFICATIONS);
if (!localStorage.getItem('edkart_user')) setStored('user', INITIAL_USER);
if (!localStorage.getItem('edkart_sessions')) setStored('sessions', INITIAL_SESSIONS);
if (!localStorage.getItem('edkart_products')) setStored('products', BANKING_PRODUCTS_CATALOG);
if (!localStorage.getItem('edkart_customers')) setStored('customers', INITIAL_CUSTOMERS);
if (!localStorage.getItem('edkart_tickets')) setStored('tickets', INITIAL_TICKETS);
if (!localStorage.getItem('edkart_system_logs')) setStored('system_logs', INITIAL_SYSTEM_LOGS);

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

/* ================= AUTH SERVICE ================= */
export const authService = {
  login: async (email, password) => {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      await delay(300);
      if (email === 'locked@edkart.com') {
        throw { status: 403, message: 'Account locked due to 3 consecutive failed login attempts. Contact bank support.' };
      }

      // Check Admin Login
      if (email === 'admin@edkart.com' && (password === 'Admin@123' || password === 'admin123' || password === 'Password@123')) {
        const adminUser = INITIAL_ADMIN;
        const token = 'jwt_mock_admin_token.' + btoa(JSON.stringify(adminUser)) + '.sig';
        localStorage.setItem('edkart_auth_token', token);
        localStorage.setItem('edkart_user', JSON.stringify(adminUser));
        return { success: true, token, user: adminUser };
      }

      if (password !== 'Password@123' && password !== 'admin123') {
        throw { status: 401, message: 'Invalid credentials. Please verify your email and password.' };
      }

      const user = getStored('user', INITIAL_USER);
      const safeBase64 = (str) => {
        try {
          if (typeof Buffer !== 'undefined') {
            return Buffer.from(str, 'utf-8').toString('base64');
          }
          return btoa(unescape(encodeURIComponent(str)));
        } catch (e) {
          return 'jwt_encoded_payload';
        }
      };
      const token = 'jwt_mock_header.' + safeBase64(JSON.stringify(user)) + '.mock_signature_2026';
      localStorage.setItem('edkart_auth_token', token);
      localStorage.setItem('edkart_user', JSON.stringify(user));
      return { success: true, token, user };
    }
  },

  register: async (formData) => {
    try {
      const res = await apiClient.post('/auth/register', formData);
      return res.data;
    } catch (err) {
      await delay(400);
      const newUser = {
        ...INITIAL_USER,
        fullName: formData.fullName || 'New Customer',
        email: formData.email,
        phone: formData.phone || '+91 99999 88888',
        customerId: 'EDK-' + Math.floor(100000 + Math.random() * 900000),
      };
      setStored('user', newUser);
      return { success: true, message: 'Account registered successfully.', user: newUser };
    }
  },

  verifyOtp: async (otp, context = 'login') => {
    try {
      const res = await apiClient.post('/auth/verify-otp', { otp, context });
      return res.data;
    } catch (err) {
      await delay(200);
      if (otp === '123456' || otp === '999999' || otp.length === 6) {
        return { success: true, message: 'OTP verified successfully.' };
      }
      throw { status: 400, message: 'Invalid OTP entered.' };
    }
  },

  forgotPassword: async (identifier) => {
    try {
      const res = await apiClient.post('/auth/forgot-password', { identifier });
      return res.data;
    } catch (err) {
      await delay(300);
      return { success: true, message: `Reset instructions sent to ${identifier}` };
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      const res = await apiClient.post('/auth/reset-password', { token, newPassword });
      return res.data;
    } catch (err) {
      await delay(300);
      return { success: true, message: 'Password has been securely reset.' };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      // Ignore fallback
    } finally {
      localStorage.removeItem('edkart_auth_token');
      localStorage.removeItem('edkart_user');
    }
  },
};

/* ================= ACCOUNT SERVICE ================= */
export const accountService = {
  getAccounts: async () => {
    try {
      const res = await apiClient.get('/accounts');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('accounts', INITIAL_ACCOUNTS);
    }
  },

  getAccountById: async (id) => {
    try {
      const res = await apiClient.get(`/accounts/${id}`);
      return res.data;
    } catch (err) {
      await delay(150);
      const accounts = getStored('accounts', INITIAL_ACCOUNTS);
      const found = accounts.find((a) => a.id === id || a.accountNumber === id);
      if (!found) throw { status: 404, message: 'Account not found' };
      return found;
    }
  },
};

/* ================= TRANSACTION SERVICE ================= */
export const transactionService = {
  getTransactions: async (params = {}) => {
    try {
      const res = await apiClient.get('/transactions', { params });
      return res.data;
    } catch (err) {
      await delay(200);
      let list = getStored('transactions', INITIAL_TRANSACTIONS);
      
      if (params.accountId && params.accountId !== 'all') {
        list = list.filter((t) => t.accountId === params.accountId);
      }
      if (params.type && params.type !== 'all') {
        list = list.filter((t) => t.type === params.type);
      }
      if (params.category && params.category !== 'all') {
        list = list.filter((t) => t.category === params.category);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        list = list.filter(
          (t) =>
            t.description.toLowerCase().includes(q) ||
            t.referenceId.toLowerCase().includes(q) ||
            (t.recipient && t.recipient.toLowerCase().includes(q)) ||
            (t.sender && t.sender.toLowerCase().includes(q))
        );
      }
      return {
        transactions: list,
        total: list.length,
        page: params.page || 1,
      };
    }
  },

  getTransactionById: async (id) => {
    try {
      const res = await apiClient.get(`/transactions/${id}`);
      return res.data;
    } catch (err) {
      await delay(150);
      const list = getStored('transactions', INITIAL_TRANSACTIONS);
      const found = list.find((t) => t.id === id || t.referenceId === id);
      if (!found) throw { status: 404, message: 'Transaction record not found' };
      return found;
    }
  },
};

/* ================= TRANSFER SERVICE ================= */
export const transferService = {
  executeTransfer: async (transferPayload) => {
    try {
      const res = await apiClient.post('/transfers', transferPayload);
      return res.data;
    } catch (err) {
      await delay(400);
      const accounts = getStored('accounts', INITIAL_ACCOUNTS);
      const transactions = getStored('transactions', INITIAL_TRANSACTIONS);
      const { sourceAccountId, beneficiaryId, amount, note, transferMode = 'IMPS' } = transferPayload;
      
      const numAmount = Number(amount);
      const sourceAcc = accounts.find((a) => a.id === sourceAccountId);

      if (!sourceAcc) throw { status: 400, message: 'Invalid source account selected.' };
      if (sourceAcc.balance < numAmount) throw { status: 400, message: 'Insufficient account balance for this transfer.' };

      sourceAcc.balance -= numAmount;
      setStored('accounts', accounts);

      const beneficiaries = getStored('beneficiaries', INITIAL_BENEFICIARIES);
      const ben = beneficiaries.find((b) => b.id === beneficiaryId);
      const recipientName = ben ? `${ben.name} (${ben.bankName})` : 'Beneficiary Account';

      const newTxn = {
        id: 'txn_' + Date.now(),
        referenceId: generateReferenceId('TXN'),
        accountId: sourceAccountId,
        type: 'DEBIT',
        category: 'transfer',
        amount: numAmount,
        currency: 'INR',
        date: new Date().toISOString(),
        description: `${transferMode} Fund Transfer to ${recipientName}`,
        status: 'COMPLETED',
        recipient: recipientName,
        fee: transferMode === 'IMPS' ? 5.0 : 0.0,
        note: note || 'Fund Transfer',
      };

      transactions.unshift(newTxn);
      setStored('transactions', transactions);

      const notifications = getStored('notifications', INITIAL_NOTIFICATIONS);
      notifications.unshift({
        id: 'notif_' + Date.now(),
        category: 'transaction',
        title: `Transfer Successful: ₹${numAmount.toLocaleString('en-IN')}`,
        message: `Transferred to ${recipientName} via ${transferMode}. Ref: ${newTxn.referenceId}`,
        timestamp: new Date().toISOString(),
        read: false,
        priority: 'NORMAL',
        actionLink: `/transactions/${newTxn.id}`,
      });
      setStored('notifications', notifications);

      return {
        success: true,
        transaction: newTxn,
        updatedBalance: sourceAcc.balance,
        message: 'Fund transfer completed successfully.',
      };
    }
  },
};

/* ================= BENEFICIARY SERVICE ================= */
export const beneficiaryService = {
  getBeneficiaries: async () => {
    try {
      const res = await apiClient.get('/beneficiaries');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('beneficiaries', INITIAL_BENEFICIARIES);
    }
  },

  addBeneficiary: async (payload) => {
    try {
      const res = await apiClient.post('/beneficiaries', payload);
      return res.data;
    } catch (err) {
      await delay(300);
      const beneficiaries = getStored('beneficiaries', INITIAL_BENEFICIARIES);
      const newBen = {
        id: 'ben_' + Date.now(),
        name: payload.name,
        accountNumber: payload.accountNumber,
        bankName: payload.bankName || 'Other Bank',
        ifsc: payload.ifsc.toUpperCase(),
        transferType: payload.transferType || 'IMPS/NEFT',
        dailyLimit: Number(payload.dailyLimit) || 100000,
        status: 'ACTIVE',
        addedDate: new Date().toISOString().split('T')[0],
        nickname: payload.nickname || payload.name,
        email: payload.email || '',
      };
      beneficiaries.unshift(newBen);
      setStored('beneficiaries', beneficiaries);
      return { success: true, beneficiary: newBen, message: 'Beneficiary registered successfully.' };
    }
  },

  deleteBeneficiary: async (id) => {
    try {
      const res = await apiClient.delete(`/beneficiaries/${id}`);
      return res.data;
    } catch (err) {
      await delay(200);
      let beneficiaries = getStored('beneficiaries', INITIAL_BENEFICIARIES);
      beneficiaries = beneficiaries.filter((b) => b.id !== id);
      setStored('beneficiaries', beneficiaries);
      return { success: true, message: 'Beneficiary removed.' };
    }
  },
};

/* ================= CARD SERVICE ================= */
export const cardService = {
  getCards: async () => {
    try {
      const res = await apiClient.get('/cards');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('cards', INITIAL_CARDS);
    }
  },

  toggleFreeze: async (cardId, newStatus) => {
    try {
      const res = await apiClient.patch(`/cards/${cardId}/status`, { status: newStatus });
      return res.data;
    } catch (err) {
      await delay(200);
      const cards = getStored('cards', INITIAL_CARDS);
      const card = cards.find((c) => c.id === cardId);
      if (card) {
        card.status = newStatus;
        setStored('cards', cards);
      }
      return { success: true, card, message: `Card ${newStatus === 'FROZEN' ? 'frozen' : 'unfrozen'} successfully.` };
    }
  },

  updateLimits: async (cardId, limitsPayload) => {
    try {
      const res = await apiClient.patch(`/cards/${cardId}/limits`, limitsPayload);
      return res.data;
    } catch (err) {
      await delay(200);
      const cards = getStored('cards', INITIAL_CARDS);
      const card = cards.find((c) => c.id === cardId);
      if (card) {
        Object.assign(card, limitsPayload);
        setStored('cards', cards);
      }
      return { success: true, card, message: 'Card spending controls updated.' };
    }
  },

  changePin: async (cardId, pin) => {
    try {
      const res = await apiClient.post(`/cards/${cardId}/pin`, { pin });
      return res.data;
    } catch (err) {
      await delay(250);
      return { success: true, message: 'Card ATM / POS PIN reset successfully.' };
    }
  },
};

/* ================= LOAN SERVICE ================= */
export const loanService = {
  getLoans: async () => {
    try {
      const res = await apiClient.get('/loans');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('loans', INITIAL_LOANS);
    }
  },

  applyLoan: async (applicationData) => {
    try {
      const res = await apiClient.post('/loans/apply', applicationData);
      return res.data;
    } catch (err) {
      await delay(300);
      return {
        success: true,
        referenceNumber: 'APP-LN-' + Math.floor(100000 + Math.random() * 900000),
        message: 'Loan application submitted for digital underwriting.',
      };
    }
  },
};

/* ================= PRODUCT SERVICE & ADMIN CRUD ================= */
export const productService = {
  getProducts: async () => {
    try {
      const res = await apiClient.get('/products');
      if (res.data && res.data.content) return res.data.content;
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('products', BANKING_PRODUCTS_CATALOG);
    }
  },

  addProduct: async (newProduct) => {
    try {
      const res = await apiClient.post('/products', newProduct);
      return res.data;
    } catch (err) {
      await delay(300);
      const products = getStored('products', BANKING_PRODUCTS_CATALOG);
      const item = {
        id: 'prod_' + Date.now(),
        name: newProduct.name,
        category: newProduct.category || 'savings',
        tagline: newProduct.tagline || 'Next-Gen Financial Solution',
        interestRate: newProduct.interestRate || '5.5% p.a.',
        minBalance: newProduct.minBalance || '₹5,000',
        badge: newProduct.badge || 'New Launch',
        recommended: !!newProduct.recommended,
        status: 'ACTIVE',
        imageUrl: newProduct.imageUrl || 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&auto=format&fit=crop&q=80',
        features: Array.isArray(newProduct.features) ? newProduct.features : [
          'Instant digital onboarding',
          'Zero processing charges on first year',
          '24/7 dedicated wealth advisory desk',
        ],
      };
      products.unshift(item);
      setStored('products', products);
      return { success: true, product: item, message: 'Product added to catalog successfully.' };
    }
  },

  updateProduct: async (id, updatedFields) => {
    try {
      const res = await apiClient.put(`/products/${id}`, updatedFields);
      return res.data;
    } catch (err) {
      await delay(250);
      const products = getStored('products', BANKING_PRODUCTS_CATALOG);
      const index = products.findIndex((p) => p.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedFields };
        setStored('products', products);
      }
      return { success: true, product: products[index], message: 'Product updated successfully.' };
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await apiClient.delete(`/products/${id}`);
      return res.data;
    } catch (err) {
      await delay(200);
      let products = getStored('products', BANKING_PRODUCTS_CATALOG);
      products = products.filter((p) => p.id !== id);
      setStored('products', products);
      return { success: true, message: 'Product removed from catalog.' };
    }
  },
};

/* ================= ADMIN MANAGEMENT SERVICES ================= */
export const adminService = {
  getCustomers: async () => {
    await delay(200);
    return getStored('customers', INITIAL_CUSTOMERS);
  },

  updateCustomerKYC: async (customerId, kycStatus) => {
    await delay(250);
    const customers = getStored('customers', INITIAL_CUSTOMERS);
    const customer = customers.find((c) => c.customerId === customerId || c.id === customerId);
    if (customer) {
      customer.kycStatus = kycStatus;
      setStored('customers', customers);
    }
    return { success: true, customer, message: `KYC updated to ${kycStatus}.` };
  },

  toggleCustomerLock: async (customerId, isLocked) => {
    await delay(250);
    const customers = getStored('customers', INITIAL_CUSTOMERS);
    const customer = customers.find((c) => c.customerId === customerId || c.id === customerId);
    if (customer) {
      customer.isLocked = isLocked;
      setStored('customers', customers);
    }
    return { success: true, customer, message: `Customer account ${isLocked ? 'locked' : 'unlocked'}.` };
  },

  getTickets: async () => {
    await delay(150);
    return getStored('tickets', INITIAL_TICKETS);
  },

  updateTicketStatus: async (ticketId, status) => {
    await delay(200);
    const tickets = getStored('tickets', INITIAL_TICKETS);
    const ticket = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (ticket) {
      ticket.status = status;
      setStored('tickets', tickets);
    }
    return { success: true, ticket, message: `Ticket status set to ${status}.` };
  },

  replyTicket: async (ticketId, messageText) => {
    await delay(200);
    const tickets = getStored('tickets', INITIAL_TICKETS);
    const ticket = tickets.find((t) => t.id === ticketId || t.ticketNumber === ticketId);
    if (ticket) {
      ticket.messages.push({
        sender: 'admin',
        text: messageText,
        timestamp: new Date().toISOString(),
      });
      setStored('tickets', tickets);
    }
    return { success: true, ticket, message: 'Response sent to customer.' };
  },

  getSystemLogs: async () => {
    await delay(150);
    return getStored('system_logs', INITIAL_SYSTEM_LOGS);
  },
};

/* ================= PROFILE SERVICE ================= */
export const profileService = {
  getProfile: async () => {
    try {
      const res = await apiClient.get('/profile');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('user', INITIAL_USER);
    }
  },

  updateProfile: async (updatedData) => {
    try {
      const res = await apiClient.put('/profile', updatedData);
      return res.data;
    } catch (err) {
      await delay(250);
      const user = { ...getStored('user', INITIAL_USER), ...updatedData };
      setStored('user', user);
      return { success: true, user, message: 'Profile details updated.' };
    }
  },

  getSessions: async () => {
    try {
      const res = await apiClient.get('/security/sessions');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('sessions', INITIAL_SESSIONS);
    }
  },

  terminateSession: async (sessionId) => {
    try {
      const res = await apiClient.delete(`/security/sessions/${sessionId}`);
      return res.data;
    } catch (err) {
      await delay(200);
      let sessions = getStored('sessions', INITIAL_SESSIONS);
      sessions = sessions.filter((s) => s.id !== sessionId);
      setStored('sessions', sessions);
      return { success: true, message: 'Device session terminated.' };
    }
  },
};

/* ================= NOTIFICATION SERVICE ================= */
export const notificationService = {
  getNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications');
      return res.data;
    } catch (err) {
      await delay(150);
      return getStored('notifications', INITIAL_NOTIFICATIONS);
    }
  },

  markAsRead: async (id) => {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (err) {
      // fallback
    }
    const notifs = getStored('notifications', INITIAL_NOTIFICATIONS);
    const n = notifs.find((item) => item.id === id);
    if (n) {
      n.read = true;
      setStored('notifications', notifs);
    }
    return { success: true };
  },

  markAllAsRead: async () => {
    try {
      await apiClient.post('/notifications/read-all');
    } catch (err) {
      // fallback
    }
    const notifs = getStored('notifications', INITIAL_NOTIFICATIONS).map((n) => ({ ...n, read: true }));
    setStored('notifications', notifs);
    return { success: true };
  },
};

/* ================= DOCUMENT SERVICE ================= */
export const documentService = {
  getDocuments: async () => {
    try {
      const res = await apiClient.get('/documents');
      return res.data;
    } catch (err) {
      await delay(150);
      return INITIAL_DOCUMENTS;
    }
  },
};
