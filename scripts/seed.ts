/**
 * Seed скрипт для наполнения базы данных
 * Запуск: npm run seed
 */

// Загрузка переменных окружения - ДО всех остальных импортов
import dotenv from "dotenv";
import path from "path";
import {fileURLToPath} from "url";
import {readFileSync} from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем .env.local вручную
const envPath = path.resolve(__dirname, "../.env.local");
const envContent = readFileSync(envPath, "utf-8");
const envLines = envContent.split("\n");

for (const line of envLines) {
    const match = line.match(/^([^#][^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, "");
        process.env[key] = value;
    }
}

import {connectDB} from "@/lib/db/connect";
import {Service} from "@/lib/db/models/Service";
import {Article} from "@/lib/db/models/Article";
import {Video} from "@/lib/db/models/Video";
import {Webinar} from "@/lib/db/models/Webinar";
import {Case} from "@/lib/db/models/Case";
import {Education} from "@/lib/db/models/Education";
import {Testimonial} from "@/lib/db/models/Testimonial";

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
            Testimonial.deleteMany({}),
        ]);

        console.log("✅ Очистка завершена");

        // ============================================
        // Услуги (Services)
        // ============================================
        console.log("📦 Создание услуг...");
        const services = await Service.insertMany([
            {
                slug: "nutrition",
                title: "Нутрициология",
                description: "Индивидуальный план питания и коррекция рациона",
                fullDescription:
                    "Комплексный подход к вашему питанию. Анализ текущего рациона, выявление дефицитов, составление индивидуального плана питания с учетом ваших предпочтений и образа жизни.",
                category: "nutrition",
                icon: "🥗",
                image: {
                    url: "/images/services/nutrition.jpg",
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
                title: "Health-коучинг",
                description: "Комплексное сопровождение к здоровью и энергии",
                fullDescription:
                    "Глубокая работа с образом жизни, привычками и мышлением. Помощь в достижении устойчивых изменений через интеграцию питания, движения, сна и управления стрессом.",
                category: "health_coaching",
                icon: "🎯",
                image: {
                    url: "/images/services/health-coaching.jpg",
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
                slug: "slavic-gymnastics",
                title: "Славянская гимнастика",
                description: "Телесные практики для гармонии души и тела",
                fullDescription:
                    "Древние славянские практики для восстановления энергии, гибкости и внутреннего равновесия. Подходит для любого уровня подготовки.",
                category: "slavic_gymnastics",
                icon: "🧘",
                image: {
                    url: "/images/services/slavic-gymnastics.jpg",
                    alt: "Славянская гимнастика",
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
        ]);
        console.log(`✅ Создано ${services.length} услуг`);

        // ============================================
        // Статьи (Articles)
        // ============================================
        console.log("📝 Создание статей...");
        const articles = await Article.insertMany([
            {
                slug: "kak-pravilno-pitatsya-utrom",
                title: "Как правильно питаться утром: 5 правил здорового завтрака",
                excerpt:
                    "Разбираем, каким должен быть идеальный завтрак для энергии и хорошего настроения на весь день.",
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
                    url: "/images/articles/breakfast.jpg",
                    alt: "Здоровый завтрак",
                },
                author: {
                    name: "Ксения Каменская",
                    photo: "/images/author.jpg",
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
                title: "Связь питания и эмоций: как еда влияет на настроение",
                excerpt:
                    "Научный взгляд на то, как различные продукты влияют на наше эмоциональное состояние.",
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
                    url: "/images/articles/emotions.jpg",
                    alt: "Эмоции и питание",
                },
                author: {
                    name: "Ксения Каменская",
                    photo: "/images/author.jpg",
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
                title: "Топ-5 витаминов для энергии и бодрости",
                excerpt:
                    "Какие витамины и микроэлементы необходимы для поддержания высокого уровня энергии.",
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
                    url: "/images/articles/vitamins.jpg",
                    alt: "Витамины для энергии",
                },
                author: {
                    name: "Ксения Каменская",
                    photo: "/images/author.jpg",
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
                title: "5 привычек здорового питания",
                description:
                    "Практическое руководство по формированию полезных привычек",
                videoUrl: "https://www.youtube.com/watch?v=example1",
                thumbnail: {
                    url: "/images/videos/habits.jpg",
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
                title: "Медитация для начинающих",
                description:
                    "Простая техника для снятия стресса и улучшения концентрации",
                videoUrl: "https://www.youtube.com/watch?v=example2",
                thumbnail: {
                    url: "/images/videos/meditation.jpg",
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
                title: "Упражнения для здоровой спины",
                description:
                    "Комплекс упражнений для снятия напряжения с позвоночника",
                videoUrl: "https://www.youtube.com/watch?v=example3",
                thumbnail: {
                    url: "/images/videos/back.jpg",
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
                title: "Гармония тела и сознания: большой вебинар о здоровье",
                description:
                    "Комплексный подход к здоровью: питание, движение, мышление и эмоциональное благополучие.",
                recordingUrl: "https://www.youtube.com/watch?v=webinar1",
                thumbnail: {
                    url: "/images/webinars/harmony.jpg",
                    alt: "Гармония тела и сознания",
                },
                duration: 5400, // 90 минут
                originalDate: new Date("2025-01-15"),
                speaker: {
                    name: "Ксения Каменская",
                    photo: "/images/author.jpg",
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
                title: "Минус 15 кг за 4 месяца",
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
                    anonymized: true,
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
                    "Хронические проблемы с пищеварением, вздутие, усталость после еды",
                challenge:
                    "После многих лет безуспешного лечения у врачей найти причину проблем",
                solution:
                    "Исключающая диета, поддержка пищеварения, работа со стрессом",
                results: [
                    {title: "Симптомы", value: "-90%", metric: "исчезли"},
                    {title: "Энергия", value: "Стабильная", metric: "весь день"},
                    {title: "Сон", value: "8 часов", metric: "без пробуждений"},
                ],
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
                title: "Нутрициология и диетология",
                institution: "Московский Государственный Университет",
                degree: "Магистр",
                specialty: "Диетология",
                startDate: new Date("2015-09-01"),
                endDate: new Date("2017-06-30"),
                isCurrent: false,
                description:
                    "Фундаментальное образование в области нутрициологии и диетологии",
                documents: [
                    {
                        type: "diploma",
                        url: "/documents/diploma-msu.pdf",
                        name: "Диплом МГУ",
                    },
                ],
                order: 1,
                featured: true,
            },
            {
                title: "Международная сертификация INM",
                institution: "Institute for Nutrition Medicine",
                specialty: "Нутрициология",
                startDate: new Date("2018-01-15"),
                endDate: new Date("2019-06-30"),
                isCurrent: false,
                description:
                    "Международная сертификация в области нутрициологии",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-inm.pdf",
                        name: "Сертификат INM",
                    },
                ],
                order: 2,
                featured: true,
            },
            {
                title: "Health-коучинг",
                institution: "International Coach Federation",
                specialty: "Коучинг здоровья",
                startDate: new Date("2020-01-10"),
                endDate: new Date("2021-06-30"),
                isCurrent: false,
                description:
                    "Сертификация в области health-коучинга",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-icf.pdf",
                        name: "Сертификат ICF",
                    },
                ],
                order: 3,
                featured: true,
            },
            {
                title: "Психология питания",
                institution: "Школа психологии питания",
                specialty: "Психология пищевого поведения",
                startDate: new Date("2019-09-01"),
                endDate: new Date("2020-06-30"),
                isCurrent: false,
                description:
                    "Изучение психологии пищевого поведения и работы с расстройствами",
                documents: [
                    {
                        type: "course",
                        url: "/documents/course-psychology.pdf",
                        name: "Сертификат о курсе",
                    },
                ],
                order: 4,
                featured: false,
            },
            {
                title: "Славянская гимнастика",
                institution: "Центр славянских практик",
                specialty: "Инструктор славянской гимнастики",
                startDate: new Date("2021-01-15"),
                endDate: new Date("2022-06-30"),
                isCurrent: false,
                description:
                    "Сертификация инструктора славянской гимнастики",
                documents: [
                    {
                        type: "certificate",
                        url: "/documents/certificate-gymnastics.pdf",
                        name: "Сертификат инструктора",
                    },
                ],
                order: 5,
                featured: true,
            },
            {
                title: "Функциональная медицина",
                institution: "Институт функциональной медицины",
                specialty: "Основы функционального подхода",
                startDate: new Date("2022-09-01"),
                endDate: new Date("2023-06-30"),
                isCurrent: false,
                description:
                    "Изучение функционального подхода к здоровью",
                documents: [
                    {
                        type: "course",
                        url: "/documents/certificate-ifm.pdf",
                        name: "Сертификат IFM",
                    },
                ],
                order: 6,
                featured: false,
            },
        ]);
        console.log(`✅ Создано ${education.length} записей об образовании`);

        // ============================================
        // Отзывы (Testimonials)
        // ============================================
        console.log("💬 Создание отзывов...");
        const testimonials = await Testimonial.insertMany([
            {
                author: {
                    name: "Екатерина М.",
                    anonymized: false,
                },
                rating: 5,
                title: "Лучшее решение в моей жизни!",
                content:
                    "Обратилась с проблемой лишнего веса после родов. За 4 месяца не только похудела на 15 кг, но и полностью изменила отношение к питанию. Энергия зашкаливает, кожа сияет, волосы блестят! Спасибо за индивидуальный подход и постоянную поддержку!",
                serviceName: "Health-коучинг",
                verified: true,
                published: true,
                featured: true,
                consentGiven: true,
                order: 1,
            },
            {
                author: {
                    name: "Анна К.",
                    anonymized: true,
                },
                rating: 5,
                title: "Наконец-то гармония с едой",
                content:
                    "Долгие годы страдала от компульсивного переедания. Перепробовала всё: диеты, психологи, кодирование... Ничего не работало надолго. Только здесь я поняла корень проблемы и научилась слышать свой организм. 3 месяца без срывов!",
                serviceName: "Нутрициология + Психология",
                verified: true,
                published: true,
                featured: true,
                consentGiven: true,
                order: 2,
            },
            {
                author: {
                    name: "Михаил Д.",
                    anonymized: false,
                },
                rating: 5,
                title: "Здоровье ЖКТ восстановлено",
                content:
                    "После многих лет безуспешного лечения у гастроэнтерологов обратился за помощью. Через 2 месяца симптомы ушли на 90%. Просто изменил питание по рекомендациям. Жалею только об одном — что не обратился раньше!",
                serviceName: "Нутрициология",
                verified: true,
                published: true,
                featured: true,
                consentGiven: true,
                order: 3,
            },
            {
                author: {
                    name: "Ольга П.",
                    anonymized: false,
                },
                rating: 5,
                title: "Славянская гимнастика — это чудо!",
                content:
                    "В 50 лет я чувствую себя лучше, чем в 40! Боли в спине ушли, появилась гибкость, энергия бьет ключом. А главное — научилась расслабляться и получать удовольствие от движения. Рекомендую всем!",
                serviceName: "Славянская гимнастика",
                verified: true,
                published: true,
                featured: true,
                consentGiven: true,
                order: 4,
            },
            {
                author: {
                    name: "Ирина С.",
                    anonymized: true,
                },
                rating: 5,
                title: "Профессиональный подход",
                content:
                    "Очень понравился комплексный подход. Не просто дали список продуктов, а разобрали весь образ жизни: сон, стресс, движение, питание. Результат превзошел ожидания. Минус 8 кг и полное изменение качества жизни!",
                serviceName: "Нутрициология",
                verified: true,
                published: true,
                featured: true,
                consentGiven: true,
                order: 5,
            },
            {
                author: {
                    name: "Дмитрий В.",
                    anonymized: false,
                },
                rating: 5,
                title: "Энергия вернулась!",
                content:
                    "Постоянная усталость стала нормой жизни. После консультации и коррекции питания энергия вернулась на такой уровень, что я снова начал тренироваться. Это невероятно! Спасибо!",
                serviceName: "Health-коучинг",
                verified: true,
                published: true,
                featured: true,
                consentGiven: true,
                order: 6,
            },
        ]);
        console.log(`✅ Создано ${testimonials.length} отзывов`);

        console.log("\n✅ ✅ ✅ Seed завершен успешно! ✅ ✅ ✅\n");
        console.log("📊 Итого создано:");
        console.log(`   - Услуг: ${services.length}`);
        console.log(`   - Статей: ${articles.length}`);
        console.log(`   - Видео: ${videos.length}`);
        console.log(`   - Вебинаров: ${webinars.length}`);
        console.log(`   - Кейсов: ${cases.length}`);
        console.log(`   - Образований: ${education.length}`);
        console.log(`   - Отзывов: ${testimonials.length}`);
        console.log("\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seed failed:", error);
        process.exit(1);
    }
}

seed();
