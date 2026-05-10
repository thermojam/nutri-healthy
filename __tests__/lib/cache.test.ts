import { Cache, memoize, memoizeAsync } from '@/lib/cache';

describe('Cache', () => {
  let cache: Cache<string>;

  beforeEach(() => {
    cache = new Cache<string>();
  });

  describe('set and get', () => {
    it('stores and retrieves values', () => {
      cache.set('key1', 'value1');
      expect(cache.get('key1')).toBe('value1');
    });

    it('returns null for non-existent keys', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('returns null for expired entries', () => {
      cache.set('key1', 'value1', 100); // 100ms TTL
      expect(cache.get('key1')).toBe('value1');

      // Wait for expiration
      return new Promise((resolve) => {
        setTimeout(() => {
          expect(cache.get('key1')).toBeNull();
          resolve(true);
        }, 150);
      });
    });
  });

  describe('has', () => {
    it('returns true for existing valid entries', () => {
      cache.set('key1', 'value1');
      expect(cache.has('key1')).toBe(true);
    });

    it('returns false for non-existent keys', () => {
      expect(cache.has('nonexistent')).toBe(false);
    });
  });

  describe('delete', () => {
    it('removes entries', () => {
      cache.set('key1', 'value1');
      cache.delete('key1');
      expect(cache.get('key1')).toBeNull();
    });
  });

  describe('clear', () => {
    it('clears all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.clear();
      expect(cache.size()).toBe(0);
    });
  });

  describe('size', () => {
    it('returns correct number of entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      expect(cache.size()).toBe(2);
    });
  });
});

describe('memoize', () => {
  it('caches function results', () => {
    const fn = jest.fn((a: number) => a * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('differentiates between different arguments', () => {
    const fn = jest.fn((a: number) => a * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(3)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('memoizeAsync', () => {
  it('caches async function results', async () => {
    const fn = jest.fn(async (a: number) => {
      return a * 2;
    });
    const memoized = memoizeAsync(fn);

    expect(await memoized(5)).toBe(10);
    expect(await memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('differentiates between different arguments', async () => {
    const fn = jest.fn(async (a: number) => a * 2);
    const memoized = memoizeAsync(fn);

    expect(await memoized(5)).toBe(10);
    expect(await memoized(3)).toBe(6);
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
