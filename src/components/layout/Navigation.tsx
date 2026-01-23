"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Home, Menu, Settings, X, ChevronRight, Code } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Lesson {
    slug: string;
    subject: string;
    grade: string;
    title: string;
    order: number;
}

interface NavigationProps {
    lessons: Lesson[];
}

// 🛡️ DEEP SYSTEM AUDIT: Using 'export function' instead of 'const' to prevent Turbopack name mangling (k is not defined)
export function NavItem({ href, icon, label, active, isCollapsed }: { href: string; icon: React.ReactNode; label: string; active: boolean; isCollapsed?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all duration-300",
                active
                    ? "text-white bg-primary shadow-neu border-primary/20"
                    : "text-slate-900 hover:text-primary hover:bg-white/80"
            )}
        >
            <div className="shrink-0">{icon}</div>
            {!isCollapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="whitespace-nowrap"
                >
                    {label}
                </motion.span>
            )}
        </Link>
    );
}

export function BottomNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col items-center gap-1 p-2 transition-colors",
                active ? "text-primary" : "text-muted-foreground"
            )}
        >
            {icon}
            <span className="text-[10px] font-medium">{label}</span>
        </Link>
    );
}

export function DesktopSidebar({ lessons, pathname, sidebarState, setSidebarState }: { lessons: Lesson[], pathname: string, sidebarState: "full" | "hidden", setSidebarState: any }) {
    return (
        <AnimatePresence mode="wait">
            {sidebarState !== "hidden" && (
                <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0, width: 288 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="hidden md:flex flex-col h-screen fixed left-0 top-0 glass border-r border-black/10 z-50 overflow-hidden shadow-2xl"
                >
                    <div className="p-6 border-b border-black/10 flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                                <Code className="text-white" size={20} />
                            </div>
                            {sidebarState === "full" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h1 className="font-bold text-xl text-slate-950 whitespace-nowrap tracking-tight">
                                        Python 10
                                    </h1>
                                    <p className="text-[10px] uppercase font-bold text-primary tracking-widest">KNTT Series</p>
                                </motion.div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarState("hidden")}
                            className="p-1.5 hover:bg-black/5 rounded-lg transition-colors text-slate-500"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar overflow-x-hidden">
                        <div className="mb-6">
                            {sidebarState === "full" && <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Danh mục</p>}
                            <NavItem
                                href="/"
                                icon={<Home size={22} />}
                                label={sidebarState === "full" ? "Trang chủ" : ""}
                                active={pathname === "/"}
                                isCollapsed={false}
                            />
                        </div>

                        <div className="mb-4">
                            {sidebarState === "full" && <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-3">Bài học Python</p>}
                            <div className="space-y-3">
                                {lessons.map((lesson) => (
                                    <Link
                                        key={lesson.slug}
                                        href={`/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`}
                                        title={lesson.title}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-3.5 rounded-3xl transition-all duration-500 group relative overflow-hidden",
                                            pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                                ? "text-white bg-slate-900 shadow-2xl scale-[1.03] z-10"
                                                : "text-slate-900 hover:text-black hover:bg-white/60 dark:hover:bg-white/10"
                                        )}
                                    >
                                        {pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` && (
                                            <motion.div
                                                layoutId="active-nav-bg"
                                                className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        <div className={cn(
                                            "w-10 h-10 shrink-0 rounded-[1.2rem] flex items-center justify-center text-xs font-black transition-all shadow-sm",
                                            pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                                ? "bg-white/20 text-white"
                                                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-black/5 dark:border-white/5"
                                        )}>
                                            {lesson.order}
                                        </div>
                                        {sidebarState === "full" && (
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="truncate text-xs font-black uppercase tracking-tight opacity-50">Bài {lesson.order}</span>
                                                <span className="truncate text-[13px] font-bold leading-tight text-inherit">
                                                    {lesson.title.split(':')[1]?.trim() || lesson.title}
                                                </span>
                                            </div>
                                        )}
                                        {pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` && (
                                            <ChevronRight size={14} className="text-white/50" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.aside>
            )}

            {sidebarState === "hidden" && (
                <motion.button
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    onClick={() => setSidebarState("full")}
                    className="hidden md:flex fixed left-4 top-4 z-[60] w-12 h-12 bg-white border border-black/10 shadow-neu-flat rounded-full items-center justify-center text-slate-900 hover:scale-110 transition-transform"
                >
                    <Menu size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export function BottomNav({ pathname, setMobileMenuOpen }: { pathname: string, setMobileMenuOpen: any }) {
    return (
        <div className="md:hidden fixed bottom-1 left-4 right-4 glass border border-white/40 shadow-2xl z-50 px-6 py-2 flex justify-between items-center rounded-3xl backdrop-blur-2xl">
            <BottomNavItem href="/" icon={<Home size={24} />} label="Home" active={pathname === "/"} />

            <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shadow-lg shadow-primary/20 -mt-10 border-4 border-white">
                    <BookOpen size={28} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Học tập</span>
            </button>

            <BottomNavItem href="/settings" icon={<Settings size={24} />} label="Cài đặt" active={pathname === "/settings"} />
        </div>
    );
}

export function MobileDrawer({ lessons, pathname, mobileMenuOpen, setMobileMenuOpen }: { lessons: Lesson[], pathname: string, mobileMenuOpen: boolean, setMobileMenuOpen: any }) {
    return (
        <AnimatePresence>
            {mobileMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm md:hidden"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[85vh] glass rounded-t-[3rem] z-[61] md:hidden flex flex-col overflow-hidden"
                    >
                        <div className="p-6 border-b border-black/5 flex justify-between items-center bg-white/40 rounded-t-[3rem]">
                            <div>
                                <h2 className="font-black text-2xl text-slate-900">Bài học Python</h2>
                                <p className="text-xs font-bold text-primary uppercase tracking-widest">KNTT Series</p>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-black/5 hover:bg-black/10 rounded-2xl transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                            {lessons.map((lesson) => (
                                <Link
                                    key={lesson.slug}
                                    href={`/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 p-4 rounded-3xl transition-all duration-300",
                                        pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                            ? "bg-slate-900 shadow-xl border-slate-800 text-white"
                                            : "bg-white/40 border border-black/5 text-slate-900"
                                    )}
                                >
                                    <div className={cn(
                                        "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm shrink-0",
                                        pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` ? "bg-primary text-white" : "bg-white text-slate-600"
                                    )}>
                                        {lesson.order}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-xs font-black uppercase tracking-tighter opacity-50 mb-0.5")}>
                                            Bài {lesson.order}
                                        </p>
                                        <p className="font-bold text-base truncate leading-tight">
                                            {lesson.title.split(':')[1]?.trim() || lesson.title}
                                        </p>
                                    </div>
                                    <ChevronRight size={18} className="opacity-30" />
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function Navigation({ lessons }: NavigationProps) {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarState, setSidebarState] = useState<"full" | "hidden">("full");

    React.useEffect(() => {
        let width = "288px";
        if (sidebarState === "hidden") width = "0px";

        // Use requestAnimationFrame to ensure it happens after hydration and layout
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--sidebar-width', width);
        });
    }, [sidebarState]);

    return (
        <>
            <DesktopSidebar lessons={lessons} pathname={pathname} sidebarState={sidebarState} setSidebarState={setSidebarState} />
            <BottomNav pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} />
            <MobileDrawer lessons={lessons} pathname={pathname} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        </>
    );
}
