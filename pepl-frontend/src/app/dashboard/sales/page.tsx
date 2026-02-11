'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartLineUp,
    Target,
    Medal,
    CurrencyInr,
    ArrowUpRight,
    ChartBar,
    Calendar
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default function SalesDashboardPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-between mb-10 animate-fade-in-up">
                <div>
                    <h1 className="text-display tracking-tighter">Revenue Command</h1>
                    <p className="text-neutral-500 font-black uppercase tracking-[0.2em] mt-2 opacity-60 text-[10px]">Capital Inflow & Incentive Terminal</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="rounded-[1.25rem] px-8 h-14 border-2 hover:bg-neutral-900 hover:text-white transition-all shadow-premium-sm font-black text-[10px] uppercase tracking-widest">
                        <Calendar weight="duotone" className="mr-3 w-5 h-5 text-primary-main" />
                        February 2026 Cycle
                    </Button>
                    <Button className="rounded-[1.25rem] px-8 h-14 bg-neutral-900 text-white shadow-premium-xl hover:bg-primary-main hover:-translate-y-1 transition-all font-black text-[10px] uppercase tracking-widest">
                        <CurrencyInr weight="bold" className="mr-3 w-5 h-5 text-primary-light" />
                        Disburse Earnings
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <StatsCard
                    title="Gross Capital Outflow"
                    value="₹45.2M"
                    change="+18.2% Efficiency"
                    icon={<CurrencyInr weight="duotone" />}
                    trend="up"
                    accent="var(--color-primary-main)"
                />
                <StatsCard
                    title="Projected Incentive"
                    value="₹1.24L"
                    change="Pending Verification"
                    icon={<Medal weight="duotone" />}
                    accent="var(--color-accent-warning)"
                />
                <StatsCard
                    title="Operational Lead"
                    value="Alex Rivera"
                    change="145% Achievement"
                    icon={<Target weight="duotone" />}
                    trend="up"
                    accent="var(--color-accent-success)"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="bg-white border-2 border-neutral-100 shadow-sm rounded-[2.5rem] p-8">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-xl font-bold flex items-center justify-between text-neutral-900 tracking-tight">
                            Target Achievement
                            <ChartBar weight="duotone" className="w-6 h-6 text-primary-main" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 space-y-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">Total Logistics Goal (₹50M)</p>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-primary-main tracking-tighter">₹45.2M</p>
                                    <p className="text-[10px] font-black text-accent-success uppercase tracking-widest mt-1">90.4% Completed</p>
                                </div>
                            </div>
                            <div className="h-5 bg-neutral-100/50 rounded-full overflow-hidden border border-neutral-100 shadow-inner p-1">
                                <div className="h-full bg-gradient-to-r from-primary-main to-primary-light w-[90.4%] rounded-full shadow-[0_0_20px_rgba(45,91,255,0.4)] transition-all duration-1000 animate-pulse" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                <p className="text-label uppercase tracking-widest opacity-70">Region: North</p>
                                <p className="text-lg font-black text-neutral-900">₹18.4M</p>
                                <p className="text-xs text-accent-success font-bold">Over Target</p>
                            </div>
                            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                <p className="text-label uppercase tracking-widest opacity-70">Region: South</p>
                                <p className="text-lg font-black text-neutral-900">₹12.8M</p>
                                <p className="text-xs text-accent-warning font-bold italic">Approaching Target</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-neutral-900 text-white shadow-premium-xl rounded-[3rem] p-10 overflow-hidden relative animate-scale-in" style={{ animationDelay: '200ms' }}>
                    <div className="absolute top-[-10%] right-[-10%] w-60 h-60 bg-primary-main/20 rounded-full blur-[100px] animate-pulse" />
                    <CardHeader className="p-0 mb-10">
                        <CardTitle className="text-2xl font-black flex items-center gap-4 text-white tracking-tighter">
                            <Medal weight="duotone" className="w-10 h-10 text-primary-light" />
                            Earning Spectrum
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex flex-col h-full relative z-10">
                        <div className="space-y-6 flex-1">
                            <BreakdownItem label="BASE COMMISSION NODE (2%)" value="₹90,400" />
                            <BreakdownItem label="THRESHOLD OVERFLOW BONUS" value="₹25,000" />
                            <BreakdownItem label="NETWORK REFERRAL YIELD" value="₹9,100" />
                            <div className="pt-8 mt-4 border-t border-white/10">
                                <div className="flex justify-between items-center">
                                    <p className="font-black text-[10px] uppercase tracking-[0.3em] text-white/40">GROSS PAYABLE DISBURSEMENT</p>
                                    <p className="font-black text-5xl text-white tracking-tighter">₹1,24,500</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-12 p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center gap-6 group hover:bg-white/10 transition-all">
                            <div className="w-14 h-14 rounded-2xl bg-primary-main flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                                <ChartLineUp weight="bold" className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-primary-light uppercase tracking-[0.25em] mb-1">PROGNOSTIC INSIGHT</p>
                                <p className="text-base font-black text-white leading-tight tracking-tight">You are on track to yield ₹45,000+ surplus this cycle.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, change, icon, trend = 'neutral', accent }: { title: string, value: string, change: string, icon: any, trend?: 'up' | 'down' | 'neutral', accent?: string }) {
    return (
        <Card className="bg-white border-none shadow-premium-md p-2 rounded-[3rem] hover:shadow-premium-xl hover:-translate-y-1 transition-all duration-500 cursor-default group relative overflow-hidden animate-scale-in">
            <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
            <CardContent className="p-8 flex items-start justify-between relative z-10">
                <div className="relative">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 mb-3 opacity-80">{title}</p>
                    <div className="text-4xl font-black text-neutral-900 tracking-tighter mb-4 group-hover:translate-x-1 transition-transform">{value}</div>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${trend === 'up' ? 'bg-accent-success/10 text-accent-success' : 'bg-neutral-100 text-neutral-400'}`}>
                            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
                        </div>
                    </div>
                </div>
                <div
                    className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-premium-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 text-white"
                    style={{ background: accent || 'var(--color-primary-main)' }}
                >
                    {/* @ts-ignore */}
                    {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement, { size: 28, weight: "duotone" }) : icon}
                </div>
            </CardContent>
            {/* Elegant backdrop focus */}
            <div
                className="absolute bottom-[-20%] right-[-10%] w-32 h-32 rounded-full opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 blur-[40px]"
                style={{ background: accent || 'var(--color-primary-main)' }}
            />
        </Card>
    );
}

function BreakdownItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between items-center py-5 border-b border-white/5 last:border-0 group cursor-default">
            <p className="text-[11px] font-black text-white/40 group-hover:text-white/60 transition-colors uppercase tracking-[0.2em]">{label}</p>
            <p className="text-base font-black text-white tracking-tight">{value}</p>
        </div>
    );
}
