'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft, Sparkle } from "@phosphor-icons/react";

export const dynamic = 'force-dynamic';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-subtle rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-warning/5 rounded-full blur-[120px]" />
            <div className="relative z-10 text-center space-y-8 p-12 bg-white/50 backdrop-blur-xl border-2 border-white rounded-[3rem] shadow-2xl">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-primary-main shadow-2xl shadow-primary-main/30 mb-4 animate-bounce">
                    <Sparkle weight="duotone" className="w-12 h-12 text-white" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-8xl font-black tracking-tighter text-neutral-900 drop-shadow-2xl">404</h1>
                    <p className="text-xl text-neutral-500 font-bold max-w-sm mx-auto leading-relaxed">
                        The page you&apos;re looking for has vanished into the binary void.
                    </p>
                </div>
                <Link href="/dashboard" className="block">
                    <Button className="rounded-xl px-10 h-14 bg-primary-main shadow-xl shadow-primary-main/20 hover:translate-y-[-4px] active:scale-95 transition-all font-black text-lg gap-3">
                        <ArrowLeft weight="bold" className="w-6 h-6" /> Back to Safety
                    </Button>
                </Link>
            </div>
        </div>
    );
}
