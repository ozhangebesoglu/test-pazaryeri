import { Money } from '../Money';

describe('Money Value Object', () => {
  describe('create', () => {
    it('should create money with amount and currency', () => {
      const money = Money.create(100, 'TRY');
      expect(money.amount).toBe(100);
      expect(money.currency).toBe('TRY');
    });

    it('should use TRY as default currency', () => {
      const money = Money.create(50);
      expect(money.currency).toBe('TRY');
    });

    it('should throw error for negative amount', () => {
      expect(() => Money.create(-10)).toThrow('Money amount cannot be negative');
    });

    it('should be immutable', () => {
      const money = Money.create(100, 'TRY');
      expect(Object.isFrozen(money)).toBe(true);
    });
  });

  describe('zero', () => {
    it('should create zero money', () => {
      const money = Money.zero('TRY');
      expect(money.amount).toBe(0);
      expect(money.currency).toBe('TRY');
    });
  });

  describe('add', () => {
    it('should add two money values', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(50, 'TRY');
      const result = m1.add(m2);
      expect(result.amount).toBe(150);
    });

    it('should throw error for different currencies', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(50, 'USD');
      expect(() => m1.add(m2)).toThrow('Currency mismatch');
    });
  });

  describe('subtract', () => {
    it('should subtract money values', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(30, 'TRY');
      const result = m1.subtract(m2);
      expect(result.amount).toBe(70);
    });

    it('should throw error for negative result', () => {
      const m1 = Money.create(50, 'TRY');
      const m2 = Money.create(100, 'TRY');
      expect(() => m1.subtract(m2)).toThrow('Result cannot be negative');
    });
  });

  describe('multiply', () => {
    it('should multiply money by factor', () => {
      const money = Money.create(100, 'TRY');
      const result = money.multiply(3);
      expect(result.amount).toBe(300);
    });

    it('should handle decimal factors', () => {
      const money = Money.create(100, 'TRY');
      const result = money.multiply(1.5);
      expect(result.amount).toBe(150);
    });

    it('should throw error for negative factor', () => {
      const money = Money.create(100, 'TRY');
      expect(() => money.multiply(-2)).toThrow('Factor cannot be negative');
    });
  });

  describe('equals', () => {
    it('should return true for equal money', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(100, 'TRY');
      expect(m1.equals(m2)).toBe(true);
    });

    it('should return false for different amounts', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(50, 'TRY');
      expect(m1.equals(m2)).toBe(false);
    });

    it('should return false for different currencies', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(100, 'USD');
      expect(m1.equals(m2)).toBe(false);
    });
  });

  describe('comparison', () => {
    it('isGreaterThan should work correctly', () => {
      const m1 = Money.create(100, 'TRY');
      const m2 = Money.create(50, 'TRY');
      expect(m1.isGreaterThan(m2)).toBe(true);
      expect(m2.isGreaterThan(m1)).toBe(false);
    });

    it('isLessThan should work correctly', () => {
      const m1 = Money.create(50, 'TRY');
      const m2 = Money.create(100, 'TRY');
      expect(m1.isLessThan(m2)).toBe(true);
      expect(m2.isLessThan(m1)).toBe(false);
    });
  });

  describe('format', () => {
    it('should format money for Turkish locale', () => {
      const money = Money.create(1234.5, 'TRY');
      const formatted = money.format('tr-TR');
      expect(formatted).toContain('1.234,50');
    });
  });

  describe('toJSON', () => {
    it('should return plain object', () => {
      const money = Money.create(100, 'TRY');
      const json = money.toJSON();
      expect(json).toEqual({ amount: 100, currency: 'TRY' });
    });
  });
});
