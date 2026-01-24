"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
    const [mounted, setMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isStationary, setIsStationary] = useState(false);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 250 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        setMounted(true);
        let timeout: NodeJS.Timeout;
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);

            setIsStationary(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setIsStationary(true), 150);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.getAttribute('role') === 'button';

            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
            clearTimeout(timeout);
        };
    }, [cursorX, cursorY, isVisible]);

    if (!mounted) return null;

    return (
        <div className="hidden md:block">
            {/* Outer Pulse Ring when stationary or hovering */}
            <motion.div
                className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9999] rounded-full border-2 border-primary/30"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isStationary || isHovering ? [1, 1.6, 1] : 1,
                    opacity: isStationary || isHovering ? [0.2, 0.5, 0.2] : 0,
                    borderColor: isHovering ? "rgba(14, 165, 233, 0.6)" : "rgba(14, 165, 233, 0.3)",
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] rounded-full mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovering ? 2.5 : 1,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.8)",
                }}
            />

            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-primary pointer-events-none z-[9999] rounded-full shadow-[0_0_10px_rgba(14,165,233,0.8)]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
            />

            {/* Spotlight effect */}
            <motion.div
                className="fixed top-0 left-0 w-[600px] h-[600px] pointer-events-none z-[9998] rounded-full"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    background: "radial-gradient(circle, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.05) 30%, transparent 70%)",
                }}
                animate={{
                    scale: isHovering ? 1.5 : 1,
                    opacity: isVisible ? 1 : 0,
                }}
            />
        </div>
    );
};
