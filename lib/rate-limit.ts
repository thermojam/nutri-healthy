type RateLimitStore = Map<string, { count: number; resetTime: number }>;

const stores = new Map<string, RateLimitStore>();

export interface RateLimitOptions {
  interval?: number; // milliseconds, default 60000 (1 minute)
  maxRequests?: number; // default 100
}

export function createRateLimiter(key: string, options: RateLimitOptions = {}) {
  const interval = options.interval || 60000;
  const maxRequests = options.maxRequests || 100;

  if (!stores.has(key)) {
    stores.set(key, new Map());
  }

  const store = stores.get(key)!;

  return (identifier: string): { allowed: boolean; remaining: number } => {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Reset window
      store.set(identifier, {
        count: 1,
        resetTime: now + interval,
      });
      return { allowed: true, remaining: maxRequests - 1 };
    }

    if (entry.count < maxRequests) {
      entry.count++;
      return { allowed: true, remaining: maxRequests - entry.count };
    }

    return { allowed: false, remaining: 0 };
  };
}

// Common rate limiters
export const apiRateLimiter = createRateLimiter('api', {
  interval: 60000, // 1 minute
  maxRequests: 100,
});

export const authRateLimiter = createRateLimiter('auth', {
  interval: 300000, // 5 minutes
  maxRequests: 5,
});

export const formSubmitRateLimiter = createRateLimiter('form', {
  interval: 60000, // 1 minute
  maxRequests: 10,
});
