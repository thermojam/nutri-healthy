# Legal Compliance & Roskomnadzor Ready

Это исследование направлено на итеративное создание полного набора юридических документов и требований UI для **nutri-healthy.vercel** для соответствия законодательству Российской Федерации (152-ФЗ, 54-ФЗ, Закон о рекламе) и подготовки к регистрации в Роскомнадзор.

## Setup

Для начала нового цикла исследований:

1. **Выберите идентификатор цикла**: тег на основе сегодняшней даты (например `may10-legal`). Ветка `research/<tag>` должна быть новой.
2. **Создайте ветку**: `git checkout -b research/<tag>` из текущей feature.
3. **Прочитайте критические файлы для контекста**:
   - `README.md` — описание проекта
   - `package.json` — зависимости и scripts
   - `.env.example` — переменные окружения
   - Существующие страницы сайта (структура в `/public`)
4. **Инициализируйте results.tsv**: создайте `research/results.tsv` с заголовком для юридического цикла.
5. **Подтвердите**: убедитесь, что setup готов к работе.

## Что такое Legal Compliance Score?

Legal Compliance оценивает готовность приложения к работе в России по следующим критериям:

- **Privacy & Data Protection (152-ФЗ)** (0-100): наличие Политики конфиденциальности, согласий на обработку, уведомлений
- **User Agreement & Disclaimers** (0-100): Пользовательское соглашение, отказ от медицинской ответственности, условия сервиса
- **Payment & Tax Compliance (54-ФЗ)** (0-100): электронные квитанции, соответствие Закону о ККТ
- **Advertising & Marketing Compliance** (0-100): согласие на маркетинг, соответствие Закону о рекламе
- **Roskomnadzor Readiness** (0-100): уведомление об обработке персональных данных, регистрация

**Итоговая Legal Compliance метрика**: взвешенное среднее всех оценок.

```
Legal-Compliance = 
  0.30 * Privacy-Protection +
  0.25 * User-Agreement +
  0.20 * Payment-Tax +
  0.15 * Advertising +
  0.10 * RKN-Readiness
```

## Экспериментальный цикл (10 итераций)

Каждая итерация генерирует юридический документ или обновление UI.

**Что вы можете делать:**
- Генерировать Политику конфиденциальности (152-ФЗ)
- Создавать Пользовательские соглашения и Offert
- Писать Дисклеймеры и условия сервиса
- Генерировать Согласия на обработку ПД и маркетинг
- Подготавливать уведомления для Роскомнадзора
- Добавлять UI элементы (Cookie Banner, чекбоксы, линки на документы)
- Интегрировать сторонние сервисы (YooKassa, PayKeeper)
- Создавать протоколы удаления данных

**Что вы НЕ можете делать:**
- Менять основную бизнес-логику приложения
- Давать юридические консультации (только стандартные шаблоны)
- Обрабатывать реальные персональные данные
- Менять коммерческие условия без согласования

**Цель**: создать полный набор документов и UI, готовых к Roskomnadzor, и достичь Legal-Compliance Score 90+.

**Ограничения**:
- Каждая итерация должна занимать ~15-20 минут
- Все документы должны соответствовать актуальному российскому законодательству (май 2026)
- Все изменения UI должны быть проверяемы в браузере

## Output формат

После завершения каждой итерации скрипт выводит:

```
---
legal_compliance_score: 45.0
privacy_protection_score: 50.0
user_agreement_score: 40.0
payment_tax_score: 30.0
advertising_score: 50.0
rkn_readiness_score: 0.0
documents_created: 2
ui_changes: 3
status: in_progress
iteration: 1/10
```

Основная метрика: `legal_compliance_score` (0-100).

## Логирование результатов

Когда итерация завершена, логируйте результаты в `research/results.tsv` (tab-separated).

TSV имеет заголовок и 6 колонок:

```
iteration	legal_compliance_score	documents_created	ui_changes	status	description
```

1. номер итерации (1-10)
2. legal_compliance_score (0-100, e.g. 45.0)
3. количество созданных документов
4. количество UI изменений
5. status: `keep`, `discard`, или `error`
6. короткое описание итерации

Пример:

