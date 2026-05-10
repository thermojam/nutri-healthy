/**
 * Тесты для retry policy
 */

import { withRetry, isRetryableError, calculateBackoffDelay } from "@/lib/payments/retry-policy";

describe("Retry Policy", () => {
  describe("isRetryableError", () => {
    it("should recognize network errors as retryable", () => {
      const error = new TypeError("fetch failed");
      expect(isRetryableError(error)).toBe(true);
    });

    it("should recognize retryable HTTP status codes", () => {
      expect(isRetryableError(null, 503)).toBe(true);
      expect(isRetryableError(null, 502)).toBe(true);
      expect(isRetryableError(null, 504)).toBe(true);
    });

    it("should not consider non-retryable HTTP status codes", () => {
      expect(isRetryableError(null, 400)).toBe(false);
      expect(isRetryableError(null, 401)).toBe(false);
      expect(isRetryableError(null, 404)).toBe(false);
    });

    it("should handle null error", () => {
      expect(isRetryableError(null)).toBe(false);
    });
  });

  describe("calculateBackoffDelay", () => {
    it("should increase delay exponentially", () => {
      const config = {
        maxAttempts: 5,
        initialDelayMs: 100,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        retryableStatusCodes: [],
      };

      const delay1 = calculateBackoffDelay(1, config);
      const delay2 = calculateBackoffDelay(2, config);

      expect(delay2).toBeGreaterThan(delay1);
    });

    it("should not exceed maxDelayMs", () => {
      const config = {
        maxAttempts: 10,
        initialDelayMs: 1000,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        retryableStatusCodes: [],
      };

      for (let i = 1; i <= 10; i++) {
        const delay = calculateBackoffDelay(i, config);
        expect(delay).toBeLessThanOrEqual(config.maxDelayMs);
      }
    });

    it("should add jitter to avoid thundering herd", () => {
      const config = {
        maxAttempts: 5,
        initialDelayMs: 100,
        maxDelayMs: 5000,
        backoffMultiplier: 2,
        retryableStatusCodes: [],
      };

      const delay1 = calculateBackoffDelay(2, config);
      const delay2 = calculateBackoffDelay(2, config);

      // Задержки не должны быть одинаковыми из-за jitter
      // (с очень высокой вероятностью)
      expect(delay1).not.toBe(delay2);
    });
  });

  describe("withRetry", () => {
    it("should succeed on first attempt", async () => {
      let attempts = 0;
      const result = await withRetry(async () => {
        attempts++;
        return "success";
      });

      expect(result).toBe("success");
      expect(attempts).toBe(1);
    });

    it("should retry on retryable error", async () => {
      let attempts = 0;
      const result = await withRetry(async () => {
        attempts++;
        if (attempts < 2) {
          const error = new TypeError("network timeout");
          throw error;
        }
        return "success";
      });

      expect(result).toBe("success");
      expect(attempts).toBe(2);
    });

    it("should fail after max attempts exceeded", async () => {
      let attempts = 0;
      await expect(
        withRetry(
          async () => {
            attempts++;
            throw new TypeError("network error");
          },
          "test_op",
          { maxAttempts: 2, initialDelayMs: 10, maxDelayMs: 100, backoffMultiplier: 2, retryableStatusCodes: [] }
        )
      ).rejects.toThrow();

      expect(attempts).toBe(2);
    });

    it("should not retry non-retryable errors", async () => {
      let attempts = 0;
      await expect(
        withRetry(async () => {
          attempts++;
          const error = new Error("Validation failed");
          (error as any).statusCode = 400;
          throw error;
        })
      ).rejects.toThrow();

      expect(attempts).toBe(1);
    });
  });
});
