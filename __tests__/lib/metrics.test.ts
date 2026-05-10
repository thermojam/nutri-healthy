import { metricsCollector } from '@/lib/metrics';

describe('Metrics Collector', () => {
  beforeEach(() => {
    metricsCollector.clear();
  });

  describe('recordRequest', () => {
    it('records request metrics', () => {
      metricsCollector.recordRequest('/api/test', 'GET', 200, 50);
      const metrics = metricsCollector.getMetrics();
      expect(metrics).toHaveLength(1);
      expect(metrics[0].endpoint).toBe('/api/test');
      expect(metrics[0].statusCode).toBe(200);
    });

    it('records error metrics', () => {
      metricsCollector.recordRequest('/api/test', 'POST', 500, 150, 'Database error');
      const metrics = metricsCollector.getMetrics();
      expect(metrics[0].error).toBe('Database error');
      expect(metrics[0].statusCode).toBe(500);
    });
  });

  describe('getMetrics', () => {
    it('returns all metrics', () => {
      metricsCollector.recordRequest('/api/test1', 'GET', 200, 50);
      metricsCollector.recordRequest('/api/test2', 'GET', 200, 60);
      expect(metricsCollector.getMetrics()).toHaveLength(2);
    });

    it('filters metrics by endpoint', () => {
      metricsCollector.recordRequest('/api/test1', 'GET', 200, 50);
      metricsCollector.recordRequest('/api/test2', 'GET', 200, 60);
      const test1Metrics = metricsCollector.getMetrics('/api/test1');
      expect(test1Metrics).toHaveLength(1);
      expect(test1Metrics[0].endpoint).toBe('/api/test1');
    });
  });

  describe('getAverageResponseTime', () => {
    it('calculates average response time', () => {
      metricsCollector.recordRequest('/api/test', 'GET', 200, 100);
      metricsCollector.recordRequest('/api/test', 'GET', 200, 200);
      expect(metricsCollector.getAverageResponseTime('/api/test')).toBe(150);
    });

    it('returns 0 for no metrics', () => {
      expect(metricsCollector.getAverageResponseTime()).toBe(0);
    });
  });

  describe('getErrorRate', () => {
    it('calculates error rate', () => {
      metricsCollector.recordRequest('/api/test', 'GET', 200, 50);
      metricsCollector.recordRequest('/api/test', 'GET', 500, 150);
      expect(metricsCollector.getErrorRate('/api/test')).toBe(50);
    });

    it('returns 0 for no errors', () => {
      metricsCollector.recordRequest('/api/test', 'GET', 200, 50);
      metricsCollector.recordRequest('/api/test', 'GET', 200, 60);
      expect(metricsCollector.getErrorRate('/api/test')).toBe(0);
    });
  });

  describe('getSummary', () => {
    it('returns metrics summary', () => {
      metricsCollector.recordRequest('/api/test', 'GET', 200, 100);
      metricsCollector.recordRequest('/api/test', 'GET', 500, 200);
      const summary = metricsCollector.getSummary('/api/test');
      expect(summary.totalRequests).toBe(2);
      expect(summary.averageResponseTime).toBe(150);
      expect(summary.errorRate).toBe(50);
    });
  });

  describe('clear', () => {
    it('clears all metrics', () => {
      metricsCollector.recordRequest('/api/test', 'GET', 200, 50);
      metricsCollector.clear();
      expect(metricsCollector.getMetrics()).toHaveLength(0);
    });
  });
});
