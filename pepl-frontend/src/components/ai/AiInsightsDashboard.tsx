"use client";

import React, { useState } from 'react';
import {
    Sparkle,
    ChartLineDown,
    ChartLineUp,
    Target,
    Warning,
    Brain,
    Lightbulb,
    ArrowRight
} from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AiInsightsDashboard() {
    const [loading, setLoading] = useState(false);

    const insights = [
        {
            title: "Attrition Risk Analysis",
            type: "Risk Assessment",
            score: 24,
            trend: "down",
            desc: "Based on recent attendance and engagement patterns, the overall company attrition risk is low.",
            reasons: ["High engagement in training", "Consistent attendance in Q1", "Positive feedback in internal polls"],
            icon: ChartLineDown,
            color: "text-accent-success",
            bg: "bg-accent-success/10"
        },
        {
            title: "Sales Incentive Forecast",
            type: "Performance Prediction",
            score: 88,
            trend: "up",
            desc: "February sales targets are likely to be exceeded based on current deal pipeline velocity.",
            reasons: ["Shortened sales cycle", "Higher deal volume in Tech sector", "Incentive structure optimization"],
            icon: Target,
            color: "text-primary-main",
            bg: "bg-primary-subtle"
        }
    ];

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between mb-10 animate-fade-in-up">
                <div>
                    <h2 className="text-display tracking-tighter flex items-center gap-6">
                        <Brain weight="duotone" className="w-16 h-16 text-primary-main opacity-40 animate-pulse" /> Omniscient Engine
                    </h2>
                    <p className="text-neutral-500 font-black uppercase tracking-[0.2em] mt-3 opacity-60 text-[10px]">Strategic Forecasting & Neural Insights</p>
                </div>
                <Button className="h-14 px-10 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest flex gap-3 shadow-premium-xl bg-neutral-900 text-white hover:bg-primary-main hover:-translate-y-1 transition-all group">
                    <Sparkle weight="bold" className="w-5 h-5 transition-transform group-hover:rotate-12 text-primary-light" />
                    Synchronize Intelligence
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {insights.map((insight, idx) => (
                    <Card key={idx} className="p-10 bg-white border-none glass-card relative overflow-hidden group rounded-[3rem] shadow-premium-lg hover:shadow-premium-xl transition-all duration-500 animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                        <div className="absolute inset-0 bg-mesh opacity-0 group-hover:opacity-10 transition-opacity duration-700" />
                        <div className={`absolute -top-12 -right-12 w-48 h-48 ${insight.bg} opacity-[0.05] rounded-full blur-3xl transition-all group-hover:scale-125`} />

                        <div className="flex items-start justify-between mb-10">
                            <div className="space-y-3">
                                <Badge variant="outline" className={`${insight.bg} ${insight.color} border-none font-black uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 rounded-full`}>
                                    {insight.type}
                                </Badge>
                                <h3 className="text-2xl font-black text-neutral-900 tracking-tighter">{insight.title}</h3>
                            </div>
                            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${insight.bg} ${insight.color} shadow-premium-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                <insight.icon weight="duotone" className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="flex items-end gap-6 mb-12">
                            <div className="text-7xl font-black tracking-tighter text-neutral-900 group-hover:translate-x-1 transition-transform">
                                {insight.score}<span className="text-2xl text-neutral-300 font-black ml-1">%</span>
                            </div>
                            <div className="pb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-success bg-accent-success/5 px-4 py-1.5 rounded-full shadow-sm">
                                {insight.trend === 'up' ? '↑ TRENDING POSITIVE' : '↓ NORMALIZING'}
                            </div>
                        </div>

                        <p className="text-neutral-500 font-bold leading-relaxed mb-10 text-sm tracking-tight opacity-80">
                            {insight.desc}
                        </p>

                        <div className="space-y-5">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400 flex items-center gap-3">
                                <Lightbulb weight="duotone" className="w-6 h-6 text-accent-warning" /> Cognitive Drivers
                            </h4>
                            <div className="grid grid-cols-1 gap-3">
                                {insight.reasons.map((reason, i) => (
                                    <div key={i} className="flex items-center gap-4 text-[11px] font-black p-5 rounded-[2rem] bg-neutral-50/50 border border-neutral-100 hover:bg-white hover:shadow-premium-sm transition-all group/item">
                                        <div className={`w-2 h-2 rounded-full ${insight.color} shadow-sm animate-pulse`} />
                                        <span className="opacity-70 group-hover/item:opacity-100 transition-opacity uppercase tracking-wider">{reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button variant="outline" className="w-full mt-10 h-14 rounded-[1.25rem] font-black text-[10px] uppercase tracking-widest flex gap-3 hover:bg-neutral-900 hover:text-white transition-all border-2">
                            Execute Detailed Analysis <ArrowRight weight="bold" className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Card>
                ))}
            </div>

            <Card className="p-12 bg-neutral-900 text-white border-none rounded-[3.5rem] shadow-premium-xl animate-scale-in relative overflow-hidden" style={{ animationDelay: '300ms' }}>
                <div className="absolute top-0 right-0 w-80 h-80 bg-primary-main/10 rounded-full blur-[100px] animate-pulse" />
                <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
                    <div className="h-48 w-48 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center p-10 hover:bg-white/10 hover:scale-105 transition-all group">
                        <Sparkle weight="duotone" className="w-full h-full text-primary-light opacity-40 group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="space-y-6 flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-black text-white tracking-tighter">Strategic Query Protocol</h3>
                        <p className="text-white/50 font-bold leading-relaxed max-w-xl text-sm">
                            "Propose a recruitment cost reduction roadmap" or "Simulate retention impact of calibrated compensation cycles."
                        </p>
                        <div className="flex gap-5 max-w-2xl">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Enter strategic command..."
                                    className="w-full h-16 bg-white/5 border-2 border-white/10 rounded-[1.25rem] px-8 text-sm outline-none focus:border-primary-main focus:bg-white/10 transition-all font-black text-white placeholder:text-white/20 shadow-inner"
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-white/20 uppercase tracking-widest border border-white/10 px-2 py-1 rounded-md">PRESS ENTER</div>
                            </div>
                            <Button size="icon" className="h-16 w-16 rounded-[1.25rem] shadow-premium-xl bg-primary-main hover:bg-white hover:text-neutral-900 hover:-translate-y-2 transition-all">
                                <ArrowRight weight="bold" className="w-8 h-8" />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
