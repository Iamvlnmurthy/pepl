'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ChartBar,
    UsersThree,
    Calendar,
    CurrencyInr,
    ChartLineUp,
    DownloadSimple,
    ArrowUpRight,
    ArrowDownRight,
    Clock
} from "@phosphor-icons/react";

export const dynamic = 'force-dynamic';

const kpis = [
    { label: 'Total Headcount', value: '156', change: '+4', trend: 'up', icon: UsersThree, color: 'text-primary-main' },
    { label: 'Avg Attendance', value: '94.2%', change: '+1.8%', trend: 'up', icon: Clock, color: 'text-accent-success' },
    { label: 'Payroll This Month', value: '₹48.6L', change: '-2.1%', trend: 'down', icon: CurrencyInr, color: 'text-accent-warning' },
    { label: 'Sales Revenue', value: '₹1.2Cr', change: '+12.4%', trend: 'up', icon: ChartLineUp, color: 'text-primary-main' },
];

const attendanceData = [
    { month: 'Sep', rate: 91 }, { month: 'Oct', rate: 93 },
    { month: 'Nov', rate: 90 }, { month: 'Dec', rate: 88 },
    { month: 'Jan', rate: 94 }, { month: 'Feb', rate: 94 },
];

const deptPerformance = [
    { dept: 'Engineering', headcount: 42, attendance: '96%', cost: '₹18.2L', rating: 'A' },
    { dept: 'Sales', headcount: 38, attendance: '91%', cost: '₹12.8L', rating: 'A' },
    { dept: 'Operations', headcount: 31, attendance: '93%', cost: '₹9.4L', rating: 'B+' },
    { dept: 'Design', headcount: 18, attendance: '97%', cost: '₹5.6L', rating: 'A+' },
    { dept: 'HR & Admin', headcount: 12, attendance: '95%', cost: '₹3.2L', rating: 'A' },
    { dept: 'Executive', headcount: 15, attendance: '89%', cost: '₹8.4L', rating: 'B' },
];

