'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Buildings, Bell, ShieldCheck, Palette, GlobeSimple, FloppyDisk } from "@phosphor-icons/react";

export const dynamic = 'force-dynamic';

const sections = [
    {
        icon: Buildings,
        title: 'Organization',
        desc: 'Company name, logo, and registration details.',
        fields: [
            { label: 'Company Name', value: 'PEPL Group', type: 'text' },
            { label: 'Industry', value: 'Technology & Services', type: 'text' },
            { label: 'Timezone', value: 'Asia/Kolkata (IST)', type: 'text' },
        ],
    },
    {
        icon: Bell,
        title: 'Notifications',
        desc: 'Configure email and push notification preferences.',
        fields: [
            { label: 'Email Alerts', value: 'Enabled', type: 'toggle' },
            { label: 'Leave Approvals', value: 'Enabled', type: 'toggle' },
            { label: 'Payroll Reminders', value: 'Enabled', type: 'toggle' },
        ],
    },
    {
        icon: ShieldCheck,
        title: 'Security',
        desc: 'Authentication and access control settings.',
        fields: [
            { label: 'Two-Factor Auth', value: 'Enabled', type: 'toggle' },
            { label: 'Session Timeout', value: '30 minutes', type: 'text' },
            { label: 'Password Policy', value: 'Strong (12+ chars)', type: 'text' },
        ],
    },
    {
        icon: Palette,
        title: 'Appearance',
        desc: 'Theme, branding, and display preferences.',
        fields: [
            { label: 'Theme', value: 'System Default', type: 'text' },
            { label: 'Accent Color', value: 'Primary Blue', type: 'text' },
            { label: 'Date Format', value: 'DD/MM/YYYY', type: 'text' },
        ],
    },
];

export default function SettingsPage() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <GlobeSimple weight="duotone" className="w-8 h-8 text-primary-main" /> Settings
                    </h1>
                    <p className="text-neutral-500 font-medium mt-1">Manage organization-wide preferences and configurations.</p>
                </div>
                <Button className="rounded-xl px-8 h-12 bg-primary-main gap-3 shadow-lg shadow-primary-main/20 hover:translate-y-[-2px] transition-all font-bold">
                    <FloppyDisk weight="bold" className="w-5 h-5" /> Save Changes
                </Button>
            </div>

            <div className="space-y-6">
                {sections.map((section) => (
                    <Card key={section.title} className="bg-white border-2 border-neutral-100 shadow-sm rounded-[2rem] overflow-hidden">
                        <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
                            <CardTitle className="text-lg flex items-center gap-3 text-neutral-900 font-black">
                                <section.icon weight="duotone" className="w-6 h-6 text-primary-main" /> {section.title}
                            </CardTitle>
                            <CardDescription className="font-medium">{section.desc}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {section.fields.map((field) => (
                                    <div key={field.label} className="flex items-center justify-between py-4 border-b border-neutral-100 last:border-none">
                                        <span className="text-sm font-bold text-neutral-700">{field.label}</span>
                                        {field.type === 'toggle' ? (
                                            <Badge className="rounded-full bg-accent-success/10 text-accent-success border-accent-success/20 font-black text-[10px] uppercase px-3" variant="outline">
                                                {field.value}
                                            </Badge>
                                        ) : (
                                            <span className="text-sm font-medium text-neutral-400">{field.value}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
