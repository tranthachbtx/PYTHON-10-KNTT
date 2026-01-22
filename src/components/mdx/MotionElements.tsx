"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// 🛡️ DEEP SYSTEM AUDIT: Using 'export function' to prevent Turbopack name mangling (k is not defined)
export function MotionH2(props: any) {
    return (
        <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
                "text-4xl font-black mt-10 mb-5 scroll-m-20 pb-4 border-b-4 border-primary/20 text-slate-950 flex items-center gap-3",
                props.className
            )}
            {...props}
        />
    );
}

export function MotionH3(props: any) {
    return (
        <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
                "text-3xl font-black mt-8 mb-4 text-slate-900",
                props.className
            )}
            {...props}
        />
    );
}

export function MotionTable({ children, ...props }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, scale: 1.01 }}
            className="my-10 w-full overflow-x-auto rounded-[2.5rem] border-2 border-black/5 shadow-float bg-white/60 backdrop-blur-md"
        >
            <table className="w-full text-lg text-left border-collapse" {...props}>
                {children}
            </table>
        </motion.div>
    );
}
