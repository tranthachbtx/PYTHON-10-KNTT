"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { List, ChevronRight, Hash } from "lucide-react";

interface Heading {
    id: string;
    text: string;
    level: number;
}

export function ContentPanel() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const elements = Array.from(document.querySelectorAll("h2, h3"))
            .map((elem) => ({
                id: elem.id,
                text: elem.textContent || "",
                level: Number(elem.tagName.replace("H", "")),
            }))
            .filter((h) => h.id);

        setHeadings(elements);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "-100px 0px -66%" }
        );

        elements.forEach((h) => {
            const el = document.getElementById(h.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <>
            {/* Desktop Side Panel */}
            <div className="hidden xl:block fixed right-8 top-32 w-64 z-40">
                <div className="glass p-6 rounded-[2.5rem] border border-white/40 shadow-float">
                    <div className="flex items-center gap-3 mb-6 px-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-black/10">
                            <List size={16} />
                        </div>
                        <span className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Nội dung</span>
                    </div>

                    <nav className="space-y-1">
                        {headings.map((heading) => (
                            <a
                                key={heading.id}
                                href={`#${heading.id}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                                }}
                                className={cn(
                                    "flex items-start gap-2 py-2 px-3 rounded-xl transition-all duration-300 group",
                                    heading.level === 3 ? "ml-4" : "",
                                    activeId === heading.id
                                        ? "bg-slate-900 text-white shadow-lg translate-x-1"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                                )}
                            >
                                <div className={cn(
                                    "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all",
                                    activeId === heading.id ? "bg-primary scale-150" : "bg-slate-300 group-hover:bg-slate-400"
                                )} />
                                <span className={cn(
                                    "text-[13px] font-bold leading-tight",
                                    activeId === heading.id ? "font-black" : ""
                                )}>
                                    {heading.text}
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Floating Toggle */}
            <div className="xl:hidden fixed right-6 bottom-24 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all border-4 border-white active:scale-90",
                        isOpen ? "bg-slate-950 text-white rotate-90" : "glass text-slate-900"
                    )}
                >
                    <List size={24} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="absolute bottom-20 right-0 w-72 glass p-6 rounded-[2.5rem] border border-white/60 shadow-2xl backdrop-blur-3xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <span className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Mục lục nhanh</span>
                            </div>
                            <div className="max-h-[50vh] overflow-y-auto space-y-2 custom-scrollbar pr-2">
                                {headings.map((heading) => (
                                    <a
                                        key={heading.id}
                                        href={`#${heading.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                                            setIsOpen(false);
                                        }}
                                        className={cn(
                                            "flex items-start gap-4 p-3 rounded-2xl transition-all",
                                            heading.level === 3 ? "ml-4" : "",
                                            activeId === heading.id
                                                ? "bg-slate-900 text-white shadow-xl"
                                                : "bg-white/40 text-slate-600"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-1.5 w-2 h-2 rounded-full shrink-0 shadow-inner",
                                            activeId === heading.id ? "bg-primary shadow-[0_0_8px_rgba(14,165,233,0.8)]" : "bg-slate-200"
                                        )} />
                                        <span className="text-sm font-bold leading-tight">{heading.text}</span>
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
