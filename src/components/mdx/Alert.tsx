"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface AlertProps {
    children: React.ReactNode;
    type?: "info" | "success" | "warning" | "error" | "danger" | "tip" | "idea" | "memo";
    title?: string;
    className?: string;
}

const icons = {
    info: Info,
    success: CheckCircle2,
    warning: AlertCircle,
    error: XCircle,
    danger: AlertCircle,
    tip: CheckCircle2,
    idea: Info,
    memo: AlertCircle,
};

const styles = {
    info: "bg-[#f0f9ff] text-blue-950 border-blue-200",
    success: "bg-[#f5fff7] text-emerald-950 border-emerald-200",
    warning: "bg-[#fffdf0] text-amber-950 border-amber-200",
    error: "bg-[#fffafa] text-rose-950 border-rose-200",
    danger: "bg-[#fffafa] text-red-950 border-red-200",
    tip: "bg-[#f5f3ff] text-indigo-950 border-indigo-200",
    idea: "bg-[#fbf7ff] text-violet-950 border-violet-200",
    memo: "bg-[#f0fdfa] text-teal-950 border-teal-200",
};

export function Alert({ children, type = "info", title, className }: AlertProps) {
    const safeType = icons[type] ? type : "info";
    const Icon = icons[safeType];
    const styleClass = styles[safeType];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex gap-4 p-6 md:p-7 rounded-3xl border-2 shadow-float transition-all my-4 focus-ring-hover",
                styleClass,
                className
            )}
        >
            <div className="shrink-0 mt-1">
                <Icon size={28} />
            </div>
            <div className="flex-1">
                {title && <h5 className="font-black text-lg mb-2 uppercase tracking-wider">{title}</h5>}
                <div className="text-lg leading-relaxed font-bold opacity-90">
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
