"use client";

import React, { useState, useEffect } from 'react';
import {
    XCircle,
    CircleNotch,
    IdentificationBadge,
    User,
    EnvelopeSimple,
    Phone,
    Calendar,
    Buildings,
    Briefcase
} from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/toast-provider';
import { supabase } from '@/lib/supabase';

interface AddEmployeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddEmployeeModal({ isOpen, onClose, onSuccess }: AddEmployeeModalProps) {
    const { toast } = useToast();
    const [submitting, setSubmitting] = useState(false);
    const [loadingMetadata, setLoadingMetadata] = useState(false);
    const [isQuickCompanySetup, setIsQuickCompanySetup] = useState(false);
    const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

    // Meta-data states
    const [companies, setCompanies] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);

    // Quick Company Form
    const [companyForm, setCompanyForm] = useState({
        name: 'PEPL Dynamics',
        legal_name: 'PEPL Dynamics Pvt Ltd',
        code: 'PEPL01',
        registered_address: 'Corporate Hub, Level 5, Bangalore'
    });

    // Form state
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        employeeCode: '',
        personalEmail: '',
        workEmail: '',
        phone: '',
        joiningDate: new Date().toISOString().split('T')[0],
        companyId: '',
        departmentId: '',
        roleId: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchMetadata();
        }
    }, [isOpen]);

    const fetchMetadata = async () => {
        setLoadingMetadata(true);
        try {
            // Check for groups first (essential for relational integrity)
            let { data: groups } = await supabase.from('groups').select('id').limit(1);
            let groupId = groups?.[0]?.id;

            if (!groupId) {
                // Auto-create a primary group if none exists
                const { data: newGroup, error: groupError } = await supabase
                    .from('groups')
                    .insert([{ name: 'PEPL Global' }])
                    .select();
                if (groupError) throw groupError;
                groupId = newGroup?.[0]?.id;
            }
            setActiveGroupId(groupId);

            const [compRes, deptRes, roleRes] = await Promise.all([
                supabase.from('companies').select('id, name'),
                supabase.from('departments').select('id, name'),
                supabase.from('roles').select('id, title'),
            ]);

            if (compRes.data) {
                setCompanies(compRes.data);
                if (compRes.data.length === 0) {
                    setIsQuickCompanySetup(true);
                } else {
                    setIsQuickCompanySetup(false);
                }
            }
            if (deptRes.data) setDepartments(deptRes.data);
            if (roleRes.data) setRoles(roleRes.data);

            // Set default company if only one exists
            if (compRes.data && compRes.data.length === 1) {
                setFormData(prev => ({ ...prev, companyId: compRes.data[0].id }));
            }
        } catch (error) {
            console.error('Error fetching metadata:', error);
            toast("Failed to load cloud metadata. Please check connection.", "error");
        } finally {
            setLoadingMetadata(false);
        }
    };

    if (!isOpen) return null;

    const handleQuickCompanyCreate = async () => {
        if (!activeGroupId) {
            toast("Group identity missing. Re-fetching...", "info");
            await fetchMetadata();
            return;
        }

        setSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('companies')
                .insert([{
                    ...companyForm,
                    group_id: activeGroupId
                }])
                .select();

            if (error) throw error;

            if (data && data[0]) {
                toast(`🏢 ${companyForm.name} registered successfully!`, "success");
                await fetchMetadata();
                setFormData(prev => ({ ...prev, companyId: data[0].id }));
                setIsQuickCompanySetup(false);
            }
        } catch (error: any) {
            toast(`Company setup failed: ${error.message}`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isQuickCompanySetup) {
            await handleQuickCompanyCreate();
            return;
        }

        if (!formData.firstName || !formData.employeeCode || !formData.personalEmail || !formData.companyId) {
            toast("Required fields missing: Name, Code, Email, Company.", "error");
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.from('employees').insert([
                {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    employee_code: formData.employeeCode,
                    personal_email: formData.personalEmail,
                    work_email: formData.workEmail,
                    phone: formData.phone,
                    joining_date: formData.joiningDate,
                    group_id: activeGroupId,
                    company_id: formData.companyId,
                    department_id: formData.departmentId || null,
                    role_id: formData.roleId || null,
                    status: 'active',
                    employment_type: 'Full-time' // Required by schema
                }
            ]);

            if (error) {
                if (error.code === '23505') {
                    throw new Error("Employee Code or Email already exists in the cloud.");
                }
                throw error;
            }

            toast(`🎉 ${formData.firstName} onboarded to cloud!`, "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Onboarding error:', error);
            toast(`Failed to onboard: ${error.message || 'Unknown error'}`, "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300 px-4">
            <Card className="w-full max-w-2xl p-0 glass-card border-none shadow-premium-2xl rounded-[3rem] overflow-hidden">
                <div className="bg-neutral-900 p-8 text-white flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
                            <IdentificationBadge weight="duotone" className="w-9 h-9 text-primary-light" />
                            {isQuickCompanySetup ? "Register Organization" : "Onboard Member"}
                        </h2>
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.3em] mt-2">
                            {isQuickCompanySetup ? "Step 1: Universal Entity Setup" : "Step 2: Provisioning Cloud Identity"}
                        </p>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all relative z-10" onClick={onClose}>
                        <XCircle weight="duotone" className="w-8 h-8" />
                    </Button>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <Buildings weight="duotone" className="w-48 h-48 -mr-12 -mt-12" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-white/80 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {isQuickCompanySetup ? (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="p-6 rounded-[2rem] bg-amber-50 border border-amber-100/50 flex gap-4 items-start translate-y-[-10px]">
                                <Buildings weight="duotone" className="w-8 h-8 text-amber-600 mt-1" />
                                <div>
                                    <p className="text-sm font-black text-amber-900">No Companies Found</p>
                                    <p className="text-[11px] text-amber-700 font-bold leading-relaxed mt-1">
                                        You must register your primary organization before adding employees. We've pre-filled some defaults for you.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Display Name *</label>
                                    <input
                                        type="text"
                                        value={companyForm.name}
                                        onChange={(e) => setCompanyForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Legal Entity Name *</label>
                                    <input
                                        type="text"
                                        value={companyForm.legal_name}
                                        onChange={(e) => setCompanyForm(prev => ({ ...prev, legal_name: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Organization Code *</label>
                                    <input
                                        type="text"
                                        value={companyForm.code}
                                        onChange={(e) => setCompanyForm(prev => ({ ...prev, code: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold uppercase"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1">Registered Address *</label>
                                    <input
                                        type="text"
                                        value={companyForm.registered_address}
                                        onChange={(e) => setCompanyForm(prev => ({ ...prev, registered_address: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
                            {/* Identity Section */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">Identity & Access</p>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        <User weight="bold" className="w-3 h-3" /> First Name *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        placeholder="e.g. Julian"
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-neutral-300"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        <User weight="bold" className="w-3 h-3" /> Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        placeholder="e.g. Thorne"
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-neutral-300"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        <IdentificationBadge weight="bold" className="w-3 h-3" /> Employee Code *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.employeeCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, employeeCode: e.target.value }))}
                                        placeholder="e.g. EMP1001"
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-neutral-300"
                                    />
                                </div>
                            </div>

                            {/* Professional Section */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">Professional Details</p>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        <Buildings weight="bold" className="w-3 h-3" /> Company *
                                    </label>
                                    <select
                                        required
                                        value={formData.companyId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, companyId: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>Select Company</option>
                                        {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        <Buildings weight="bold" className="w-3 h-3" /> Department
                                    </label>
                                    <select
                                        value={formData.departmentId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="">None / Floating</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                        <Briefcase weight="bold" className="w-3 h-3" /> Role
                                    </label>
                                    <select
                                        value={formData.roleId}
                                        onChange={(e) => setFormData(prev => ({ ...prev, roleId: e.target.value }))}
                                        className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="">None / Pending</option>
                                        {roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-2">Contact & Logistics</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                            <EnvelopeSimple weight="bold" className="w-3 h-3" /> Personal Email *
                                        </label>
                                        <input
                                            required
                                            type="email"
                                            value={formData.personalEmail}
                                            onChange={(e) => setFormData(prev => ({ ...prev, personalEmail: e.target.value }))}
                                            placeholder="personal@email.com"
                                            className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-neutral-300"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                            <EnvelopeSimple weight="bold" className="w-3 h-3" /> Work Email
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.workEmail}
                                            onChange={(e) => setFormData(prev => ({ ...prev, workEmail: e.target.value }))}
                                            placeholder="work@company.com"
                                            className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-neutral-300"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                            <Phone weight="bold" className="w-3 h-3" /> Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="+91 XXXXX XXXXX"
                                            className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold placeholder:font-medium placeholder:text-neutral-300"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider pl-1 flex items-center gap-2">
                                            <Calendar weight="bold" className="w-3 h-3" /> Joining Date
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.joiningDate}
                                            onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
                                            className="w-full h-12 bg-neutral-50 border-2 border-transparent focus:border-primary-main/20 rounded-2xl px-5 text-sm outline-none transition-all font-bold uppercase cursor-text"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-4 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest border-2 hover:bg-neutral-50 transition-all"
                            onClick={onClose}
                        >
                            Cancel Session
                        </Button>
                        <Button
                            type="submit"
                            disabled={submitting}
                            className="flex-3 h-14 bg-neutral-900 hover:bg-primary-main text-white px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-premium-xl hover:-translate-y-1 flex items-center gap-3"
                        >
                            {submitting ? (
                                <CircleNotch weight="bold" className="w-5 h-5 animate-spin" />
                            ) : (
                                <IdentificationBadge weight="duotone" className="w-6 h-6" />
                            )}
                            {submitting ? "Provisioning..." : isQuickCompanySetup ? "Finalize Company Setup" : "Finalize Onboarding"}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
