"use client";

import {memo} from "react";
import {motion, Variants} from "framer-motion";
import {ReactNode} from "react";

interface StaggerChildrenProps {
    children: ReactNode;
    className?: string;
    staggerDelay?: number;
    delay?: number;
}

const itemVariants: Variants = {
    hidden: {opacity: 0, y: 20},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.4, 0.25, 1],
        },
    },
};

export const StaggerChildren = memo(function StaggerChildren({
    children,
    className = "",
    staggerDelay = 0.1,
    delay = 0,
}: StaggerChildrenProps) {
    return (
        <motion.div
            variants={{
                hidden: {opacity: 0},
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren: delay,
                    },
                },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{once: true, margin: "-50px"}}
            className={className}
        >
            {children}
        </motion.div>
    );
});

export const StaggerItem = memo(function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <motion.div variants={itemVariants} className={className}>
            {children}
        </motion.div>
    );
});
