# СПЕЦИФИКАЦИЯ РАЗРАБОТКИ САЙТА НУТРИЦИОЛОГА/HEALTH-КОУЧА

**Версия:** 3.0  
**Дата:** 2025  
**Статус:** Утверждена  
**База данных:** MongoDB  
**Тип:** Лендинг с элементами многостраничного сайта

---

## СОДЕРЖАНИЕ

1. [Общие положения](#1-общие-положения)
2. [Техническая архитектура](#2-техническая-архитектура)
3. [База данных MongoDB](#3-база-данных-mongodb)
4. [Структура лендинга](#4-структура-лендинга)
5. [Дизайн-система](#5-дизайн-система)
6. [Юридические требования](#6-юридические-требования)
7. [Платежная система и фискализация](#7-платежная-система-и-фискализация)
8. [Рассрочки и сплит-платежи](#8-рассрочки-и-сплит-платежи)
9. [Функциональные требования](#9-функциональные-требования)
10. [Производительность и SEO](#10-производительность-и-seo)
11. [Чеклист запуска](#11-чеклист-запуска)
12. [Приложения](#12-приложения)

---

## 1. ОБЩИЕ ПОЛОЖЕНИЯ

### 1.1. Продукт

| Параметр | Значение |
|----------|----------|
| **Тип** | Лендинг с элементами многостраничного сайта |
| **Цель** | Продажа консультационных услуг нутрициологии и health-коучинга |
| **Правовой статус** | ИП / Самозанятый (НПД) |
| **База данных** | MongoDB Atlas / Self-hosted |
| **Регион хранения данных** | РФ (требование 152-ФЗ) |

### 1.2. Целевая аудитория

| Сегмент | Возраст | Интересы |
|---------|---------|----------|
| Основная | 25-45 лет | Саморазвитие, психология, здоровье, телесные практики |
| Вторичная | 25-40 лет | Начинающие специалисты (нутрициология, психология) |
| Дополнительная | 30-50 лет | Славянская гимнастика, ЗОЖ |

### 1.3. Пользовательский сценарий

```
Главная → О себе/Путь → Продукты → Кейсы → Полезные материалы → 
Заявка/Оплата → Чек
```

**Ключевые принципы:**
- **Доверие:** Акцент на личность, путь, образование, отзывы
- **Легкость:** Воздушный дизайн, отсутствие перегрузки
- **Навигация:** Простой путь от "Узнать" до "Купить"
- **Контент:** Полезные материалы как лид-магнит

---

## 2. ТЕХНИЧЕСКАЯ АРХИТЕКТУРА

### 2.1. Стек технологий

```yaml
Framework: Next.js 16 (App Router)
Language: TypeScript
Database: MongoDB (Atlas или self-hosted в РФ)
ODM: Mongoose
Styling: Tailwind CSS + CSS Variables
Animations: Framer Motion
Theme: next-themes
Forms: React Hook Form + Zod
Validation: Zod
Video: Next.js Video Component / Vimeo / YouTube
Analytics: Yandex Metrica + GA4
Payments: ЮKassa/Robokassa + CloudPayments
Email: Resend/SendGrid
SMS: SMS.ru/Twilio
```

### 2.2. Структура проекта

```
app/
├── layout.tsx
├── page.tsx                              # Главная (лендинг)
├── about/page.tsx                        # О себе/Путь/Образование
├── services/
│   ├── page.tsx                          # Продуктовая линейка
│   ├── nutrition/page.tsx
│   ├── health-coaching/page.tsx
│   └── slavic-gymnastics/page.tsx
├── cases/page.tsx                        # Кейсы/Результаты
├── materials/
│   ├── page.tsx                          # Полезные материалы
│   ├── articles/[slug]/page.tsx          # Статьи
│   ├── videos/[slug]/page.tsx            # Видео
│   └── webinars/[slug]/page.tsx          # Вебинары
├── legal/
│   ├── privacy-policy/page.tsx
│   ├── personal-data-consent/page.tsx
│   ├── marketing-consent/page.tsx
│   └── contract/page.tsx
├── payment/
│   ├── success/page.tsx
│   ├── cancel/page.tsx
│   └── webhook/route.ts
├── dashboard/
│   ├── orders/page.tsx
│   ├── clients/page.tsx
│   ├── receipts/page.tsx
│   └── consents/page.tsx
└── api/
    ├── send-form/route.ts
    ├── create-payment/route.ts
    ├── receipt/route.ts
    ├── installment/create/route.ts
    └── installment/webhook/route.ts

components/
├── ui/
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── accordion.tsx
│   ├── badge.tsx
│   ├── typography.tsx
│   ├── video-player.tsx
│   └── testimonial-card.tsx
├── layout/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── container.tsx
│   ├── theme-toggle.tsx
│   └── logo.tsx
├── sections/
│   ├── hero-section.tsx
│   ├── about-section.tsx                 # О себе/Путь
│   ├── education-section.tsx             # Образование/Дипломы
│   ├── products-section.tsx              # Продуктовая линейка
│   ├── cases-section.tsx                 # Кейсы/Результаты
│   ├── materials-section.tsx             # Полезные материалы
│   ├── articles-grid.tsx                 # Сетка статей
│   ├── videos-grid.tsx                   # Сетка видео
│   ├── webinars-section.tsx              # Вебинары
│   ├── gymnastics-section.tsx            # Славянская гимнастика
│   ├── testimonials-carousel.tsx
│   ├── pricing-section.tsx
│   └── faq-section.tsx
├── features/
│   ├── expert-block.tsx
│   ├── services-grid.tsx
│   ├── contact-form.tsx
│   ├── legal-consent-checkboxes.tsx
│   ├── payment-form.tsx
│   └── installment-selector.tsx
└── motion/
    ├── animated-background.tsx
    ├── fade-in.tsx
    └── stagger-children.tsx

lib/
├── utils.ts
├── constants.ts
├── mock-data.ts
├── validations.ts
├── types.ts
├── db/
│   ├── connect.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   ├── Receipt.ts
│   │   ├── Consent.ts
│   │   ├── Service.ts
│   │   ├── Testimonial.ts
│   │   ├── Article.ts
│   │   ├── Video.ts
│   │   ├── Webinar.ts
│   │   ├── Case.ts
│   │   ├── Education.ts
│   │   └── Installment.ts
│   └── repositories/
│       ├── user.repository.ts
│       ├── order.repository.ts
│       ├── payment.repository.ts
│       ├── receipt.repository.ts
│       ├── consent.repository.ts
│       ├── article.repository.ts
│       ├── video.repository.ts
│       ├── webinar.repository.ts
│       ├── case.repository.ts
│       └── education.repository.ts
├── payments/
│   ├── yookassa.ts
│   ├── cloudpayments.ts
│   └── receipts.ts
└── installments/
    ├── yandex.ts
    ├── dolimi.ts
    └── sobol.ts

styles/
└── globals.css

config/
├── database.ts
└── app.ts

scripts/
├── seed.ts
└── migrate.ts

content/
├── articles/                               # Маркетинговые статьи
├── videos/                                 # Видео-контент
└── webinars/                               # Вебинары
```

### 2.3. Конфигурация MongoDB

```typescript
// lib/db/connect.ts

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
    }).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
```

---

## 3. БАЗА ДАННЫХ MONGODB

### 3.1. Схема пользователя (User)

```typescript
// lib/db/models/User.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  role: 'client' | 'admin';
  consents: {
    personalData: {
      given: boolean;
      givenAt?: Date;
      withdrawn?: boolean;
      withdrawnAt?: Date;
      ipAddress?: string;
      userAgent?: string;
    };
    marketing: {
      given: boolean;
      givenAt?: Date;
      withdrawn?: boolean;
      withdrawnAt?: Date;
      channels: ('email' | 'sms' | 'telegram' | 'whatsapp')[];
    };
    contract: {
      given: boolean;
      givenAt?: Date;
      version: string;
      ipAddress?: string;
    };
  };
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: 'ru' | 'en';
    notifications: {
      email: boolean;
      sms: boolean;
      telegram: boolean;
    };
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email обязателен'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: [true, 'Имя обязательно'],
    trim: true,
    minlength: 2,
  },
  lastName: {
    type: String,
    required: [true, 'Фамилия обязательна'],
    trim: true,
    minlength: 2,
  },
  patronymic: String,
  role: {
    type: String,
    enum: ['client', 'admin'],
    default: 'client',
  },
  consents: {
    personalData: {
      given: { type: Boolean, default: false },
      givenAt: Date,
      withdrawn: { type: Boolean, default: false },
      withdrawnAt: Date,
      ipAddress: String,
      userAgent: String,
    },
    marketing: {
      given: { type: Boolean, default: false },
      givenAt: Date,
      withdrawn: { type: Boolean, default: false },
      withdrawnAt: Date,
      channels: [{
        type: String,
        enum: ['email', 'sms', 'telegram', 'whatsapp'],
      }],
    },
    contract: {
      given: { type: Boolean, default: false },
      givenAt: Date,
      version: String,
      ipAddress: String,
    },
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system',
    },
    language: {
      type: String,
      enum: ['ru', 'en'],
      default: 'ru',
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      telegram: { type: Boolean, default: false },
    },
  },
  lastLoginAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phone: 1 }, { unique: true, sparse: true });
UserSchema.index({ createdAt: -1 });

UserSchema.virtual('fullName').get(function() {
  return `${this.lastName} ${this.firstName}${this.patronymic ? ' ' + this.patronymic : ''}`;
});

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

### 3.2. Схема образования (Education)

```typescript
// lib/db/models/Education.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
  title: string;
  institution: string;
  degree?: string;
  specialty: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  documents: {
    type: 'diploma' | 'certificate' | 'course';
    url: string;
    name: string;
  }[];
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>({
  title: {
    type: String,
    required: true,
  },
  institution: {
    type: String,
    required: true,
  },
  degree: String,
  specialty: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  isCurrent: {
    type: Boolean,
    default: false,
  },
  description: String,
  documents: [{
    type: {
      type: String,
      enum: ['diploma', 'certificate', 'course'],
      required: true,
    },
    url: { type: String, required: true },
    name: { type: String, required: true },
  }],
  order: {
    type: Number,
    default: 0,
    index: true,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

EducationSchema.index({ order: 1 });
EducationSchema.index({ featured: 1 });

export const Education = mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);
```

### 3.3. Схема кейса (Case)

```typescript
// lib/db/models/Case.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ICase extends Document {
  title: string;
  slug: string;
  client: {
    name: string;
    photo?: string;
    anonymized: boolean;
    age?: number;
    gender?: 'female' | 'male';
  };
  problem: string;
  challenge: string;
  solution: string;
  results: {
    title: string;
    value: string;
    metric?: string;
  }[];
  beforeAfter?: {
    before: string;
    after: string;
  };
  testimonial?: string;
  serviceId?: mongoose.Types.ObjectId;
  serviceName: string;
  duration: string;
  published: boolean;
  publishedAt?: Date;
  consentGiven: boolean;
  consentDate?: Date;
  order: number;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICase>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  client: {
    name: { type: String, required: true },
    photo: String,
    anonymized: { type: Boolean, default: false },
    age: Number,
    gender: {
      type: String,
      enum: ['female', 'male'],
    },
  },
  problem: {
    type: String,
    required: true,
  },
  challenge: {
    type: String,
    required: true,
  },
  solution: {
    type: String,
    required: true,
  },
  results: [{
    title: String,
    value: { type: String, required: true },
    metric: String,
  }],
  beforeAfter: {
    before: String,
    after: String,
  },
  testimonial: String,
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  serviceName: {
    type: String,
    required: true,
  },
  duration: String,
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  publishedAt: Date,
  consentGiven: {
    type: Boolean,
    required: true,
    default: false,
  },
  consentDate: Date,
  order: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  tags: [String],
}, {
  timestamps: true,
});

CaseSchema.index({ slug: 1 }, { unique: true });
CaseSchema.index({ published: 1, publishedAt: -1 });
CaseSchema.index({ featured: 1 });
CaseSchema.index({ order: 1 });

CaseSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Case = mongoose.models.Case || mongoose.model<ICase>('Case', CaseSchema);
```

### 3.4. Схема статьи (Article)

```typescript
// lib/db/models/Article.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IArticle extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: {
    url: string;
    alt: string;
  };
  author: {
    name: string;
    photo?: string;
  };
  category: 'nutrition' | 'psychology' | 'wellness' | 'lifestyle';
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  readingTime: number;
  views: number;
  relatedArticles: mongoose.Types.ObjectId[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
    maxlength: 200,
  },
  content: {
    type: String,
    required: true,
  },
  coverImage: {
    url: { type: String, required: true },
    alt: String,
  },
  author: {
    name: { type: String, required: true },
    photo: String,
  },
  category: {
    type: String,
    enum: ['nutrition', 'psychology', 'wellness', 'lifestyle'],
    required: true,
    index: true,
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  publishedAt: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  readingTime: {
    type: Number,
    default: 5,
  },
  views: {
    type: Number,
    default: 0,
  },
  relatedArticles: [{
    type: Schema.Types.ObjectId,
    ref: 'Article',
  }],
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

ArticleSchema.index({ slug: 1 }, { unique: true });
ArticleSchema.index({ published: 1, publishedAt: -1 });
ArticleSchema.index({ category: 1 });
ArticleSchema.index({ featured: 1 });

ArticleSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Article = mongoose.models.Article || mongoose.model<IArticle>('Article', ArticleSchema);
```

### 3.5. Схема видео (Video)

```typescript
// lib/db/models/Video.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IVideo extends Document {
  title: string;
  slug: string;
  description: string;
  videoUrl: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  duration: number; // секунды
  category: 'nutrition' | 'psychology' | 'wellness' | 'gymnastics';
  tags: string[];
  published: boolean;
  publishedAt?: Date;
  views: number;
  featured: boolean;
  order: number;
  transcript?: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema = new Schema<IVideo>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    url: { type: String, required: true },
    alt: String,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ['nutrition', 'psychology', 'wellness', 'gymnastics'],
    required: true,
    index: true,
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  transcript: String,
  seo: {
    metaTitle: String,
    metaDescription: String,
  },
}, {
  timestamps: true,
});

VideoSchema.index({ slug: 1 }, { unique: true });
VideoSchema.index({ published: 1, publishedAt: -1 });
VideoSchema.index({ category: 1 });
VideoSchema.index({ featured: 1 });

VideoSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Video = mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
```

### 3.6. Схема вебинара (Webinar)

```typescript
// lib/db/models/Webinar.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IWebinar extends Document {
  title: string;
  slug: string;
  description: string;
  recordingUrl: string;
  thumbnail: {
    url: string;
    alt: string;
  };
  duration: number; // секунды
  originalDate: Date;
  speaker: {
    name: string;
    photo?: string;
    bio?: string;
  };
  topics: string[];
  materials?: {
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'xlsx';
  }[];
  published: boolean;
  publishedAt?: Date;
  views: number;
  featured: boolean;
  accessType: 'free' | 'paid' | 'registration';
  price?: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WebinarSchema = new Schema<IWebinar>({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  recordingUrl: {
    type: String,
    required: true,
  },
  thumbnail: {
    url: { type: String, required: true },
    alt: String,
  },
  duration: {
    type: Number,
    required: true,
    min: 0,
  },
  originalDate: {
    type: Date,
    required: true,
  },
  speaker: {
    name: { type: String, required: true },
    photo: String,
    bio: String,
  },
  topics: [String],
  materials: [{
    name: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'xlsx'],
    },
  }],
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  publishedAt: Date,
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
  accessType: {
    type: String,
    enum: ['free', 'paid', 'registration'],
    default: 'free',
  },
  price: Number,
  seo: {
    metaTitle: String,
    metaDescription: String,
  },
}, {
  timestamps: true,
});

WebinarSchema.index({ slug: 1 }, { unique: true });
WebinarSchema.index({ published: 1, publishedAt: -1 });
WebinarSchema.index({ featured: 1 });

WebinarSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Webinar = mongoose.models.Webinar || mongoose.model<IWebinar>('Webinar', WebinarSchema);
```

### 3.7. Схема услуги (Service)

```typescript
// lib/db/models/Service.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  slug: string;
  title: string;
  description: string;
  fullDescription: string;
  category: 'nutrition' | 'health_coaching' | 'slavic_gymnastics' | 'other';
  pricing: {
    base: number;
    premium: number;
    vip: number;
    currency: 'RUB';
  };
  features: {
    base: string[];
    premium: string[];
    vip: string[];
  };
  duration: {
    base: number;
    premium: number;
    vip: number;
  };
  format: ('online' | 'offline' | 'both')[];
  available: boolean;
  popular: boolean;
  installmentsAvailable: boolean;
  minInstallmentAmount: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  image: {
    url: string;
    alt: string;
  };
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 200,
  },
  fullDescription: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['nutrition', 'health_coaching', 'slavic_gymnastics', 'other'],
    required: true,
    index: true,
  },
  pricing: {
    base: { type: Number, required: true, min: 0 },
    premium: { type: Number, required: true, min: 0 },
    vip: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: ['RUB'], default: 'RUB' },
  },
  features: {
    base: [String],
    premium: [String],
    vip: [String],
  },
  duration: {
    base: { type: Number, default: 60 },
    premium: { type: Number, default: 90 },
    vip: { type: Number, default: 120 },
  },
  format: [{
    type: String,
    enum: ['online', 'offline', 'both'],
  }],
  available: {
    type: Boolean,
    default: true,
    index: true,
  },
  popular: {
    type: Boolean,
    default: false,
  },
  installmentsAvailable: {
    type: Boolean,
    default: true,
  },
  minInstallmentAmount: {
    type: Number,
    default: 1500,
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
  image: {
    url: { type: String, required: true },
    alt: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

ServiceSchema.index({ slug: 1 }, { unique: true });
ServiceSchema.index({ category: 1 });
ServiceSchema.index({ available: 1 });
ServiceSchema.index({ order: 1 });

export const Service = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
```

### 3.8. Схема отзыва (Testimonial)

```typescript
// lib/db/models/Testimonial.ts

import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  author: {
    name: string;
    photo?: string;
    anonymized: boolean;
  };
  serviceId?: mongoose.Types.ObjectId;
  serviceName: string;
  rating: number;
  title: string;
  content: string;
  verified: boolean;
  orderId?: mongoose.Types.ObjectId;
  published: boolean;
  publishedAt?: Date;
  consentGiven: boolean;
  consentDate?: Date;
  video?: {
    url: string;
    thumbnail: string;
    duration: number;
  };
  order: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  author: {
    name: { type: String, required: true },
    photo: String,
    anonymized: { type: Boolean, default: false },
  },
  serviceId: {
    type: Schema.Types.ObjectId,
    ref: 'Service',
  },
  serviceName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
  },
  published: {
    type: Boolean,
    default: false,
    index: true,
  },
  publishedAt: Date,
  consentGiven: {
    type: Boolean,
    required: true,
    default: false,
  },
  consentDate: Date,
  video: {
    url: String,
    thumbnail: String,
    duration: Number,
  },
  order: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
    index: true,
  },
}, {
  timestamps: true,
});

TestimonialSchema.index({ published: 1, publishedAt: -1 });
TestimonialSchema.index({ rating: -1 });
TestimonialSchema.index({ serviceId: 1 });
TestimonialSchema.index({ featured: 1 });

TestimonialSchema.pre('save', function(next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export const Testimonial = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
```

### 3.9. Репозитории (Data Access Layer)

```typescript
// lib/db/repositories/article.repository.ts

import { connectDB } from '../connect';
import { Article, IArticle } from '../models/Article';

export class ArticleRepository {
  async findById(id: string): Promise<IArticle | null> {
    await connectDB();
    return Article.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<IArticle | null> {
    await connectDB();
    return Article.findOne({ slug, published: true }).exec();
  }

  async findPublished(limit: number = 10): Promise<IArticle[]> {
    await connectDB();
    return Article.find({ published: true })
      .sort({ publishedAt: -1, order: 1 })
      .limit(limit)
      .exec();
  }

  async findFeatured(limit: number = 3): Promise<IArticle[]> {
    await connectDB();
    return Article.find({ published: true, featured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByCategory(category: string, limit: number = 10): Promise<IArticle[]> {
    await connectDB();
    return Article.find({ published: true, category })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(data: Partial<IArticle>): Promise<IArticle> {
    await connectDB();
    return Article.create(data);
  }

  async updateViews(slug: string): Promise<void> {
    await connectDB();
    await Article.updateOne({ slug }, { $inc: { views: 1 } });
  }

  async getArticlesCount(): Promise<number> {
    await connectDB();
    return Article.countDocuments({ published: true });
  }
}

export const articleRepository = new ArticleRepository();
```

```typescript
// lib/db/repositories/video.repository.ts

import { connectDB } from '../connect';
import { Video, IVideo } from '../models/Video';

export class VideoRepository {
  async findById(id: string): Promise<IVideo | null> {
    await connectDB();
    return Video.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<IVideo | null> {
    await connectDB();
    return Video.findOne({ slug, published: true }).exec();
  }

  async findPublished(limit: number = 10): Promise<IVideo[]> {
    await connectDB();
    return Video.find({ published: true })
      .sort({ publishedAt: -1, order: 1 })
      .limit(limit)
      .exec();
  }

  async findFeatured(limit: number = 3): Promise<IVideo[]> {
    await connectDB();
    return Video.find({ published: true, featured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByCategory(category: string, limit: number = 10): Promise<IVideo[]> {
    await connectDB();
    return Video.find({ published: true, category })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findNutritionPsychoVideos(limit: number = 3): Promise<IVideo[]> {
    await connectDB();
    return Video.find({ 
      published: true, 
      category: { $in: ['nutrition', 'psychology', 'wellness'] },
      duration: { $gte: 600, $lte: 1200 } // 10-20 минут
    })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async create(data: Partial<IVideo>): Promise<IVideo> {
    await connectDB();
    return Video.create(data);
  }

  async updateViews(slug: string): Promise<void> {
    await connectDB();
    await Video.updateOne({ slug }, { $inc: { views: 1 } });
  }
}

export const videoRepository = new VideoRepository();
```

```typescript
// lib/db/repositories/webinar.repository.ts

import { connectDB } from '../connect';
import { Webinar, IWebinar } from '../models/Webinar';

export class WebinarRepository {
  async findById(id: string): Promise<IWebinar | null> {
    await connectDB();
    return Webinar.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<IWebinar | null> {
    await connectDB();
    return Webinar.findOne({ slug, published: true }).exec();
  }

  async findPublished(limit: number = 10): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true })
      .sort({ publishedAt: -1, order: 1 })
      .limit(limit)
      .exec();
  }

  async findFeatured(limit: number = 1): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true, featured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findFreeWebinars(): Promise<IWebinar[]> {
    await connectDB();
    return Webinar.find({ published: true, accessType: 'free' })
      .sort({ publishedAt: -1 })
      .exec();
  }

  async create(data: Partial<IWebinar>): Promise<IWebinar> {
    await connectDB();
    return Webinar.create(data);
  }

  async updateViews(slug: string): Promise<void> {
    await connectDB();
    await Webinar.updateOne({ slug }, { $inc: { views: 1 } });
  }
}

export const webinarRepository = new WebinarRepository();
```

```typescript
// lib/db/repositories/case.repository.ts

import { connectDB } from '../connect';
import { Case, ICase } from '../models/Case';

export class CaseRepository {
  async findById(id: string): Promise<ICase | null> {
    await connectDB();
    return Case.findById(id).exec();
  }

  async findBySlug(slug: string): Promise<ICase | null> {
    await connectDB();
    return Case.findOne({ slug, published: true }).exec();
  }

  async findPublished(limit: number = 10): Promise<ICase[]> {
    await connectDB();
    return Case.find({ published: true })
      .sort({ publishedAt: -1, order: 1 })
      .limit(limit)
      .exec();
  }

  async findFeatured(limit: number = 5): Promise<ICase[]> {
    await connectDB();
    return Case.find({ published: true, featured: true })
      .sort({ order: 1, publishedAt: -1 })
      .limit(limit)
      .exec();
  }

  async findByService(serviceId: string): Promise<ICase[]> {
    await connectDB();
    return Case.find({ published: true, serviceId })
      .sort({ publishedAt: -1 })
      .exec();
  }

  async create(data: Partial<ICase>): Promise<ICase> {
    await connectDB();
    return Case.create(data);
  }

  async getCasesCount(): Promise<number> {
    await connectDB();
    return Case.countDocuments({ published: true });
  }
}

export const caseRepository = new CaseRepository();
```

```typescript
// lib/db/repositories/education.repository.ts

import { connectDB } from '../connect';
import { Education, IEducation } from '../models/Education';

export class EducationRepository {
  async findById(id: string): Promise<IEducation | null> {
    await connectDB();
    return Education.findById(id).exec();
  }

  async findAll(): Promise<IEducation[]> {
    await connectDB();
    return Education.find().sort({ order: 1, startDate: -1 }).exec();
  }

  async findFeatured(): Promise<IEducation[]> {
    await connectDB();
    return Education.find({ featured: true })
      .sort({ order: 1, startDate: -1 })
      .exec();
  }

  async findByType(type: 'diploma' | 'certificate' | 'course'): Promise<IEducation[]> {
    await connectDB();
    return Education.find({ 'documents.type': type })
      .sort({ order: 1, startDate: -1 })
      .exec();
  }

  async create(data: Partial<IEducation>): Promise<IEducation> {
    await connectDB();
    return Education.create(data);
  }

  async updateOrder(id: string, order: number): Promise<IEducation | null> {
    await connectDB();
    return Education.findByIdAndUpdate(id, { order }, { new: true }).exec();
  }
}

export const educationRepository = new EducationRepository();
```

---

## 4. СТРУКТУРА ЛЕНДИНГА

### 4.1. Главная страница (Лендинг)

**Последовательность секций:**

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HERO SECTION                                             │
│    - Заголовок + УТП                                        │
│    - Подзаголовок                                           │
│    - CTA кнопки (Записаться / Узнать больше)                │
│    - Фото эксперта                                          │
│    - Анимированный фон                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. О СЕБЕ / ПУТЬ                                            │
│    - Краткая биография                                      │
│    - Путь в профессии (timeline)                            │
│    - Философия и подход                                     │
│    - Личная история                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. ОБРАЗОВАНИЕ / ДИПЛОМЫ                                    │
│    - Дипломы (сканы)                                        │
│    - Сертификаты                                            │
│    - Курсы повышения квалификации                           │
│    - ВУЗы и учреждения                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. ПРОДУКТОВАЯ ЛИНЕЙКА                                      │
│    - Нутрициология (карточка)                               │
│    - Health-коучинг (карточка)                              │
│    - Славянская гимнастика (карточка)                       │
│    - Тарифы (Базовый / Оптимальный / VIP)                   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. КЕЙСЫ / РЕЗУЛЬТАТЫ                                       │
│    - До/После (фото, если есть согласие)                    │
│    - Истории клиентов                                       │
│    - Конкретные результаты (цифры, метрики)                 │
│    - Отзывы с видео                                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. ПОЛЕЗНЫЕ МАТЕРИАЛЫ                                       │
│    ├── Статьи (Нутри/Психо) - 3-5 шт                       │
│    ├── Видео (~15 мин) - 3 шт                              │
│    ├── Вебинар (запись) - 1 шт                             │
│    └── Открытые занятия по гимнастике                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. ОТЗЫВЫ                                                   │
│    - Carousel с отзывами                                    │
│    - Видео-отзывы                                           │
│    - Рейтинги                                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. FAQ                                                      │
│    - Accordion с частыми вопросами                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. ЛИД-МАГНИТ / ФОРМА ЗАХВАТА                               │
│    - Форма (имя, email, телефон)                            │
│    - Чекбоксы согласий                                      │
│    - Бонус за подписку                                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 10. КОНТАКТЫ / FOOTER                                       │
│    - Контакты                                               │
│    - Соцсети                                                │
│    - Юридические документы                                  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2. Секция "О себе / Путь"

```typescript
// components/sections/about-section.tsx

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface AboutSectionProps {
  data: {
    title: string;
    subtitle: string;
    bio: string;
    journey: {
      year: string;
      title: string;
      description: string;
    }[];
    philosophy: string;
    photo: {
      url: string;
      alt: string;
    };
  };
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <section id="about" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          {/* Фото эксперта */}
          <div className="relative">
            <Image
              src={data.photo.url}
              alt={data.photo.alt}
              width={600}
              height={700}
              className="rounded-2xl shadow-xl"
              placeholder="blur"
              priority
            />
            {/* Декоративный элемент */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-2xl -z-10" />
          </div>

          {/* Контент */}
          <div className="space-y-6">
            <div>
              <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
              <p className="text-xl text-muted-foreground">{data.subtitle}</p>
            </div>

            <div className="prose dark:prose-invert">
              <p className="text-lg">{data.bio}</p>
            </div>

            {/* Timeline пути */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Мой путь</h3>
              <div className="space-y-4">
                {data.journey.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-16 text-primary font-bold">
                      {item.year}
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Философия */}
            <div className="bg-primary/5 dark:bg-primary/10 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold mb-2">Моя философия</h3>
              <p className="text-muted-foreground italic">{data.philosophy}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### 4.3. Секция "Образование / Дипломы"

```typescript
// components/sections/education-section.tsx

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface EducationSectionProps {
  data: {
    title: string;
    subtitle: string;
    items: {
      id: string;
      title: string;
      institution: string;
      specialty: string;
      year: string;
      documents: {
        type: 'diploma' | 'certificate' | 'course';
        url: string;
        name: string;
      }[];
    }[];
  };
}

export default function EducationSection({ data }: EducationSectionProps) {
  return (
    <section id="education" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 rounded-2xl border shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <Badge 
                  variant={
                    item.documents[0]?.type === 'diploma' ? 'default' : 'outline'
                  }
                >
                  {item.documents[0]?.type === 'diploma' ? 'Диплом' : 
                   item.documents[0]?.type === 'certificate' ? 'Сертификат' : 'Курс'}
                </Badge>
                <span className="text-muted-foreground">{item.year}</span>
              </div>

              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-primary font-medium mb-1">{item.institution}</p>
              <p className="text-muted-foreground text-sm">{item.specialty}</p>

              {/* Документы */}
              {item.documents.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Документы:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        📄 {doc.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4.4. Секция "Продуктовая линейка"

```typescript
// components/sections/products-section.tsx

'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface ProductsSectionProps {
  data: {
    title: string;
    subtitle: string;
    services: {
      id: string;
      slug: string;
      title: string;
      description: string;
      category: 'nutrition' | 'health_coaching' | 'slavic_gymnastics';
      pricing: {
        base: number;
        premium: number;
        vip: number;
      };
      features: {
        base: string[];
        premium: string[];
        vip: string[];
      };
      popular: boolean;
      image: {
        url: string;
        alt: string;
      };
    }[];
  };
}

export default function ProductsSection({ data }: ProductsSectionProps) {
  return (
    <section id="services" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden rounded-2xl ${
                service.popular ? 'border-primary border-2' : ''
              }`}>
                {service.popular && (
                  <Badge className="absolute top-4 right-4 bg-primary">
                    Популярный
                  </Badge>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>

                  {/* Тарифы */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center py-3 border-b">
                      <span>Базовый</span>
                      <span className="font-bold">{service.pricing.base.toLocaleString()} ₽</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b">
                      <span>Оптимальный</span>
                      <span className="font-bold text-primary">
                        {service.pricing.premium.toLocaleString()} ₽
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span>VIP</span>
                      <span className="font-bold">{service.pricing.vip.toLocaleString()} ₽</span>
                    </div>
                  </div>

                  {/* Возможности */}
                  <div className="space-y-2 mb-6">
                    {service.features.premium.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full" size="lg">
                    Выбрать тариф
                  </Button>

                  {/* Рассрочка */}
                  {service.pricing.premium >= 3000 && (
                    <p className="text-center text-sm text-muted-foreground mt-3">
                      Или в рассрочку от {Math.round(service.pricing.premium / 4)}₽/мес
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4.5. Секция "Кейсы / Результаты"

```typescript
// components/sections/cases-section.tsx

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CasesSectionProps {
  data: {
    title: string;
    subtitle: string;
    cases: {
      id: string;
      slug: string;
      title: string;
      client: {
        name: string;
        photo?: string;
        anonymized: boolean;
        age?: number;
      };
      problem: string;
      results: {
        title: string;
        value: string;
        metric?: string;
      }[];
      beforeAfter?: {
        before: string;
        after: string;
      };
      testimonial?: string;
      serviceName: string;
    }[];
  };
}

export default function CasesSection({ data }: CasesSectionProps) {
  return (
    <section id="cases" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {data.cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden rounded-2xl">
                {/* До/После */}
                {caseItem.beforeAfter && (
                  <div className="grid grid-cols-2 aspect-video">
                    <div className="relative">
                      <Image
                        src={caseItem.beforeAfter.before}
                        alt="До"
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2">До</Badge>
                    </div>
                    <div className="relative">
                      <Image
                        src={caseItem.beforeAfter.after}
                        alt="После"
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-primary">После</Badge>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {caseItem.client.photo && !caseItem.client.anonymized ? (
                      <Image
                        src={caseItem.client.photo}
                        alt={caseItem.client.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">
                          {caseItem.client.name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{caseItem.client.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {caseItem.client.age && `${caseItem.client.age} лет`} • {caseItem.serviceName}
                      </p>
                    </div>
                  </div>

                  <h4 className="text-xl font-bold mb-3">{caseItem.title}</h4>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Запрос:</p>
                    <p>{caseItem.problem}</p>
                  </div>

                  {/* Результаты */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-muted-foreground">Результаты:</p>
                    {caseItem.results.map((result, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-primary font-bold">✓</span>
                        <span>
                          <strong>{result.value}</strong>
                          {result.metric && <span className="text-muted-foreground"> {result.metric}</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Отзыв */}
                  {caseItem.testimonial && (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                      "{caseItem.testimonial}"
                    </blockquote>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 4.6. Секция "Полезные материалы"

```typescript
// components/sections/materials-section.tsx

'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, FileText, Video, Calendar } from 'lucide-react';

interface MaterialsSectionProps {
  data: {
    title: string;
    subtitle: string;
    articles: {
      id: string;
      slug: string;
      title: string;
      excerpt: string;
      category: 'nutrition' | 'psychology';
      coverImage: {
        url: string;
        alt: string;
      };
      readingTime: number;
    }[];
    videos: {
      id: string;
      slug: string;
      title: string;
      description: string;
      thumbnail: {
        url: string;
        alt: string;
      };
      duration: number; // секунды
      category: 'nutrition' | 'psychology' | 'wellness';
    }[];
    webinars: {
      id: string;
      slug: string;
      title: string;
      description: string;
      thumbnail: {
        url: string;
        alt: string;
      };
      duration: number;
      originalDate: string;
      accessType: 'free' | 'paid';
    }[];
    gymnastics: {
      id: string;
      title: string;
      description: string;
      videoUrl: string;
      thumbnail: {
        url: string;
        alt: string;
      };
      schedule?: {
        day: string;
        time: string;
      }[];
    }[];
  };
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes} мин`;
}

export default function MaterialsSection({ data }: MaterialsSectionProps) {
  return (
    <section id="materials" className="py-24 bg-card">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
          <p className="text-xl text-muted-foreground">{data.subtitle}</p>
        </motion.div>

        {/* Статьи (Нутри/Психо) - 3-5 штук */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              Статьи о питании и психологии
            </h3>
            <Link href="/materials/articles" className="text-primary hover:underline">
              Все статьи →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {data.articles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/materials/articles/${article.slug}`}>
                  <Card className="overflow-hidden rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video">
                      <Image
                        src={article.coverImage.url}
                        alt={article.coverImage.alt}
                        fill
                        className="object-cover"
                        placeholder="blur"
                      />
                      <Badge className="absolute top-2 left-2">
                        {article.category === 'nutrition' ? 'Нутрициология' : 'Психология'}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2">{article.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>⏱ {article.readingTime} мин</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Видео (~15 минут) - 3 шт */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Video className="h-6 w-6 text-primary" />
              Полезные видео
            </h3>
            <Link href="/materials/videos" className="text-primary hover:underline">
              Все видео →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {data.videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/materials/videos/${video.slug}`}>
                  <Card className="overflow-hidden rounded-2xl hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video group">
                      <Image
                        src={video.thumbnail.url}
                        alt={video.thumbnail.alt}
                        fill
                        className="object-cover"
                        placeholder="blur"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                      <Badge className="absolute bottom-2 right-2 bg-black/80">
                        {formatDuration(video.duration)}
                      </Badge>
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold mb-2 line-clamp-2">{video.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Вебинар (запись) - 1 шт */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Запись вебинара
            </h3>
          </div>

          {data.webinars.map((webinar) => (
            <motion.div
              key={webinar.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="overflow-hidden rounded-2xl">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto">
                    <Image
                      src={webinar.thumbnail.url}
                      alt={webinar.thumbnail.alt}
                      fill
                      className="object-cover"
                      placeholder="blur"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="h-16 w-16 text-white" />
                    </div>
                    <Badge className="absolute top-4 left-4">
                      {formatDuration(webinar.duration)}
                    </Badge>
                    {webinar.accessType === 'free' && (
                      <Badge className="absolute top-4 right-4 bg-green-600">
                        Бесплатно
                      </Badge>
                    )}
                  </div>
                  <div className="p-6 flex flex-col justify-center">
                    <h4 className="text-2xl font-bold mb-3">{webinar.title}</h4>
                    <p className="text-muted-foreground mb-4">{webinar.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span>📅 {new Date(webinar.originalDate).toLocaleDateString('ru-RU')}</span>
                      <span>⏱ {formatDuration(webinar.duration)}</span>
                    </div>
                    <Link href={`/materials/webinars/${webinar.slug}`}>
                      <Button size="lg">Смотреть запись</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Открытые занятия по гимнастике */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold flex items-center gap-2">
              <Play className="h-6 w-6 text-primary" />
              Открытые занятия по гимнастике
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {data.gymnastics.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden rounded-2xl">
                  <div className="relative aspect-video group">
                    <Image
                      src={item.thumbnail.url}
                      alt={item.thumbnail.alt}
                      fill
                      className="object-cover"
                      placeholder="blur"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    {item.schedule && (
                      <div className="space-y-1">
                        {item.schedule.map((slot, i) => (
                          <p key={i} className="text-sm text-muted-foreground">
                            📅 {slot.day} в {slot.time}
                          </p>
                        ))}
                      </div>
                    )}
                    <Link href={item.videoUrl} target="_blank">
                      <Button className="w-full mt-4" variant="outline">
                        Смотреть занятие
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

---

## 5. ДИЗАЙН-СИСТЕМА

### 5.1. Цветовая палитра

```css
:root {
  /* Light Theme */
  --background: 0 0% 100%;
  --card: 0 0% 100%;
  --primary: 271 68% 46%;      /* #7B2CBF */
  --primary-foreground: 0 0% 100%;
  --accent: 29 100% 66%;       /* #FFA552 */
  --accent-foreground: 0 0% 100%;
  --text: 240 21% 15%;         /* #1E1E2E */
  --text-muted: 240 10% 45%;
  --border: 240 10% 90%;
  --ring: 271 68% 46%;
}

.dark {
  /* Dark Theme */
  --background: 240 10% 6%;
  --card: 240 10% 10%;
  --primary: 271 76% 63%;      /* #A855F7 */
  --primary-foreground: 0 0% 100%;
  --accent: 29 100% 66%;
  --accent-foreground: 0 0% 100%;
  --text: 0 0% 96%;            /* #F5F5F5 */
  --text-muted: 240 10% 65%;
  --border: 240 10% 20%;
  --ring: 271 76% 63%;
}
```

### 5.2. Типографика

```typescript
import { Nunito } from 'next/font/google'

const nunito = Nunito({
  subsets: ['cyrillic', 'latin'],
  display: 'swap',
  variable: '--font-nunito',
})

// Размеры:
// H1: 48px (mobile: 32px) - font-bold
// H2: 36px (mobile: 24px) - font-semibold
// H3: 24px (mobile: 20px) - font-semibold
// Body: 16-18px - font-normal
// Small: 14px - font-normal
```

### 5.3. UI компоненты

- **Button:** rounded-2xl, variants: default/outline/ghost
- **Card:** rounded-2xl, shadow-sm, border
- **Input:** rounded-xl, focus:ring-2 focus:ring-primary
- **Accordion:** для FAQ и программ
- **Badge:** для тегов и категорий
- **Checkbox:** кастомный с анимацией
- **VideoPlayer:** кастомный плеер для видео

---

## 6. ЮРИДИЧЕСКИЕ ТРЕБОВАНИЯ

### 6.1. Компонент согласий

```typescript
interface Consents {
  personalData: boolean;      // Обязательное
  marketing: boolean;         // Опциональное
  contract: boolean;          // Обязательное (оферта)
}
```

### 6.2. Юридические документы

**Страницы:**
- `/legal/privacy-policy` - Политика обработки ПДн
- `/legal/personal-data-consent` - Согласие на обработку ПДн
- `/legal/marketing-consent` - Согласие на рассылку
- `/legal/contract` - Договор оферты

**Требования:**
- Все документы доступны из футера
- Ссылки на документы в формах
- Логирование согласий в MongoDB (минимум 3 года)
- Актуальные версии на 2025-2026 гг.

### 6.3. Соответствие 152-ФЗ

- [x] Локализация данных (MongoDB в РФ или Atlas с EU region)
- [x] Уведомление Роскомнадзора
- [x] Политика cookies
- [x] Хранение согласий 3+ лет (TTL индекс в AuditLog)
- [x] Простая процедура отзыва согласия

---

## 7. ПЛАТЕЖНАЯ СИСТЕМА И ФИСКАЛИЗАЦИЯ

### 7.1. Интеграция платежных систем

```typescript
export const PAYMENT_PROVIDERS = {
  YOOKASSA: {
    name: 'ЮKassa',
    enabled: true,
  },
  CLOUDPAYMENTS: {
    name: 'CloudPayments',
    enabled: true,
  },
} as const;
```

### 7.2. Фискализация (54-ФЗ)

- Чеки формируются автоматически при оплате
- Отправка на email клиента
- Сохранение в MongoDB (коллекция receipts)
- Интеграция с ОФД (Атол/Штрих-М)

### 7.3. Для самозанятых (НПД)

- Чеки через API "Мой налог"
- Автоматическая отправка клиенту
- QR-код для проверки в ФНС

---

## 8. РАССРОЧКИ И СПЛИТ-ПЛАТЕЖИ

### 8.1. Поддерживаемые сервисы

```typescript
export const INSTALLMENT_PROVIDERS = {
  YANDEX_SPLIT: {
    name: 'Яндекс.Рассрочка',
    minAmount: 3000,
    maxAmount: 500000,
    installments: [2, 3, 4, 6, 12],
  },
  DOLEMI: {
    name: 'Долями',
    minAmount: 1500,
    maxAmount: 75000,
    installments: [4],
  },
  TINKOFF_INSTALLMENTS: {
    name: 'Тинькофф Рассрочка',
    minAmount: 3000,
    maxAmount: 300000,
    installments: [3, 6, 12],
  },
} as const;
```

### 8.2. Отображение на сайте

- Калькулятор рассрочки на карточках товаров
- Выбор провайдера при оформлении
- Webhook для обновления статуса платежей

---

## 9. ФУНКЦИОНАЛЬНЫЕ ТРЕБОВАНИЯ

### 9.1. Формы обратной связи

- Валидация через Zod
- Чекбоксы согласий (обязательные/опциональные)
- Логирование в MongoDB
- Отправка уведомлений на email

### 9.2. Анимации (Framer Motion)

- whileInView с once: true
- FadeIn для секций
- StaggerChildren для списков
- AnimatedBackground для Hero

### 9.3. Видео-контент

- Поддержка Vimeo/YouTube/self-hosted
- Lazy loading для видео
- Кастомный плеер с контролем
- Транскрипты для доступности

---

## 10. ПРОИЗВОДИТЕЛЬНОСТЬ И SEO

### 10.1. Оптимизация

- **Server Components:** 95% компонентов
- **Images:** next/image + placeholder="blur"
- **Fonts:** next/font/google + display: swap
- **Videos:** Lazy loading + poster images
- **Database:** MongoDB индексы на всех часто используемых полях

### 10.2. SEO

```typescript
export const metadata: Metadata = {
  title: 'Нутрициолог [Имя] | Health-коучинг',
  description: 'Консультации по нутрициологии и health-коучингу',
  keywords: ['нутрициолог', 'health-коучинг', 'здоровое питание'],
  openGraph: {
    title: 'Нутрициолог [Имя]',
    description: 'Индивидуальные консультации',
    images: ['/og-image.jpg'],
    locale: 'ru_RU',
    type: 'website',
  },
  robots: { index: true, follow: true },
};
```

### 10.3. MongoDB оптимизация

- Индексы на всех query полях
- Агрегации для аналитики
- TTL для audit_logs (3 года)
- Репликация для отказоустойчивости

---

## 11. ЧЕКЛИСТ ЗАПУСКА

### 11.1. Контент

- [ ] Тексты для секции "О себе / Путь"
- [ ] Сканы дипломов и сертификатов
- [ ] Фото эксперта (профессиональные)
- [ ] Описания услуг и тарифов
- [ ] Кейсы с результатами (5-10 шт)
- [ ] Статьи (3-5 шт, нутри/психо)
- [ ] Видео (~15 мин, 3 шт)
- [ ] Запись вебинара (1 шт)
- [ ] Открытые занятия по гимнастике
- [ ] Отзывы клиентов (с согласиями)

### 11.2. Юридическая подготовка

- [ ] Заполнить реквизиты (ИНН, ОГРНИП, ФИО)
- [ ] Разместить юридические документы
- [ ] Настроить чекбоксы согласий
- [ ] Подключить ОФД (Атол/Штрих-М)
- [ ] Настроить логирование согласий в MongoDB
- [ ] Подать уведомление в Роскомнадзор
- [ ] Добавить политику cookies

### 11.3. База данных MongoDB

- [ ] Настроить MongoDB Atlas или self-hosted в РФ
- [ ] Создать все коллекции и индексы
- [ ] Настроить backup (ежедневно)
- [ ] Настроить мониторинг
- [ ] Протестировать репликацию
- [ ] Настроить TTL для audit_logs (3 года)

### 11.4. Платежи и фискализация

- [ ] Подключить платежную систему
- [ ] Настроить webhook'и
- [ ] Протестировать формирование чеков
- [ ] Настроить отправку чеков на email
- [ ] Для самозанятых: настроить API "Мой налог"
- [ ] Протестировать возвраты средств

### 11.5. Рассрочки

- [ ] Подключить Яндекс.Рассрочку
- [ ] Подключить Долями
- [ ] Подключить Тинькофф Рассрочку
- [ ] Настроить webhook'и
- [ ] Протестировать сценарий одобрения/отказа

### 11.6. Техническая подготовка

- [ ] Настроить домен и SSL
- [ ] Настроить Яндекс.Метрику и GA4
- [ ] Добавить sitemap.xml и robots.txt
- [ ] Протестировать формы на всех устройствах
- [ ] Проверить PageSpeed (>90)
- [ ] Настроить резервное копирование

### 11.7. Тестирование

- [ ] Протестировать оплату картой
- [ ] Протестировать рассрочки
- [ ] Проверить выдачу чеков
- [ ] Протестировать темную тему
- [ ] Проверить доступность (a11y)
- [ ] Протестировать SEO-разметку
- [ ] Протестировать все видео
- [ ] Проверить отображение на мобильных

---

## 12. ПРИЛОЖЕНИЯ

### A. Переменные окружения

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutritionist?retryWrites=true&w=majority
MONGODB_DB_NAME=nutritionist

# Платежные системы
YOOKASSA_SHOP_ID=
YOOKASSA_SECRET_KEY=
CLOUDPAYMENTS_PUBLIC_ID=
CLOUDPAYMENTS_API_SECRET=

# Рассрочки
YANDEX_SHOP_ID=
YANDEX_SECRET_KEY=
DOLEMI_MERCHANT_ID=
DOLEMI_API_KEY=
TINKOFF_TERMINAL_KEY=
TINKOFF_SECRET_KEY=

# ОФД
ATOL_LOGIN=
ATOL_PASSWORD=
ATOL_SNO=npd

# Самозанятые
MY_TAX_TOKEN=

# Email
RESEND_API_KEY=

# SMS
SMSRU_API_KEY=

# Аналитика
YANDEX_METRICA_ID=
GA4_MEASUREMENT_ID=

# Безопасность
WEBHOOK_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Приложение
NEXT_PUBLIC_URL=https://yoursite.ru
NODE_ENV=production

# Видео
VIMEO_ACCESS_TOKEN=
YOUTUBE_API_KEY=
```

### D. Скрипты для MongoDB

```typescript
// scripts/seed.ts

import { connectDB } from '@/lib/db/connect';
import { Service } from '@/lib/db/models/Service';
import { Article } from '@/lib/db/models/Article';
import { Video } from '@/lib/db/models/Video';
import { Webinar } from '@/lib/db/models/Webinar';
import { Case } from '@/lib/db/models/Case';
import { Education } from '@/lib/db/models/Education';

async function seed() {
  await connectDB();

  // Услуги
  await Service.insertMany([
    {
      slug: 'nutrition-consultation',
      title: 'Консультация нутрициолога',
      description: 'Индивидуальный план питания',
      category: 'nutrition',
      pricing: { base: 5000, premium: 10000, vip: 20000, currency: 'RUB' },
      available: true,
      popular: true,
    },
    {
      slug: 'health-coaching',
      title: 'Health-коучинг',
      description: 'Комплексное сопровождение',
      category: 'health_coaching',
      pricing: { base: 15000, premium: 30000, vip: 50000, currency: 'RUB' },
      available: true,
    },
    {
      slug: 'slavic-gymnastics',
      title: 'Славянская гимнастика',
      description: 'Телесные практики для гармонии',
      category: 'slavic_gymnastics',
      pricing: { base: 3000, premium: 8000, vip: 15000, currency: 'RUB' },
      available: true,
    },
  ]);

  // Статьи (3-5 шт)
  await Article.insertMany([
    {
      slug: 'kak-pravilno-pitatsya-utrom',
      title: 'Как правильно питаться утром',
      excerpt: '5 правил здорового завтрака',
      category: 'nutrition',
      published: true,
      readingTime: 7,
    },
    {
      slug: 'svyaz-pitaniya-i-emociy',
      title: 'Связь питания и эмоций',
      excerpt: 'Как еда влияет на настроение',
      category: 'psychology',
      published: true,
      readingTime: 10,
    },
  ]);

  // Видео (3 шт, ~15 мин)
  await Video.insertMany([
    {
      slug: '5-privychek-zdorovogo-pitaniya',
      title: '5 привычек здорового питания',
      description: 'Практическое руководство',
      duration: 900, // 15 минут
      category: 'nutrition',
      published: true,
    },
  ]);

  // Вебинар (1 шт)
  await Webinar.insertMany([
    {
      slug: 'garmoniya-tela-i-soznaniya',
      title: 'Гармония тела и сознания',
      description: 'Большой вебинар о здоровье',
      duration: 5400, // 90 минут
      accessType: 'free',
      published: true,
    },
  ]);

  // Кейсы (5-10 шт)
  await Case.insertMany([
    {
      slug: 'minus-10-kg-za-3-mesyaca',
      title: 'Минус 10 кг за 3 месяца',
      problem: 'Лишний вес, низкая энергия',
      results: [{ title: 'Похудение', value: '-10 кг', metric: 'за 3 месяца' }],
      published: true,
      featured: true,
    },
  ]);

  console.log('✅ Database seeded successfully');
  process.exit(0);
}

seed().catch(console.error);
```

---

**Версия документа:** 3.0  
**Дата утверждения:** 2025  
**База данных:** MongoDB  
**Статус:** Готово к разработке  
**Заказчик:** Нутрициолог/Health-коуч