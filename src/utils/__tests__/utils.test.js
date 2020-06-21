import { formatDate } from '../date.utils';
import { formatCurrency } from '../index';

describe('utils', () => {

  describe('formatCurrency()', () => {
    it('should format currency', () => {
      expect(formatCurrency(3000)).toBe('$30.00')
      expect(formatCurrency(300000)).toBe('$3000.00')
    });
  });

  describe('formatDate()', () => {
    const s = 1; // 1 s
    const m = s * 60; // 1 m
    const h = m * 60; // 1 h
    const d = h * 24; // 1 d
    const w = d * 7; // 1 w

    const getDate = (diffInSeconds: number) => new Date(Date.now() - (diffInSeconds * 1000));

    it('should format for moment ago', () => {
      expect(formatDate(getDate(1))).toBe('a moment ago');
      expect(formatDate(getDate(4))).toBe('few moments ago');
    });

    it('should correct parse various time elapses', () => {
      expect(formatDate(getDate(4))).toBe('few moments ago');
      expect(formatDate(getDate(m * 4))).toBe('4 minutes ago');
      expect(formatDate(getDate(h * 4))).toBe('4 hours ago');
      expect(formatDate(getDate(d * 4))).toBe('4 days ago');
      expect(formatDate(getDate(w * 4))).not.toMatch(/ago/);
    });

    it('should format to plural and singular depending on relativeCount', () => {
      expect(formatDate(getDate(m))).toBe('a minute ago');
      expect(formatDate(getDate(m * 4))).toBe('4 minutes ago');
      expect(formatDate(getDate(h))).toBe('an hour ago');
      expect(formatDate(getDate(h * 4))).toBe('4 hours ago');
    });

    it('should format to full date if more than a week', () => {
      expect(formatDate(getDate(w * 4))).not.toMatch(/ago/);
    });
  });
});

