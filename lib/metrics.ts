interface MetricData {
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  error?: string;
}

class MetricsCollector {
  private metrics: MetricData[] = [];
  private maxMetrics = 1000;

  recordRequest(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    error?: string,
  ): void {
    const metric: MetricData = {
      timestamp: new Date().toISOString(),
      endpoint,
      method,
      statusCode,
      duration,
      error,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log metrics
    console.info('Metric recorded', {
      endpoint,
      method,
      statusCode,
      duration: `${duration}ms`,
      timestamp: metric.timestamp,
    });
  }

  getMetrics(endpoint?: string): MetricData[] {
    if (!endpoint) return this.metrics;
    return this.metrics.filter((m) => m.endpoint === endpoint);
  }

  getAverageResponseTime(endpoint?: string): number {
    const relevant = endpoint
      ? this.metrics.filter((m) => m.endpoint === endpoint)
      : this.metrics;

    if (relevant.length === 0) return 0;

    const sum = relevant.reduce((acc, m) => acc + m.duration, 0);
    return sum / relevant.length;
  }

  getErrorRate(endpoint?: string): number {
    const relevant = endpoint
      ? this.metrics.filter((m) => m.endpoint === endpoint)
      : this.metrics;

    if (relevant.length === 0) return 0;

    const errors = relevant.filter((m) => m.statusCode >= 400).length;
    return (errors / relevant.length) * 100;
  }

  clear(): void {
    this.metrics = [];
  }

  getSummary(endpoint?: string) {
    const relevant = endpoint
      ? this.metrics.filter((m) => m.endpoint === endpoint)
      : this.metrics;

    return {
      totalRequests: relevant.length,
      averageResponseTime: this.getAverageResponseTime(endpoint),
      errorRate: this.getErrorRate(endpoint),
      lastUpdated: relevant[relevant.length - 1]?.timestamp,
    };
  }
}

export const metricsCollector = new MetricsCollector();
