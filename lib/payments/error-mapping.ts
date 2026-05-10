/**
 * Маппирование ошибок платежных систем в пользовательские сообщения
 * Преобразует ошибки от YooKassa/PayKeeper в понятные UI сообщения
 */

export enum PaymentErrorCode {
  // Пользовательские ошибки (5xx)
  INVALID_AMOUNT = "invalid_amount",
  INVALID_CURRENCY = "invalid_currency",
  INVALID_EMAIL = "invalid_email",
  INVALID_PHONE = "invalid_phone",
  DUPLICATE_PAYMENT = "duplicate_payment",

  // Системные ошибки (4xx)
  PROVIDER_UNAVAILABLE = "provider_unavailable",
  RATE_LIMIT_EXCEEDED = "rate_limit_exceeded",
  NETWORK_ERROR = "network_error",
  TIMEOUT = "timeout",
  INVALID_RESPONSE = "invalid_response",

  // Финансовые ошибки
  INSUFFICIENT_FUNDS = "insufficient_funds",
  CARD_EXPIRED = "card_expired",
  CARD_BLOCKED = "card_blocked",
  DECLINED = "declined",
  LIMIT_EXCEEDED = "limit_exceeded",
  DAILY_LIMIT = "daily_limit",

  // Прочие ошибки
  REFUND_FAILED = "refund_failed",
  PAYMENT_CANCELED = "payment_canceled",
  UNKNOWN = "unknown",
}

interface UserFriendlyError {
  code: PaymentErrorCode;
  title: string;
  message: string;
  retryable: boolean;
  suggestContactSupport: boolean;
}

/**
 * Маппинг YooKassa ошибок
 */
function mapYooKassaError(errorCode: string, errorDescription: string): PaymentErrorCode {
  const description = errorDescription.toLowerCase();

  // Валидация
  if (description.includes("invalid") || description.includes("bad request")) {
    if (description.includes("amount")) return PaymentErrorCode.INVALID_AMOUNT;
    if (description.includes("currency")) return PaymentErrorCode.INVALID_CURRENCY;
    if (description.includes("email")) return PaymentErrorCode.INVALID_EMAIL;
    if (description.includes("phone")) return PaymentErrorCode.INVALID_PHONE;
  }

  // Финансовые ошибки
  if (description.includes("insufficient") || description.includes("funds")) {
    return PaymentErrorCode.INSUFFICIENT_FUNDS;
  }
  if (description.includes("expired")) {
    return PaymentErrorCode.CARD_EXPIRED;
  }
  if (description.includes("blocked") || description.includes("lock")) {
    return PaymentErrorCode.CARD_BLOCKED;
  }
  if (description.includes("declined") || description.includes("refuse")) {
    return PaymentErrorCode.DECLINED;
  }
  if (description.includes("limit") && !description.includes("rate")) {
    return PaymentErrorCode.LIMIT_EXCEEDED;
  }

  // Системные ошибки
  if (
    description.includes("timeout") ||
    description.includes("504") ||
    description.includes("timeout")
  ) {
    return PaymentErrorCode.TIMEOUT;
  }
  if (description.includes("429")) {
    return PaymentErrorCode.RATE_LIMIT_EXCEEDED;
  }

  return PaymentErrorCode.UNKNOWN;
}

/**
 * Маппинг PayKeeper ошибок
 */
function mapPayKeeperError(errorCode: string, errorMessage: string): PaymentErrorCode {
  const message = errorMessage.toLowerCase();

  // Валидация
  if (errorCode === "INVALID_PARAMETER") {
    if (message.includes("amount")) return PaymentErrorCode.INVALID_AMOUNT;
    if (message.includes("email")) return PaymentErrorCode.INVALID_EMAIL;
    if (message.includes("phone")) return PaymentErrorCode.INVALID_PHONE;
  }

  // Финансовые ошибки
  if (errorCode === "INSUFFICIENT_FUNDS") {
    return PaymentErrorCode.INSUFFICIENT_FUNDS;
  }
  if (errorCode === "CARD_EXPIRED") {
    return PaymentErrorCode.CARD_EXPIRED;
  }
  if (errorCode === "CARD_BLOCKED") {
    return PaymentErrorCode.CARD_BLOCKED;
  }
  if (errorCode === "DECLINED" || errorCode === "DECLINED_BY_BANK") {
    return PaymentErrorCode.DECLINED;
  }

  // Системные
  if (errorCode === "TIMEOUT") {
    return PaymentErrorCode.TIMEOUT;
  }
  if (errorCode === "RATE_LIMIT") {
    return PaymentErrorCode.RATE_LIMIT_EXCEEDED;
  }

  return PaymentErrorCode.UNKNOWN;
}

/**
 * Получить user-friendly сообщение об ошибке
 */
