# 🎨 UI КОМПОНЕНТЫ - ДОКУМЕНТАЦИЯ

## ✅ Созданные компоненты

### Базовые UI компоненты:

| Компонент | Файл | Описание |
|-----------|------|----------|
| **Typography** | `typography.tsx` | Заголовки H1-H6, текст, цитаты |
| **Skeleton** | `skeleton.tsx` | Заглушки загрузки |
| **VideoPlayer** | `video-player.tsx` | Кастомный видеоплеер |
| **EmptyState** | `empty-state.tsx` | Состояния "нет данных" |
| **TestimonialCard** | `testimonial-card.tsx` | Карточка отзыва |
| **Avatar** | `avatar.tsx` | Аватар пользователя |

---

## 📊 Примеры использования

### Typography

```typescript
import {H1, H2, H3, Paragraph, Blockquote, Highlight, Small} from "@/components/ui/typography";

// Заголовки
<H1>Главный заголовок</H1>
<H2>Заголовок раздела</H2>
<H3>Подзаголовок</H3>

// Текст
<Paragraph>Обычный текст</Paragraph>
<Paragraph muted>Приглушенный текст</Paragraph>

// Цитата
<Blockquote cite="Автор">
  Текст цитаты
</Blockquote>

// Выделение
<Highlight>Важный текст</Highlight>

// Маленький текст
<Small>Подпись или примечание</Small>
```

### Skeleton

```typescript
import {Skeleton, CardSkeleton, ListSkeleton, TableSkeleton} from "@/components/ui/skeleton";

// Одиночный скелетон
<Skeleton variant="text" width="60%" height={20} />
<Skeleton variant="circular" width={48} height={48} />
<Skeleton variant="rounded" height={200} />

// Карточка с загрузкой
<CardSkeleton />

// Список с загрузкой
<ListSkeleton count={5} />

// Таблица с загрузкой
<TableSkeleton rows={10} />
```

### VideoPlayer

```typescript
import {VideoPlayer, LazyVideoEmbed} from "@/components/ui/video-player";

// Кастомный плеер
<VideoPlayer
    src="/video.mp4"
    poster="/poster.jpg"
    title="Название видео"
    autoPlay={false}
    controls={true}
/>

// YouTube/Vimeo с ленивой загрузкой
<LazyVideoEmbed
    videoUrl="https://youtube.com/watch?v=..."
    poster="/thumbnail.jpg"
    title="Название"
/>
```

### EmptyState

```typescript
import {EmptyState, EmptyList, EmptySearch, NotFound} from "@/components/ui/empty-state";

// Пустой список
<EmptyList
    title="Список пуст"
    description="Здесь пока ничего нет"
    actionText="Добавить элемент"
    onAction={() => addItem()}
/>

// Нет результатов поиска
<EmptySearch query="поисковый запрос" />

// 404
<NotFound title="Страница не найдена" />

// Кастомный
<EmptyState
    icon="help"
    title="Нужна помощь?"
    description="Свяжитесь с поддержкой"
    action={<Button>Написать</Button>}
/>
```

### TestimonialCard

```typescript
import {TestimonialCard, CompactTestimonial, FeaturedTestimonial} from "@/components/ui/testimonial-card";

// Обычная карточка
<TestimonialCard testimonial={testimonial} />

// Компактная для списка
<CompactTestimonial testimonial={testimonial} />

// Выделенная (featured)
<FeaturedTestimonial
    testimonial={testimonial}
    className="border-primary"
/>
```

### Avatar

```typescript
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";

// С изображением
<Avatar>
    <AvatarImage src="/user.jpg" alt="Имя" />
    <AvatarFallback>ИИ</AvatarFallback>
</Avatar>

// Без изображения (fallback)
<Avatar>
    <AvatarFallback className="bg-primary/10 text-primary">
        {getInitials("Иван Иванов")}
    </AvatarFallback>
</Avatar>
```

---

## 🎯 Примененные лучшие практики

### 1. **bundle-dynamic-imports** - next/dynamic для тяжелых

```typescript
// Для тяжелых компонентов (видео, карусели)
import dynamic from "next/dynamic";

const VideoPlayer = dynamic(
    () => import("@/components/ui/video-player").then(mod => mod.VideoPlayer),
    {
        loading: () => <Skeleton variant="rectangular" height={300} />,
        ssr: false, // Отключаем SSR для видео
    }
);
```

