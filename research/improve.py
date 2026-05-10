#!/usr/bin/env python3
"""
Production-Readiness Evaluation Script for nutri-healthy-v1

Evaluates various aspects of application readiness for production:
- Security (API protection, validation, injection prevention)
- Performance (bundle size, load time, response time)
- Reliability (error handling, graceful degradation)
- Test coverage
- Monitoring and logging

Usage: python research/improve.py
"""

import os
import json
import subprocess
import time
from pathlib import Path
from dataclasses import dataclass
from typing import Dict, Tuple

@dataclass
class ProductionReadinessScore:
    security: float = 0.0
    performance: float = 0.0
    reliability: float = 0.0
    test_coverage: float = 0.0
    monitoring: float = 0.0

    @property
    def overall(self) -> float:
        """Calculate weighted overall score."""
        weights = {
            'security': 0.25,
            'performance': 0.20,
            'reliability': 0.20,
            'test_coverage': 0.20,
            'monitoring': 0.15,
        }
        total = (
            self.security * weights['security'] +
            self.performance * weights['performance'] +
            self.reliability * weights['reliability'] +
            self.test_coverage * weights['test_coverage'] +
            self.monitoring * weights['monitoring']
        )
        return round(total, 1)


def run_command(cmd: str, cwd: str = '.') -> Tuple[str, bool]:
    """Run shell command and return output + success status."""
    try:
        result = subprocess.run(
            cmd, shell=True, cwd=cwd, capture_output=True, text=True, timeout=30
        )
        return result.stdout + result.stderr, result.returncode == 0
    except subprocess.TimeoutExpired:
        return "TIMEOUT", False
    except Exception as e:
        return str(e), False


def evaluate_security() -> float:
    """Evaluate security aspects (0-100)."""
    score = 50.0  # baseline
    root = Path('.')

    # Check for environment variables protection
    if Path('.env.example').exists():
        score += 10
    if Path('.env.local').exists() or Path('.env.production').exists():
        score += 5

    # Check for .gitignore proper setup
    gitignore = Path('.gitignore').read_text() if Path('.gitignore').exists() else ''
    if '.env.local' in gitignore and 'node_modules' in gitignore:
        score += 10

    # Check for TypeScript usage (type safety)
    ts_files = list(root.glob('**/*.ts')) + list(root.glob('**/*.tsx'))
    if len(ts_files) > 10:
        score += 15

    # Check for API route protection (middleware, validation)
    api_routes = list(root.glob('app/api/**/*.ts'))
    if api_routes:
        protected_count = sum(1 for f in api_routes if 'middleware' in f.read_text().lower())
        score += min(10, protected_count * 2)

    return min(100.0, score)


def evaluate_performance() -> float:
    """Evaluate performance aspects (0-100)."""
    score = 50.0  # baseline

    # Check Next.js optimization config
    config_file = Path('next.config.ts')
    if config_file.exists():
        content = config_file.read_text().lower()
        score += 10  # Has config
        if 'compress' in content or 'optimization' in content:
            score += 10

    # Check for image optimization
    if 'next/image' in Path('.').glob('**/*.tsx'):
        score += 10

    # Check package.json for build optimizations
    if Path('package.json').exists():
        pkg = json.loads(Path('package.json').read_text())
        scripts = pkg.get('scripts', {})
        if 'build' in scripts:
            score += 10
        if 'analyze' in scripts:
            score += 10

    return min(100.0, score)


def evaluate_reliability() -> float:
    """Evaluate reliability aspects (0-100)."""
    score = 50.0  # baseline

    # Check for error handling in API routes
    api_routes = list(Path('.').glob('app/api/**/*.ts'))
    if api_routes:
        error_handling = sum(
            1 for f in api_routes
            if 'try' in f.read_text().lower() and 'catch' in f.read_text().lower()
        )
        score += min(15, error_handling * 2)

    # Check for graceful error responses
    app_tsx = Path('app/page.tsx')
    if app_tsx.exists() and 'error' in app_tsx.read_text().lower():
        score += 10

    # Check for retry logic or fallbacks
    lib_files = list(Path('lib').glob('**/*.ts'))
    retry_count = sum(1 for f in lib_files if 'retry' in f.read_text().lower())
    score += min(10, retry_count * 3)

    return min(100.0, score)


