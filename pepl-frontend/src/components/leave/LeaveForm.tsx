"use client";

import React, { useState } from 'react';
import { Calendar, FileDoc, PaperPlaneRight, Info } from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function LeaveForm() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h2 className="text-3xl font-black tracking-tight">Apply for Leave</h2>
                <p className="text-muted-foreground">Submit your leave request for approval.</p>
            </div>

            <Card className="p-8 bg-white border-2 border-neutral-100 shadow-sm rounded-[2rem]">
                <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-label uppercase tracking-widest text-neutral-400">Leave Type</label>
                            <select className="w-full h-12 bg-neutral-50 border-2 border-transparent rounded-xl px-4 text-sm focus:bg-white focus:border-primary-main focus:shadow-[0_0_0_4px_rgba(45,91,255,0.1)] outline-none transition-all appearance-none cursor-pointer font-medium">
                                <option>Privilege Leave (PL)</option>
                                <option>Sick Leave (SL)</option>
                                <option>Casual Leave (CL)</option>
                                <option>Work From Home (WFH)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-label uppercase tracking-widest text-neutral-400">Available Balance</label>
                            <div className="h-12 flex items-center px-4 bg-accent-success/5 text-accent-success rounded-xl border-2 border-accent-success/10 font-black text-xs uppercase tracking-widest">
                                12 Days Remaining
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-label uppercase tracking-widest text-neutral-400">Start Date</label>
                            <div className="relative">
                                <Calendar weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-main" />
                                <input
                                    type="date"
                                    className="w-full h-12 bg-neutral-50 border-2 border-transparent rounded-xl pl-12 pr-4 text-sm focus:bg-white focus:border-primary-main focus:shadow-[0_0_0_4px_rgba(45,91,255,0.1)] outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-label uppercase tracking-widest text-neutral-400">End Date</label>
                            <div className="relative">
                                <Calendar weight="duotone" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-main" />
                                <input
                                    type="date"
                                    className="w-full h-12 bg-neutral-50 border-2 border-transparent rounded-xl pl-12 pr-4 text-sm focus:bg-white focus:border-primary-main focus:shadow-[0_0_0_4px_rgba(45,91,255,0.1)] outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-label uppercase tracking-widest text-neutral-400">Reason for Leave</label>
                        <div className="relative">
                            <FileDoc weight="duotone" className="absolute left-4 top-4 w-5 h-5 text-primary-main" />
                            <textarea
                                placeholder="Briefly describe the reason for your leave..."
                                className="w-full min-h-[120px] bg-neutral-50 border-2 border-transparent rounded-xl pl-12 pr-4 py-4 text-sm focus:bg-white focus:border-primary-main focus:shadow-[0_0_0_4px_rgba(45,91,255,0.1)] outline-none transition-all resize-none font-medium"
                            />
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-accent-warning/5 border-2 border-accent-warning/10 flex gap-3">
                        <Info weight="duotone" className="w-6 h-6 text-accent-warning shrink-0" />
                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                            <span className="font-bold text-accent-warning">Note:</span> Leave requests submitted within 24 hours of start date may require direct manager approval via call or WhatsApp.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 rounded-xl text-lg font-black bg-primary-main shadow-xl shadow-primary-main/20 flex gap-3 overflow-hidden group hover:translate-y-[-2px] transition-all"
                    >
                        Submit Request
                        <PaperPlaneRight weight="bold" className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                </form>
            </Card>
        </div>
    );
}
