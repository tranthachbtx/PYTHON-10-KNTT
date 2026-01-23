"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface CodeBlockProps {
    children: React.ReactNode;
    language?: string;
    className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const getText = (node: any): string => {
        if (!node) return "";
        if (typeof node === "string") return node;
        if (Array.isArray(node)) return node.map(getText).join("");
        if (node.props && node.props.children) return getText(node.props.children);
        return "";
    };

    const handleCopy = () => {
        const text = getText(children);
        if (!text) return;
        navigator.clipboard.writeText(text.trim());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("my-6 relative group not-prose", className)}
        >
            {/* Darkened Gray Background - Scientific Look - Fluid Padding */}
            <div className="relative rounded-2xl bg-[#1e293b] border border-slate-700/50 p-4 md:p-6 transition-all duration-300 hover:bg-[#233044] shadow-2xl focus-ring-hover">

                {/* Floating Copy Button - Subtle */}
                <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "p-2.5 rounded-xl transition-all shadow-lg border",
                            copied
                                ? "bg-emerald-500 text-white border-emerald-400"
                                : "bg-slate-700/80 text-slate-300 hover:text-white border-slate-600 hover:bg-slate-600"
                        )}
                        title="Sao chép"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>

                {/* Code Content - Scientific Size & High Contrast */}
                <div className="overflow-x-auto custom-scrollbar scrollbar-pastel relative z-10 text-slate-100">
                    <pre className="font-mono text-base md:text-lg lg:text-xl leading-normal !bg-transparent !p-0">
                        <code className="hljs !bg-transparent !p-0 block whitespace-pre">
                            {children}
                        </code>
                    </pre>
                </div>

                {/* Optional: Small Language Tag if needed, very subtle */}
                <div className="absolute bottom-4 right-6 pointer-events-none opacity-20">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] font-sans italic text-slate-400">Python Script</span>
                </div>
            </div>
        </motion.div>
    );
}
