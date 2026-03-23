# 📦 РЕПОЗИТОРИИ - ДОКУМЕНТАЦИЯ

## ✅ Созданные репозитории

### Бизнес-репозитории (новые):

| Репозиторий | Файл | Методов | Описание |
|-------------|------|---------|----------|
| **UserRepository** | `user.repository.ts` | 14 | Пользователи, согласия, аудит |
| **OrderRepository** | `order.repository.ts` | 13 | Заказы, статистика, фильтры |
| **ReceiptRepository** | `receipt.repository.ts` | 10 | Чеки (54-ФЗ), фискализация |
| **ConsentRepository** | `consent.repository.ts` | 12 | Согласия (152-ФЗ), отзыв, экспорт |

### Контентные репозитории (существующие):

| Репозиторий | Файл | Методов | Описание |
|-------------|------|---------|----------|
| ServiceRepository | `service.repository.ts` | 9 | Услуги |
| ArticleRepository | `article.repository.ts` | 9 | Статьи |
| VideoRepository | `video.repository.ts` | 11 | Видео |
| WebinarRepository | `webinar.repository.ts` | 10 | Вебинары |
| CaseRepository | `case.repository.ts` | 9 | Кейсы |
| EducationRepository | `education.repository.ts` | 9 | Образование |
| TestimonialRepository | `testimonial.repository.ts` | 9 | Отзывы |

---

## 🎯 Примененные лучшие практики

### 1. **async-parallel** - Параллельные запросы

```typescript
// ✅ Хорошо: независимые запросы выполняются параллельно
const [orders, total] = await Promise.all([
    Order.find({user: userId}).exec(),
    Order.countDocuments({user: userId}),
]);

// ❌ Плохо: последовательное выполнение
const orders = await Order.find({user: userId}).exec();
const total = await Order.countDocuments({user: userId});
```

### 2. **server-cache-lru** - LRU кэширование

```typescript
// Кэш для пользователей (5 минут)
const userCache = new Map<string, IUser & {cachedAt: number}>();
const CACHE_TTL = 5 * 60 * 1000;

async findById(id: string) {
    const cached = userCache.get(id);
    if (cached && Date.now() - cached.cachedAt < CACHE_TTL) {
        return cached; // Возвращаем из кэша
    }
    
    const user = await User.findById(id).lean().exec();
    if (user) {
        userCache.set(id, {...user, cachedAt: Date.now()});
    }
    return user;
}
```

### 3. **js-early-exit** - Ранние возвраты

```typescript
// ✅ Хорошо: ранний возврат
async create(data: Partial<IConsent>) {
    if (!data.user || !data.type) {
        throw new Error("User и type обязательны");
    }
    
    const existing = await this.findActiveByType(data.user, data.type);
    if (existing) {
        throw new Error("Согласие уже существует");
    }
    
    return Consent.create(data);
}

// ❌ Плохо: глубокая вложенность
async create(data: Partial<IConsent>) {
    if (data.user && data.type) {
        const existing = await this.findActiveByType(data.user, data.type);
        if (!existing) {
            return Consent.create(data);
        } else {
            throw new Error("Согласие уже существует");
        }
    } else {
        throw new Error("User и type обязательны");
    }
}
```

### 4. **server-serialization** - Минимизация данных

```typescript
// ✅ Хорошо: lean() для сериализации и .select() для выбора полей
async findByEmail(email: string) {
    return User.findOne({email: email.toLowerCase()})
        .select("-consents -preferences") // Исключаем чувствительные данные
        .lean() // Возвращаем POJO, не документ Mongoose
        .exec();
}
```

### 5. **Индексы для производительности**

```typescript
// В моделях добавлены индексы:
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({createdAt: -1});
OrderSchema.index({user: 1, createdAt: -1});
OrderSchema.index({status: 1, createdAt: -1});
```

---

## 📊 Примеры использования

### UserRepository

```typescript
import {userRepository} from "@/lib/db/repositories";

// Найти пользователя
const user = await userRepository.findById(userId);

// Создать пользователя
const newUser = await userRepository.create({
    email: "test@example.com",
    firstName: "Иван",
    lastName: "Иванов",
});

// Получить заказы пользователя
const {orders, pagination} = await userRepository.getUserOrders(
    userId,
    10,  // limit
    1     // page
);

// Отозвать согласие (152-ФЗ)
await userRepository.withdrawConsent(
    userId,
    "personal_data",
    ipAddress,
    userAgent
);

// Удалить пользователя (GDPR)
await userRepository.delete(userId);
```

### OrderRepository

