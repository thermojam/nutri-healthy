import {
  AppError,
  ValidationError,
  NotFoundError,
  UnauthorizedError,
  RateLimitError,
  logError,
  withRetry,
} from './error-handler';

describe('Error Handling', () => {
  describe('Custom Errors', () => {
    it('creates AppError with correct properties', () => {
      const error = new AppError(400, 'Bad request', 'BAD_REQUEST');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('BAD_REQUEST');
      expect(error.message).toBe('Bad request');
    });

    it('creates ValidationError', () => {
      const error = new ValidationError('Invalid input');
      expect(error.statusCode).toBe(400);
      expect(error.code).toBe('VALIDATION_ERROR');
    });

    it('creates NotFoundError', () => {
      const error = new NotFoundError('User');
      expect(error.statusCode).toBe(404);
      expect(error.message).toContain('User');
    });

    it('creates UnauthorizedError', () => {
      const error = new UnauthorizedError();
      expect(error.statusCode).toBe(401);
    });

    it('creates RateLimitError with retryAfter', () => {
      const error = new RateLimitError(60);
      expect(error.statusCode).toBe(429);
      expect(error.retryAfter).toBe(60);
    });
  });

  describe('logError', () => {
    it('logs AppError', () => {
      const error = new AppError(500, 'Server error');
      const logged = logError(error);
      expect(logged).toBe(error);
    });

    it('converts unknown errors to AppError', () => {
      const error = logError(new Error('Unknown error'));
      expect(error instanceof AppError).toBe(true);
      expect(error.statusCode).toBe(500);
    });
  });

  describe('withRetry', () => {
    it('executes operation successfully on first try', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await withRetry(operation);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('retries on failure', async () => {
      const operation = jest.fn()
        .mockRejectedValueOnce(new Error('Try 1'))
        .mockResolvedValueOnce('success');
      const result = await withRetry(operation, 3, 10);
      expect(result).toBe('success');
      expect(operation).toHaveBeenCalledTimes(2);
    });

    it('fails after max attempts', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      await expect(withRetry(operation, 2, 10)).rejects.toThrow('Failed');
      expect(operation).toHaveBeenCalledTimes(2);
    });
  });
});
