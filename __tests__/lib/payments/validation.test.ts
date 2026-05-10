/**
 * Тесты для валидации платежных данных
 */

import {
  validatePaymentData,
  validateRefundData,
  sanitizePaymentData,
} from "@/lib/payments/validation";
import { PaymentData, RefundData } from "@/lib/payments/providers/abstract-payment-provider";

describe("Payment Validation", () => {
  describe("validatePaymentData", () => {
    it("should accept valid payment data", () => {
      const data: PaymentData = {
        orderId: "550e8400-e29b-41d4-a716-446655440000",
        amount: 100.5,
        currency: "RUB",
        description: "Test payment",
      };
      const errors = validatePaymentData(data);
      expect(errors).toHaveLength(0);
    });

    it("should reject invalid orderId", () => {
      const data: PaymentData = {
        orderId: "",
        amount: 100,
        currency: "RUB",
        description: "Test",
      };
      const errors = validatePaymentData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "orderId" })
      );
    });

    it("should reject invalid amount", () => {
      const data: PaymentData = {
        orderId: "12345",
        amount: -100,
        currency: "RUB",
        description: "Test",
      };
      const errors = validatePaymentData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "amount" })
      );
    });

    it("should reject non-RUB currency", () => {
      const data: PaymentData = {
        orderId: "12345",
        amount: 100,
        currency: "USD" as any,
        description: "Test",
      };
      const errors = validatePaymentData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "currency" })
      );
    });

    it("should reject HTML in description", () => {
      const data: PaymentData = {
        orderId: "12345",
        amount: 100,
        currency: "RUB",
        description: "<script>alert('xss')</script>",
      };
      const errors = validatePaymentData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "description" })
      );
    });

    it("should validate email format", () => {
      const data: PaymentData = {
        orderId: "12345",
        amount: 100,
        currency: "RUB",
        description: "Test",
        email: "invalid-email",
      };
      const errors = validatePaymentData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "email" })
      );
    });

    it("should validate phone format", () => {
      const data: PaymentData = {
        orderId: "12345",
        amount: 100,
        currency: "RUB",
        description: "Test",
        phone: "abc",
      };
      const errors = validatePaymentData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "phone" })
      );
    });
  });

  describe("validateRefundData", () => {
    it("should accept valid refund data", () => {
      const data: RefundData = {
        paymentId: "payment-123",
        amount: 100,
        description: "User requested refund",
      };
      const errors = validateRefundData(data);
      expect(errors).toHaveLength(0);
    });

    it("should reject missing paymentId", () => {
      const data: RefundData = {
        paymentId: "",
        amount: 100,
        description: "Test",
      };
      const errors = validateRefundData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "paymentId" })
      );
    });

    it("should reject invalid refund amount", () => {
      const data: RefundData = {
        paymentId: "payment-123",
        amount: 0,
        description: "Test",
      };
      const errors = validateRefundData(data);
      expect(errors).toContainEqual(
        expect.objectContaining({ field: "amount" })
      );
    });
  });

  describe("sanitizePaymentData", () => {
    it("should sanitize payment data", () => {
      const data: PaymentData = {
        orderId: " uuid-123 ",
        amount: 100.999,
        currency: "RUB",
        description: "  Test payment  ",
        email: "TEST@EXAMPLE.COM",
      };
      const sanitized = sanitizePaymentData(data);

      expect(sanitized.orderId).toBe("uuid-123");
      expect(sanitized.amount).toBe(101.0);
      expect(sanitized.description).toBe("Test payment");
      expect(sanitized.email).toBe("test@example.com");
    });

    it("should round amount to 2 decimal places", () => {
      const data: PaymentData = {
        orderId: "123",
        amount: 99.999,
        currency: "RUB",
        description: "Test",
      };
      const sanitized = sanitizePaymentData(data);
      expect(sanitized.amount).toBe(100.0);
    });

    it("should trim description", () => {
      const data: PaymentData = {
        orderId: "123",
        amount: 100,
        currency: "RUB",
        description: "  " + "x".repeat(1100),
      };
      const sanitized = sanitizePaymentData(data);
      expect(sanitized.description.length).toBeLessThanOrEqual(1000);
    });
  });
});
