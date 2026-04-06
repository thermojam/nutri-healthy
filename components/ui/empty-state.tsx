import {ReactNode} from "react";
import {Inbox, FileX, HelpCircle, SearchX} from "lucide-react";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";

/**
 * Empty State компонент
 * 
 * Лучшие практики:
 * - rendering-hoist-jsx: Статические иконки вынесены
 * - rerender-memo: memo для предотвращения лишних ререндеров
 */

interface EmptyStateProps {
    icon?: "inbox" | "file" | "search" | "help" | ReactNode;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

const ICONS = {
    inbox: <Inbox className="h-12 w-12" />,
    file: <FileX className="h-12 w-12" />,
    search: <SearchX className="h-12 w-12" />,
    help: <HelpCircle className="h-12 w-12" />,
} as const;

/**
 * Empty State для отображения пустого состояния
 */
export function EmptyState({
    icon = "inbox",
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    const iconNode = typeof icon === "string" ? ICONS[icon as keyof typeof ICONS] : icon;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 text-center",
                className
            )}
        >
            <div className="text-muted mb-4">{iconNode}</div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-muted mb-4 max-w-md">{description}</p>
            )}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}

/**
 * Empty State для списка
 */
export function EmptyList({
    title = "Список пуст",
    description = "Здесь пока ничего нет",
    actionText,
    onAction,
}: {
    title?: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
}) {
    return (
        <EmptyState
            icon="inbox"
            title={title}
            description={description}
            action={
                actionText && onAction ? (
                    <Button onClick={onAction}>{actionText}</Button>
                ) : null
            }
        />
    );
}

/**
 * Empty State для поиска
 */
export function EmptySearch({query}: {query?: string}) {
    return (
        <EmptyState
            icon="search"
            title="Ничего не найдено"
            description={
                query
                    ? `По запросу "${query}" результатов не найдено`
                    : "Попробуйте изменить параметры поиска"
            }
        />
    );
}

/**
 * Empty State для 404
 */
export function NotFound({title = "Страница не найдена"}: {title?: string}) {
    return (
        <EmptyState
            icon="file"
            title={title}
            description="Извините, мы не смогли найти эту страницу"
            action={
                <Button onClick={() => window.history.back()}>
                    Вернуться назад
                </Button>
            }
        />
    );
}
