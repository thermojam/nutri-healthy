# Production-Readiness Research

Эта папка содержит адаптированную версию autoresearch фреймворка для итеративного улучшения метрики **Production-readiness** приложения nutri-healthy-v1.

## Файлы

- **program.md** — полная документация о структуре, целях и циклах экспериментов
- **improve.py** — скрипт для оценки Production-readiness Score приложения
- **results.tsv** — логирование всех экспериментов и результатов (не коммитится в git)

## Быстрый старт

### 1. Создайте новую ветку для исследования

```bash
git checkout -b research/may10
```

### 2. Запустите начальную оценку

```bash
python3 research/improve.py
```

Вы получите базовую метрику Production-readiness Score и подробные оценки по категориям.

### 3. Выберите область для улучшения

Смотрите `program.md` для полного списка возможных улучшений:

- **Security** (текущая: 80.0) — добавить валидацию, rate limiting, защиту от injection
- **Performance** (текущая: 70.0) — оптимизировать bundle size, load time
- **Reliability** (текущая: 78.0) — улучшить error handling, graceful degradation
- **Test Coverage** (текущая: 62.6) — написать unit/integration тесты
- **Monitoring** (текущая: 60.0) — добавить логирование, error tracking, метрики

### 4. Реализуйте улучшение

Измените код в основном приложении (app/, lib/, components/).

```bash
# Например: добавьте валидацию в API route
# или напишите тесты
# или добавьте логирование
```

### 5. Оцените результат

```bash
npm run build  # убедитесь, что приложение собирается
python3 research/improve.py
```

### 6. Логируйте результат

Добавьте строку в `results.tsv`:

```
a1b2c3d	73.5	5	keep	added input validation to API routes
```

### 7. Сделайте коммит

```bash
git add -A
git commit -m "add input validation to payment API"
```

### 8. Повторяйте!

Продолжайте цикл: выбирайте улучшение → кодируйте → проверяете → логируете → коммитите.

## Что можно улучшать

### Security (25% веса)
- [ ] Добавить rate limiting на API endpoints
- [ ] Добавить CORS protection
- [ ] Валидация всех user inputs
- [ ] Защита от SQL injection, XSS, CSRF
- [ ] Шифрование sensitive данных

### Performance (20% веса)
- [ ] Оптимизировать bundle size
- [ ] Добавить code splitting
- [ ] Кешировать статические assets
- [ ] Оптимизировать database queries
- [ ] Добавить CDN для статики

### Reliability (20% веса)
- [ ] Улучшить error handling
- [ ] Добавить graceful degradation
- [ ] Retry logic для external APIs
- [ ] Fallback страницы (404, 500)
- [ ] Health checks endpoints

### Test Coverage (20% веса)
- [ ] Unit tests для utils и helpers
- [ ] Integration tests для API routes
- [ ] E2E tests для critical flows
- [ ] Component tests (React Testing Library)
- [ ] API contract tests

### Monitoring (15% веса)
- [ ] Логирование errors и warnings
- [ ] Metrics for key operations
- [ ] Error tracking (Sentry, etc.)
- [ ] Analytics events
- [ ] Performance monitoring

## Нормы Production-readiness

- **< 50**: Не готово к продакшену, критические проблемы с безопасностью или надежностью
- **50-70**: Базовые стандарты есть, нужны улучшения в тестировании и мониторинге
- **70-85**: Хорошо подготовлено, остаются области для оптимизации
- **85-95**: Готово к продакшену с хорошими защитами и мониторингом
- **95+**: Enterprise-ready, все аспекты на высоком уровне

## Примеры улучшений

### Пример 1: Добавить input validation (Security +5-10)

```typescript
// app/api/payment/route.ts
export async function POST(req: Request) {
  const body = await req.json();
  
  // Валидация
  if (!body.amount || !Number.isFinite(body.amount)) {
    return Response.json({ error: 'Invalid amount' }, { status: 400 });
  }
  if (body.amount <= 0 || body.amount > 10000) {
    return Response.json({ error: 'Amount out of range' }, { status: 400 });
  }
  
  // ... rest of the logic
}
```

### Пример 2: Добавить error boundary (Reliability +5-10)

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <button
          onClick={() => reset()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

### Пример 3: Написать тесты (Test Coverage +10-20)

```typescript
// lib/__tests__/utils.test.ts
import { calculateNutrients } from '../nutrition';

describe('calculateNutrients', () => {
  it('should calculate macros correctly', () => {
    const result = calculateNutrients({ protein: 25, carbs: 100, fat: 20 });
    expect(result.calories).toBe(605); // 25*4 + 100*4 + 20*9
  });

  it('should handle edge cases', () => {
    const result = calculateNutrients({ protein: 0, carbs: 0, fat: 0 });
    expect(result.calories).toBe(0);
  });
});
```

## Git worflow

```bash
# 1. Создайте ветку исследования
git checkout -b research/may10

# 2. Работайте итеративно
# - Выбирайте улучшение
# - Кодируйте
# - Проверяйте: python3 research/improve.py
# - Логируйте результат в results.tsv
# - git commit

# 3. Когда закончите серию улучшений
git log --oneline -n 10  # Смотрите коммиты

# 4. Создайте pull request
# или мержите в main, когда готово
```

## Notes

- **results.tsv не коммитится** — это логирование экспериментов, файл игнорируется git
- **improve.py запускается за 1-2 секунды** — быстрая обратная связь
- **Цель: 95+ Production-readiness Score**
- Каждое улучшение должно быть проверяемо и обоснованно

## Ссылки

- `program.md` — полная документация и инструкции
- `improve.py` — исходный код оценочного скрипта
- Основной проект: `../README.md`, `../CLAUDE.md`
