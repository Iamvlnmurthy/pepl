import React from 'react';
import { LeaveForm } from '@/components/leave/LeaveForm';

export const dynamic = 'force-dynamic';
export default function LeaveApplyPage() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LeaveForm />
        </div>
    );
}
