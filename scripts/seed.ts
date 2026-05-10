/**
 * Seed скрипт для наполнения базы данных
 * Запуск: npm run seed
 */

// Используем createRequire для импорта dotenv
import {createRequire} from "module";
import path from "path";
import {fileURLToPath} from "url";

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка переменных окружения - ДОЛЖНО БЫТЬ В НАЧАЛЕ
const envPath = path.resolve(__dirname, "../.env.local");
require("dotenv").config({path: envPath});

// Теперь импортируем остальное ПОСЛЕ загрузки переменных окружения
import {connectDB} from "@/lib/db/connect";
import {Service} from "@/lib/db/models/Service";
import {Article} from "@/lib/db/models/Article";
import {Video} from "@/lib/db/models/Video";
import {Webinar} from "@/lib/db/models/Webinar";
import {Case} from "@/lib/db/models/Case";
import {Education} from "@/lib/db/models/Education";

// ============================================
// ЕДИНЫЙ ИСТОЧНИК ИСТИНЫ - ИЗОБРАЖЕНИЯ
// Все изображения проекта с Unsplash
// ============================================
const IMAGES = {
    // Услуги
    services: {
        nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
        healthCoaching: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop",
        slavicGymnastics: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=600&fit=crop",
    },
    // Статьи
    articles: {
        nutrition: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&h=600&fit=crop",
        psychology: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800&h=600&fit=crop",
    },
    // Видео
    videos: {
        nutrition: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop",
        wellness: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=600&fit=crop",
        gymnastics: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    },
    // Вебинары
    webinars: {
        default: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
    },
    // Кейсы
    cases: {
        weightLoss: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop&crop=face",  // Екатерина
        habits: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=600&fit=crop&crop=face",  // Анна
        energy: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&crop=face",  // Михаил (мужчина)
    },
    // Авторы
    authors: {
        ksenia: "/images/expert.jpeg", // Локальное фото эксперта
    },
};

