import { formatPrice, formatDate, formatDuration, getInitials, truncateText, slugify } from './utils';

describe('Utils', () => {
  describe('formatPrice', () => {
    it('formats price in RUB currency', () => {
      expect(formatPrice(1000)).toBe('1 000 ₽');
      expect(formatPrice(0)).toBe('0 ₽');
    });
  });

  describe('formatDate', () => {
    it('formats date in Russian locale', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toContain('15');
    });
  });

  describe('formatDuration', () => {
    it('formats duration in minutes and hours', () => {
      expect(formatDuration(120)).toBe('2 мин');
      expect(formatDuration(3600)).toContain('ч');
    });
  });

  describe('getInitials', () => {
    it('returns initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('alice')).toBe('AL');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than maxLength', () => {
      expect(truncateText('Hello World', 5)).toBe('Hello...');
      expect(truncateText('Hi', 10)).toBe('Hi');
    });
  });

  describe('slugify', () => {
    it('converts text to slug format', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Test-Slug')).toBe('test-slug');
    });
  });
});
