"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    variant?: "default" | "hover";
}

export function GlassCard({
    title,
    children,
    className,
    variant = "default",
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "glass neu-flat rounded-3xl p-6 md:p-7 my-4 relative overflow-hidden transition-all duration-300",
                className
            )}
            {...(props as any)}
        >
            {/* Decorative gradient blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

            {title && (
                <h3 className="text-lg font-black mb-4 text-slate-900 border-b-4 border-primary/10 pb-2">
                    {title}
                </h3>
            )}

            <div className="relative z-10 text-slate-950 leading-relaxed font-bold text-lg">
                {children}
            </div>
        </motion.div>
    );
}
