'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UsersThree, CalendarCheck, Clock, ChartLineUp, MagicWand, Pulse } from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-neutral-50 p-4 md:p-6 space-y-6 animate-in fade-in duration-700 surface-noise">
            {/* Greeting Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-neutral-900 p-8 md:p-10 text-white shadow-premium-xl animate-fade-in-up surface-noise">
                {/* mesh background overlay */}
                <div className="absolute inset-0 bg-mesh opacity-40" />

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-[0.3em]">
                                Digital Hub
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            <span className="text-white/50 text-[11px] font-black uppercase tracking-widest">May 24, 2026</span>
                        </div>
                        <div className="flex items-center gap-6 mb-6">
                            <Logo collapsed className="scale-125" />
                            <h1 className="text-display md:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 leading-none">
                                Welcome Back
                            </h1>
                        </div>
                        <p className="text-lg font-bold opacity-70 max-w-xl leading-relaxed mb-6 tracking-tight">
                            Your workforce analytics are <span className="text-white opacity-100 border-b-2 border-primary-main/50 pb-1">updating in real-time</span>. Monitoring active nodes.
                        </p>
                        <div className="flex flex-wrap gap-5">
                            <button className="btn-prism h-14 px-10 shadow-2xl shadow-primary-main/40">
                                Check In / Out Now
                            </button>
                            <button className="btn-secondary-depth h-14 px-10 !bg-white/5 !border-white/10 !text-white hover:!bg-white/10">
                                Analyze Schedule
                            </button>
                        </div>
                    </div>

                    {/* Visual feature for hero */}
                    <div className="hidden lg:flex w-64 h-64 rounded-full bg-gradient-to-br from-primary-main to-accent-payroll p-1 shadow-premium-xl animate-float relative cursor-default group">
                        <div className="w-full h-full rounded-full bg-neutral-900 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-mesh opacity-20 group-hover:opacity-40 transition-opacity" />
                            <Pulse weight="duotone" className="w-20 h-20 text-white mb-2" />
                            <span className="text-4xl font-black">98.4%</span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">System Efficiency</span>
                        </div>
                    </div>
                </div>

                {/* Decorative floating elements */}
                <div className="absolute top-[-10%] right-[15%] w-[400px] h-[400px] bg-primary-main opacity-[0.05] rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-15%] left-[10%] w-[300px] h-[300px] bg-accent-payroll opacity-[0.05] rounded-full blur-[100px]" />
            </div>

            {/* Stats Grid - 2 cols mobile, 4 cols desktop as per spec */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Present Today"
                    value="--"
                    change="0%"
                    trend="up"
                    icon={<UsersThree weight="duotone" className="w-5 h-5" />}
                    accent="attendance"
                />
                <StatsCard
                    title="Leave Balance"
                    value="--"
                    change="0 pending"
                    trend="neutral"
                    icon={<CalendarCheck weight="duotone" className="w-5 h-5" />}
                    accent="leaves"
                />
                <StatsCard
                    title="Net Payout"
                    value="₹0.0"
                    change="0%"
                    trend="up"
                    icon={<Clock weight="duotone" className="w-5 h-5" />}
                    accent="payroll"
                />
                <StatsCard
                    title="Sales Growth"
                    value="0%"
                    change="0% of goal"
                    trend="up"
                    icon={<ChartLineUp weight="duotone" className="w-5 h-5" />}
                    accent="sales"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <Pulse weight="duotone" className="w-7 h-7 text-primary-main" />
                            Recent Activity
                        </h2>
                        <button className="text-[10px] font-black uppercase tracking-widest text-primary-main hover:underline transition-all ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">View All Activity</button>
                    </div>

                    <div className="glass-card rounded-[2.5rem] border-none p-3 shadow-premium-lg">
                        <div className="space-y-1">
                            <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
                                <Pulse weight="duotone" className="w-12 h-12 mb-4 opacity-20" />
                                <p className="text-xs font-black uppercase tracking-widest opacity-40">No Recent System Activity</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-3 px-2">
                        <MagicWand weight="duotone" className="w-7 h-7 text-accent-payroll" />
                        AI Insights
                    </h2>

                    <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center py-8 glass-card border-dashed border-2 border-neutral-100/50 rounded-[2rem] text-neutral-400">
                            <MagicWand weight="duotone" className="w-10 h-10 mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Listening for signals...</p>
                        </div>
                        <div className="glass-card p-6 rounded-[2rem] bg-gradient-to-br from-primary-main to-primary-light text-white border-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
                                <MagicWand weight="duotone" className="w-12 h-12" />
                            </div>
                            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 tracking-tight">
                                Ask PEPL AI
                            </h3>
                            <p className="text-sm opacity-90 leading-relaxed mb-4">
                                "Summarize the workforce diversity report for Q1"
                            </p>
                            <button className="w-full btn-secondary-depth h-14">
                                Start Consultation
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, change, trend, icon, accent }: any) {
    const accentColor = accent === 'attendance' ? 'var(--color-accent-attendance)' : accent === 'leaves' ? 'var(--color-accent-leaves)' : accent === 'payroll' ? 'var(--color-accent-payroll)' : 'var(--color-accent-sales)';

    return (
        <Card className="group relative overflow-hidden p-6 hover:shadow-premium-xl transition-all duration-500 border-2 border-neutral-100/50 rounded-[2.5rem] bg-white shadow-premium-md animate-scale-in">
            <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-20 transition-opacity duration-700" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500" style={{ background: accentColor }}>
                        {React.cloneElement(icon, { size: 24, weight: "duotone" })}
                    </div>
                    <div className={`flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${trend === 'up' ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-warning/10 text-accent-warning'}`}>
                        {trend === 'up' ? '↑' : '↓'} {change}
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400 opacity-80">{title}</p>
                    <p className="text-4xl font-black text-neutral-900 tracking-tighter group-hover:translate-x-1 transition-transform">{value}</p>
                </div>
            </div>

            {/* Elegant backdrop indicator */}
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[150px] h-[150px] rounded-full opacity-[0.05] group-hover:opacity-[0.1] transition-all duration-700 blur-[40px]"
                style={{ background: accentColor }}
            />
        </Card>
    );
}

