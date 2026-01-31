"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import { GlassCard } from './GlassCard';

interface StepProps {
    title?: string;
    children: React.ReactNode;
}

const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function StepEngagement({ title = "1. Mở đầu (Engagement)", children }: StepProps) {
    return (
        <motion.section
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="my-10 p-6 rounded-3xl bg-[#f0f9ff] border-2 border-blue-100 shadow-xl shadow-blue-100/30"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg shadow-sky-200 dark:shadow-none">
                    <span className="text-xl">🚀</span>
                </div>
                <h2 className="text-2xl font-bold text-sky-900 dark:text-sky-300 !m-0">{title}</h2>
            </div>
            <div className="space-y-4">{children}</div>
        </motion.section>
    );
}

export function StepKnowledge({ title = "2. Hình thành kiến thức (Knowledge)", children }: StepProps) {
    return (
        <motion.section
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="my-10 p-6 rounded-3xl bg-[#fffafa] border-2 border-salmon-100 shadow-xl shadow-salmon-100/30"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-salmon-500 bg-[#FF8C69] flex items-center justify-center text-white shadow-lg shadow-salmon-200 dark:shadow-none">
                    <span className="text-xl">📖</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 !m-0">{title}</h2>
            </div>
            <div className="space-y-4">{children}</div>
        </motion.section>
    );
}

export function StepPractice({ title = "3. Luyện tập (Practice)", children }: StepProps) {
    return (
        <motion.section
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="my-10 p-6 rounded-3xl bg-[#f5fff7] border-2 border-emerald-100 shadow-xl shadow-emerald-100/30"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-none">
                    <span className="text-xl">🧩</span>
                </div>
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-300 !m-0">{title}</h2>
            </div>
            <div className="space-y-4">{children}</div>
        </motion.section>
    );
}

export function StepApplication({ title = "4. Vận dụng (Application)", children }: StepProps) {
    return (
        <motion.section
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="my-10 p-6 rounded-3xl bg-[#fffdf0] border-2 border-amber-100 shadow-xl shadow-amber-100/30"
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-200 dark:shadow-none">
                    <span className="text-xl">🌟</span>
                </div>
                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-300 !m-0">{title}</h2>
            </div>
            <div className="space-y-4">{children}</div>
        </motion.section>
    );
}

export function TeacherNotes({ children }: { children: React.ReactNode }) {
    const { isTeacherMode } = useSettings();

    return (
        <AnimatePresence>
            {isTeacherMode && (
                <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="overflow-hidden mt-4"
                >
                    <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-2 border-dashed border-indigo-200 dark:border-indigo-800 shadow-inner">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase text-xs tracking-wider">
                            <span className="text-lg">👩‍🏫</span> Ghi chú Sư phạm (5512)
                        </div>
                        <div className="prose prose-indigo dark:prose-invert max-w-none text-sm leading-relaxed">
                            {children}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export function RawContent({ children }: { children: React.ReactNode }) {
    return <div className="raw-content-wrapper">{children}</div>;
}

// Export object for easier registration
export const LessonSteps = {
    StepEngagement,
    StepKnowledge,
    StepPractice,
    StepApplication,
    TeacherNotes,
    RawContent
};
