"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, X, HelpCircle, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuizData {
    question: string;
    options: string[];
    correctAnswer: number; // Index 0-based
    explanation: string;
}

interface QuizProps {
    data: QuizData;
    className?: string;
}

export function Quiz({ data, className, ...rest }: any) {
    const quizData = data || rest;
    const [selected, setSelected] = useState<number | null>(null);
    const [submitted, setSubmitted] = useState(false);

    if (!quizData || !quizData.options || !Array.isArray(quizData.options)) {
        return null;
    }

    const isCorrect = selected === quizData.correctAnswer;

    const handleSelect = (index: number) => {
        if (!submitted) {
            setSelected(index);
        }
    };

    const handleSubmit = () => {
        if (selected !== null) {
            setSubmitted(true);
        }
    };

    const handleReset = () => {
        setSelected(null);
        setSubmitted(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            whileHover={{ y: -8, scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className={cn("bg-white/98 border-2 border-primary/10 p-6 md:p-7 my-6 rounded-3xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl focus-ring-hover shadow-xl", className)}
        >
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <HelpCircle size={64} className="text-primary" />
            </div>

            <h4 className="text-lg font-black mb-4 flex items-center gap-3 text-primary">
                <Trophy size={24} className="text-yellow-500" />
                Thử thách kiến thức
            </h4>

            <p className="text-lg mb-6 font-black text-slate-900 leading-relaxed">{quizData.question}</p>

            <div className="space-y-3">
                {quizData.options.map((option: string, index: number) => {
                    let optionStyle = "bg-white/40 hover:bg-white/60 border-white/20 shadow-sm";
                    if (selected === index) {
                        optionStyle = "border-primary bg-primary/10 shadow-neu-pressed ring-2 ring-primary/20";
                    }
                    if (submitted) {
                        if (index === quizData.correctAnswer) {
                            optionStyle = "bg-green-100/50 border-green-500 text-green-700 shadow-[2px_2px_5px_rgba(34,197,94,0.2)]";
                        } else if (selected === index && !isCorrect) {
                            optionStyle = "bg-red-100/50 border-red-500 text-red-700 shadow-[2px_2px_5px_rgba(239,68,68,0.2)]";
                        } else {
                            optionStyle = "opacity-50 grayscale-[0.5]";
                        }
                    }

                    return (
                        <motion.button
                            key={index}
                            onClick={() => handleSelect(index)}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                                "w-full text-left p-4 px-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between text-base font-bold text-slate-900",
                                optionStyle,
                                !submitted && "cursor-pointer active:scale-95"
                            )}
                            disabled={submitted}
                        >
                            <span>{option}</span>
                            {submitted && index === quizData.correctAnswer && <Check size={20} className="text-green-500" />}
                            {submitted && selected === index && !isCorrect && <X size={20} className="text-red-500" />}
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {!submitted ? (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 flex justify-end"
                    >
                        <button
                            onClick={handleSubmit}
                            disabled={selected === null}
                            className={cn(
                                "px-8 py-3 rounded-full font-black text-lg transition-all shadow-lg",
                                selected !== null
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-primary/30 hover:shadow-primary/50"
                                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                            )}
                        >
                            Kiểm tra
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "mt-6 p-5 rounded-3xl border-2",
                            isCorrect ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        )}
                    >
                        <div className="font-black text-lg mb-2 flex items-center gap-2">
                            {isCorrect ? (
                                <span className="text-green-600">Chính xác! 🎉</span>
                            ) : (
                                <span className="text-red-600">Sai rồi! 😅</span>
                            )}
                        </div>
                        <p className="text-base font-medium opacity-90">{quizData.explanation}</p>
                        <button
                            onClick={handleReset}
                            className="mt-4 text-sm font-black underline opacity-70 hover:opacity-100 uppercase tracking-widest"
                        >
                            Làm lại
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
