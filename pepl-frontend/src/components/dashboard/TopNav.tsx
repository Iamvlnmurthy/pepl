'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, MagnifyingGlass, CheckCircle, WarningCircle, Info } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/components/ui/toast-provider";

export function TopNav() {
    const { toast } = useToast();
    const [showNotifications, setShowNotifications] = useState(false);
    const [unreadCount, setUnreadCount] = useState(3);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const notifications = [
        { id: 1, title: 'Payroll Processed', time: '10m ago', icon: <CheckCircle weight="duotone" className="w-4 h-4 text-emerald-500" /> },
        { id: 2, title: 'New Leave Request', time: '1h ago', icon: <WarningCircle weight="duotone" className="w-4 h-4 text-orange-500" /> },
        { id: 3, title: 'Sync Complete', time: '2h ago', icon: <Info weight="duotone" className="w-4 h-4 text-blue-500" /> },
    ];

    return (
        <header className="h-24 glass flex items-center justify-between px-10 z-50 sticky top-0 transition-all duration-300 surface-noise border-b border-neutral-100/50">
            <div className="flex items-center gap-6 md:hidden">
                <Logo collapsed />
            </div>
            <div className="flex items-center gap-4 w-[450px]">
                <div className="relative w-full text-neutral-400 group">
                    <MagnifyingGlass weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors group-focus-within:text-primary-main" />
                    <input
                        type="text"
                        placeholder="Search for employees, documents, or reports..."
                        className="w-full bg-white/50 backdrop-blur-sm border-2 border-neutral-100/50 rounded-2xl py-3 pl-11 pr-4 text-sm transition-all text-neutral-900 focus:bg-white focus:border-primary-main focus:shadow-premium-xl outline-none font-bold placeholder:text-neutral-300 placeholder:font-medium"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`w-12 h-12 rounded-2xl relative transition-all duration-300 ${showNotifications ? 'bg-primary-main text-white shadow-xl shadow-primary-main/30' : 'text-neutral-500 hover:bg-white hover:shadow-premium-md'}`}
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell weight="duotone" className="w-6 h-6" />
                        {unreadCount > 0 && !showNotifications && <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent-error rounded-full border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse" />}
                    </Button>

                    {showNotifications && (
                        <div ref={dropdownRef} className="absolute right-0 mt-4 w-96 glass-card rounded-[2.5rem] p-3 animate-in fade-in zoom-in-95 duration-300 shadow-premium-xl z-50 overflow-hidden border-white/50">
                            <div className="p-5 border-b border-neutral-100/50 flex items-center justify-between">
                                <h3 className="font-black text-[11px] uppercase tracking-[0.25em] text-neutral-500">Center Analytics</h3>
                                <button
                                    className="text-[10px] font-black text-primary-main cursor-pointer hover:underline uppercase tracking-widest bg-primary-subtle px-3 py-1.5 rounded-full"
                                    onClick={() => {
                                        setUnreadCount(0);
                                        toast("All notifications marked as read", "success");
                                    }}
                                >
                                    Mark all read
                                </button>
                            </div>
                            <div className="max-h-[28rem] overflow-y-auto no-scrollbar py-2">
                                {notifications.map((n) => (
                                    <div key={n.id} className="p-5 mx-2 rounded-[2rem] hover:bg-white/60 hover:shadow-premium-sm transition-all flex items-start gap-4 cursor-pointer group mb-1">
                                        <div className="w-11 h-11 rounded-2xl bg-white border border-neutral-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-premium-md transition-all">
                                            {n.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-neutral-900 leading-tight mb-1 group-hover:text-primary-main transition-colors">{n.title}</p>
                                            <p className="text-[11px] text-neutral-500 font-bold opacity-70 tracking-tight">{n.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 border-t border-neutral-100/50 bg-neutral-50/30">
                                <button className="w-full h-12 btn-prism">View All Activity</button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 ml-4 h-10 px-1 rounded-full">
                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-8 h-8 rounded-full border border-primary/20"
                                }
                            }}
                        />
                        <div className="hidden sm:block">
                            <p className="text-xs font-bold leading-none">Command Center</p>
                            <p className="text-[10px] text-muted-foreground">Authorized session</p>
                        </div>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton mode="modal">
                            <Button variant="outline" size="sm" className="rounded-xl border-2 font-bold px-6">Sign In</Button>
                        </SignInButton>
                    </SignedOut>
                </div>
            </div>
        </header>
    );
}
