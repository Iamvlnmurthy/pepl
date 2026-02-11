"use client";

import React, { useState } from 'react';
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    eachDayOfInterval
} from 'date-fns';
import { CaretLeft, CaretRight, Clock, MapPinLine, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useToast } from '@/components/ui/toast-provider';

interface AttendanceLog {
    date: Date;
    status: 'present' | 'absent' | 'leave' | 'late';
    checkIn?: string;
    checkOut?: string;
    location?: string;
}

export function AttendanceCalendar() {
    const { toast } = useToast();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Mock data for demonstration
    const [logs] = useState<AttendanceLog[]>([]);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const getDayStatus = (day: Date) => {
        return logs.find(log => isSameDay(log.date, day));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-10 animate-fade-in-up">
                <div>
                    <h2 className="text-display tracking-tighter">{format(currentMonth, 'MMMM yyyy')}</h2>
                    <p className="text-neutral-500 font-black uppercase tracking-[0.2em] mt-2 opacity-60 text-[10px]">Temporal Attendance Records</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-[1.25rem] border-2 hover:bg-neutral-900 hover:text-white transition-all shadow-premium-sm" onClick={prevMonth}>
                        <CaretLeft weight="bold" className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" className="w-12 h-12 rounded-[1.25rem] border-2 hover:bg-neutral-900 hover:text-white transition-all shadow-premium-sm" onClick={nextMonth}>
                        <CaretRight weight="bold" className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Calendar Grid */}
                <Card className="lg:col-span-5 p-8 bg-white border-none glass-card rounded-[3rem] shadow-premium-lg animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <div className="grid grid-cols-7 border-b border-neutral-100/50 pb-6 mb-8">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em]">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-3">
                        {days.map((day, idx) => {
                            const log = getDayStatus(day);
                            const isToday = isSameDay(day, new Date());
                            const isCurrentMonth = isSameMonth(day, monthStart);

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedDate(day)}
                                    className={cn(
                                        "min-h-[130px] p-4 rounded-[2rem] transition-all cursor-pointer relative group border-2",
                                        !isCurrentMonth ? "border-transparent opacity-20 grayscale" : "border-neutral-50 bg-neutral-50/20 hover:bg-white hover:border-white hover:shadow-premium-md",
                                        isSameDay(day, selectedDate) && "border-primary-main bg-white shadow-premium-lg"
                                    )}
                                >
                                    <span className={cn(
                                        "text-xs font-black h-8 w-8 flex items-center justify-center rounded-xl transition-all",
                                        isToday ? "bg-primary-main text-white shadow-xl shadow-primary-main/30" : "text-neutral-900 group-hover:text-primary-main"
                                    )}>
                                        {format(day, 'd')}
                                    </span>

                                    {log && (
                                        <div className="mt-2 space-y-1">
                                            <div className={cn(
                                                "text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit font-black tracking-tighter",
                                                log.status === 'present' && "bg-accent-success/10 text-accent-success",
                                                log.status === 'late' && "bg-accent-warning/10 text-accent-warning",
                                                log.status === 'leave' && "bg-primary-subtle text-primary-main",
                                                log.status === 'absent' && "bg-accent-error/10 text-accent-error",
                                            )}>
                                                <div className={cn(
                                                    "w-1 h-1 rounded-full",
                                                    log.status === 'present' && "bg-emerald-500",
                                                    log.status === 'late' && "bg-amber-500",
                                                    log.status === 'leave' && "bg-blue-500",
                                                    log.status === 'absent' && "bg-red-500",
                                                )} />
                                                {log.status.toUpperCase()}
                                            </div>
                                            {log.checkIn && log.checkIn !== '-' && (
                                                <div className="text-[10px] text-neutral-500 flex items-center gap-1 font-medium">
                                                    <Clock weight="duotone" className="w-3 h-3" />
                                                    {log.checkIn}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </Card>

                {/* Selected Date Details */}
                <div className="lg:col-span-2 p-8 rounded-[3rem] shadow-premium-xl flex flex-col gap-10 animate-scale-in" style={{ animationDelay: '200ms', backgroundColor: '#171717', color: 'white' }}>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter" style={{ color: 'white' }}>{format(selectedDate, 'EEEE')}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>{format(selectedDate, 'do MMMM, yyyy')}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 rounded-[2.5rem] space-y-5 relative overflow-hidden group" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform">
                                <Clock weight="duotone" className="w-12 h-12" />
                            </div>
                            <div className="flex items-center justify-between text-sm relative z-10">
                                <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    <Clock weight="duotone" className="w-4 h-4 text-primary-light" /> CHECK-IN
                                </span>
                                <span className="font-black" style={{ color: 'white' }}>{getDayStatus(selectedDate)?.checkIn || '--:--'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm relative z-10">
                                <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    <Clock weight="duotone" className="w-4 h-4 text-primary-light" /> CHECK-OUT
                                </span>
                                <span className="font-black" style={{ color: 'white' }}>{getDayStatus(selectedDate)?.checkOut || '--:--'}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5 relative z-10">
                                <span className="font-black text-[10px] uppercase tracking-widest flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)' }}>
                                    <MapPinLine weight="duotone" className="w-4 h-4 text-primary-light" /> LOCATION
                                </span>
                                <span className="font-black truncate max-w-[120px]" style={{ color: 'white' }}>{getDayStatus(selectedDate)?.location || 'N/A'}</span>
                            </div>
                        </div>

                        <div className="p-6 rounded-[2rem] flex items-center gap-5 transition-all" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div className="h-12 w-12 rounded-2xl bg-primary-main flex items-center justify-center text-white shadow-xl shadow-primary-main/20">
                                <CheckCircle weight="duotone" className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.5)' }}>Work Node Status</p>
                                <p className="text-sm font-black tracking-tight" style={{ color: 'white' }}>Active Protocol</p>
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest shadow-xl transition-all transform active:scale-95"
                            style={{ background: 'white', color: '#171717' }}
                            onClick={() => toast(`Correction request submitted for ${format(selectedDate, 'MMM dd')}`, "info")}
                        >
                            Request Correction
                        </Button>
                    </div>

                    <div className="mt-auto">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Monthly Pulse</h4>
                        <div className="grid grid-cols-2 gap-5">
                            <div className="text-center p-6 rounded-[2rem] transition-all group" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p className="text-3xl font-black mb-1" style={{ color: 'white' }}>--</p>
                                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>PRESENT</p>
                            </div>
                            <div className="text-center p-6 rounded-[2rem] transition-all group" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <p className="text-3xl font-black mb-1" style={{ color: 'white' }}>--</p>
                                <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>LATE</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