export function getErrorMessage(errorCode: PaymentErrorCode): UserFriendlyError {
  const messages: Record<PaymentErrorCode, UserFriendlyError> = {
    [PaymentErrorCode.INVALID_AMOUNT]: {
      code: PaymentErrorCode.INVALID_AMOUNT,
      title: "Некорректная сумма",
      message: "Проверьте сумму платежа и попробуйте снова",
      retryable: false,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.INVALID_CURRENCY]: {
      code: PaymentErrorCode.INVALID_CURRENCY,
      title: "Валюта не поддерживается",
      message: "Платежи возможны только в рублях",
      retryable: false,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.INVALID_EMAIL]: {
      code: PaymentErrorCode.INVALID_EMAIL,
      title: "Некорректный email",
      message: "Проверьте email и попробуйте снова",
      retryable: false,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.INVALID_PHONE]: {
      code: PaymentErrorCode.INVALID_PHONE,
      title: "Некорректный номер телефона",
      message: "Проверьте номер телефона и попробуйте снова",
      retryable: false,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.INSUFFICIENT_FUNDS]: {
      code: PaymentErrorCode.INSUFFICIENT_FUNDS,
      title: "Недостаточно средств",
      message: "На карте недостаточно средств. Пополните счет и попробуйте снова",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.CARD_EXPIRED]: {
      code: PaymentErrorCode.CARD_EXPIRED,
      title: "Карта истекла",
      message: "Срок действия карты истек. Используйте другую карту",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.CARD_BLOCKED]: {
      code: PaymentErrorCode.CARD_BLOCKED,
      title: "Карта заблокирована",
      message: "Ваша карта заблокирована. Обратитесь в банк",
      retryable: false,
      suggestContactSupport: true,
    },
    [PaymentErrorCode.DECLINED]: {
      code: PaymentErrorCode.DECLINED,
      title: "Платеж отклонен",
      message: "Банк отклонил платеж. Попробуйте другую карту",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.LIMIT_EXCEEDED]: {
      code: PaymentErrorCode.LIMIT_EXCEEDED,
      title: "Превышен лимит",
      message: "Вы превысили лимит на транзакцию или суточный лимит",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.DAILY_LIMIT]: {
      code: PaymentErrorCode.DAILY_LIMIT,
      title: "Суточный лимит исчерпан",
      message: "Вы исчерпали суточный лимит. Попробуйте завтра",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.PROVIDER_UNAVAILABLE]: {
      code: PaymentErrorCode.PROVIDER_UNAVAILABLE,
      title: "Платежный сервис недоступен",
      message: "Платежный сервис временно недоступен. Попробуйте позже",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.RATE_LIMIT_EXCEEDED]: {
      code: PaymentErrorCode.RATE_LIMIT_EXCEEDED,
      title: "Слишком много попыток",
      message: "Вы пытались создать платеж слишком много раз. Подождите несколько минут",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.NETWORK_ERROR]: {
      code: PaymentErrorCode.NETWORK_ERROR,
      title: "Ошибка сети",
      message: "Проверьте интернет соединение и попробуйте снова",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.TIMEOUT]: {
      code: PaymentErrorCode.TIMEOUT,
      title: "Истекло время ожидания",
      message: "Платежный сервис не ответил вовремя. Попробуйте снова",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.INVALID_RESPONSE]: {
      code: PaymentErrorCode.INVALID_RESPONSE,
      title: "Ошибка обработки",
      message: "Ошибка при обработке платежа. Попробуйте снова",
      retryable: true,
      suggestContactSupport: true,
    },
    [PaymentErrorCode.DUPLICATE_PAYMENT]: {
      code: PaymentErrorCode.DUPLICATE_PAYMENT,
      title: "Платеж уже создан",
      message: "Платеж с таким ID уже создан",
      retryable: false,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.REFUND_FAILED]: {
      code: PaymentErrorCode.REFUND_FAILED,
      title: "Ошибка возврата",
      message: "Не удалось обработать возврат. Обратитесь в поддержку",
      retryable: false,
      suggestContactSupport: true,
    },
    [PaymentErrorCode.PAYMENT_CANCELED]: {
      code: PaymentErrorCode.PAYMENT_CANCELED,
      title: "Платеж отменен",
      message: "Платеж был отменен. Попробуйте снова",
      retryable: true,
      suggestContactSupport: false,
    },
    [PaymentErrorCode.UNKNOWN]: {
      code: PaymentErrorCode.UNKNOWN,
      title: "Ошибка платежа",
      message: "Произошла ошибка при обработке платежа. Попробуйте позже",
      retryable: true,
      suggestContactSupport: true,
    },
  };

  return messages[errorCode] || messages[PaymentErrorCode.UNKNOWN];
}

/**
 * Конвертировать ошибку платежной системы в пользовательское сообщение
 */
export function convertPaymentError(
  error: Error | string,
  provider?: string
): UserFriendlyError {
  let errorCode = PaymentErrorCode.UNKNOWN;

  if (typeof error === "string") {
    if (provider === "yookassa") {
      errorCode = mapYooKassaError("", error);
    } else if (provider === "paykeeper") {
      errorCode = mapPayKeeperError("", error);
    }
  } else if (error instanceof Error) {
    // Попытка распарсить структурированное сообщение об ошибке
    const message = error.message;
    if (provider === "yookassa") {
      errorCode = mapYooKassaError("", message);
    } else if (provider === "paykeeper") {
      errorCode = mapPayKeeperError("", message);
    }
  }

  return getErrorMessage(errorCode);
}
