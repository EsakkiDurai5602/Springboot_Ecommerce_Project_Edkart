import { describe, it, expect } from 'vitest';
import { authService, productService, orderService } from '../services/ecommerceServices';

describe('Admin Portal E-Commerce Operations', () => {
  it('authenticates admin credentials and grants ADMIN role', async () => {
    const res = await authService.login('admin@edkart.com', 'Admin@123');
    expect(res.success).toBe(true);
    expect(res.user.role).toBe('ADMIN');
    expect(res.user.fullName).toBe('Store Operations Admin');
  });

  it('allows creating, updating, and deleting products in catalog', async () => {
    const newProduct = await productService.createProduct({
      name: 'Sony Bravia 4K OLED 65" TV',
      price: 189900.0,
      originalPrice: 219900.0,
      category: 'Electronics',
      seller: 'Sony Official Flagship',
      stock: 15,
      description: 'Cognitive Processor XR with Acoustic Surface Audio+',
      imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    });

    expect(newProduct.name).toBe('Sony Bravia 4K OLED 65" TV');
    expect(newProduct.price).toBe(189900.0);

    const updated = await productService.updateProduct(newProduct.id, {
      price: 179900.0,
    });
    expect(updated.price).toBe(179900.0);

    const deleteRes = await productService.deleteProduct(newProduct.id);
    expect(deleteRes.success).toBe(true);
  });

  it('manages and updates customer order fulfillment status', async () => {
    const orders = await orderService.getOrders();
    const order = orders[0];

    const updatedOrder = await orderService.updateOrderStatus(order.id, 'SHIPPED');
    expect(updatedOrder.orderStatus).toBe('SHIPPED');
  });
});
