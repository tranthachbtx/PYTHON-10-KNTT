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
        const queryElements = () => {
            const elements = Array.from(document.querySelectorAll("h2, h3, h4, li, p > strong:first-child"))
                .map((elem) => {
                    let id = elem.id;
                    let text = elem.textContent || "";
                    let level = 0;

                    if (elem.tagName.startsWith("H")) {
                        level = Number(elem.tagName.replace("H", ""));
                    } else if (elem.tagName === "LI" || elem.tagName === "STRONG") {
                        // Check if it's an important list item or label (1., 2., a), b), etc.)
                        const isSection = /^[0-9a-z]\s*[.\)]/.test(text.trim());
                        const isLabel = elem.tagName === "STRONG" && text.includes(":") && text.length < 50;

                        if (isSection || isLabel) {
                            level = elem.tagName === "LI" ? 4 : 5;
                            // Ensure ID exists for navigation
                            if (!id) {
                                id = "point-" + text.trim().toLowerCase()
                                    .replace(/[^a-z0-9]/g, "-")
                                    .slice(0, 30);
                                elem.id = id;
                            }
                        } else {
                            return null;
                        }
                    }

                    return { id, text: text.trim(), level };
                })
                .filter((h): h is Heading => h !== null && !!h.id);

            // Filter out duplicates and keep order
            const uniqueElements = elements.filter((h, index) =>
                elements.findIndex(item => item.id === h.id) === index
            );

            setHeadings(uniqueElements);

            // Re-setup observer for all unique elements
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

            uniqueElements.forEach((h) => {
                const el = document.getElementById(h.id);
                if (el) observer.observe(el);
            });

            return observer;
        };

        const observer = queryElements();

        return () => observer?.disconnect();
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
            {/* Desktop Side Panel - Neomorphic Card Style */}
            <div className="hidden xl:flex fixed right-0 top-1 bottom-1 w-80 z-40 flex-col">
                <div
                    className="flex-1 flex flex-col overflow-hidden bg-white/90 backdrop-blur-xl rounded-l-[40px] shadow-[-20px_0_60px_rgba(0,0,0,0.05)] border-l border-y border-white"
                >
                    <div className="pt-6" />

                    <nav
                        ref={sidebarNavRef}
                        className="flex-1 overflow-y-auto px-6 py-4 space-y-2 custom-scrollbar scroll-smooth"
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
                                    "flex items-start gap-4 py-3 px-5 rounded-[2rem] transition-all duration-500 relative group/item",
                                    "font-black leading-tight",
                                    heading.level === 2 ? "text-[17px]" :
                                        heading.level === 3 ? "ml-6 text-[15px]" :
                                            heading.level === 4 ? "ml-10 text-[14px]" :
                                                "ml-14 text-[13px]",
                                    activeId === heading.id
                                        ? "bg-slate-950 text-yellow-400 shadow-2xl scale-[1.05] -translate-x-1"
                                        : heading.level === 2
                                            ? "text-red-500 hover:text-red-700 hover:bg-black/5"
                                            : "text-slate-500 hover:text-slate-950 hover:bg-black/5"
                                )}
                            >
                                {activeId === heading.id && (
                                    <motion.div
                                        layoutId="toc-indicator-line"
                                        className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                                    />
                                )}

                                <div className={cn(
                                    "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500 border-2",
                                    activeId === heading.id
                                        ? "bg-yellow-400 border-yellow-400 scale-125 shadow-[0_0_10px_rgba(250,204,21,1)]"
                                        : heading.level === 2
                                            ? "bg-red-100 border-red-500"
                                            : "bg-transparent border-slate-300 group-hover/item:border-slate-400"
                                )} />

                                <span className="leading-tight transition-all">
                                    {heading.text}
                                </span>
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Mobile Floating Toggle - Kept for UX */}
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
                            className="absolute bottom-24 right-0 w-[88vw] max-w-[380px] bg-white overflow-hidden rounded-[50px] border border-white shadow-[20px_20px_60px_rgba(0,0,0,0.05),-20px_-20px_60px_#ffffff] backdrop-blur-3xl"
                        >
                            <div className="p-10 bg-slate-950 text-white relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full" />
                                <div className="relative z-10 flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 backdrop-blur-md">
                                        <Hash size={28} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-2xl tracking-tight leading-none mb-1">Cấu trúc bài</h2>
                                        <p className="text-[13px] uppercase font-bold text-white/40 tracking-[0.2em]">{headings.length} PHẦN NỘI DUNG</p>
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
                                            "font-black tracking-tight",
                                            heading.level === 2 ? "text-red-500 text-xl" :
                                                heading.level === 3 ? "ml-8 scale-95 opacity-90 text-lg" :
                                                    heading.level === 4 ? "ml-12 scale-90 opacity-80 text-base" :
                                                        "ml-16 scale-85 opacity-70 text-sm",
                                            activeId === heading.id
                                                ? "bg-slate-950 text-yellow-400 shadow-2xl scale-[1.02] translate-x-1"
                                                : "bg-white border border-slate-100 hover:bg-slate-50"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-1.5 w-2 h-2 rounded-full shrink-0",
                                            activeId === heading.id ? "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,1)] scale-125" : "bg-red-500"
                                        )} />
                                        <span className="text-inherit leading-tight">{heading.text}</span>
                                    </a>
                                ))}
                            </nav>

                            <div className="p-8 border-t border-white/50 bg-black/5 flex items-center justify-between">
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
