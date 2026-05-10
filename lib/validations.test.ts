import { contactFormSchema, orderFormSchema, withdrawConsentSchema, subscribeSchema, feedbackSchema } from './validations';

describe('Validations', () => {
  describe('contactFormSchema', () => {
    it('validates valid contact form', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        personalDataConsent: true,
        contractAcceptance: true,
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects missing required fields', () => {
      const data = { firstName: 'John' };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it('rejects invalid email', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        personalDataConsent: true,
        contractAcceptance: true,
      };
      const result = contactFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('orderFormSchema', () => {
    it('validates valid order form', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        serviceId: 'service-1',
        tariff: 'base',
        personalDataConsent: true,
        contractAcceptance: true,
      };
      const result = orderFormSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects invalid tariff', () => {
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        serviceId: 'service-1',
        tariff: 'invalid',
        personalDataConsent: true,
        contractAcceptance: true,
      };
      const result = orderFormSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('withdrawConsentSchema', () => {
    it('validates valid withdrawal request', () => {
      const data = {
        consentType: 'personal_data',
        email: 'user@example.com',
      };
      const result = withdrawConsentSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe('subscribeSchema', () => {
    it('validates valid subscription', () => {
      const data = {
        email: 'user@example.com',
        marketingConsent: true,
        marketingChannels: ['email'],
      };
      const result = subscribeSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects empty marketing channels', () => {
      const data = {
        email: 'user@example.com',
        marketingConsent: true,
        marketingChannels: [],
      };
      const result = subscribeSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe('feedbackSchema', () => {
    it('validates valid feedback', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a feedback message with at least 10 chars',
        personalDataConsent: true,
      };
      const result = feedbackSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it('rejects message shorter than 10 chars', () => {
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        message: 'short',
        personalDataConsent: true,
      };
      const result = feedbackSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });
});
