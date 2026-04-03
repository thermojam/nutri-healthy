import {useState, useEffect} from "react";
import {Users, Award, Star} from "lucide-react";
import {useCountUp} from "@/lib/hooks/use-count-up";

interface AnimatedStatsProps {
    stats: {
        value: string;
        label: string;
    }[];
    mobileVertical?: boolean;
}

const statIcons = [Users, Award, Star];

export function AnimatedStats({stats, mobileVertical = false}: AnimatedStatsProps) {
    // Парсим значения для анимации
    const parseValue = (value: string): {end: number; suffix: string} => {
        const num = parseInt(value.replace(/\D/g, ""), 10);
        const suffix = value.replace(/[\d]/g, "");
        return {end: num || 0, suffix};
    };

    return (
        <div className={mobileVertical
            ? "flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8"
            : "flex items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8"
        }>
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
                        mobileVertical={mobileVertical}
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
    mobileVertical?: boolean;
}

function StatItem({icon: Icon, end, suffix, label, delay, mobileVertical = false}: StatItemProps) {
    const {count, ref, formatted} = useCountUp({
        end,
        duration: 4000,
        suffix,
        startOnView: true,
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            ref={ref}
            className={mobileVertical
                ? "flex flex-col sm:flex-row items-center sm:items-center gap-1.5 sm:gap-2 md:gap-3"
                : "flex items-center gap-1.5 sm:gap-2 md:gap-3"
            }
            style={{animationDelay: `${delay}s`}}
        >
            {/* Иконка - круглая без тени */}
            <div className="relative flex-shrink-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 text-white"/>
                </div>
            </div>

            {/* Число и подпись */}
            <div className={mobileVertical
                ? "flex flex-col items-center sm:items-center"
                : "flex flex-col"
            }>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight">
                    {mounted ? formatted : ""}
                </p>
                <p className="text-[10px] sm:text-xs text-white/80 leading-tight text-center lg:text-left font-medium">
                    {label}
                </p>
            </div>
        </div>
    );
}