const leaveStats = [
    { type: 'Casual Leave', used: 234, total: 480, color: 'bg-primary-main' },
    { type: 'Sick Leave', used: 89, total: 240, color: 'bg-accent-warning' },
    { type: 'Earned Leave', used: 156, total: 720, color: 'bg-accent-success' },
    { type: 'Comp Off', used: 42, total: 120, color: 'bg-accent-payroll' },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-12 animate-fade-in-up">
                <div>
                    <h1 className="text-display tracking-tighter flex items-center gap-6">
                        <ChartBar weight="duotone" className="w-16 h-16 text-primary-main opacity-40 animate-pulse" /> Analytics Nexus
                    </h1>
                    <p className="text-neutral-500 font-black uppercase tracking-[0.2em] mt-3 opacity-60 text-[10px]">Macro-Scale Organizational Diagnostics</p>
                </div>
                <Button className="rounded-[1.25rem] px-10 h-14 bg-neutral-900 text-white gap-4 shadow-premium-xl hover:bg-primary-main hover:-translate-y-1 transition-all font-black text-[10px] uppercase tracking-widest">
                    <DownloadSimple weight="bold" className="w-6 h-6 text-primary-light" /> Synchronize Data Stack
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                {kpis.map((kpi, idx) => (
                    <Card key={kpi.label} className="bg-white border-none glass-card shadow-premium-md rounded-[2.5rem] hover:shadow-premium-xl hover:-translate-y-1 transition-all duration-500 cursor-default overflow-hidden relative animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                        <CardContent className="p-8 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`w-14 h-14 rounded-[1.25rem] bg-neutral-50 border border-neutral-100 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                                    <kpi.icon weight="duotone" className={`w-7 h-7 ${kpi.color}`} />
                                </div>
                                <div className={`flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm ${kpi.trend === 'up' ? 'text-accent-success bg-accent-success/5' : 'text-accent-warning bg-accent-warning/5'}`}>
                                    {kpi.trend === 'up' ? '↑' : '↓'} {kpi.change}
                                </div>
                            </div>
                            <p className="text-4xl font-black text-neutral-900 tracking-tighter mb-1.5 group-hover:translate-x-1 transition-transform">{kpi.value}</p>
                            <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.25em] opacity-80">{kpi.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                {/* Attendance Trend Chart */}
                <Card className="bg-white border-none glass-card shadow-premium-lg rounded-[3rem] overflow-hidden animate-scale-in" style={{ animationDelay: '400ms' }}>
                    <CardHeader className="p-8 border-b border-neutral-100/50">
                        <CardTitle className="text-xl flex items-center justify-between text-neutral-900 font-black tracking-tighter">
                            <span className="flex items-center gap-4"><Calendar weight="duotone" className="w-8 h-8 text-primary-main opacity-40" /> Attendance Velocity</span>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-300">6 MONTH WINDOW</div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="flex items-end justify-between gap-6 h-56">
                            {attendanceData.map((d) => (
                                <div key={d.month} className="flex-1 flex flex-col items-center gap-4 group">
                                    <span className="text-xs font-black text-primary-main opacity-0 group-hover:opacity-100 transition-opacity">{d.rate}%</span>
                                    <div className="w-full bg-neutral-50 rounded-2xl overflow-hidden shadow-inner p-1" style={{ height: '100%' }}>
                                        <div
                                            className="w-full bg-gradient-to-t from-primary-main to-primary-light rounded-xl transition-all duration-1000 shadow-premium-sm group-hover:shadow-premium-xl animate-mesh"
                                            style={{ height: `${d.rate}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] group-hover:text-primary-main transition-colors">{d.month}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Leave Utilization */}
                <Card className="bg-neutral-900 text-white shadow-premium-xl rounded-[3rem] overflow-hidden animate-scale-in" style={{ animationDelay: '500ms' }}>
                    <CardHeader className="p-8 border-b border-white/10">
                        <CardTitle className="text-xl flex items-center justify-between text-white font-black tracking-tighter">
                            <span className="flex items-center gap-4"><Clock weight="duotone" className="w-8 h-8 text-primary-light opacity-40" /> Quota Utilization</span>
                            <div className="text-[10px] font-black uppercase tracking-widest text-white/20">ANNUAL ALLOCATION</div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                        {leaveStats.map((l) => (
                            <div key={l.type} className="space-y-3 group cursor-default">
                                <div className="flex justify-between text-sm items-end">
                                    <span className="font-black text-white/80 group-hover:text-white transition-colors tracking-tight uppercase text-[11px] tracking-[0.1em]">{l.type}</span>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">{l.used} / {l.total} NODES</span>
                                </div>
                                <div className="h-4 bg-white/5 rounded-full overflow-hidden shadow-inner p-0.5 border border-white/5">
                                    <div
                                        className={`h-full ${l.color} rounded-full transition-all duration-1000 shadow-2xl group-hover:animate-pulse`}
                                        style={{ width: `${(l.used / l.total) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Department Performance Table */}
            <Card className="bg-white border-none glass-card shadow-premium-xl rounded-[3.5rem] overflow-hidden animate-scale-in" style={{ animationDelay: '600ms' }}>
                <CardHeader className="p-8 border-b border-neutral-100/50 bg-neutral-50/30">
                    <CardTitle className="text-xl flex items-center justify-between text-neutral-900 font-black tracking-tighter">
                        <span className="flex items-center gap-4"><UsersThree weight="duotone" className="w-8 h-8 text-primary-main opacity-40" /> Node Performance Ledger</span>
                        <div className="text-[10px] font-black uppercase tracking-widest text-neutral-300">DEPARTMENTAL SYNC</div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-neutral-100/50 bg-neutral-50/10">
                                    <th className="text-left py-8 px-10 font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Department Node</th>
                                    <th className="text-center py-8 px-10 font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Population</th>
                                    <th className="text-center py-8 px-10 font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Sync Status</th>
                                    <th className="text-center py-8 px-10 font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Logistics Cost</th>
                                    <th className="text-right py-8 px-10 font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Cognitive Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deptPerformance.map((d, idx) => (
                                    <tr key={d.dept} className="border-b border-neutral-100/50 hover:bg-neutral-50/50 transition-all group">
                                        <td className="py-8 px-10">
                                            <div className="flex items-center gap-4">
                                                <div className="w-2 h-2 rounded-full bg-primary-main opacity-0 group-hover:opacity-100 transition-all scale-0 group-hover:scale-100 shadow-[0_0_10px_rgba(45,91,255,0.5)]" />
                                                <span className="font-black text-sm text-neutral-900 tracking-tight group-hover:translate-x-1 transition-transform">{d.dept}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-10 text-center font-bold text-neutral-700">{d.headcount}</td>
                                        <td className="py-8 px-10 text-center">
                                            <div className="flex items-center justify-center gap-2 font-black text-[11px] text-neutral-900 tracking-tighter">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse" />
                                                {d.attendance}
                                            </div>
                                        </td>
                                        <td className="py-8 px-10 text-center font-black text-sm text-neutral-900">{d.cost}</td>
                                        <td className="py-8 px-10 text-right">
                                            <Badge variant="outline" className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm transition-all group-hover:scale-105 ${d.rating.startsWith('A') ? 'bg-accent-success/10 text-accent-success border-accent-success/20 shadow-accent-success/5' : 'bg-accent-warning/10 text-accent-warning border-accent-warning/20 shadow-accent-warning/5'
                                                }`}>{d.rating}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
