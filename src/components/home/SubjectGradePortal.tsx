"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, BookOpen, Users, Code, Zap, Sparkles } from "lucide-react";
import { Lesson } from "@/lib/mdx";

interface SubjectGradePortalProps {
    initialLessons: Lesson[];
}

const subjects = [
    {
        id: "informatics",
        title: "Tin học",
        description: "Khám phá lập trình Python, cấu trúc dữ liệu và thuật toán.",
        icon: Code,
        color: "from-blue-500 to-cyan-400",
        bgLight: "bg-blue-50",
        textLight: "text-blue-600",
    },
    {
        id: "experiential",
        title: "HĐ Trải nghiệm",
        description: "Phát triển kỹ năng sống, hướng nghiệp và kết nối cộng đồng.",
        icon: Users,
        color: "from-orange-500 to-rose-400",
        bgLight: "bg-orange-50",
        textLight: "text-orange-600",
    },
];

const grades = [
    { id: "grade-10", label: "Lớp 10" },
    { id: "grade-11", label: "Lớp 11" },
    { id: "grade-12", label: "Lớp 12" },
];

export default function SubjectGradePortal({ initialLessons }: SubjectGradePortalProps) {
    const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
    const [selectedGrade, setSelectedGrade] = useState(grades[0].id);

    const filteredLessons = useMemo(() => {
        return initialLessons.filter(
            (lesson) => lesson.subject === selectedSubject && lesson.grade === selectedGrade
        );
    }, [initialLessons, selectedSubject, selectedGrade]);

    const currentSubjectInfo = subjects.find((s) => s.id === selectedSubject)!;

    return (
        <div className="space-y-16">
            {/* Subject Picker */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {subjects.map((subject) => {
                    const isActive = selectedSubject === subject.id;
                    const Icon = subject.icon;

                    return (
                        <motion.button
                            key={subject.id}
                            onClick={() => setSelectedSubject(subject.id)}
                            whileHover={{ y: -5 }}
                            whileTap={{ scale: 0.98 }}
                            className={`relative overflow-hidden p-8 rounded-[2.5rem] text-left transition-all duration-500 focus-ring-hover ${isActive
                                ? "glass border-primary/50 shadow-2xl shadow-primary/10"
                                : "bg-white/60 border-white/20 hover:bg-white/80 opacity-90 hover:opacity-100"
                                } border-2 group`}
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${subject.color} opacity-10 rounded-bl-[5rem] -z-10 transition-transform duration-500 group-hover:scale-110`} />

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${isActive ? `bg-gradient-to-br ${subject.color} text-white` : "bg-gray-100 text-gray-400"
                                }`}>
                                <Icon size={28} />
                            </div>

                            <h3 className={`text-2xl font-black mb-3 ${isActive ? "text-slate-950" : "text-slate-700"}`}>
                                {subject.title}
                            </h3>
                            <p className={`text-sm leading-relaxed font-medium ${isActive ? "text-slate-700" : "text-slate-500"}`}>
                                {subject.description}
                            </p>

                            {isActive && (
                                <motion.div
                                    layoutId="active-indicator"
                                    className="absolute bottom-6 right-8 text-primary"
                                >
                                    <Sparkles size={24} className="animate-pulse" />
                                </motion.div>
                            )}
                        </motion.button>
                    );
                })}
            </section>

            {/* Grade Selector & Content List */}
            <section id="lessons" className="space-y-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                            <Zap className="text-amber-500 fill-amber-500" size={28} />
                            Lộ trình bài học
                        </h2>
                        <p className="text-slate-500 font-medium">{currentSubjectInfo.title} • {grades.find(g => g.id === selectedGrade)?.label}</p>
                    </div>

                    <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200 backdrop-blur-sm">
                        {grades.map((grade) => (
                            <button
                                key={grade.id}
                                onClick={() => setSelectedGrade(grade.id)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${selectedGrade === grade.id
                                    ? "bg-white text-primary shadow-md"
                                    : "text-slate-500 hover:text-slate-700"
                                    }`}
                            >
                                {grade.label}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${selectedSubject}-${selectedGrade}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {filteredLessons.length > 0 ? (
                            filteredLessons.map((lesson) => (
                                <Link
                                    key={lesson.slug}
                                    href={`/lessons/${lesson.subject}/${lesson.grade}/${lesson.slug}`}
                                    className="group glass p-8 rounded-[2rem] hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 block h-full border-2 border-white/50 relative overflow-hidden focus-ring-hover"
                                >
                                    {/* Decorative number background */}
                                    <span className="absolute -right-4 -top-4 text-8xl font-black text-slate-100/50 select-none group-hover:text-primary/5 transition-colors">
                                        {lesson.frontmatter.order}
                                    </span>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className={`px-4 py-1.5 rounded-full ${currentSubjectInfo.bgLight} ${currentSubjectInfo.textLight} text-[10px] font-black uppercase tracking-widest border border-white`}>
                                                {selectedSubject === "experiential" ? "Chủ đề" : "Bài"} {lesson.frontmatter.order}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black mb-4 line-clamp-2 group-hover:text-primary transition-colors text-slate-900 leading-tight">
                                            {lesson.frontmatter.title.split(":")[1]?.trim() || lesson.frontmatter.title}
                                        </h3>

                                        <p className="text-sm text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
                                            {lesson.frontmatter.description}
                                        </p>

                                        <div className="flex items-center text-primary text-sm font-black group-hover:gap-3 transition-all">
                                            BẮT ĐẦU HỌC <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-dashed border-2 border-gray-300">
                                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                    <BookOpen size={40} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-400 mb-2">Đang cập nhật nội dung...</h3>
                                <p className="text-slate-400 font-medium">Chúng tôi sẽ sớm bổ sung tài liệu cho khối lớp này.</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </section>
        </div>
    );
}
