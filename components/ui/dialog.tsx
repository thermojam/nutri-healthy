"use client";

import * as React from "react";
import {cn} from "@/lib/utils";

interface DialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Dialog({children}: DialogProps) {
    return <>{children}</>;
}

interface DialogContentProps {
    children: React.ReactNode;
    className?: string;
}

export function DialogContent({children, className}: DialogContentProps) {
    return (
        <div className={cn("fixed inset-0 z-50 flex items-center justify-center p-4", className)}>
            {children}
        </div>
    );
}