function ActivityItem({ title, desc, time, emoji, i }: any) {
    return (
        <div
            className="flex items-center gap-5 p-5 mx-1 rounded-[2.25rem] hover:bg-white hover:shadow-premium-lg transition-all duration-500 group cursor-pointer border border-transparent hover:border-neutral-100/50"
            style={{ animationDelay: `${i * 100}ms` }}
        >
            <div className="w-14 h-14 rounded-[1.25rem] bg-neutral-100 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-premium-md transition-all duration-500">
                {emoji}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <h4 className="font-black text-sm text-neutral-900 tracking-tight truncate group-hover:text-primary-main transition-colors">{title}</h4>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-neutral-400 whitespace-nowrap shrink-0 opacity-60">{time}</span>
                </div>
                <p className="text-[12px] text-neutral-500 font-bold opacity-70 line-clamp-1 tracking-tight">{desc}</p>
            </div>
        </div>
    );
}

function InsightCard({ title, content, color }: any) {
    const accentColor = color === 'blue' ? 'border-primary-main/10 bg-primary-subtle text-primary-main' : 'border-accent-success/10 bg-accent-success/5 text-accent-success';

    return (
        <Card className={`p-6 border-2 shadow-premium-sm rounded-[2.25rem] transition-all duration-500 hover:shadow-premium-lg hover:-translate-y-1 relative overflow-hidden group ${accentColor}`}>
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:scale-125 transition-transform">
                <MagicWand weight="duotone" className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-current animate-pulse shadow-lg" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-current opacity-80">{title}</span>
            </div>
            <p className="text-sm font-black leading-relaxed text-neutral-900 relative z-10 tracking-tight">
                {content}
            </p>
        </Card>
    );
}
