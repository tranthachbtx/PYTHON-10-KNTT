"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  List,
  PanelRightClose,
  PanelRightOpen,
  Tv,
} from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

export function ContentPanel() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const sidebarNavRef = useRef<HTMLElement>(null);

  // Initialize collapse preference from localStorage
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("lesson_toc_collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  // Sync CSS variable for dynamic layout padding on desktop
  useEffect(() => {
    const width = isCollapsed ? "0px" : "320px";
    document.documentElement.style.setProperty("--toc-width", width);

    return () => {
      document.documentElement.style.setProperty("--toc-width", "0px");
    };
  }, [isCollapsed]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("lesson_toc_collapsed", String(next));
      return next;
    });
  }, []);

  // Keyboard shortcut: Alt + T or Escape to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        toggleCollapsed();
      } else if (e.key === "Escape" && !isCollapsed) {
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleCollapsed, isCollapsed]);

  useEffect(() => {
    const queryElements = () => {
      const elements = Array.from(
        document.querySelectorAll("h2, h3, h4, li, p > strong:first-child"),
      )
        .map((elem) => {
          let id = elem.id;
          let text = elem.textContent || "";
          let level = 0;

          if (elem.tagName.startsWith("H")) {
            level = Number(elem.tagName.replace("H", ""));
          } else if (elem.tagName === "LI" || elem.tagName === "STRONG") {
            const isSection = /^[0-9a-z]\s*[.\)]/.test(text.trim());
            const isLabel =
              elem.tagName === "STRONG" &&
              text.includes(":") &&
              text.length < 50;

            if (isSection || isLabel) {
              level = elem.tagName === "LI" ? 4 : 5;
              if (!id) {
                id =
                  "point-" +
                  text
                    .trim()
                    .toLowerCase()
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

      const uniqueElements = elements.filter(
        (h, index) => elements.findIndex((item) => item.id === h.id) === index,
      );

      setHeadings(uniqueElements);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: "-100px 0px -66%" },
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
      const activeElement = sidebarNavRef.current.querySelector(
        `[href="#${activeId}"]`,
      );
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
  const activeIndex = headings.findIndex((h) => h.id === activeId);
  const progress =
    headings.length > 0
      ? Math.round(((activeIndex >= 0 ? activeIndex + 1 : 1) / headings.length) * 100)
      : 0;

  return (
    <>
      {/* Floating Smart Trigger Button (Visible when collapsed on Desktop, or on Tablet/Mobile) */}
      <AnimatePresence>
        {(isCollapsed || !isMounted) && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed right-3 md:right-5 top-24 md:top-28 z-40"
          >
            <button
              onClick={toggleCollapsed}
              className={cn(
                "group relative flex items-center gap-2.5 p-2.5 md:p-3 rounded-2xl md:rounded-3xl",
                "bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/40 dark:border-white/10",
                "shadow-neu-flat hover:shadow-float active:shadow-neu-pressed transition-all duration-300",
                "text-slate-800 dark:text-slate-100 hover:scale-105 active:scale-95",
                "min-w-[48px] min-h-[48px] cursor-pointer"
              )}
              title="Hiện tiến trình bài học (Màn hình TV: ẩn để mở rộng không gian) [Alt + T]"
            >
              {/* Circular Progress Ring */}
              <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary transition-all duration-500 ease-out"
                    strokeDasharray={`${progress}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <PanelRightOpen size={16} className="absolute text-primary" />
              </div>

              {/* Progress Text with expand hint */}
              <div className="hidden sm:flex flex-col text-left pr-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Mục lục
                </span>
                <span className="text-xs font-black text-slate-800 dark:text-white leading-none">
                  {progress}%
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Side Panel - Smart Neomorphic & Glassmorphic Drawer */}
      <motion.aside
        initial={false}
        animate={{
          x: isCollapsed ? 340 : 0,
          opacity: isCollapsed ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "hidden xl:flex fixed right-0 top-1 bottom-1 w-80 z-40 flex-col",
          isCollapsed && "pointer-events-none"
        )}
      >
        <div className="flex-1 flex flex-col overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-l-[40px] shadow-[-20px_0_60px_rgba(0,0,0,0.06)] border-l border-y border-white dark:border-white/10">
          {/* Header with Title, Progress Bar, and Smart Collapse Button */}
          <div className="pt-5 px-5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <List size={18} />
                </div>
                <div className="truncate">
                  <h3 className="font-black text-sm text-slate-900 dark:text-white truncate leading-none">
                    Tiến trình bài học
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {progress}% hoàn thành
                  </p>
                </div>
              </div>

              {/* Smart Collapse for TV Screen Button */}
              <button
                onClick={toggleCollapsed}
                className={cn(
                  "p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white",
                  "hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0",
                  "cursor-pointer active:scale-95"
                )}
                title="Thu gọn mục lục (Tối ưu không gian màn hình TV) [Alt + T]"
              >
                <PanelRightClose size={18} />
              </button>
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-cyan-400 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <nav
            ref={sidebarNavRef}
            className="flex-1 overflow-y-auto px-2 py-3 space-y-1 custom-scrollbar scroll-smooth"
          >
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(heading.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={cn(
                  "flex items-start gap-3 py-1.5 px-3 rounded-[2rem] transition-all duration-300 relative group/item",
                  "font-black leading-tight",
                  heading.level === 2
                    ? "text-[18px]"
                    : heading.level === 3
                      ? "ml-3 text-[16px]"
                      : heading.level === 4
                        ? "ml-6 text-[15px]"
                        : "ml-8 text-[14px]",
                  activeId === heading.id
                    ? "bg-slate-950 text-yellow-400 shadow-xl scale-[1.03] -translate-x-1"
                    : heading.level === 2
                      ? "text-rose-500 hover:text-rose-600 hover:bg-black/5 dark:hover:bg-white/5"
                      : heading.level === 3
                        ? "text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 hover:bg-black/5 dark:hover:bg-white/5"
                        : heading.level === 4
                          ? "text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 hover:bg-black/5 dark:hover:bg-white/5"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5",
                )}
              >
                {activeId === heading.id && (
                  <motion.div
                    layoutId="toc-indicator-line"
                    className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                    transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                  />
                )}

                <div
                  className={cn(
                    "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 border-2",
                    activeId === heading.id
                      ? "bg-yellow-400 border-yellow-400 scale-125 shadow-[0_0_10px_rgba(250,204,21,1)]"
                      : heading.level === 2
                        ? "bg-rose-100 border-rose-500"
                        : heading.level === 3
                          ? "bg-indigo-100 border-indigo-500"
                          : heading.level === 4
                            ? "bg-emerald-100 border-emerald-500"
                            : "bg-transparent border-slate-300 group-hover/item:border-slate-400",
                  )}
                />

                <span className="leading-tight transition-all">
                  {heading.text}
                </span>
              </a>
            ))}
          </nav>

          {/* Footer note: TV Mode hint */}
          <div className="p-3 bg-slate-50/60 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={toggleCollapsed}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-primary text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Tv size={14} className="text-primary shrink-0" />
              <span>Chế độ TV: Nhấn để ẩn thanh</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
