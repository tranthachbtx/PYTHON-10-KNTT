"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { List, X, Hash } from "lucide-react";

interface Heading {
    id: string;
    text: string;
    level: number;
}

export function ContentPanel() {
    const [headings, setHeadings] = useState<Heading[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);
    const sidebarNavRef = React.useRef<HTMLElement>(null);

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

    // Auto-scroll sidebar when active item changes
    useEffect(() => {
        if (activeId && sidebarNavRef.current) {
            const activeElement = sidebarNavRef.current.querySelector(`[href="#${activeId}"]`);
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                });
            }
        }
    }, [activeId]);

    if (headings.length === 0) return null;

    // Calculate progression percentage based on active index
    const activeIndex = headings.findIndex(h => h.id === activeId);
    const progress = headings.length > 0 ? ((activeIndex + 1) / headings.length) * 100 : 0;

    return (
        <>
            {/* Desktop Side Panel - Ultra Premium Redesign */}
            <div className="hidden xl:flex fixed right-0 top-0 bottom-0 w-80 z-40 flex-col border-l border-white/20 bg-white/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
                {/* Visual Progress Bar - Subtle Vertical Line */}
                <div className="absolute left-0 top-0 w-1 bg-slate-200/30 h-full overflow-hidden">
                    <motion.div
                        className="w-full bg-primary shadow-[0_0_20px_rgba(14,165,233,1)]"
                        initial={{ height: 0 }}
                        animate={{ height: `${progress}%` }}
                        transition={{ type: "spring", damping: 30, stiffness: 50 }}
                    />
                </div>

                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <span className="font-black text-[9px] uppercase tracking-[0.4em] text-primary">On this page</span>
                    </div>
                    <h3 className="font-display font-black text-2xl text-slate-950 tracking-tight">Mục lục</h3>
                </div>

                <nav
                    ref={sidebarNavRef}
                    className="flex-1 overflow-y-auto px-5 py-2 space-y-1 custom-scrollbar scroll-smooth"
                >
                    {headings.map((heading) => (
                        <a
                            key={heading.id}
                            href={`#${heading.id}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className={cn(
                                "flex items-start gap-4 py-2 px-4 rounded-[1.2rem] transition-all duration-500 relative group/item",
                                heading.level === 3 ? "ml-6 opacity-80" : "font-black",
                                activeId === heading.id
                                    ? "bg-white text-slate-950 shadow-neu-flat scale-[1.02] -translate-x-1 border border-white/80"
                                    : "text-slate-500 hover:text-slate-950 hover:bg-white/40"
                            )}
                        >
                            {activeId === heading.id && (
                                <motion.div
                                    layoutId="toc-indicator-line"
                                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(14,165,233,0.6)]"
                                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                />
                            )}

                            <div className={cn(
                                "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500 border-2",
                                activeId === heading.id
                                    ? "bg-primary border-primary scale-125 shadow-[0_0_10px_rgba(14,165,233,1)]"
                                    : "bg-transparent border-slate-300 group-hover/item:border-slate-400"
                            )} />

                            <span className={cn(
                                "text-[13px] leading-tight transition-all",
                                activeId === heading.id ? "font-black" : "font-bold opacity-70 group-hover/item:opacity-100"
                            )}>
                                {heading.text}
                            </span>
                        </a>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/20 bg-white/20 backdrop-blur-xl">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">
                        <span>Tiến trình đọc</span>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-950">{Math.round(progress)}%</span>
                        </div>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary via-blue-400 to-indigo-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                        />
                    </div>
                </div>
            </div>

            {/* Mobile Floating Toggle - Redefined for Impact */}
            <div className="xl:hidden fixed right-6 bottom-24 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-16 h-16 rounded-[2.2rem] flex items-center justify-center shadow-2xl transition-all duration-500 border-4 border-white active:scale-90 relative overflow-hidden",
                        isOpen ? "bg-slate-950 text-white rotate-90" : "glass text-slate-950"
                    )}
                >
                    {isOpen ? <X size={28} /> : (
                        <div className="relative">
                            <List size={28} />
                            {progress > 0 && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                </div>
                            )}
                        </div>
                    )}
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40, x: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40, x: 20 }}
                            className="absolute bottom-24 right-0 w-[88vw] max-w-[380px] glass overflow-hidden rounded-[3.5rem] border border-white/80 shadow-[0_50px_120px_rgba(0,0,0,0.3)] backdrop-blur-3xl"
                        >
                            <div className="p-10 bg-slate-950 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                                <div className="relative z-10 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                                        <Hash size={28} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-2xl tracking-tight leading-none mb-1">Cấu trúc bài</h2>
                                        <p className="text-[11px] uppercase font-bold text-white/40 tracking-[0.2em]">{headings.length} PHẦN NỘI DUNG</p>
                                    </div>
                                </div>
                            </div>

                            <nav className="max-h-[55vh] overflow-y-auto p-8 space-y-2 custom-scrollbar pr-4">
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
                                            "flex items-start gap-5 p-4 rounded-[1.8rem] transition-all duration-300",
                                            heading.level === 3 ? "ml-8 scale-95 opacity-80" : "font-black",
                                            activeId === heading.id
                                                ? "bg-slate-950 text-white shadow-2xl scale-[1.02] translate-x-1"
                                                : "bg-white/50 text-slate-700 border border-white/40 hover:bg-white"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-1.5 w-2 h-2 rounded-full shrink-0",
                                            activeId === heading.id ? "bg-primary shadow-[0_0_15px_rgba(14,165,233,1)] scale-125" : "bg-slate-300"
                                        )} />
                                        <span className="text-base leading-tight">{heading.text}</span>
                                    </a>
                                ))}
                            </nav>

                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiến độ hiện tại</span>
                                <span className="text-sm font-black text-slate-950">{Math.round(progress)}%</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
