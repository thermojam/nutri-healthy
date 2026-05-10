import { createRateLimiter, apiRateLimiter, authRateLimiter, formSubmitRateLimiter } from '@/lib/rate-limit';

describe('Rate Limiting', () => {
  describe('createRateLimiter', () => {
    it('creates a rate limiter with default options', () => {
      const limiter = createRateLimiter('test', {});
      const result = limiter('user1');
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });

    it('allows requests within limit', () => {
      const limiter = createRateLimiter('test2', { maxRequests: 3 });
      expect(limiter('user1').allowed).toBe(true);
      expect(limiter('user1').allowed).toBe(true);
      expect(limiter('user1').allowed).toBe(true);
    });

    it('rejects requests exceeding limit', () => {
      const limiter = createRateLimiter('test3', { maxRequests: 2 });
      limiter('user1');
      limiter('user1');
      const result = limiter('user1');
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('isolates rate limits between identifiers', () => {
      const limiter = createRateLimiter('test4', { maxRequests: 2 });
      limiter('user1');
      limiter('user1');
      const user2Result = limiter('user2');
      expect(user2Result.allowed).toBe(true);
    });
  });

  describe('Pre-configured limiters', () => {
    it('apiRateLimiter works', () => {
      const result = apiRateLimiter('test-ip');
      expect(result.allowed).toBe(true);
    });

    it('authRateLimiter works', () => {
      const result = authRateLimiter('test-user');
      expect(result.allowed).toBe(true);
    });

    it('formSubmitRateLimiter works', () => {
      const result = formSubmitRateLimiter('test-ip');
      expect(result.allowed).toBe(true);
    });
  });
});
