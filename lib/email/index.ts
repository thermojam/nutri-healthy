/**
 * Email Service - Индексный файл
 * 
 * Экспорт всех шаблонов и сервисов
 */

// Unisender Go сервис
export * from "./unisender-go";

// Шаблоны
export {EmailTemplate, EmailButton, EmailDivider, EmailSection} from "./templates/base";
export {AdminNewOrderTemplate} from "./templates/admin-new-order";
export {ClientWelcomeTemplate} from "./templates/client-welcome";
export {ClientOrderConfirmTemplate} from "./templates/client-order-confirm";
export {ClientReceiptTemplate} from "./templates/client-receipt";
export {TestEmailTemplate} from "./templates/test-email";
