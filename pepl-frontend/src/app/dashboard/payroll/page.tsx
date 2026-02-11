import React from 'react';
import { PayrollDashboard } from '@/components/payroll/PayrollDashboard';

export const dynamic = 'force-dynamic';

export default function PayrollPage() {
    return (
        <div className="animate-in fade-in duration-500">
            <PayrollDashboard />
        </div>
    );
}
