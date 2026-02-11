'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EnvelopeSimple, Phone, MapPin, Briefcase, Calendar, FileDoc, ShieldCheck, PencilSimple } from "@phosphor-icons/react";

export const dynamic = 'force-dynamic';

const profile = {
    name: 'John Doe',
    code: 'PEPL-001',
    role: 'Chief Executive Officer',
    department: 'Executive',
    email: 'john@pepl.com',
    phone: '+91 98765 43210',
    location: 'Hyderabad, India',
    joinDate: 'Jan 15, 2020',
    status: 'active',
    reportingTo: 'Board of Directors',
};

const quickStats = [
    { label: 'Leave Balance', value: '18 days', color: 'text-emerald-500' },
    { label: 'Attendance', value: '97%', color: 'text-blue-500' },
    { label: 'Documents', value: '12', color: 'text-purple-500' },
    { label: 'Team Size', value: '156', color: 'text-orange-500' },
];

export default function ProfilePage() {
    const [isEditing, setIsEditing] = React.useState(false);
    const [userData, setUserData] = React.useState(profile);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // In a real app, this would be an API call
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto relative">
            {isEditing && (
                <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg glass-card rounded-[3rem] p-8 animate-in zoom-in-95 duration-300">
                        <h2 className="text-3xl font-black tracking-tighter mb-8">Edit Profile</h2>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 font-bold outline-none focus:border-primary-main transition-all"
                                    value={userData.name}
                                    onChange={e => setUserData({ ...userData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest opacity-50 ml-2">Role</label>
                                <input
                                    type="text"
                                    className="w-full bg-neutral-50 border-2 border-neutral-100 rounded-2xl p-4 font-bold outline-none focus:border-primary-main transition-all"
                                    value={userData.role}
                                    onChange={e => setUserData({ ...userData, role: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" className="flex-1 h-14 rounded-2xl bg-primary-main text-white font-black uppercase tracking-widest shadow-xl shadow-primary-main/20">Save Changes</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
            {/* Profile Header */}
            <Card className="bg-white border-2 border-neutral-100 shadow-sm rounded-[2.5rem] overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-primary-main via-primary-dark to-neutral-900" />
                <CardContent className="relative px-8 pb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16">
                        <Avatar className="w-32 h-32 border-8 border-white shadow-2xl text-3xl rounded-[2.5rem] overflow-hidden">
                            <AvatarFallback className="bg-primary-main text-white font-black text-3xl">JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 pb-2">
                            <h1 className="text-4xl font-black text-neutral-900 tracking-tighter">{userData.name}</h1>
                            <p className="text-neutral-500 font-bold flex items-center gap-2">
                                {userData.role} <span className="text-primary-main opacity-30">&middot;</span> {userData.department}
                            </p>
                        </div>
                        <Button
                            className="rounded-xl px-8 h-12 bg-primary-main shadow-lg shadow-primary-main/20 hover:translate-y-[-2px] transition-all font-bold gap-3"
                            onClick={() => setIsEditing(true)}
                        >
                            <PencilSimple weight="bold" className="w-5 h-5" /> Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((s) => (
                    <Card key={s.label} className="bg-white border-2 border-neutral-100 shadow-sm rounded-3xl hover:translate-y-[-2px] transition-all cursor-default">
                        <CardContent className="p-6 text-center">
                            <p className={`text-2xl font-black ${s.color} tracking-tighter`}>{s.value}</p>
                            <p className="text-label uppercase tracking-widest mt-1 opacity-60">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-2 border-neutral-100 shadow-sm rounded-[2rem] overflow-hidden transform transition-all hover:shadow-lg">
                    <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
                        <CardTitle className="text-lg flex items-center gap-3 text-neutral-900 font-black">
                            <Briefcase weight="duotone" className="w-6 h-6 text-primary-main" /> Work Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <InfoRow icon={<ShieldCheck weight="duotone" className="w-5 h-5 text-primary-main" />} label="Employee Code" value={profile.code} />
                        <InfoRow icon={<Briefcase weight="duotone" className="w-5 h-5 text-primary-main" />} label="Department" value={profile.department} />
                        <InfoRow icon={<Calendar weight="duotone" className="w-5 h-5 text-primary-main" />} label="Joining Date" value={profile.joinDate} />
                        <InfoRow icon={<ShieldCheck weight="duotone" className="w-5 h-5 text-primary-main" />} label="Reports To" value={profile.reportingTo} />
                        <div className="flex items-center gap-3 pt-2">
                            <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest text-[10px]">Status</span>
                            <Badge className="rounded-full bg-accent-success/10 text-accent-success border-accent-success/20 font-black text-[10px] uppercase px-3" variant="outline">Active</Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-2 border-neutral-100 shadow-sm rounded-[2rem] overflow-hidden transform transition-all hover:shadow-lg">
                    <CardHeader className="bg-neutral-50/50 border-b border-neutral-100">
                        <CardTitle className="text-lg flex items-center gap-3 text-neutral-900 font-black">
                            <EnvelopeSimple weight="duotone" className="w-6 h-6 text-primary-main" /> Contact Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                        <InfoRow icon={<EnvelopeSimple weight="duotone" className="w-5 h-5 text-primary-main" />} label="Email" value={profile.email} />
                        <InfoRow icon={<Phone weight="duotone" className="w-5 h-5 text-primary-main" />} label="Phone" value={profile.phone} />
                        <InfoRow icon={<MapPin weight="duotone" className="w-5 h-5 text-primary-main" />} label="Location" value={profile.location} />
                        <div className="pt-4">
                            <Button variant="outline" className="rounded-xl h-12 gap-3 w-full border-2 hover:bg-neutral-50 font-bold">
                                <FileDoc weight="bold" className="w-5 h-5 text-primary-main" /> View My Documents
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">{label}</span>
                <span className="text-sm font-bold text-neutral-800">{value}</span>
            </div>
        </div>
    );
}