```typescript
import {orderRepository} from "@/lib/db/repositories";

// Создать заказ
const order = await orderRepository.create({
    user: userId,
    service: serviceId,
    tariff: "premium",
    price: 10000,
    status: "pending",
});

// Обновить статус
await orderRepository.updateStatus(orderId, "paid", {
    paymentId: "yookassa_payment_id",
});

// Получить статистику
const stats = await orderRepository.getStatistics("month");
// {
//   totalOrders: 50,
//   totalRevenue: 500000,
//   statusBreakdown: {pending: 5, paid: 40, completed: 5},
//   recentOrders: [...]
// }

// Админка: заказы с фильтрами
const {orders, pagination} = await orderRepository.getAdminOrders({
    page: 1,
    limit: 20,
    status: "paid",
    search: "ivan@example.com",
    sortBy: "createdAt",
    sortOrder: "desc",
});
```

### ConsentRepository

```typescript
import {consentRepository} from "@/lib/db/repositories";

// Проверить наличие согласия
const hasConsent = await consentRepository.hasActiveConsent(
    userId,
    "personal_data"
);

// Создать согласие
await consentRepository.create({
    user: userId,
    type: "personal_data",
    given: true,
    givenAt: new Date(),
    version: "1.0",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0...",
});

// Отозвать согласие (152-ФЗ)
await consentRepository.withdraw(
    consentId,
    ipAddress,
    userAgent
);

// Получить статистику
const stats = await consentRepository.getStatistics();
// {
//   total: 100,
//   active: 85,
//   withdrawn: 15,
//   byType: {...}
// }

// Экспорт для проверки (152-ФЗ)
const consents = await consentRepository.getForExport(
    new Date("2025-01-01"),
    new Date("2025-12-31")
);
```

### ReceiptRepository

```typescript
import {receiptRepository} from "@/lib/db/repositories";

// Создать чек
const receipt = await receiptRepository.create({
    order: orderId,
    user: userId,
    type: "payment",
    status: "pending",
    provider: "atol",
    items: [...],
    total: 10000,
    sno: "npd",
});

// Отметить как отправленный
await receiptRepository.markAsSent(receiptId, {
    fiscalNumber: "12345",
    fiscalSign: "ABCDEF",
    fiscalDate: new Date(),
});

// Получить статистику
const stats = await receiptRepository.getStatistics("week");
```

---

## 🔒 152-ФЗ Compliance

### Что реализовано:

1. **Логирование всех действий с согласиями**
   ```typescript
   await AuditLog.create({
       userId,
       action: "consent_withdrawn",
       entityType: "consent",
       entityId: consentId,
       details: {ipAddress, userAgent},
   });
   ```

2. **Хранение IP и User-Agent**
   ```typescript
   consent.metadata = {
       withdrawalIpAddress: ipAddress,
       withdrawalUserAgent: userAgent,
   };
   ```

3. **Отзыв согласий**
   ```typescript
   await consentRepository.withdraw(consentId, ipAddress, userAgent);
   ```

4. **Экспорт согласий**
   ```typescript
   await consentRepository.getForExport(startDate, endDate);
   ```

5. **Автоматическое удаление старых данных (GDPR)**
   ```typescript
   await consentRepository.deleteOldWithdrawn(3); // 3 года
   ```

---

## 📈 Производительность

### Кэширование:

| Репозиторий | Что кэшируется | TTL |
|-------------|----------------|-----|
| UserRepository | Пользователи | 5 мин |
| OrderRepository | Статистика | 2 мин |

### Индексы:

```typescript
// Пользователи
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({createdAt: -1});

// Заказы
OrderSchema.index({user: 1, createdAt: -1});
OrderSchema.index({status: 1, createdAt: -1});

// Согласия
ConsentSchema.index({user: 1, type: 1});
ConsentSchema.index({given: 1, withdrawn: 1});
```

---

## 🧪 Тестирование

### Пример теста:

```typescript
import {userRepository} from "@/lib/db/repositories";

describe("UserRepository", () => {
    it("должен создать пользователя", async () => {
        const user = await userRepository.create({
            email: "test@example.com",
            firstName: "Иван",
            lastName: "Иванов",
        });
        
        expect(user.email).toBe("test@example.com");
        expect(user.firstName).toBe("Иван");
    });
    
    it("должен найти пользователя по email", async () => {
        const user = await userRepository.findByEmail("test@example.com");
        
        expect(user).not.toBeNull();
        expect(user?.email).toBe("test@example.com");
    });
});
```

---

## 📚 API Reference

Полный список методов см. в файлах:
- [`lib/db/repositories/user.repository.ts`](./lib/db/repositories/user.repository.ts)
- [`lib/db/repositories/order.repository.ts`](./lib/db/repositories/order.repository.ts)
- [`lib/db/repositories/receipt.repository.ts`](./lib/db/repositories/receipt.repository.ts)
- [`lib/db/repositories/consent.repository.ts`](./lib/db/repositories/consent.repository.ts)

---

**Все репозитории готовы к использованию! 🎉**
