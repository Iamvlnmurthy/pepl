'use client';

import React from 'react';
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopNav } from "@/components/dashboard/TopNav";
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground font-sans antialiased">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopNav />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/30 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
