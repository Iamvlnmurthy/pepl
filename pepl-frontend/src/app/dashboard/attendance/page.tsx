import React from 'react';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';

export const dynamic = 'force-dynamic';

export default function AttendancePage() {
    return (
        <div className="animate-in fade-in duration-500">
            <AttendanceCalendar />
        </div>
    );
}
