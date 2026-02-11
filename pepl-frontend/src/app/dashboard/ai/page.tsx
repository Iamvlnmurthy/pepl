import React from 'react';
import { AiInsightsDashboard } from '@/components/ai/AiInsightsDashboard';

export const dynamic = 'force-dynamic';

export default function AiPage() {
    return (
        <div className="animate-in fade-in duration-700">
            <AiInsightsDashboard />
        </div>
    );
}
