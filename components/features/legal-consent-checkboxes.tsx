"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { LEGAL_VERSIONS } from "@/lib/validations";

interface LegalConsentCheckboxesProps {
  className?: string;
  required?: boolean;
  // Значения из формы
  personalDataConsent?: boolean;
  marketingConsent?: boolean;
  contractAcceptance?: boolean;
  marketingChannels?: ("email" | "sms" | "telegram" | "whatsapp")[];
  // Callbacks
  onPersonalDataChange?: (checked: boolean) => void;
  onMarketingChange?: (checked: boolean) => void;
  onContractChange?: (checked: boolean) => void;
  onMarketingChannelsChange?: (channels: ("email" | "sms" | "telegram" | "whatsapp")[]) => void;
  // Кастомные тексты
  personalDataText?: string;
  marketingText?: string;
  contractText?: string;
}

/**
 * Компонент чекбоксов согласий (152-ФЗ требование)
 * Обязателен для всех форм сбора персональных данных
 */
export function LegalConsentCheckboxes({
  className,
  required = true,
  personalDataConsent = false,
  marketingConsent = false,
  contractAcceptance = false,
  marketingChannels = [],
  onPersonalDataChange,
  onMarketingChange,
  onContractChange,
  onMarketingChannelsChange,
  personalDataText,
  marketingText,
  contractText,
}: LegalConsentCheckboxesProps) {
  const handleChannelChange = (channel: "email" | "sms" | "telegram" | "whatsapp") => {
    if (!onMarketingChannelsChange) return;
    
    const newChannels = marketingChannels.includes(channel)
      ? marketingChannels.filter((c) => c !== channel)
      : [...marketingChannels, channel];
    
    onMarketingChannelsChange(newChannels);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Обязательное согласие на обработку персональных данных */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="personalDataConsent"
          checked={personalDataConsent}
          onCheckedChange={onPersonalDataChange}
          required={required}
          className="mt-1"
        />
        <label
          htmlFor="personalDataConsent"
          className="text-sm text-muted leading-relaxed cursor-pointer"
        >
          {personalDataText || (
            <>
              Я даю согласие на обработку{" "}
              <a
                href="/legal/personal-data-consent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                персональных данных
              </a>{" "}
              и принимаю условия{" "}
              <a
                href="/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                политики конфиденциальности
              </a>
              {required && <span className="text-error">*</span>}
            </>
          )}
        </label>
      </div>

      {/* Обязательное согласие с договором оферты */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="contractAcceptance"
          checked={contractAcceptance}
          onCheckedChange={onContractChange}
          required={required}
          className="mt-1"
        />
        <label
          htmlFor="contractAcceptance"
          className="text-sm text-muted leading-relaxed cursor-pointer"
        >
          {contractText || (
            <>
              Я принимаю условия{" "}
              <a
                href="/legal/contract"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                договора публичной оферты
              </a>
              {required && <span className="text-error">*</span>}
            </>
          )}
        </label>
      </div>

      {/* Опциональное согласие на маркетинг */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="marketingConsent"
          checked={marketingConsent}
          onCheckedChange={onMarketingChange}
          className="mt-1"
        />
        <label
          htmlFor="marketingConsent"
          className="text-sm text-muted leading-relaxed cursor-pointer"
        >
          {marketingText || (
            <>
              Я хочу получать полезные материалы, новости и специальные предложения по email
              {!required && <span className="text-muted"> (необязательно)</span>}
            </>
          )}
        </label>
      </div>

      {/* Каналы маркетинговых коммуникаций */}
      {marketingConsent && (
        <div className="pl-8 space-y-2 animate-fade-in">
          <p className="text-sm text-muted">Выберите удобные каналы связи:</p>
          <div className="flex flex-wrap gap-4">
            {[
              { id: "email", label: "Email" },
              { id: "telegram", label: "Telegram" },
              { id: "whatsapp", label: "WhatsApp" },
              { id: "sms", label: "SMS" },
            ].map((channel) => (
              <label
                key={channel.id}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={marketingChannels.includes(
                    channel.id as "email" | "sms" | "telegram" | "whatsapp"
                  )}
                  onCheckedChange={() =>
                    handleChannelChange(
                      channel.id as "email" | "sms" | "telegram" | "whatsapp"
                    )
                  }
                />
                {channel.label}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Версии документов (для прозрачности) */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted">
          Версии документов: Оферта v{LEGAL_VERSIONS.contract}, Персональные данные v{LEGAL_VERSIONS.personalDataConsent}
        </p>
      </div>
    </div>
  );
}

/**
 * Упрощенная версия только с обязательными согласиями
 * Для форм где не нужен маркетинг
 */
export function MinimalConsentCheckboxes({
  className,
  onPersonalDataChange,
  onContractChange,
  personalDataConsent = false,
  contractAcceptance = false,
}: {
  className?: string;
  onPersonalDataChange?: (checked: boolean) => void;
  onContractChange?: (checked: boolean) => void;
  personalDataConsent?: boolean;
  contractAcceptance?: boolean;
}) {
  return (
    <LegalConsentCheckboxes
      className={className}
      personalDataConsent={personalDataConsent}
      contractAcceptance={contractAcceptance}
      onPersonalDataChange={onPersonalDataChange}
      onContractChange={onContractChange}
      marketingConsent={false}
    />
  );
}
