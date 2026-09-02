import { describe, it, expect } from 'vitest';
import {
  authService,
  productService,
  adminService,
} from '../services/bankingServices';

describe('Admin Portal & Product Catalog CRUD Integration', () => {
  it('authenticates admin login credentials and assigns ADMIN role', async () => {
    const res = await authService.login('admin@edkart.com', 'Admin@123');
    expect(res.success).toBe(true);
    expect(res.user.role).toBe('ADMIN');
    expect(res.user.fullName).toBe('Bank Operations Administrator');
  });

  it('allows adding a new banking product with custom image URL and rates', async () => {
    const newProd = {
      name: 'Cyber Security High-Yield Vault',
      category: 'deposits',
      tagline: 'Insured term deposits with compounding interest',
      interestRate: '8.25% p.a.',
      minBalance: '₹25,000',
      badge: 'Exclusive',
      recommended: true,
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&auto=format&fit=crop&q=80',
      features: ['256-Bit Cryptographic Ledger', 'Zero Premature Penalty'],
    };

    const res = await productService.addProduct(newProd);
    expect(res.success).toBe(true);
    expect(res.product.name).toBe('Cyber Security High-Yield Vault');
    expect(res.product.interestRate).toBe('8.25% p.a.');

    const catalog = await productService.getProducts();
    const found = catalog.find((p) => p.name === 'Cyber Security High-Yield Vault');
    expect(found).toBeDefined();
  });

  it('updates product details and deletes product successfully', async () => {
    const catalog = await productService.getProducts();
    const target = catalog[0];

    const updateRes = await productService.updateProduct(target.id, {
      interestRate: '9.00% p.a.',
    });
    expect(updateRes.success).toBe(true);
    expect(updateRes.product.interestRate).toBe('9.00% p.a.');

    const deleteRes = await productService.deleteProduct(target.id);
    expect(deleteRes.success).toBe(true);
  });

  it('manages customer KYC approval and account locking', async () => {
    const customers = await adminService.getCustomers();
    const testCust = customers[0];

    const approveRes = await adminService.updateCustomerKYC(testCust.customerId, 'VERIFIED');
    expect(approveRes.success).toBe(true);
    expect(approveRes.customer.kycStatus).toBe('VERIFIED');

    const lockRes = await adminService.toggleCustomerLock(testCust.customerId, true);
    expect(lockRes.success).toBe(true);
    expect(lockRes.customer.isLocked).toBe(true);
  });

  it('processes support tickets and logs admin replies', async () => {
    const tickets = await adminService.getTickets();
    const ticket = tickets[0];

    const replyRes = await adminService.replyTicket(ticket.id, 'Investigation completed.');
    expect(replyRes.success).toBe(true);

    const statusRes = await adminService.updateTicketStatus(ticket.id, 'RESOLVED');
    expect(statusRes.success).toBe(true);
    expect(statusRes.ticket.status).toBe('RESOLVED');
  });
});
