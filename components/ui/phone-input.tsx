import * as React from "react";
import {IMaskInput} from "react-imask";
import {cn} from "@/lib/utils";

interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value?: string;
    onChange?: (value: string) => void;
    error?: boolean;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
    ({className, value = "", onChange, error, ...props}, ref) => {
        // Проверяем, заполнена ли маска полностью
        const isCompleteMask = (v: string) => /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v);
        const isEmptyMask = (v: string) => v === "+7 (___) ___-__-__" || v === "";

        return (
            <IMaskInput
                mask="+{7} (000) 000-00-00"
                placeholder="+7 (999) 123-45-67"
                value={value}
                onAccept={(maskedValue: string) => {
                    // Если маска пустая — передаём пустую строку
                    if (isEmptyMask(maskedValue)) {
                        onChange?.("");
                    } else if (isCompleteMask(maskedValue)) {
                        onChange?.(maskedValue);
                    }
                    // Неполная маска — ничего не делаем
                }}
                overwrite
                lazy={false}
                className={cn(
                    "flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm transition-colors",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    error && "border-error focus-visible:ring-error",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
PhoneInput.displayName = "PhoneInput";

export {PhoneInput};
