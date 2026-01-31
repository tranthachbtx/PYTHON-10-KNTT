"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';

export function TeacherToggle() {
    const { isTeacherMode, setIsTeacherMode } = useSettings();

    return (
        <div className="fixed top-20 right-4 z-50 md:top-6 md:right-8">
            <motion.button
                onClick={() => setIsTeacherMode(!isTeacherMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
          relative flex items-center gap-2 px-4 py-2 rounded-2xl
          backdrop-blur-xl border transition-all duration-500
          ${isTeacherMode
                        ? 'bg-indigo-500/90 text-white border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
                        : 'bg-white/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 border-white/20 shadow-xl'
                    }
        `}
            >
                <div className={`
          w-8 h-8 rounded-xl flex items-center justify-center text-lg
          transition-transform duration-500 rotate-0
          ${isTeacherMode ? 'bg-white/20 scale-110' : 'bg-slate-100 dark:bg-slate-700'}
        `}>
                    {isTeacherMode ? '👩‍🏫' : '👨‍🎓'}
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase tracking-widest opacity-70 font-bold">Chế độ</span>
                    <span className="text-sm font-bold">{isTeacherMode ? 'Giáo viên' : 'Học sinh'}</span>
                </div>

                {/* Animated indicator */}
                {isTeacherMode && (
                    <motion.span
                        layoutId="active-glow"
                        className="absolute inset-0 rounded-2xl bg-indigo-400/20 blur-md -z-10"
                    />
                )}
            </motion.button>
        </div>
    );
}
