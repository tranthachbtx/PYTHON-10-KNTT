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
            // Check if it's an important list item or label (1., 2., a), b), etc.)
            const isSection = /^[0-9a-z]\s*[.\)]/.test(text.trim());
            const isLabel =
              elem.tagName === "STRONG" &&
              text.includes(":") &&
              text.length < 50;

            if (isSection || isLabel) {
              level = elem.tagName === "LI" ? 4 : 5;
              // Ensure ID exists for navigation
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

      // Filter out duplicates and keep order
      const uniqueElements = elements.filter(
        (h, index) => elements.findIndex((item) => item.id === h.id) === index,
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
    headings.length > 0 ? ((activeIndex + 1) / headings.length) * 100 : 0;

  return (
    <>
      {/* Desktop Side Panel - Neomorphic Card Style */}
      <div className="hidden xl:flex fixed right-0 top-1 bottom-1 w-80 z-40 flex-col">
        <div className="flex-1 flex flex-col overflow-hidden bg-white/90 backdrop-blur-xl rounded-l-[40px] shadow-[-20px_0_60px_rgba(0,0,0,0.05)] border-l border-y border-white">
          <div className="pt-6" />

          <nav
            ref={sidebarNavRef}
            className="flex-1 overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar scroll-smooth"
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
                  "flex items-start gap-3 py-1.5 px-3 rounded-[2rem] transition-all duration-500 relative group/item",
                  "font-black leading-tight",
                  heading.level === 2
                    ? "text-[19px]"
                    : heading.level === 3
                      ? "ml-3 text-[17px]"
                      : heading.level === 4
                        ? "ml-6 text-[16px]"
                        : "ml-9 text-[15px]",
                  activeId === heading.id
                    ? "bg-slate-950 text-yellow-400 shadow-2xl scale-[1.05] -translate-x-1"
                    : heading.level === 2
                      ? "text-rose-500 hover:text-rose-600 hover:bg-black/5"
                      : heading.level === 3
                        ? "text-indigo-600 hover:text-indigo-800 hover:bg-black/5"
                        : heading.level === 4
                          ? "text-emerald-600 hover:text-emerald-800 hover:bg-black/5"
                          : "text-slate-500 hover:text-slate-950 hover:bg-black/5",
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
                    "mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500 border-2",
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
        </div>
      </div>
    </>
  );
}
