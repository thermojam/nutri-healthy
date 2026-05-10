# Production-Readiness Research

Это исследование направлено на итеративное улучшение метрики "Production-readiness" приложения **nutri-healthy-v1** (Next.js health coaching платформа).

## Setup

Для начала нового цикла исследований:

1. **Выберите идентификатор цикла**: предложите тег на основе сегодняшней даты (например `may10`). Ветка `research/<tag>` должна быть новой.
2. **Создайте ветку**: `git checkout -b research/<tag>` из текущей master.
3. **Прочитайте критические файлы для контекста**:
   - `README.md` — описание проекта
   - `package.json` — зависимости и scripts
   - `doc/deployment-guide.md` — текущие требования развертывания
   - `doc/api-documentation.md` — API контракты
   - `.env.example` — переменные окружения
4. **Инициализируйте results.tsv**: создайте `research/results.tsv` с заголовком. Базовая метрика будет записана после первого запуска.
5. **Подтвердите**: убедитесь, что setup готов к работе.

## Что такое Production-Readiness?

Production-readiness оценивает готовность приложения к работе в продакшене по следующим критериям:

- **Security Score** (0-100): безопасность (API keys защита, rate limiting, CORS, injection protection)
- **Performance Score** (0-100): производительность (load time, bundle size, API response time)
- **Reliability Score** (0-100): надежность (error handling, graceful degradation, retry logic)
- **Test Coverage** (0-100): покрытие тестами (unit tests, integration tests, API tests)
- **Monitoring Score** (0-100): мониторинг и логирование (error tracking, metrics, analytics)

**Итоговая Production-readiness метрика**: взвешенное среднее всех оценок.

```
Production-readiness = 
  0.25 * Security +
  0.20 * Performance +
  0.20 * Reliability +
  0.20 * TestCoverage +
  0.15 * Monitoring
```

## Экспериментальный цикл

Каждый эксперимент направлен на улучшение одного или нескольких аспектов Production-readiness.

**Что вы можете делать:**
- Улучшать безопасность: добавлять валидацию, защиту от injection, rate limiting
- Оптимизировать производительность: уменьшать bundle size, улучшать load time, кешировать
- Повышать надежность: добавлять error handling, retry logic, graceful degradation
- Писать тесты: unit tests, integration tests, API tests
- Улучшать мониторинг: добавлять логирование, error tracking, метрики

**Что вы НЕ можете делать:**
- Менять основную бизнес-логику приложения
- Добавлять новые функциональности, которые не связаны с production-readiness
- Удалять существующие функции
- Менять database schema без тщательного планирования

**Цель**: максимально увеличить Production-readiness Score до 95+, сохраняя функциональность приложения.

**Ограничения**:
- Каждый эксперимент должен занимать ~15 минут выполнения (не включая тестирование вручную)
- Улучшения должны быть проверяемы и демонстрируемы
- Все изменения должны быть backed by тестами или автоматизированными проверками

## Output формат

После завершения эксперимента скрипт выводит:

```
---
production_readiness_score: 72.5
security_score:             65.0
performance_score:          70.0
reliability_score:          75.0
test_coverage_score:        80.0
monitoring_score:           70.0
changes_made:              5
files_modified:            8
tests_passed:              true
duration_seconds:          300
```

Основная метрика: `production_readiness_score` (0-100).

## Логирование результатов

Когда эксперимент завершен, логируйте результаты в `research/results.tsv` (tab-separated).

TSV имеет заголовок и 5 колонок:

```
commit	production_readiness_score	changes_made	status	description
```

1. git commit hash (short, 7 chars)
2. production_readiness_score (0-100, e.g. 72.5)
3. количество измененных файлов
4. status: `keep`, `discard`, или `error`
5. короткое описание эксперимента

Пример:

```
commit	production_readiness_score	changes_made	status	description
a1b2c3d	65.0	3	keep	baseline: security & error handling
b2c3d4e	68.5	5	keep	add input validation & rate limiting
c3d4e5f	71.2	8	keep	add monitoring & error tracking
d4e5f6g	72.0	6	discard	remove check - breaks API compatibility
```

## Экспериментальный цикл (LOOP FOREVER)

LOOP FOREVER:

1. Смотрите git state: текущую ветку и коммит
2. Выберите одно улучшение для Production-readiness и реализуйте его
3. git commit с понятным сообщением
4. Запустите проверки: `npm run build && npm run test` (если есть)
5. Запустите скрипт оценки: `node research/improve.py` (выведет метрики)
6. Если возникли ошибки, посмотрите logs и попробуйте исправить
7. Запишите результаты в results.tsv (НЕ коммитьте этот файл)
8. Если production_readiness_score улучшилась, "продвиньте" ветку, оставляя git commit
9. Если score не изменилась или ухудшилась, выполните `git reset` к начальной точке

**Идея**: вы автономный исследователь, пробующий различные улучшения. Если работает — берете. Если нет — откатываете.

**Timeout**: каждый эксперимент должен занимать ~15 минут. Если превышает 20 минут, остановитесь и откатитесь.

**НИКОГДА НЕ ОСТАНАВЛИВАЙТЕСЬ**: после начала цикла экспериментов НЕ СПРАШИВАЙТЕ человека, продолжать ли. Человек может спать. Вы — автономны. Если идеи заканчиваются, думайте еще. Цикл продолжается, пока человек вас не остановит.

Пример использования: человек оставляет вас работать перед сном. Если каждый эксперимент ~15 минут, вы можете сделать ~4 за час, ~30+ за ночь. Человек просыпается с улучшенным Production-readiness Score!
