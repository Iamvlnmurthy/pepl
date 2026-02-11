'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    House,
    UsersThree,
    Fingerprint,
    CalendarCheck,
    ChartLineUp,
    Bank,
    Files,
    Sparkle,
    ChartBar,
    UserCircle,
    Gear
} from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";

const menuItems = [
    { icon: House, label: 'Overview', href: '/dashboard' },
    { icon: UsersThree, label: 'Employees', href: '/dashboard/employees' },
    { icon: Fingerprint, label: 'Attendance', href: '/dashboard/attendance' },
    { icon: CalendarCheck, label: 'Leaves', href: '/dashboard/leave/apply' },
    { icon: ChartLineUp, label: 'Sales & Incentives', href: '/dashboard/sales' },
    { icon: Bank, label: 'Payroll', href: '/dashboard/payroll' },
    { icon: Files, label: 'Documents', href: '/dashboard/documents' },
    { icon: Sparkle, label: 'AI Insights', href: '/dashboard/ai' },
    { icon: ChartBar, label: 'Reports', href: '/dashboard/reports' },
    { icon: UserCircle, label: 'My Profile', href: '/dashboard/profile' },
    { icon: Gear, label: 'Settings', href: '/dashboard/settings' },
];

export function Sidebar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') return pathname === '/dashboard';
        return pathname.startsWith(href);
    };

    return (
        <aside className="w-72 bg-neutral-900 border-r border-white/5 flex-col hidden md:flex relative overflow-hidden surface-noise">
            {/* Visual depth elements */}
            <div className="absolute top-[-10%] left-[-20%] w-[300px] h-[300px] bg-primary-main opacity-[0.03] rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-20%] w-[200px] h-[200px] bg-accent-payroll opacity-[0.03] rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col h-full">
                <div className="p-8 mb-6">
                    <Logo />
                </div>
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, idx) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${active
                                    ? 'bg-gradient-to-r from-primary-main to-primary-light text-white shadow-xl shadow-primary-main/20 border border-white/10'
                                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                                    }`}
                                style={{ animationDelay: `${idx * 40}ms` }}
                            >
                                <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-white/20' : 'bg-transparent group-hover:bg-white/5'}`}>
                                    <item.icon weight="duotone" className={`w-5 h-5 transition-transform duration-500 ${active ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:-rotate-3'}`} />
                                </div>
                                <span className={`text-sm tracking-tight transition-all ${active ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                                {active && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-6 mt-auto relative z-10">
                    <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm group cursor-default">
                        <p className="text-[10px] font-black text-primary-light uppercase tracking-[0.2em] mb-3 opacity-60">System Health</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-accent-success shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                                <p className="text-sm font-black text-white/90 tracking-tight">Stable</p>
                            </div>
                            <span className="text-[10px] font-black text-white/30">v2.4.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
