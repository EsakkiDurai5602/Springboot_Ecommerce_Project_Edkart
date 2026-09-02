import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  maskAccountNumber,
  maskCardNumber,
  maskEmail,
  calculateEMI,
  generateReferenceId,
} from '../utils/formatters';

describe('Financial Formatting Utilities', () => {
  it('formats INR currency with proper symbol and precision', () => {
    const formatted = formatCurrency(25000);
    expect(formatted).toContain('25,000');
    expect(formatCurrency(0)).toContain('0.00');
    expect(formatCurrency(null)).toContain('0.00');
  });

  it('masks account numbers showing only the last 4 digits', () => {
    expect(maskAccountNumber('501009823412')).toBe('•••• •••• 3412');
    expect(maskAccountNumber('1234')).toBe('1234');
  });

  it('masks card numbers showing first 4 and last 4 digits', () => {
    expect(maskCardNumber('4532890123458819')).toBe('4532 •••• •••• 8819');
  });

  it('masks email addresses preserving user identity safety', () => {
    expect(maskEmail('durai@edkart.com')).toBe('du••••i@edkart.com');
  });

  it('accurately calculates monthly EMI and interest for loans', () => {
    // Principal: 10,00,000, Annual Rate: 10%, Tenure: 12 months
    const { emi, totalPayment, totalInterest } = calculateEMI(1000000, 10, 12);
    expect(emi).toBe(87916);
    expect(totalPayment).toBe(1054991);
    expect(totalInterest).toBe(54991);
  });

  it('generates unique transaction reference IDs', () => {
    const ref1 = generateReferenceId('TXN');
    const ref2 = generateReferenceId('TXN');
    expect(ref1).toMatch(/^TXN/);
    expect(ref1).not.toBe(ref2);
  });
});
