'use client';

import React from 'react';
import { Sparkle } from "@phosphor-icons/react";

export function Logo({ className = "", collapsed = false }: { className?: string; collapsed?: boolean }) {
    return (
        <div className={`flex items-center gap-4 group cursor-pointer ${className}`}>
            <div className="relative">
                {/* Multi-layered CSS Mark */}
                <div className="bg-gradient-to-br from-primary-main to-primary-light w-12 h-12 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-primary-main/30 border border-white/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 relative overflow-hidden">
                    {/* Glass glare effect */}
                    <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                    <Sparkle weight="duotone" className="text-white w-7 h-7 relative z-10 animate-pulse" />

                    {/* Inner depth shadow */}
                    <div className="absolute inset-0 shadow-inner rounded-[1.25rem] pointer-events-none" />
                </div>

                {/* Secondary orbital ring */}
                <div className="absolute -inset-1 border-2 border-primary-main/10 rounded-[1.5rem] group-hover:scale-125 group-hover:rotate-12 transition-all duration-1000 opacity-0 group-hover:opacity-100" />
            </div>

            {!collapsed && (
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black tracking-tighter text-white leading-none bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                        PEPL
                    </h1>
                    <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-black text-primary-light uppercase tracking-[0.4em] opacity-60">Nexus HRMS</span>
                        <div className="w-1 h-1 rounded-full bg-accent-success animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                    </div>
                </div>
            )}
        </div>
    );
}
