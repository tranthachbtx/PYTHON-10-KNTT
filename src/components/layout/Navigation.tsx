"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BookOpen, Home, Menu, Settings, X, ChevronRight, Code, Sparkles, Brain, Cpu, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TeacherToggle } from "@/components/ui/TeacherToggle";

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

const SUBJECT_THEMES: Record<string, { label: string, icon: any, color: string, gradient: string }> = {
    "informatics": {
        label: "Tin học",
        icon: Cpu,
        color: "text-blue-600",
        gradient: "from-blue-600 to-cyan-500"
    },
    "experiential": {
        label: "HĐ Trải nghiệm",
        icon: Sparkles,
        color: "text-rose-500",
        gradient: "from-rose-500 to-orange-400"
    }
};

export function NavItem({ href, icon, label, active, isCollapsed }: { href: string; icon: React.ReactNode; label: string; active: boolean; isCollapsed?: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl text-base font-bold transition-all duration-300",
                active
                    ? "text-white bg-slate-900 shadow-neu-flat-lg border-white/10"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
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

export function DesktopSidebar({ lessons, pathname, sidebarState, setSidebarState, isLessonPage }: { lessons: Lesson[], pathname: string, sidebarState: "full" | "hidden", setSidebarState: any, isLessonPage: boolean }) {
    const pathParts = pathname.split('/');
    const currentSubject = pathParts[2] || "informatics";
    const currentGrade = pathParts[3] || "grade-10";

    const theme = SUBJECT_THEMES[currentSubject] || SUBJECT_THEMES["informatics"];
    const ThemeIcon = theme.icon;

    // Filter lessons for the current subject and grade
    const filteredLessons = lessons.filter(l => l.subject === currentSubject && l.grade === currentGrade);

    return (
        <AnimatePresence mode="wait">
            {sidebarState !== "hidden" && (
                <motion.aside
                    initial={{ x: -300 }}
                    animate={{ x: 0, width: 300 }}
                    exit={{ x: -300 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="hidden md:flex flex-col h-screen fixed left-0 top-0 glass-dark border-r border-white/20 z-50 overflow-hidden shadow-2xl"
                >
                    <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className={cn(
                                "w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                                theme.gradient
                            )}>
                                <ThemeIcon className="text-white" size={24} />
                            </div>
                            {sidebarState === "full" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h1 className="font-black text-xl text-white whitespace-nowrap tracking-tight leading-none mb-1">
                                        {theme.label} {currentGrade.replace("grade-", "")}
                                    </h1>
                                    <p className="text-[10px] uppercase font-black text-white/40 tracking-[0.2em]">KNTT SERIES</p>
                                </motion.div>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarState("hidden")}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/50 hover:text-white"
                        >
                            <Menu size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar overflow-x-hidden">
                        <div className="mb-8">
                            <Link
                                href="/"
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-wider transition-all duration-500",
                                    pathname === "/"
                                        ? "bg-white text-slate-950 shadow-neu-flat-lg"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                <Home size={20} />
                                <span>Trang chủ</span>
                            </Link>
                        </div>

                        <div className="mb-4">
                            {sidebarState === "full" && (
                                <div className="px-4 mb-6 flex items-center justify-between">
                                    <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] leading-none">Danh sách bài học</p>
                                    <span className="text-[10px] font-black py-1 px-2 bg-white/10 text-white/60 rounded-lg">{filteredLessons.length} bài</span>
                                </div>
                            )}
                            <div className="space-y-3">
                                {filteredLessons.map((lesson) => (
                                    <Link
                                        key={lesson.slug}
                                        href={`/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`}
                                        onClick={() => {
                                            // Auto-hide sidebar after selecting a lesson
                                            setTimeout(() => setSidebarState("hidden"), 300);
                                        }}
                                        className={cn(
                                            "flex items-center gap-4 px-4 py-4 rounded-[2rem] transition-all duration-500 group relative overflow-hidden",
                                            pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                                ? "text-white scale-[1.02] shadow-2xl"
                                                : "text-white/60 hover:text-white hover:bg-white/5"
                                        )}
                                    >
                                        {pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` && (
                                            <motion.div
                                                layoutId="active-nav-bg"
                                                className={cn("absolute inset-0 bg-gradient-to-r -z-10", theme.gradient)}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}

                                        <div className={cn(
                                            "w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center text-[13px] font-black transition-all shadow-sm",
                                            pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                                ? "bg-white/20 text-white rotate-12 scale-110"
                                                : "bg-white/5 text-white/30 border border-white/5"
                                        )}>
                                            {lesson.order}
                                        </div>
                                        {sidebarState === "full" && (
                                            <div className="flex flex-col flex-1 min-w-0">
                                                <span className="truncate text-[13px] font-black tracking-tight text-inherit">
                                                    {lesson.title.split(':')[1]?.trim() || lesson.title}
                                                </span>
                                                <span className="truncate text-[10px] font-bold uppercase opacity-40 mt-0.5">Lesson {lesson.order}</span>
                                            </div>
                                        )}
                                        {pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` && (
                                            <ChevronRight size={16} className="text-white/80 animate-pulse" />
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-white/10 mt-auto">
                        <TeacherToggle onToggle={() => {
                            // Auto-hide sidebar after changing mode
                            setTimeout(() => setSidebarState("hidden"), 400);
                        }} />
                    </div>
                </motion.aside>
            )}

            {sidebarState === "hidden" && isLessonPage && (
                <motion.button
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    onClick={() => setSidebarState("full")}
                    className="hidden md:flex fixed left-6 top-6 z-[60] w-14 h-14 glass border border-white/20 shadow-neu-flat rounded-[1.2rem] items-center justify-center text-slate-800 hover:scale-110 transition-all hover:rotate-6 active:scale-95"
                >
                    <Menu size={28} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}

export function BottomNavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                "flex flex-col items-center gap-1.5 p-2 transition-all group",
                active ? "text-slate-950 scale-110" : "text-slate-400"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                active ? "bg-slate-900 text-white shadow-lg rotate-12" : "group-hover:bg-slate-100"
            )}>
                {icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.1em]">{label}</span>
        </Link>
    );
}

export function BottomNav({ pathname, setMobileMenuOpen }: { pathname: string, setMobileMenuOpen: any }) {
    return (
        <div className="md:hidden fixed bottom-4 left-4 right-4 glass border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 px-4 py-2 flex justify-around items-center rounded-[2.5rem] backdrop-blur-3xl">
            <BottomNavItem href="/" icon={<Home size={22} />} label="Trang chủ" active={pathname === "/"} />

            <div className="relative -mt-10">
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="w-18 h-18 rounded-[2rem] bg-slate-950 flex items-center justify-center text-white shadow-2xl border-6 border-[#f0f9ff] active:scale-90 transition-transform relative group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <BookOpen size={28} className="relative z-10" />
                </button>
                <div className="mt-2 text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-950">Bài học</span>
                </div>
            </div>

            <BottomNavItem href="/settings" icon={<Settings size={22} />} label="Cài đặt" active={pathname === "/settings"} />
        </div>
    );
}

export function MobileDrawer({ lessons, pathname, mobileMenuOpen, setMobileMenuOpen }: { lessons: Lesson[], pathname: string, mobileMenuOpen: boolean, setMobileMenuOpen: any }) {
    const pathParts = pathname.split('/');
    const currentSubject = pathParts[2] || "informatics";
    const currentGrade = pathParts[3] || "grade-10";
    const theme = SUBJECT_THEMES[currentSubject] || SUBJECT_THEMES["informatics"];

    const filteredLessons = lessons.filter(l => l.subject === currentSubject && l.grade === currentGrade);

    return (
        <AnimatePresence>
            {mobileMenuOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 bg-slate-950/40 z-[60] backdrop-blur-md md:hidden"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white rounded-t-[3.5rem] z-[61] md:hidden flex flex-col overflow-hidden shadow-[0_-20px_60px_rgba(0,0,0,0.1)]"
                    >
                        <div className="mx-auto w-12 h-1.5 bg-slate-200 rounded-full mt-4 mb-2" />
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h2 className="font-black text-2xl text-slate-950 leading-none mb-2">
                                    {theme.label} {currentGrade.replace("grade-", "")}
                                </h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">KNTT Series</p>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="w-12 h-12 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors">
                                <X size={24} className="text-slate-600" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <div className="grid grid-cols-1 gap-3">
                                {filteredLessons.map((lesson) => (
                                    <Link
                                        key={lesson.slug}
                                        href={`/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center gap-4 p-5 rounded-[2rem] transition-all duration-300",
                                            pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                                ? "bg-slate-950 shadow-2xl text-white scale-[1.02]"
                                                : "bg-slate-50 text-slate-900 border border-slate-100 hover:bg-slate-100"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-inner shrink-0",
                                            pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`
                                                ? "bg-white/20 text-white rotate-12"
                                                : "bg-white text-slate-400"
                                        )}>
                                            {lesson.order}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1",
                                                pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` ? "text-white/50" : "text-slate-400")}>
                                                Bài {lesson.order}
                                            </p>
                                            <p className="font-bold text-base truncate leading-tight">
                                                {lesson.title.split(':')[1]?.trim() || lesson.title}
                                            </p>
                                        </div>
                                        <ChevronRight size={20} className={cn("opacity-20", pathname === `/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}` && "opacity-80")} />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50">
                            <TeacherToggle
                                className="!bg-white !text-slate-900 !border-slate-200 shadow-sm"
                                onToggle={() => {
                                    // Auto-close mobile drawer after changing mode
                                    setTimeout(() => setMobileMenuOpen(false), 400);
                                }}
                            />
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

    // Check if we are on a lesson page or subject/grade specific page
    const isLessonPage = pathname.startsWith('/lessons/') && pathname.split('/').length >= 4;

    const [sidebarState, setSidebarState] = useState<"full" | "hidden">("full");

    // Initialize/sync sidebar state based on route
    useEffect(() => {
        if (!isLessonPage) {
            setSidebarState("hidden");
        } else {
            setSidebarState("full");
        }
    }, [pathname, isLessonPage]);

    useEffect(() => {
        let width = "300px";
        if (sidebarState === "hidden") width = "0px";

        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--sidebar-width', width);
        });
    }, [sidebarState]);

    return (
        <nav>
            <DesktopSidebar lessons={lessons} pathname={pathname} sidebarState={sidebarState} setSidebarState={setSidebarState} isLessonPage={isLessonPage} />
            {isLessonPage && (
                <>
                    <BottomNav pathname={pathname} setMobileMenuOpen={setMobileMenuOpen} />
                    <MobileDrawer lessons={lessons} pathname={pathname} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
                </>
            )}
        </nav>
    );
}
