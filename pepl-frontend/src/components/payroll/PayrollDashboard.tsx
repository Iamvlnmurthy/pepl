"use client";

import React, { useState } from 'react';
import {
    Bank,
    DownloadSimple,
    Play,
    ClockCounterClockwise,
    CheckCircle,
    WarningCircle,
    ChartLineUp,
    FileDoc,
    CircleNotch
} from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export function PayrollDashboard() {
    const [isProcessing, setIsProcessing] = useState(false);

    const [recentRuns, setRecentRuns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const stats = [
        { label: 'Monthly Payout', value: '₹48.6L', icon: Bank, color: 'text-accent-success', bgColor: 'bg-accent-success/10' },
        { label: 'Total Employees', value: '156', icon: ChartLineUp, color: 'text-primary-main', bgColor: 'bg-primary-main/10' },
        { label: 'Draft Runs', value: '4', icon: FileDoc, color: 'text-accent-warning', bgColor: 'bg-accent-warning/10' },
    ];

    return (
        <div className="space-y-10 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-display tracking-tighter">Finance Terminal</h2>
                    <p className="text-neutral-500 font-black uppercase tracking-[0.2em] mt-2 opacity-60 text-[10px]">Salary & Statutory Logistics</p>
                </div>
                <Button
                    onClick={() => {
                        setIsProcessing(true);
                        setTimeout(() => setIsProcessing(false), 2000);
                    }}
                    disabled={isProcessing}
                    className="h-14 px-10 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest flex gap-3 shadow-premium-xl bg-neutral-900 text-white hover:bg-primary-main hover:-translate-y-1 transition-all"
                >
                    {isProcessing ? <CircleNotch weight="bold" className="animate-spin w-5 h-5" /> : <Play weight="duotone" className="w-5 h-5 text-primary-light" />}
                    Initialize Salary Run
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map((stat, idx) => (
                    <Card key={stat.label} className="p-8 bg-white border-2 border-neutral-100/50 overflow-hidden relative group rounded-[3rem] shadow-premium-md hover:shadow-premium-xl transition-all duration-500 animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                        <div className="flex items-center gap-6 relative z-10">
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${stat.bgColor} ${stat.color} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                <stat.icon weight="duotone" className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-1.5 opacity-80">{stat.label}</p>
                                <p className="text-4xl font-black text-neutral-900 tracking-tighter group-hover:translate-x-1 transition-transform">{stat.value}</p>
                            </div>
                        </div>
                        <div className={`absolute bottom-[-10%] right-[-10%] w-24 h-24 ${stat.bgColor} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700`} />
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-0 bg-white border-none glass-card rounded-[3rem] shadow-premium-lg overflow-hidden animate-scale-in" style={{ animationDelay: '300ms' }}>
                    <div className="p-8 border-b border-neutral-100/50 flex items-center justify-between">
                        <h3 className="font-black text-sm tracking-tight flex items-center gap-3">
                            <ClockCounterClockwise weight="duotone" className="w-6 h-6 text-primary-main" /> Historical Disbursements
                        </h3>
                        <Button variant="outline" size="sm" className="rounded-full px-6 font-black text-[10px] uppercase tracking-widest hover:bg-neutral-900 hover:text-white transition-all">Archive Data</Button>
                    </div>
                    <Table>
                        <TableHeader className="bg-neutral-50/40">
                            <TableRow className="border-b border-neutral-100 hover:bg-transparent">
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-neutral-400 h-16 py-8 pl-10">Logistics Period</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-neutral-400 h-16">Capital Outflow</TableHead>
                                <TableHead className="font-black text-[10px] uppercase tracking-[0.2em] text-neutral-400 h-16">Terminal Status</TableHead>
                                <TableHead className="text-right font-black text-[10px] uppercase tracking-[0.2em] text-neutral-400 h-16 pr-10">Verification Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentRuns.length > 0 ? recentRuns.map((run) => (
                                <TableRow key={run.id} className="hover:bg-white/60 transition-all group">
                                    <TableCell className="font-black text-sm tracking-tight pl-10 group-hover:text-primary-main transition-colors">{run.period}</TableCell>
                                    <TableCell className="font-black text-sm">{run.payout}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-accent-success/10 text-accent-success border-accent-success/20 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-success mr-2 animate-pulse" />
                                            {run.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-[11px] text-neutral-400 pr-10">{run.processed}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-48 text-center text-neutral-400 font-bold text-sm italic">
                                        No recent runs detected in synchronization terminal.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Card>

                <Card className="p-8 bg-neutral-900 text-white space-y-8 rounded-[3rem] shadow-premium-xl animate-scale-in" style={{ animationDelay: '400ms' }}>
                    <h3 className="font-black text-sm tracking-tight flex items-center gap-3">
                        <WarningCircle weight="duotone" className="w-6 h-6 text-accent-warning" /> Critical Interlocks
                    </h3>
                    <div className="space-y-5">
                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-accent-warning" />
                            <p className="text-sm font-black text-white leading-tight">Verify Statutory Deductions</p>
                            <p className="text-[11px] text-white/50 font-bold mt-2 leading-relaxed tracking-tight">PF & ESI for 12 new employees need manual verification before terminal run.</p>
                            <Button variant="link" className="p-0 h-auto text-[10px] font-black text-primary-light mt-4 uppercase tracking-[0.2em] hover:translate-x-1 transition-transform">Solve Interlock →</Button>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-1 h-full bg-primary-main" />
                            <p className="text-sm font-black text-white leading-tight">Generate Form-16 Stack</p>
                            <p className="text-[11px] text-white/50 font-bold mt-2 leading-relaxed tracking-tight">Tax documentation ready for synchronized generation for the current cycle.</p>
                            <Button variant="link" className="p-0 h-auto text-[10px] font-black text-primary-light mt-4 uppercase tracking-[0.2em] hover:translate-x-1 transition-transform">Initialize Protocol →</Button>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/10">
                        <h4 className="text-[10px] font-black text-white/30 uppercase mb-6 tracking-[0.3em]">Compliance Node Status</h4>
                        <div className="space-y-5">
                            <div className="flex items-center justify-between group cursor-default">
                                <span className="text-[11px] font-black text-white/60 tracking-wider group-hover:text-white transition-colors">PF CONTRIBUTIONS</span>
                                <CheckCircle weight="duotone" className="w-6 h-6 text-accent-success opacity-80 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="flex items-center justify-between group cursor-default">
                                <span className="text-[11px] font-black text-white/60 tracking-wider group-hover:text-white transition-colors">ESI FILING LOGS</span>
                                <CheckCircle weight="duotone" className="w-6 h-6 text-accent-success opacity-80 group-hover:opacity-100 transition-all" />
                            </div>
                            <div className="flex items-center justify-between group cursor-default">
                                <span className="text-[11px] font-black text-white/60 tracking-wider group-hover:text-white transition-colors">PT PAYMENT NODES</span>
                                <CheckCircle weight="duotone" className="w-6 h-6 text-accent-success opacity-80 group-hover:opacity-100 transition-all" />
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
