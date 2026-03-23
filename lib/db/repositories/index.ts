/**
 * Индексный файл для экспорта всех репозиториев
 * 
 * Лучшие практики:
 * - bundle-barrel-imports: Экспортируем явно для tree-shaking
 */

// Контентные репозитории
export * from "./service.repository";
export * from "./article.repository";
export * from "./video.repository";
export * from "./webinar.repository";
export * from "./case.repository";
export * from "./education.repository";
export * from "./testimonial.repository";

// Бизнес репозитории
export * from "./user.repository";
export * from "./order.repository";
export * from "./receipt.repository";
export * from "./consent.repository";

// Singleton экземпляры для удобного импорта
export {serviceRepository} from "./service.repository";
export {articleRepository} from "./article.repository";
export {videoRepository} from "./video.repository";
export {webinarRepository} from "./webinar.repository";
export {caseRepository} from "./case.repository";
export {educationRepository} from "./education.repository";
export {testimonialRepository} from "./testimonial.repository";
export {userRepository} from "./user.repository";
export {orderRepository} from "./order.repository";
export {receiptRepository} from "./receipt.repository";
export {consentRepository} from "./consent.repository";
