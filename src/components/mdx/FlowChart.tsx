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
    const baseStyles = "relative p-4 rounded-xl shadow-lg flex items-center justify-center text-center font-bold text-sm min-w-[160px] min-h-[60px] border backdrop-blur-md transition-all duration-300";

    const types = {
        start: "bg-emerald-100 border-emerald-500 text-emerald-700 rounded-full shadow-sm",
        process: "bg-blue-100 border-blue-500 text-blue-700 rounded-lg shadow-sm",
        action: "bg-purple-100 border-purple-500 text-purple-700 rounded-lg shadow-sm",
        end: "bg-rose-100 border-rose-500 text-rose-700 rounded-full shadow-sm",
    };

    const safeStyle = (types as any)[type] || types.process;

    if (type === "decision") {
        return (
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative p-6 flex items-center justify-center group my-2"
            >
                {/* SVG Diamond Background for perfect shape */}
                <div className="absolute inset-0 z-0 scale-[1.15]">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full drop-shadow-md">
                        <polygon
                            points="50,0 100,50 50,100 0,50"
                            className="fill-amber-100/95 stroke-amber-500 stroke-[3px]"
                        />
                    </svg>
                </div>
                <div className="relative z-10 px-10 py-6 text-center font-black text-amber-800 max-w-[180px] leading-tight text-lg">
                    {label}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            className={cn(baseStyles, safeStyle, className)}
        >
            {type === "start" && <Play size={14} className="mr-2 fill-current" />}
            {type === "end" && <XCircle size={14} className="mr-2" />}
            {label}
        </motion.div>
    );
}

interface FlowArrowProps {
    label?: string;
    className?: string;
}

export function FlowArrow({ label, className }: FlowArrowProps) {
    return (
        <div className={cn("flex flex-col items-center my-2", className)}>
            {label && <span className="text-[10px] uppercase font-bold text-gray-400 mb-1">{label}</span>}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 32, opacity: 1 }}
                className="w-[2px] bg-gradient-to-b from-primary/50 to-secondary/50 relative"
            >
                <ArrowDown className="absolute -bottom-2 -left-[6px] text-secondary" size={14} />
            </motion.div>
        </div>
    );
}

export function FlowChart({ type = "for_loop" }: { type?: string }) {
    if (type === "for_loop") {
        return (
            <div className="flex flex-col items-center p-6 my-6 glass rounded-2xl border border-white/10 shadow-neu-flat overflow-hidden">
                <FlowNode label="Bắt đầu vòng lặp" type="start" />

                <FlowArrow />

                <FlowNode label="Lấy giá trị tiếp theo" type="process" />

                <FlowArrow />

                <div className="flex flex-col items-center">
                    <FlowNode label="Còn giá trị?" type="decision" />

                    <div className="flex gap-8 mt-4">
                        <div className="flex flex-col items-center">
                            <FlowArrow label="Có" />
                            <FlowNode label="Thực hiện khối lệnh" type="action" />
                            <div className="mt-4 flex flex-col items-center text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full border border-slate-200/50">
                                <RefreshCcw size={18} className="animate-spin-slow mb-1 text-primary" />
                                <span className="text-xs font-black uppercase tracking-wider">Lặp lại</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <FlowArrow label="Hết" />
                            <FlowNode label="Kết thúc" type="end" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "while_loop") {
        return (
            <div className="flex flex-col items-center p-6 my-6 glass rounded-2xl border border-white/10 shadow-neu-flat overflow-hidden">
                <div className="flex flex-col items-center">
                    <FlowNode label="Kiểm tra điều kiện" type="decision" />

                    <div className="flex gap-12 md:gap-20 mt-6 md:mt-10">
                        <div className="flex flex-col items-center">
                            <FlowArrow label="Đúng (True)" />
                            <FlowNode label="Thực hiện khối lệnh" type="action" />
                            <div className="mt-4 flex flex-col items-center text-slate-500 bg-slate-100/50 px-3 py-1 rounded-full border border-slate-200/50">
                                <RefreshCcw size={18} className="animate-spin-slow mb-1 text-primary" />
                                <span className="text-xs font-black uppercase tracking-wider">Kiểm tra lại</span>
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
            <div className="flex flex-col items-center p-6 my-6 glass rounded-2xl border border-white/10 shadow-neu-flat overflow-hidden">
                <div className="flex flex-col items-center">
                    <FlowNode label="Điều kiện?" type="decision" />

                    <div className="flex gap-12 md:gap-20 mt-6 md:mt-10">
                        <div className="flex flex-col items-center">
                            <FlowArrow label="Đúng (True)" />
                            <FlowNode label="Câu lệnh 1" type="action" />
                        </div>

                        <div className="flex flex-col items-center">
                            <FlowArrow label="Sai (False)" />
                            <FlowNode label="Câu lệnh 2" type="end" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
