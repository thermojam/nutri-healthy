import { logger } from './logger';

describe('Logger', () => {
  const originalConsole = {
    debug: console.debug,
    info: console.info,
    warn: console.warn,
    error: console.error,
  };

  beforeEach(() => {
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.debug = originalConsole.debug;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
  });

  describe('info', () => {
    it('logs info messages', () => {
      logger.info('Test message');
      expect(console.info).toHaveBeenCalled();
    });

    it('includes context in info logs', () => {
      logger.info('Test message', { userId: '123' });
      expect(console.info).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('logs warning messages', () => {
      logger.warn('Test warning');
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('logs error messages', () => {
      logger.error('Test error');
      expect(console.error).toHaveBeenCalled();
    });

    it('includes error object in logs', () => {
      const error = new Error('Test error');
      logger.error('Test error', error);
      expect(console.error).toHaveBeenCalled();
    });
  });
});
