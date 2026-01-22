"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowDown, Play, RefreshCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlowNodeProps {
    label: string;
    type: "start" | "process" | "decision" | "end" | "action";
    className?: string;
}

// 🛡️ DEEP SYSTEM AUDIT: Named functions to prevent serialization errors
export function FlowNode({ label, type, className }: FlowNodeProps) {
    const baseStyles = "relative p-5 rounded-2xl shadow-xl flex items-center justify-center text-center font-bold text-sm min-w-[180px] min-h-[70px] border backdrop-blur-md transition-all duration-500 hover:shadow-primary/20";

    const types = {
        start: "bg-sky-400 border-sky-300 text-white shadow-[4px_4px_10px_rgba(56,189,248,0.3),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-full",
        process: "bg-white/70 dark:bg-slate-800/70 border-white/40 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 shadow-neu-flat backdrop-blur-xl",
        action: "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-400 text-white shadow-[0_10px_20px_rgba(99,102,241,0.3)]",
        end: "bg-rose-400 border-rose-300 text-white shadow-[4px_4px_10px_rgba(251,113,133,0.3),-4px_-4px_10px_rgba(255,255,255,0.8)] rounded-full",
    };

    const safeStyle = (types as any)[type] || types.process;

    if (type === "decision") {
        return (
            <motion.div
                whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
                className="relative p-10 flex items-center justify-center group my-4"
            >
                <div className="absolute inset-0 z-0 scale-[1.2]">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            <linearGradient id="diamond-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fcd34d" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                        </defs>
                        <polygon
                            points="50,0 100,50 50,100 0,50"
                            className="fill-amber-50 stroke-amber-500 stroke-[2px] dark:fill-amber-900/20"
                        />
                    </svg>
                </div>
                <div className="relative z-10 px-8 py-4 text-center font-black text-amber-900 dark:text-amber-400 max-w-[180px] leading-tight text-base uppercase tracking-tight">
                    {label}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={cn(baseStyles, safeStyle, className)}
        >
            {type === "start" && <Play size={16} className="mr-3 fill-current" />}
            {type === "end" && <XCircle size={16} className="mr-3" />}
            <span className="uppercase tracking-wide">{label}</span>
        </motion.div>
    );
}

interface FlowArrowProps {
    label?: string;
    className?: string;
    color?: string;
}

export function FlowArrow({ label, className, color }: FlowArrowProps) {
    return (
        <div className={cn("flex flex-col items-center my-4 group", className)}>
            {label && (
                <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-[0.15em] mb-3 shadow-sm border backdrop-blur-md transition-all",
                        label.includes("Đúng") || label.includes("Có") || label.includes("True")
                            ? "bg-sky-50/80 border-sky-200 text-sky-600 dark:bg-sky-950/30 dark:border-sky-800 dark:text-sky-400"
                            : "bg-salmon-50/80 border-salmon-200 text-salmon-600 dark:bg-rose-950/30 dark:border-rose-800 dark:text-rose-400"
                    )}
                >
                    {label}
                </motion.span>
            )}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 45, opacity: 1 }}
                className={cn("w-[4px] rounded-full relative", color || "bg-slate-300 dark:bg-slate-700")}
            >
                <div className="absolute -bottom-2 -left-[5px]">
                    <ArrowDown
                        className={cn(
                            "transition-colors",
                            label?.includes("Đúng") || label?.includes("Có") || label?.includes("True") ? "text-sky-500" : (label ? "text-salmon-500" : "text-slate-400")
                        )}
                        size={14}
                        strokeWidth={4}
                    />
                </div>
            </motion.div>
        </div>
    );
}

export function FlowChart({ type = "for_loop" }: { type?: string }) {
    if (type === "for_loop") {
        return (
            <div className="flex flex-col items-center p-8 my-10 glass-card rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -ml-20 -mb-20 blur-3xl" />

                <FlowNode label="Bắt đầu" type="start" />
                <FlowArrow />
                <FlowNode label="Khởi tạo biến lặp" type="process" />
                <FlowArrow />

                <div className="relative flex flex-col items-center p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[3rem] bg-white/30 dark:bg-black/20">
                    <div className="absolute -top-3 px-4 bg-white dark:bg-slate-900 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Khối lặp FOR</div>
                    <FlowNode label="Còn giá trị trong range?" type="decision" />

                    <div className="flex gap-16 md:gap-24 mt-8">
                        <div className="flex flex-col items-center relative">
                            <FlowArrow label="Đúng (Có)" />
                            <FlowNode label="Thực hiện khối lệnh" type="action" />

                            <div className="mt-8 flex flex-col items-center p-4 rounded-3xl bg-primary/5 border border-primary/10">
                                <RefreshCcw size={20} className="animate-spin-slow mb-2 text-primary" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary">Tự động tăng bước nhảy & Lặp lại</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <FlowArrow label="Sai (Hết)" />
                            <FlowNode label="Kết thúc" type="end" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "while_loop") {
        return (
            <div className="flex flex-col items-center p-8 my-10 glass-card rounded-[2.5rem] border border-white/20 shadow-2xl relative bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col items-center">
                    <FlowNode label="Kiểm tra điều kiện" type="decision" />

                    <div className="flex gap-16 md:gap-24 mt-8">
                        <div className="flex flex-col items-center group">
                            <FlowArrow label="Đúng (True)" />
                            <FlowNode label="Thực hiện khối lệnh" type="action" />

                            <div className="mt-8 flex flex-col items-center p-5 rounded-3xl bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 translate-y-2">
                                <RefreshCcw size={24} className="animate-spin-slow mb-2 text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Quay lại kiểm tra điều kiện</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <FlowArrow label="Sai (False)" />
                            <FlowNode label="Kết thúc" type="end" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "if_else") {
        return (
            <div className="flex flex-col items-center p-8 my-10 glass-card rounded-[2.5rem] border border-white/20 shadow-2xl relative bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex flex-col items-center">
                    <FlowNode label="Điều kiện?" type="decision" />

                    <div className="flex gap-16 md:gap-24 mt-8">
                        <div className="flex flex-col items-center">
                            <FlowArrow label="Đúng (True)" />
                            <FlowNode label="Câu lệnh 1" type="action" />
                            <FlowArrow />
                            <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600" />
                        </div>

                        <div className="flex flex-col items-center">
                            <FlowArrow label="Sai (False)" />
                            <FlowNode label="Câu lệnh 2" type="process" />
                            <FlowArrow />
                            <div className="w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-600" />
                        </div>
                    </div>

                    <div className="mt-4 text-[10px] font-bold uppercase text-slate-400 tracking-widest">Tiếp tục chương trình</div>
                </div>
            </div>
        );
    }

    return null;
}
