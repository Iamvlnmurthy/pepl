'use client';

import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserPlus, MagnifyingGlass, Faders, CircleNotch } from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast-provider";

import { useEffect } from 'react';
import { employeesApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { AddEmployeeModal } from '@/components/employees/AddEmployeeModal';

export default function EmployeesPage() {
    const { toast } = useToast();
    const [employees, setEmployees] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        setIsLoading(true);
        try {
            // Priority 1: Try real backend
            const response = await employeesApi.getAll();
            setEmployees(response.data);
        } catch (error) {
            console.log('Backend unreachable, falling back to Supabase Cloud Database...');
            try {
                // Priority 2: Fallback to direct Supabase select (bypasses blocked backend-to-DB network)
                const { data, error: sbError } = await supabase
                    .from('employees')
                    .select(`
                        id, 
                        first_name, 
                        last_name, 
                        employee_code, 
                        personal_email, 
                        work_email, 
                        phone, 
                        joining_date, 
                        status, 
                        avatar_url,
                        department:departments(id, name),
                        role:roles(id, title)
                    `)
                    .is('deleted_at', null)
                    .order('created_at', { ascending: false });

                if (sbError) throw sbError;

                // Map the data to match the component's expected camelCase structure
                const mappedData = (data || []).map(emp => ({
                    ...emp,
                    firstName: emp.first_name,
                    lastName: emp.last_name,
                    employeeCode: emp.employee_code,
                    personalEmail: emp.personal_email,
                    workEmail: emp.work_email,
                    joiningDate: emp.joining_date,
                    profilePicture: emp.avatar_url,
                    // Handle department/role objects which might come as arrays or single objects
                    department: Array.isArray(emp.department) ? emp.department[0] : emp.department,
                    role: Array.isArray(emp.role) ? emp.role[0] : emp.role,
                }));

                setEmployees(mappedData);
                if (data && data.length > 0) {
                    toast("Direct Cloud Connection established. Data fetched from Supabase.", "info");
                }
            } catch (sbError) {
                console.error('Cloud fallback failed:', sbError);
                toast("Full system connection failure. Check your internet/keys.", "error");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddEmployee = () => {
        setIsModalOpen(true);
    };

    const filteredEmployees = employees.filter(e =>
        (e.firstName + ' ' + (e.lastName || '')).toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.employeeCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.department?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <AddEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchEmployees}
            />

            <div className="flex items-center justify-between animate-fade-in-up">
                <div>
                    <h1 className="text-display tracking-tighter">Workforce Hub</h1>
                    <p className="text-neutral-500 font-black uppercase tracking-[0.2em] mt-2 opacity-60 text-[10px]">Real-time Employee Logistics</p>
                </div>
                <Button
                    onClick={handleAddEmployee}
                    disabled={isAdding}
                    className="rounded-[1.25rem] px-10 h-14 bg-neutral-900 text-white shadow-premium-xl transition-all hover:bg-primary-main hover:-translate-y-1 font-black text-[10px] uppercase tracking-widest"
                >
                    {isAdding ? <CircleNotch className="mr-2 h-5 w-5 animate-spin" /> : <UserPlus weight="duotone" className="mr-2 h-6 w-6" />}
                    Onboard Member
                </Button>
            </div>

            <div className="flex items-center gap-5 mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <div className="relative flex-1 group">
                    <MagnifyingGlass weight="bold" className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-primary-main transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for employees, departments, or codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-2 border-neutral-100 rounded-[1.25rem] py-4 pl-14 pr-6 text-sm focus:border-primary-main focus:shadow-premium-xl outline-none transition-all font-bold placeholder:text-neutral-300 placeholder:font-medium"
                    />
                </div>
                <Button
                    variant="outline"
                    className="rounded-[1.25rem] h-14 px-8 border-2 font-black text-[10px] uppercase tracking-widest hover:bg-neutral-50 transition-all"
                    onClick={() => toast("Filter panel coming soon", "info")}
                >
                    <Faders weight="duotone" className="mr-3 w-5 h-5 text-primary-main" />
                    Advanced Filters
                </Button>
            </div>

            <div className="glass-card rounded-[3rem] overflow-hidden border-none shadow-premium-lg animate-scale-in" style={{ animationDelay: '200ms' }}>
                <Table>
                    <TableHeader className="bg-neutral-50/40 border-b border-neutral-100">
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400 py-8 pl-10">Identity</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Full Name</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">ID Code</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Organization</TableHead>
                            <TableHead className="font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Logistics Status</TableHead>
                            <TableHead className="text-right pr-10 font-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">Operations</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center">
                                    <div className="flex flex-col items-center gap-2 text-neutral-500">
                                        <CircleNotch className="w-8 h-8 animate-spin text-primary-main" />
                                        <p className="font-bold text-sm">Fetching real-time data...</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : filteredEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                                    No employees found. Start by adding one.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <TableRow key={employee.id} className="hover:bg-white/60 transition-all border-neutral-100 group">
                                    <TableCell className="py-6 pl-10">
                                        <Avatar className="w-12 h-12 border-2 border-white shadow-premium-sm group-hover:scale-110 group-hover:shadow-premium-md transition-all">
                                            <AvatarImage src={employee.profilePicture} />
                                            <AvatarFallback className="font-black text-xs bg-primary-subtle text-primary-main">
                                                {employee.firstName[0]}{employee.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-black text-sm tracking-tight text-neutral-900 group-hover:text-primary-main transition-colors">{employee.firstName} {employee.lastName}</p>
                                            <p className="text-[11px] text-neutral-500 font-bold opacity-60 tracking-tight">{employee.workEmail || employee.personalEmail}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-black text-[10px] uppercase tracking-widest text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">{employee.employeeCode}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <p className="text-xs font-black text-neutral-900 tracking-tight">{employee.department?.name || 'Unassigned'}</p>
                                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{employee.role?.title || 'No Role'}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-sm ${employee.status === 'active'
                                            ? 'bg-accent-success/10 text-accent-success border-accent-success/20'
                                            : 'bg-accent-warning/10 text-accent-warning border-accent-warning/20'
                                            }`} variant="outline">
                                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${employee.status === 'active' ? 'bg-accent-success' : 'bg-accent-warning'} animate-pulse`} />
                                            {employee.status.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right pr-10">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="rounded-xl px-5 h-10 hover:bg-neutral-900 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95"
                                            onClick={() => toast(`Viewing profile for ${employee.firstName}`, "info")}
                                        >
                                            Manage Profile
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
