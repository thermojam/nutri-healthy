# 🧪 ОТЛАДКА ОПЛАТЫ

## 🔍 ДИАГНОСТИКА ОШИБОК

### Ошибка: "Некорректные данные формы"

**Причина:** Валидация Zod не проходит

**Что проверять:**

1. **serviceId** - должен быть строкой (ObjectId MongoDB)
   ```javascript
   // ✅ Правильно
   serviceId: "6a5f8d9e3b2c1a4f5e6d7c8b"
   
   // ❌ Неправильно (UUID формат)
   serviceId: "550e8400-e29b-41d4-a716-446655440000"
   ```

2. **tariff** - должен быть одним из:
   ```javascript
   tariff: "base"     // ✅
   tariff: "premium"  // ✅
   tariff: "vip"      // ✅
   tariff: "other"    // ❌
   ```

3. **Согласия** - обязательно `true`:
   ```javascript
   personalDataConsent: true  // ✅
   contractAcceptance: true   // ✅
   ```

---

## 📊 ТЕКУЩАЯ СХЕМА ВАЛИДАЦИИ

```typescript
export const orderFormSchema = z.object({
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
    patronymic: z.string().max(50).optional().or(z.literal("")),
    email: z.string().email(),
    phone: z.string().min(10).optional().or(z.literal("")),
    serviceId: z.string().min(1),  // ObjectId MongoDB
    tariff: z.enum(["base", "premium", "vip"]),
    paymentMethod: z.enum(["card", "yookassa", "cloudpayments", "yandex_split", "dolemi"]).optional(),
    installments: z.number().optional(),
    personalDataConsent: z.boolean().refine((val) => val === true),
    contractAcceptance: z.boolean().refine((val) => val === true),
    marketingConsent: z.boolean().optional(),
    marketingChannels: z.array(z.enum(["email", "sms", "telegram", "whatsapp"])).optional(),
});
```

---

## 🧪 ТЕСТОВОЕ ЗАПРОС ЧЕРЕЗ CURL

```bash
curl -X POST http://localhost:3000/api/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Иван",
    "lastName": "Иванов",
    "patronymic": "Иванович",
    "email": "test@example.com",
    "phone": "+79991234567",
    "serviceId": "6a5f8d9e3b2c1a4f5e6d7c8b",
    "tariff": "premium",
    "paymentMethod": "yookassa",
    "personalDataConsent": true,
    "contractAcceptance": true,
    "marketingConsent": false
  }'
```

---

## 🔍 ЛОГИРОВАНИЕ В API

Добавлено в `/api/create-order/route.ts`:

```typescript
console.log("📥 Order request body:", body);
console.log("✅ Validation result:", validationResult);
```

**Смотреть логи:**
```bash
# В консоли где запущен dev сервер
```

---

## 📋 ЧЕКЛИСТ ПРОВЕРКИ

- [ ] `.env.local` содержит правильные ключи
- [ ] MongoDB подключен и содержит услуги
- [ ] `serviceId` берется из реальной услуги (не UUID)
- [ ] `tariff` одно из: "base", "premium", "vip"
- [ ] `personalDataConsent` и `contractAcceptance` = `true`
- [ ] Email корректный
- [ ] Телефон в формате +7... (если указан)

---

## 🐛 ЧАСТЫЕ ОШИБКИ

### 1. serviceId не тот формат

**Решение:** Использовать ObjectId из MongoDB, не UUID

### 2. Согласия не отмечены

**Решение:** Обязательно отметить оба чекбокса

### 3. Услуга не найдена в БД

**Решение:** Запустить `npm run seed`

---

## ✅ ИСПРАВЛЕНИЯ В ПРОЕКТЕ

### Обновленные файлы:

1. **lib/validations.ts**
   - ✅ Изменено `serviceId: z.string().uuid()` → `serviceId: z.string().min(1)`
   - ✅ Добавлено `paymentMethod` и `installments`

2. **.env.local**
   - ✅ YOOKASSA_SHOP_ID=1110189
   - ✅ YOOKASSA_SECRET_KEY=381764678:TEST:127042

3. **components/features/payment-form.tsx**
   - ✅ Отправляет `paymentMethod` и `installments`

---

**Теперь должно работать! Попробуйте снова заполнить форму 🎯**
