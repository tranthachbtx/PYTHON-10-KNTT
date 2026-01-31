"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    isTeacherMode: boolean;
    setIsTeacherMode: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [isTeacherMode, setIsTeacherModeState] = useState(false);

    // Persistence
    useEffect(() => {
        const saved = localStorage.getItem('isTeacherMode');
        if (saved !== null) {
            setIsTeacherModeState(saved === 'true');
        }
    }, []);

    const setIsTeacherMode = (value: boolean) => {
        setIsTeacherModeState(value);
        localStorage.setItem('isTeacherMode', String(value));
    };

    return (
        <SettingsContext.Provider value={{ isTeacherMode, setIsTeacherMode }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
