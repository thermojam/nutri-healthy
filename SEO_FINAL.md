# 🔍 SEO И АНАЛИТИКА - ИТОГОВАЯ ВЕРСИЯ

## ✅ Реализованный функционал

### 1. Sitemap.xml (динамический)

**Файл:** `app/sitemap.ts`

**Что включает:**
- ✅ Статические страницы (главная, услуги, материалы, legal)
- ✅ Динамические страницы (услуги, статьи, видео, вебинары, кейсы)
- ✅ Приоритеты для разных типов страниц
- ✅ Частоту обновления
- ✅ Дату последнего изменения

**URL:** http://localhost:3000/sitemap.xml

---

### 2. Robots.txt

**Файл:** `app/robots.ts`

**Правила:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard/

User-agent: Yandex
Crawl-delay: 1

Sitemap: http://localhost:3000/sitemap.xml
```

---

### 3. Мета-теги

**Файл:** `app/layout.tsx`

**Основные:**
- Title с шаблоном для страниц
- Description
- Keywords
- Open Graph (для соцсетей)
- Twitter Card
- Robots

---

### 4. Аналитика (Яндекс Метрика)

**Файл:** `components/analytics.tsx`

**Подключение:**
```bash
NEXT_PUBLIC_YANDEX_METRICA_ID=XXXXXXXXXX
```

**Функции:**
- Автоматическая инициализация
- Отправка pageview при навигации
- Трекинг событий: `trackEvent('goal_name', params)`

**Примечание:** Google Analytics удален (не работает в РФ)

---

### 5. Schema.org разметка

**Файл:** `lib/schema.tsx`

**Типы:**
- Organization
- Person (нутрициолог)
- Service (услуга)
- Article (статья)

---

## ⚙️ Настройка для production

### 1. Обновить .env.local

```bash
NEXT_PUBLIC_URL=https://yoursite.ru
NEXT_PUBLIC_YANDEX_METRICA_ID=XXXXXXXXXX
```

### 2. Yandex Webmaster

1. https://webmaster.yandex.ru
2. Добавить сайт
3. Подтвердить права
4. Загрузить sitemap.xml

### 3. Настроить Яндекс Метрику

1. https://metrika.yandex.ru
2. Создать счетчик
3. Получить ID
4. Добавить в .env.local
5. Настроить цели

---

## ✅ Чеклист

- [x] Sitemap.xml создан
- [x] Robots.txt создан
- [x] Мета-теги настроены
- [x] Open Graph настроен
- [x] Яндекс Метрика подключена
- [x] Schema.org разметка добавлена

**Осталось:**
- [ ] Добавить реальный ID метрики
- [ ] Зарегистрировать в Yandex Webmaster
- [ ] Настроить цели в метрике

---

**SEO и аналитика полностью готовы! 🎉**
