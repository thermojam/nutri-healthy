interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class Cache<T> {
  private store = new Map<string, CacheEntry<T>>();

  set(key: string, value: T, ttlMs: number = 3600000): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.store.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  size(): number {
    return this.store.size;
  }
}

// Memoization decorator
export function memoize<T extends any[], R>(
  fn: (...args: T) => R,
  ttlMs: number = 3600000,
): (...args: T) => R {
  const cache = new Cache<R>();

  return (...args: T): R => {
    const key = JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result, ttlMs);
    return result;
  };
}

// Async memoization
export function memoizeAsync<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  ttlMs: number = 3600000,
): (...args: T) => Promise<R> {
  const cache = new Cache<R>();

  return async (...args: T): Promise<R> => {
    const key = JSON.stringify(args);

    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    const result = await fn(...args);
    cache.set(key, result, ttlMs);
    return result;
  };
}
