import {Users, Award, Star} from "lucide-react";
import {useCountUp} from "@/lib/hooks/use-count-up";

interface AnimatedStatsProps {
    stats: {
        value: string;
        label: string;
    }[];
}

const statIcons = [Users, Award, Star];

export function AnimatedStats({stats}: AnimatedStatsProps) {
    // Парсим значения для анимации
    const parseValue = (value: string): {end: number; suffix: string} => {
        const num = parseInt(value.replace(/\D/g, ""), 10);
        const suffix = value.replace(/[\d]/g, "");
        return {end: num || 0, suffix};
    };

    return (
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8 pt-4">
            {stats.map((stat, index) => {
                const {end, suffix} = parseValue(stat.value);
                const Icon = statIcons[index] || Star;

                return (
                    <StatItem
                        key={stat.label}
                        icon={Icon}
                        end={end}
                        suffix={suffix}
                        label={stat.label}
                        delay={index * 0.15}
                    />
                );
            })}
        </div>
    );
}

interface StatItemProps {
    icon: React.ElementType;
    end: number;
    suffix: string;
    label: string;
    delay: number;
}

function StatItem({icon: Icon, end, suffix, label, delay}: StatItemProps) {
    const {count, ref, formatted} = useCountUp({
        end,
        duration: 2000,
        suffix,
        startOnView: true,
    });

    return (
        <div
            ref={ref}
            className="flex items-center gap-2 sm:gap-3"
            style={{animationDelay: `${delay}s`}}
        >
            {/* Иконка с градиентом */}
            <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary"/>
                </div>
                {/* Glow эффект */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"/>
            </div>

            {/* Число и подпись */}
            <div className="flex flex-col">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {formatted}
                </p>
                <p className="text-[10px] sm:text-xs text-muted leading-tight">
                    {label}
                </p>
            </div>
        </div>
    );
}