### 2. **rerender-memo** - memo для предотвращения лишних ререндеров

```typescript
export const TestimonialCard = memo(function TestimonialCard({
    testimonial,
    className,
    variant,
}: TestimonialCardProps) {
    // Компонент не будет перерисовываться при изменении parent props
    return <Card>...</Card>;
});
```

### 3. **rendering-hoist-jsx** - Вынос статического JSX

```typescript
// ✅ Хорошо: Статические стили вынесены
const BASE_STYLES = "text-foreground antialiased";

const HEADING_STYLES = {
    h1: "text-4xl md:text-5xl font-bold",
    h2: "text-3xl md:text-4xl font-bold",
    // ...
} as const;

// ❌ Плохо: Создание объектов в компоненте
function Typography({as}) {
    const styles = { // Создается каждый ререндер!
        h1: "text-4xl...",
        h2: "text-3xl...",
    };
}
```

### 4. **js-early-exit** - Ранние возвраты

```typescript
// ✅ Хорошо
export function EmptyState({icon = "inbox", ...}) {
    if (!title) return null;

    const iconNode = typeof icon === "string" ? ICONS[icon] : icon;
    return <div>...</div>;
}

// ❌ Плохо: Глубокая вложенность
export function EmptyState({icon = "inbox", ...}) {
    if (title) {
        if (typeof icon === "string") {
            const iconNode = ICONS[icon];
            return <div>...</div>;
        } else {
            return <div>...</div>;
        }
    }
}
```

### 5. **rerender-use-ref-transient-values** - useRef для частых обновлений

```typescript
// ✅ Хорошо: useRef для video элемента
const videoRef = useRef<HTMLVideoElement>(null);

const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.play();
};

// ❌ Плохо: state для DOM элемента
const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
```

---

## 🎨 Стилизация

### CSS переменные (Tailwind)

```css
/* globals.css */
:root {
    --foreground: 0 0% 3.9%;
    --background: 0 0% 100%;
    --primary: 142 76% 36%;
    --muted: 0 0% 45.1%;
    --success: 142 76% 36%;
}

.dark {
    --foreground: 0 0% 98%;
    --background: 0 0% 3.9%;
    --primary: 142 76% 46%;
}
```

### Адаптивность

```typescript
// Мобильные классы
className="text-base md:text-lg lg:text-xl"

// Отступы
className="p-4 md:p-6 lg:p-8"

// Сетки
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
```

---

## 📈 Производительность

### Оптимизация ререндеров

```typescript
// memo для предотвращения лишних ререндеров
export const TestimonialCard = memo(TestimonialCardImpl);

// useCallback для callback props
const handlePlay = useCallback(() => {
    videoRef.current?.play();
}, []);

// useMemo для дорогих вычислений
const formattedDuration = useMemo(() => {
    return formatTime(duration);
}, [duration]);
```

### Ленивая загрузка

```typescript
// next/dynamic для тяжелых компонентов
const LazyVideoEmbed = dynamic(
    () => import("@/components/ui/video-player").then(mod => mod.LazyVideoEmbed),
    {
        loading: () => <Skeleton variant="rectangular" height={300} />,
        ssr: false,
    }
);
```

---

## 🧪 Тестирование

### Пример теста

```typescript
import {render, screen} from "@testing-library/react";
import {H1, H2, Paragraph} from "@/components/ui/typography";

describe("Typography", () => {
    it("рендерит H1 заголовок", () => {
        render(<H1>Тест</H1>);
        expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("Тест");
    });

    it("рендерит Paragraph с muted", () => {
        render(<Paragraph muted>Текст</Paragraph>);
        expect(screen.getByText("Текст")).toHaveClass("text-muted");
    });
});
```

---

## 📚 API Reference

Полный список компонентов см. в файлах:
- [`components/ui/typography.tsx`](../components/ui/typography.tsx)
- [`components/ui/skeleton.tsx`](../components/ui/skeleton.tsx)
- [`components/ui/video-player.tsx`](../components/ui/video-player.tsx)
- [`components/ui/empty-state.tsx`](../components/ui/empty-state.tsx)
- [`components/ui/testimonial-card.tsx`](../components/ui/testimonial-card.tsx)
- [`components/ui/avatar.tsx`](../components/ui/avatar.tsx)

---

**Все UI компоненты готовы к использованию! 🎉**