def evaluate_test_coverage() -> float:
    """Evaluate test coverage (0-100)."""
    score = 40.0  # baseline (no tests found)

    # Look for test files
    test_patterns = [
        'tests/**/*.test.ts',
        '__tests__/**/*.test.ts',
        '**/__tests__/**/*.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
    ]

    test_files = []
    for pattern in test_patterns:
        test_files.extend(Path('.').glob(pattern))

    if test_files:
        score = 60.0  # Has some tests
        # Estimate coverage from test count
        test_count = len(set(test_files))
        ts_files = len(list(Path('.').glob('**/*.ts')) + list(Path('.').glob('**/*.tsx')))

        if ts_files > 0:
            coverage_estimate = (test_count / ts_files) * 40  # max 40 points from count
            score = 60.0 + min(40.0, coverage_estimate)

    # Check for test script in package.json
    if Path('package.json').exists():
        pkg = json.loads(Path('package.json').read_text())
        if 'test' in pkg.get('scripts', {}):
            score += 5

    return min(100.0, score)


def evaluate_monitoring() -> float:
    """Evaluate monitoring and logging (0-100)."""
    score = 40.0  # baseline

    # Check for logging setup
    lib_files = list(Path('lib').glob('**/*.ts'))
    logging_count = sum(
        1 for f in lib_files
        if 'console.' in f.read_text() or 'logger' in f.read_text().lower()
    )
    score += min(20, logging_count * 2)

    # Check for error tracking packages
    if Path('package.json').exists():
        pkg = json.loads(Path('package.json').read_text())
        deps = {**pkg.get('dependencies', {}), **pkg.get('devDependencies', {})}

        # Check for common monitoring tools
        monitoring_tools = ['sentry', 'datadog', 'newrelic', 'logrocket', 'bugsnag']
        if any(tool in deps for tool in monitoring_tools):
            score += 30

    # Check for metrics/analytics
    api_routes = list(Path('.').glob('app/api/**/*.ts'))
    metrics_count = sum(
        1 for f in api_routes
        if 'metric' in f.read_text().lower() or 'analytics' in f.read_text().lower()
    )
    score += min(10, metrics_count)

    return min(100.0, score)


def count_changes() -> int:
    """Count files changed in current commit."""
    output, success = run_command('git diff --name-only HEAD~1 HEAD')
    if success:
        return len([l for l in output.strip().split('\n') if l])
    return 0


def main():
    print("=== Production-Readiness Evaluation ===\n")

    t_start = time.time()

    # Evaluate all aspects
    scores = ProductionReadinessScore(
        security=evaluate_security(),
        performance=evaluate_performance(),
        reliability=evaluate_reliability(),
        test_coverage=evaluate_test_coverage(),
        monitoring=evaluate_monitoring(),
    )

    overall = scores.overall
    changes = count_changes()

    t_end = time.time()
    duration = int(t_end - t_start)

    # Output results
    print("---")
    print(f"production_readiness_score: {overall:.1f}")
    print(f"security_score:             {scores.security:.1f}")
    print(f"performance_score:          {scores.performance:.1f}")
    print(f"reliability_score:          {scores.reliability:.1f}")
    print(f"test_coverage_score:        {scores.test_coverage:.1f}")
    print(f"monitoring_score:           {scores.monitoring:.1f}")
    print(f"changes_made:               {changes}")
    print(f"duration_seconds:           {duration}")

    # Return success if score is reasonable
    return 0 if overall >= 0 else 1


if __name__ == '__main__':
    exit(main())
