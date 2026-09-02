import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  generateOrderNumber,
  calculateDiscount,
} from '../utils/formatters';

describe('E-Commerce Formatting Utilities', () => {
  it('formats INR currency with proper symbol and precision', () => {
    const formatted = formatCurrency(144900);
    expect(formatted).toContain('1,44,900');
    expect(formatCurrency(0)).toContain('0.00');
    expect(formatCurrency(null)).toContain('0.00');
  });

  it('calculates percentage discounts accurately', () => {
    // 10% off on 10,000 = 9,000
    expect(calculateDiscount(10000, 10)).toBe(9000);
    expect(calculateDiscount(50000, 20)).toBe(40000);
  });

  it('generates unique E-Commerce order reference numbers', () => {
    const ord1 = generateOrderNumber();
    const ord2 = generateOrderNumber();
    expect(ord1).toMatch(/^EDK-ORD-/);
    expect(ord1).not.toBe(ord2);
  });
});
