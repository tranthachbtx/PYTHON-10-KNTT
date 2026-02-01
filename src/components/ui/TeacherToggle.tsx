"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

export function TeacherToggle({ className }: { className?: string }) {
    const { isTeacherMode, setIsTeacherMode } = useSettings();

    return (
        <motion.button
            onClick={() => setIsTeacherMode(!isTeacherMode)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative flex items-center gap-3 px-4 py-3 rounded-[1.5rem] w-full transition-all duration-300 border font-bold",
                isTeacherMode
                    ? "bg-indigo-600/90 text-white border-white/20 shadow-lg shadow-indigo-500/20"
                    : "bg-white/10 text-white/70 border-white/5 hover:bg-white/20 hover:text-white",
                className
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition-all duration-500",
                isTeacherMode ? "bg-white/20 rotate-0" : "bg-white/10"
            )}>
                {isTeacherMode ? '👩‍🏫' : '👨‍🎓'}
            </div>
            <div className="flex flex-col items-start leading-none text-left">
                <span className="text-[10px] uppercase tracking-[0.2em] opacity-50 font-black">Chế độ</span>
                <span className="text-[13px] font-black">{isTeacherMode ? 'Giáo viên' : 'Học sinh'}</span>
            </div>
        </motion.button>
    );
}
