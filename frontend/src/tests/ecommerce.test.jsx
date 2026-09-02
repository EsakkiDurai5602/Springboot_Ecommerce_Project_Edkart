import { describe, it, expect } from 'vitest';
import { productService, orderService } from '../services/ecommerceServices';

describe('E-Commerce Services & Order Processing', () => {
  it('loads products and filters by category', async () => {
    const res = await productService.getProducts({ category: 'Smartphones' });
    expect(res.products.length).toBeGreaterThanOrEqual(1);
    expect(res.products.every((p) => p.category === 'Smartphones')).toBe(true);
  });

  it('searches products by keyword', async () => {
    const res = await productService.getProducts({ keyword: 'MacBook' });
    expect(res.products.length).toBeGreaterThanOrEqual(1);
    expect(res.products[0].name).toContain('MacBook');
  });

  it('submits a customer review and recalculates star rating', async () => {
    const productsRes = await productService.getProducts();
    const targetProduct = productsRes.products[0];

    const newReview = await productService.addReview(targetProduct.id, {
      user: 'Verified Tester',
      rating: 5,
      comment: 'Super fast delivery and pristine condition!',
    });

    expect(newReview.user).toBe('Verified Tester');
    expect(newReview.rating).toBe(5);

    const updated = await productService.getProductById(targetProduct.id);
    expect(updated.reviews.length).toBeGreaterThanOrEqual(1);
  });

  it('creates an e-commerce order and deducts inventory stock', async () => {
    const productsRes = await productService.getProducts();
    const targetProduct = productsRes.products[0];
    const initialStock = targetProduct.stock;

    const orderRes = await orderService.createOrder({
      email: 'user@edkart.com',
      shippingAddress: {
        fullName: 'Esakki Durai',
        street: '42 Silicon Boulevard',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
      },
      items: [
        {
          productId: targetProduct.id,
          name: targetProduct.name,
          price: targetProduct.price,
          quantity: 2,
          imageUrl: targetProduct.images[0].url,
        },
      ],
      subtotal: targetProduct.price * 2,
      discount: 0,
      shippingFee: 0,
      totalAmount: targetProduct.price * 2,
      paymentMethod: 'Instant UPI',
    });

    expect(orderRes.orderNo).toBeDefined();
    expect(orderRes.order.items.length).toBe(1);

    const updatedProduct = await productService.getProductById(targetProduct.id);
    expect(updatedProduct.stock).toBeLessThanOrEqual(initialStock);
  });
});