async function seed() {
    try {
        await connectDB();

        console.log("🗑️  Очистка существующих данных...");
        await Promise.all([
            Service.deleteMany({}),
            Article.deleteMany({}),
            Video.deleteMany({}),
            Webinar.deleteMany({}),
            Case.deleteMany({}),
            Education.deleteMany({}),
        ]);

        console.log("✅ Очистка завершена");

        // ============================================
        // Услуги (Services)
        // ============================================
        console.log("📦 Создание услуг...");
        const services = await Service.insertMany([
            {
                slug: "nutrition",
                title: "Консультация",
                description: "Анализ образа жизни, поиск причин, конкретный план",
                fullDescription:
                    "Комплексная диагностическая консультация. Анализ текущего состояния здоровья, выявление корневых причин проблем, разработка персонального плана восстановления через работу с питанием, образом жизни и эмоциональным состоянием.",
                category: "nutrition",
                icon: "🥗",
                image: {
                    url: IMAGES.services.nutrition,
                    alt: "Нутрициология",
                },
                pricing: {
                    base: 5000,
                    premium: 10000,
                    vip: 20000,
                    currency: "RUB",
                },
                features: {
                    base: [
                        "Анкетирование и анализ рациона",
                        "Рекомендации по питанию",
                        "План питания на 7 дней",
                        "Чат поддержки 7 дней",
                    ],
                    premium: [
                        "Всё из базового тарифа",
                        "План питания на 14 дней",
                        "Список продуктов и рецептов",
                        "Коррекция плана по результатам",
                        "Чат поддержки 14 дней",
                        "2 видео-консультации по 60 мин",
                    ],
                    vip: [
                        "Всё из премиум тарифа",
                        "Индивидуальные добавки и витамины",
                        "План питания на 30 дней",
                        "Еженедельные созвоны",
                        "Чат поддержки 30 дней",
                        "4 видео-консультации по 60 мин",
                    ],
                },
                duration: {base: 60, premium: 90, vip: 120},
                format: ["online", "both"],
                available: true,
                popular: false,
                installmentsAvailable: true,
                minInstallmentAmount: 1500,
                order: 1,
                featured: true,
            },
            {
                slug: "health-coaching",
                title: "Путь к себе",
                description: "Глубокая работа над гормонами, эмоциями, границами и жизненными сценариями",
                fullDescription:
                    "Комплексная программа трансформации на 3-6 месяцев. Глубокая работа с образом жизни, привычками, мышлением и жизненными сценариями. Интеграция питания, движения, сна, управления стрессом и работа с психосоматикой.",
                category: "health_coaching",
                icon: "🎯",
                image: {
                    url: IMAGES.services.healthCoaching,
                    alt: "Health-коучинг",
                },
                pricing: {
                    base: 15000,
                    premium: 30000,
                    vip: 50000,
                    currency: "RUB",
                },
                features: {
                    base: [
                        "Глубокий анализ здоровья",
                        "Постановка целей и план действий",
                        "Работа с привычками",
                        "Чат поддержки 14 дней",
                        "2 видео-консультации по 60 мин",
                    ],
                    premium: [
                        "Всё из базового тарифа",
                        "Интеграция питания и образа жизни",
                        "Работа с мышлением и убеждениями",
                        "Чат поддержки 30 дней",
                        "4 видео-консультации по 60 мин",
                        "Доступ к закрытым материалам",
                    ],
                    vip: [
                        "Всё из премиум тарифа",
                        "Персональное сопровождение 3 месяца",
                        "Еженедельные созвоны",
                        "Экстренная поддержка в чате",
                        "8 видео-консультаций по 60 мин",
                        "Семейная консультация (1 сессия)",
                    ],
                },
                duration: {base: 60, premium: 90, vip: 120},
                format: ["online", "both"],
                available: true,
                popular: true,
                installmentsAvailable: true,
                minInstallmentAmount: 5000,
                order: 2,
                featured: true,
            },
            {
                slug: "psycho-session",
                title: "Психосессия",
                description: "Разбираемся в эмоциях и сценариях через глубокую работу",
                fullDescription:
                    "Индивидуальная работа с психологом для разрешения эмоциональных конфликтов, работа с родовыми сценариями и внутренними убеждениями.",
                category: "nutrition",
                icon: "💭",
                image: {
                    url: IMAGES.services.healthCoaching,
                    alt: "Психосессия",
                },
                pricing: {
                    base: 5000,
                    premium: 10000,
                    vip: 20000,
                    currency: "RUB",
                },
                features: {
                    base: [
                        "Глубокая консультация 90 минут",
                        "Анализ проблемы",
                        "Первые практики",
                        "Чат поддержки 7 дней",
                    ],
                    premium: [
                        "Всё из базового тарифа",
                        "Две консультации 90 минут",
                        "Домашние практики и упражнения",
                        "Обратная связь в чате",
                    ],
                    vip: [
                        "Всё из премиум тарифа",
                        "Четыре консультации",
                        "Персональная программа",
                        "Постоянная поддержка",
                    ],
                },
                duration: {base: 90, premium: 90, vip: 90},
                format: ["online", "both"],
                available: true,
                popular: false,
                installmentsAvailable: true,
                minInstallmentAmount: 1500,
                order: 1,
                featured: true,
            },
            {
                slug: "package-3-sessions",
                title: "Пакет 3 сессий",
                description: "Три встречи + чат между сессиями и личная поддержка",
                fullDescription:
                    "Комплексный пакет из трёх консультаций с сопровождением между ними. Включает чат-поддержку и корректировку плана по результатам.",
                category: "nutrition",
                icon: "📦",
                image: {
                    url: IMAGES.services.nutrition,
                    alt: "Пакет 3 сессий",
                },
                pricing: {
                    base: 12000,
                    premium: 20000,
                    vip: 35000,
                    currency: "RUB",
                },
                features: {
                    base: [
                        "3 консультации по 60 минут",
                        "Чат поддержки месяц",
                        "Личная поддержка",
                        "Корректировка по результатам",
                    ],
                    premium: [
                        "Всё из базового тарифа",
                        "Консультации по 90 минут",
                        "Расширенная чат поддержка",
                        "Дополнительные материалы",
                    ],
                    vip: [
                        "Всё из премиум тарифа",
                        "VIP приоритет в ответах",
                        "Боус сессия",
                        "Пожизненный доступ к материалам",
                    ],
                },
                duration: {base: 180, premium: 270, vip: 360},
                format: ["online", "both"],
                available: true,
                popular: false,
                installmentsAvailable: true,
                minInstallmentAmount: 3000,
                order: 2,
                featured: true,
            },
            {
                slug: "slavic-gymnastics",
                title: "Видео-комплекс",
                description: "Мягкие движения, расслабление тазового дна, работа с осанкой",
                fullDescription:
                    "Древние славянские практики для восстановления энергии, гибкости и внутреннего равновесия. Подходит для любого уровня подготовки.",
                category: "slavic_gymnastics",
                icon: "🧘",
                image: {
                    url: IMAGES.services.slavicGymnastics,
                    alt: "Видео-комплекс",
                },
                pricing: {
                    base: 3000,
                    premium: 8000,
                    vip: 15000,
                    currency: "RUB",
                },
                features: {
                    base: [
                        "Знакомство с практикой",
                        "Базовые упражнения",
                        "Видео-урок (60 мин)",
                        "Чек-лист по практике",
                    ],
                    premium: [
                        "Всё из базового тарифа",
                        "4 видео-урока (4 часа)",
                        "Аудио-сопровождение",
                        "Гайд по славянским практикам",
                        "Чат участников",
                        "1 групповой созвон",
                    ],
                    vip: [
                        "Всё из премиум тарифа",
                        "2 индивидуальные сессии по 60 мин",
                        "Персональная коррекция практики",
                        "Доступ ко всем материалам",
                        "Приглашение на ретрит (скидка 20%)",
                    ],
                },
                duration: {base: 60, premium: 90, vip: 120},
                format: ["online", "offline", "both"],
                available: true,
                popular: false,
                installmentsAvailable: true,
                minInstallmentAmount: 1000,
                order: 3,
                featured: true,
            },
            {
                slug: "gymnastics-with-consultation",
                title: "Комплекс + разбор",
                description: "Видео + встреча с индивидуальной адаптацией под вас",
                fullDescription:
                    "Полный комплекс славянских практик с персональной консультацией специалиста. Видео-материалы плюс индивидуальная работа с вашим телом и особенностями.",
                category: "slavic_gymnastics",
                icon: "🎯",
                image: {
                    url: IMAGES.services.slavicGymnastics,
                    alt: "Комплекс + разбор",
                },
                pricing: {
                    base: 8000,
                    premium: 15000,
                    vip: 25000,
                    currency: "RUB",
                },
                features: {
                    base: [
                        "Полный видео-комплекс",
                        "Одна индивидуальная встреча 60 мин",
                        "Персональная адаптация",
                        "Рекомендации по практике",
                    ],
                    premium: [
                        "Всё из базового тарифа",
                        "Две встречи по 60 минут",
                        "Расширенный гайд",
                        "Чат поддержки 14 дней",
                        "Видео-примеры упражнений",
                    ],
                    vip: [
                        "Всё из премиум тарифа",
                        "Четыре встречи по 60 минут",
                        "VIP поддержка в чате",
                        "Приглашение на мастер-класс",
                        "Персональная программа на месяц",
                    ],
                },
                duration: {base: 60, premium: 120, vip: 180},
                format: ["online", "offline", "both"],
                available: true,
                popular: false,
                installmentsAvailable: true,
                minInstallmentAmount: 2000,
                order: 4,
                featured: true,
            },
        ]);
        console.log(`✅ Создано ${services.length} услуг`);

        // ============================================
        // Статьи (Articles)
        // ============================================
        console.log("📝 Создание статей...");
        const articles = await Article.insertMany([
            {
                slug: "kak-pravilno-pitatsya-utrom",
                title: "Завтрак, который дает энергию на весь день: 5 правил",
                excerpt:
                    "Правильный завтрак — основа энергии и хорошего самочувствия. Разбираемся, как его организовать.",
                content: `
# Как правильно питаться утром

Завтрак — самый важный прием пищи дня. Он запускает метаболизм и дает энергию на несколько часов вперед.

## Правило 1: Белок с утра

Включите в завтрак источник белка: яйца, творог, рыбу или птицу.

## Правило 2: Сложные углеводы

Добавьте цельнозерновые продукты: овсянку, гречку, цельнозерновой хлеб.

## Правило 3: Клетчатка

Овощи, фрукты, ягоды — источник витаминов и клетчатки.

## Правило 4: Полезные жиры

Авокадо, орехи, семена, оливковое масло.

## Правило 5: Вода

Стакан теплой воды с лимоном натощак запускает пищеварение.

## Пример идеального завтрака

- Омлет с овощами
- Кусочек цельнозернового хлеба
- Половинка авокадо
- Ягоды
- Чай или кофе без сахара
        `,
                coverImage: {
                    url: IMAGES.articles.nutrition,
                    alt: "Здоровый завтрак",
                },
                author: {
                    name: "Ксения Каменская",
                    photo: "/images/authors/ksenia-kamenskaya.svg",
                },
                category: "nutrition",
                tags: ["завтрак", "питание", "здоровье"],
                published: true,
                readingTime: 7,
                featured: true,
                order: 1,
            },
            {
                slug: "svyaz-pitaniya-i-emociy",
                title: "Эмоции и еда: как гормоны влияют на ваше настроение",
                excerpt:
                    "Почему мы едим не только из голода? Как питание связано с эмоциональным состоянием и мышлением.",
                content: `
# Связь питания и эмоций

Еда влияет не только на физическое, но и на эмоциональное состояние.

## Серотонин и углеводы

Углеводы способствуют выработке серотонина — гормона счастья.

## Омега-3 и мозг

Жирные кислоты Омега-3 улучшают работу мозга и снижают риск депрессии.

## Витамин D и настроение

Дефицит витамина D связан с повышенным риском депрессии.

## Сахар и перепады настроения

Избыток сахара вызывает резкие скачки глюкозы и перепады настроения.
        `,
                coverImage: {
                    url: IMAGES.articles.psychology,
                    alt: "Эмоции и питание",
                },
                author: {
                    name: "Ксения Каменская",
                    photo: "/images/authors/ksenia-kamenskaya.svg",
                },
                category: "psychology",
                tags: ["психология", "эмоции", "питание"],
                published: true,
                readingTime: 10,
                featured: true,
                order: 2,
            },
            {
                slug: "top-5-vitaminov-dlya-energii",
                title: "Микронутриенты для энергии: какие витамины вам действительно нужны",
                excerpt:
                    "Недостаток каких витаминов приводит к усталости? Расскажем о 5 важнейших микронутриентах.",
                content: `
# Топ-5 витаминов для энергии

## 1. Витамин B12

Участвует в производстве энергии из пищи.

## 2. Витамин D

Дефицит вызывает усталость и слабость.

## 3. Железо

Необходимо для транспорта кислорода к клеткам.

## 4. Магний

Участвует в более чем 300 биохимических реакциях.

## 5. Витамин C

Поддерживает иммунную систему и помогает усвоению железа.
        `,
                coverImage: {
                    url: IMAGES.articles.nutrition,
                    alt: "Витамины для энергии",
                },
                author: {
                    name: "Ксения Каменская",
                    photo: "/images/authors/ksenia-kamenskaya.svg",
                },
                category: "nutrition",
                tags: ["витамины", "энергия", "здоровье"],
                published: true,
                readingTime: 5,
                featured: true,
                order: 3,
            },
        ]);
        console.log(`✅ Создано ${articles.length} статей`);

        // ============================================
        // Видео (Videos)
        // ============================================
        console.log("🎬 Создание видео...");
        const videos = await Video.insertMany([
            {
                slug: "5-privychek-zdorovogo-pitaniya",
                title: "5 ежедневных привычек для здоровья и энергии",
                description:
                    "Какие простые привычки изменят ваше самочувствие и дадут больше энергии на весь день",
                videoUrl: "https://www.youtube.com/watch?v=example1",
                thumbnail: {
                    url: IMAGES.videos.nutrition,
                    alt: "Привычки здорового питания",
                },
                duration: 900, // 15 минут
                category: "nutrition",
                tags: ["привычки", "питание", "здоровье"],
                published: true,
                featured: true,
                order: 1,
            },
            {
                slug: "meditaciya-dlya-nachinayuschih",
                title: "Медитация для расслабления: первая практика для начинающих",
                description:
                    "Как успокоить ум и тело? Простая техника релаксации для снятия стресса и эмоционального напряжения",
                videoUrl: "https://www.youtube.com/watch?v=example2",
                thumbnail: {
                    url: IMAGES.videos.wellness,
                    alt: "Медитация",
                },
                duration: 600, // 10 минут
                category: "wellness",
                tags: ["медитация", "стресс", "релаксация"],
                published: true,
                featured: true,
                order: 2,
            },
            {
                slug: "uprazhneniya-dlya-spiny",
                title: "Упражнения для спины и осанки: мягкая гимнастика",
                description:
                    "Простой комплекс мягких движений для расслабления спины, улучшения осанки и восстановления гибкости",
                videoUrl: "https://www.youtube.com/watch?v=example3",
                thumbnail: {
                    url: IMAGES.videos.gymnastics,
                    alt: "Упражнения для спины",
                },
                duration: 1200, // 20 минут
                category: "gymnastics",
                tags: ["спина", "упражнения", "здоровье"],
                published: true,
                featured: true,
                order: 3,
            },
        ]);
        console.log(`✅ Создано ${videos.length} видео`);

        // ============================================
        // Вебинары (Webinars)
        // ============================================
        console.log("📺 Создание вебинаров...");
        const webinars = await Webinar.insertMany([
            {
                slug: "garmoniya-tela-i-soznaniya",
                title: "Путь к себе: питание, движение и эмоции за 90 минут",
                description:
                    "Как три столпа здоровья — правильное питание, регулярное движение и управление эмоциями — работают вместе для вашей трансформации",
                recordingUrl: "https://www.youtube.com/watch?v=webinar1",
                thumbnail: {
                    url: IMAGES.webinars.default,
                    alt: "Гармония тела и сознания",
                },
                duration: 5400, // 90 минут
                originalDate: new Date("2025-01-15"),
                speaker: {
                    name: "Ксения Каменская",
                    photo: IMAGES.authors.ksenia,
                    bio: "Нутрициолог, health-коуч с 7-летним опытом",
                },
                topics: [
                    "Питание и энергия",
                    "Движение и гибкость",
                    "Мышление и привычки",
                    "Эмоциональное благополучие",
                ],
                published: true,
                accessType: "free",
                featured: true,
                order: 1,
            },
        ]);
        console.log(`✅ Создано ${webinars.length} вебинаров`);

        // ============================================
        // Кейсы (Cases)
        // ============================================
        console.log("📊 Создание кейсов...");
        const cases = await Case.insertMany([
            {
                slug: "minus-15-kg-za-4-mesyaca",
                title: "Минус 15 кг за 4 месяца без стресса",
                client: {
                    name: "Екатерина",
                    anonymized: false,
                    age: 32,
                    gender: "female",
                },
                problem:
                    "Лишний вес после родов, низкая энергия, проблемы с кожей и волосами",
                challenge:
                    "Необходимо было не просто похудеть, а восстановить здоровье и энергию",
                solution:
                    "Комплексный подход: коррекция питания, работа с дефицитами, изменение привычек",
                results: [
                    {title: "Похудение", value: "-15 кг", metric: "за 4 месяца"},
                    {title: "Энергия", value: "8/10", metric: "вместо 3/10"},
                    {title: "Анализы", value: "В норме", metric: "все показатели"},
                ],
                image: {
                    url: IMAGES.cases.weightLoss,
                    alt: "Снижение веса",
                },
                testimonial:
                    "Я наконец-то чувствую себя легко и энергично! Спасибо за индивидуальный подход и поддержку!",
                serviceName: "Health-коучинг",
                duration: "4 месяца",
                published: true,
                featured: true,
                consentGiven: true,
                order: 1,
            },
            {
                slug: "izbavlenie-ot-pischevogo-rasstroystva",
                title: "Избавление от пищевого расстройства",
                client: {
                    name: "Анна",
                    anonymized: false,
                    age: 28,
                    gender: "female",
                },
                problem:
                    "Компульсивное переедание, чувство вины после еды, низкая самооценка",
                challenge:
                    "Найти корень проблемы и научиться слышать сигналы голода и сытости",
                solution:
                    "Работа с психологией питания, интуитивное питание, поддержка в чате",
                results: [
                    {title: "Срывы", value: "0", metric: "за 3 месяца"},
                    {title: "Самооценка", value: "8/10", metric: "вместо 3/10"},
                    {title: "Отношения", value: "Гармония", metric: "с едой и телом"},
                ],
                image: {
                    url: IMAGES.cases.habits,
                    alt: "Пищевые привычки",
                },
                testimonial:
                    "Я научилась слышать свой организм и получать удовольствие от еды без чувства вины. Это изменило мою жизнь!",
                serviceName: "Нутрициология + Психология",
                duration: "3 месяца",
                published: true,
                featured: true,
                consentGiven: true,
                order: 2,
            },
            {
                slug: "vosstanovlenie-zdorovya-zhkt",
                title: "Восстановление здоровья ЖКТ",
                client: {
                    name: "Михаил",
                    anonymized: false,
                    age: 45,
                    gender: "male",
                },
                problem:
                    "Хронические проблемы с пищеварением после еды",
                challenge:
                    "После многих лет безуспешного лечения у врачей найти причину проблем",
                solution:
                    "Исключающая диета, поддержка пищеварения, работа со стрессом",
                results: [
                    {title: "Симптомы", value: "-90%", metric: "исчезли"},
                    {title: "Энергия", value: "Стабильная", metric: "весь день"},
                    {title: "Сон", value: "8 часов", metric: "без пробуждений"},
                ],
                image: {
                    url: IMAGES.cases.energy,
                    alt: "Энергия и здоровье",
                },
                testimonial:
                    "После многих лет безуспешного лечения у врачей я наконец-то нашел решение. Рекомендую!",
                serviceName: "Нутрициология",
                duration: "2 месяца",
                published: true,
                featured: true,
                consentGiven: true,
                order: 3,
            },
        ]);
        console.log(`✅ Создано ${cases.length} кейсов`);

        // ============================================
        // Образование (Education)
        // ============================================
        console.log("🎓 Создание записей об образовании...");
        const education = await Education.insertMany([
            {
                title: "Магистр нутрициологии",
                institution: "Политех СПб",
                degree: "Магистр",
                specialty: "Нутрициология",
                startDate: new Date("2020-09-01"),
                endDate: new Date("2022-06-30"),
                isCurrent: false,
                description:
                    "Фундаментальное образование в области нутрициологии и диетологии. Подготовила основу для комплексного понимания физиологии питания.",
                documents: [
                    {
                        type: "diploma",
                        url: "/documents/diploma-politex-spb.pdf",
                        name: "Диплом Политех СПб",
                    },
                ],
                order: 1,
                featured: true,
            },
            {
                title: "Аккредитованный специалист НАИС (2 категория)",
                institution: "НАИС",
                specialty: "Нутрициология",
                startDate: new Date("2017-01-15"),
                endDate: new Date("2018-06-30"),
                isCurrent: false,
                description:
                    "Профессиональная аккредитация в области нутрициологии",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-nais.pdf",
                        name: "Сертификат НАИС",
                    },
                ],
                order: 2,
                featured: true,
            },
            {
                title: "Сертифицированный психолог",
                institution: "Академия репарационной психологии и терапии (3 модуля)",
                specialty: "Психология пищевого поведения",
                startDate: new Date("2023-09-01"),
                endDate: new Date("2024" +
                    "-12-31"),
                isCurrent: false,
                description:
                    "Глубокое изучение психологии пищевого поведения и интеграция психологического подхода в нутрициологическую практику",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-psychology.pdf",
                        name: "Сертификат психолога",
                    },
                ],
                order: 3,
                featured: true,
            },
            {
                title: "Эксперт натуропатии (диетология и детоксикация)",
                institution: "Институт Bircham, США",
                specialty: "Натуропатия",
                startDate: new Date("2022-01-01"),
                endDate: new Date("2023-12-31"),
                isCurrent: false,
                description:
                    "Международная сертификация по натуропатии с направлением диетология и детоксикация организма",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-bircham.pdf",
                        name: "Сертификат Bircham",
                    },
                ],
                order: 4,
                featured: true,
            },
            {
                title: "Специалист по фитооздоровлению",
                institution: "НАМН",
                specialty: "Фитооздоровление",
                startDate: new Date("2021-06-01"),
                endDate: new Date("2022-06-30"),
                isCurrent: false,
                description:
                    "Профессиональная подготовка в области использования растительных средств и фитотерапии для оздоровления",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-fitoozdorovlenie.pdf",
                        name: "Сертификат НАМН",
                    },
                ],
                order: 5,
                featured: true,
            },
            {
                title: "Инструктор женской славянской гимнастики «Сила Берегини»",
                institution: "Центр славянских практик",
                specialty: "Инструктор славянской гимнастики",
                startDate: new Date("2020-09-01"),
                endDate: new Date("2022-06-30"),
                isCurrent: false,
                description:
                    "Сертификация инструктора женской славянской гимнастики. Древние практики для восстановления энергии, гибкости и гармонии с собственным телом.",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-gymnastics.pdf",
                        name: "Сертификат инструктора",
                    },
                ],
                order: 6,
                featured: true,
            },
            {
                title: "Психосоматика и телесная терапия (второе высшее)",
                institution: "Институт психосоматики и клинической психологии, Москва",
                degree: "Высшее образование",
                specialty: "Психосоматика",
                startDate: new Date("2026-09-01"),
                endDate: new Date("2030-06-30"),
                isCurrent: true,
                description:
                    "Программа второго высшего образования по психосоматике и телесной терапии. Интеграция психологического и соматического подходов к здоровью.",
                documents: [],
                order: 7,
                featured: true,
            },
        ]);
        console.log(`✅ Создано ${education.length} записей об образовании`);

        console.log("\n✅ ✅ ✅ Seed завершен успешно! ✅ ✅ ✅\n");
        console.log("📊 Итого создано:");
        console.log(`   - Услуг: ${services.length}`);
        console.log(`   - Статей: ${articles.length}`);
        console.log(`   - Видео: ${videos.length}`);
        console.log(`   - Вебинаров: ${webinars.length}`);
        console.log(`   - Кейсов: ${cases.length}`);
        console.log(`   - Образований: ${education.length}`);
        console.log("\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();