```
iteration	legal_compliance_score	documents_created	ui_changes	status	description
1	45.0	1	0	keep	Content audit & Privacy Policy draft
2	52.5	1	0	keep	User Agreement & Disclaimer
3	60.0	2	1	keep	Personal Data Processing Consent + UI checkbox
4	65.0	1	1	keep	Marketing Consent + email subscription
5	70.0	2	2	keep	Cookie Policy + Cookie Banner UI
6	75.0	1	1	keep	Payment & Tax Compliance (54-ФЗ)
7	80.0	2	1	keep	RKN Notification Preparation
8	82.5	1	2	keep	Data Rights & Deletion Protocol
9	87.5	2	2	keep	Final Document Assembly & PDF Export
10	92.5	2	3	keep	Deployment Checklist & Footer Links
```

## Экспериментальный цикл (10 итераций)

### Iteration 1: Content & Risk Audit
- Проанализировать nutri-healthy.vercel на точки сбора данных (формы, cookies, платежи)
- Определить тип деятельности эксперта (образовательная vs медицинская)
- Создать файл `legal/01_audit.md` с выводами

### Iteration 2: Privacy Policy (152-ФЗ)
- Драфт Политики конфиденциальности с указанием российских серверов
- Указать категории данных (имя, email, метрики здоровья)
- Создать файл `legal/02_privacy_policy.html`

### Iteration 3: User Agreement (Offer)
- Создать публичную оферту для информационных услуг
- Включить "Дисклеймер": услуги информационные, не медицинские советы
- Создать файл `legal/03_user_agreement.html`

### Iteration 4: Consent for Personal Data Processing
- Генерировать текст для "Чекбокса" под каждой формой на сайте
- Минимальный текст, удовлетворяющий 152-ФЗ
- Создать файл `legal/04_consent_pd.txt` и обновить UI

### Iteration 5: Advertising Consent
- Драфт отдельного согласия на маркетинговые коммуникации (email/SMS/WhatsApp)
- Избежать штрафов от ФАС (Antimonopoly Service)
- Создать файл `legal/05_advertising_consent.txt` и обновить UI

### Iteration 6: RKN Notification Preparation
- Подготовить драфт "Уведомления об обработке персональных данных" для Роскомнадзора
- Включить детали юридического лица/ИП (templates)
- Создать файл `legal/06_rkn_notification.md`

### Iteration 7: Payment & Tax Compliance (54-ФЗ)
- Добавить текст об электронных квитанциях
- Интеграция с YooKassa/PayKeeper (requirements)
- Создать файл `legal/07_payment_terms.html`

### Iteration 8: Cookie Policy & Notification
- Драфт Cookie Policy для русского интернета
- Создать Cookie Banner UI (требует явного согласия)
- Создать файл `legal/08_cookie_policy.html` и обновить UI

### Iteration 9: Data Destruction & Rights
- Создать протокол удаления данных пользователя по запросу
- Включить процедуру деанонимизации (mandatory для RKN)
- Создать файл `legal/09_data_rights.md`

### Iteration 10: Final Assembly & Deployment Plan
- Консолидировать все документы в `/legal` directory
- Создать чек-лист UI изменений для footer и forms
- Создать файл `legal/10_deployment_checklist.md`
- Обновить footer сайта с ссылками на все документы

## Автономный цикл (LOOP FOREVER)

LOOP FOREVER:

1. Смотрите git state: текущую ветку и коммит
2. Выполните следующую итерацию (1-10) в списке выше
3. git commit с понятным сообщением (`legal: iteration N - <description>`)
4. Запустите проверку: `npm run build` (если есть)
5. Запустите скрипт оценки: `node research/legal_score.js` (выведет метрики)
6. Если возникли ошибки, посмотрите logs и попробуйте исправить
7. Запишите результаты в results.tsv (НЕ коммитьте этот файл)
8. Если legal_compliance_score улучшилась, оставляйте коммит
9. Если score не изменилась или ухудшилась, выполните `git reset` к начальной точке

**Идея**: вы создаете юридическую основу для приложения итеративно. Каждая итерация добавляет слой соответствия.

**Timeout**: каждая итерация должна занимать ~15-20 минут. Если превышает 25 минут, остановитесь и откатитесь.

**НИКОГДА НЕ ОСТАНАВЛИВАЙТЕСЬ**: после начала цикла НЕ СПРАШИВАЙТЕ человека, продолжать ли. Цикл продолжается, пока человек вас не остановит (например, через `/stop` команду).