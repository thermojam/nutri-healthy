/**
 * Тесты для rate limiter
 */

import { PaymentRateLimiter, checkRateLimit } from "@/lib/payments/rate-limiter";

describe("Payment Rate Limiter", () => {
  let limiter: PaymentRateLimiter;

  beforeEach(() => {
    limiter = new PaymentRateLimiter({
      maxRequestsPerWindow: 3,
      windowSizeMs: 1000,
      perIdentifier: true,
    });
  });

  describe("checkLimit", () => {
    it("should allow requests within limit", () => {
      const result1 = limiter.checkLimit("user-1");
      expect(result1.allowed).toBe(true);
      expect(result1.remaining).toBe(2);

      const result2 = limiter.checkLimit("user-1");
      expect(result2.allowed).toBe(true);
      expect(result2.remaining).toBe(1);

      const result3 = limiter.checkLimit("user-1");
      expect(result3.allowed).toBe(true);
      expect(result3.remaining).toBe(0);
    });

    it("should block requests exceeding limit", () => {
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");

      const result = limiter.checkLimit("user-1");
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should isolate limits per identifier", () => {
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");

      const result = limiter.checkLimit("user-2");
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(2);
    });

    it("should reset after window expires", async () => {
      limiter = new PaymentRateLimiter({
        maxRequestsPerWindow: 2,
        windowSizeMs: 100,
        perIdentifier: true,
      });

      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");

      let result = limiter.checkLimit("user-1");
      expect(result.allowed).toBe(false);

      // Wait for window to expire
      await new Promise((resolve) => setTimeout(resolve, 150));

      result = limiter.checkLimit("user-1");
      expect(result.allowed).toBe(true);
    });
  });

  describe("reset", () => {
    it("should reset limit for identifier", () => {
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-1");

      let result = limiter.checkLimit("user-1");
      expect(result.allowed).toBe(false);

      limiter.reset("user-1");

      result = limiter.checkLimit("user-1");
      expect(result.allowed).toBe(true);
    });
  });

  describe("getStats", () => {
    it("should return stats", () => {
      limiter.checkLimit("user-1");
      limiter.checkLimit("user-2");
      limiter.checkLimit("user-3");

      const stats = limiter.getStats();
      expect(stats.activeIdentifiers).toBe(3);
      expect(stats.totalLimits).toBe(3);
    });
  });

  describe("cleanup", () => {
    it("should remove expired entries", async () => {
      limiter = new PaymentRateLimiter({
        maxRequestsPerWindow: 10,
        windowSizeMs: 100,
        perIdentifier: true,
      });

      limiter.checkLimit("user-1");
      let stats = limiter.getStats();
      expect(stats.activeIdentifiers).toBe(1);

      await new Promise((resolve) => setTimeout(resolve, 150));

      limiter.cleanup();
      stats = limiter.getStats();
      expect(stats.activeIdentifiers).toBe(0);
    });
  });
});
