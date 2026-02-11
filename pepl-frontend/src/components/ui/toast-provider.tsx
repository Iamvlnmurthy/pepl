'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
};

const ToastContext = createContext<{
    toast: (message: string, type?: Toast['type']) => void;
}>({ toast: () => { } });

export function useToast() {
    return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`pointer-events-auto px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium animate-in slide-in-from-right-5 fade-in duration-300 border ${t.type === 'success'
                                ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 backdrop-blur-xl'
                                : t.type === 'error'
                                    ? 'bg-red-500/10 text-red-600 border-red-500/20 backdrop-blur-xl'
                                    : 'bg-blue-500/10 text-blue-600 border-blue-500/20 backdrop-blur-xl'
                            }`}
                    >
                        {t.type === 'success' && '✓ '}{t.type === 'error' && '✕ '}{t.type === 'info' && 'ℹ '}
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}
