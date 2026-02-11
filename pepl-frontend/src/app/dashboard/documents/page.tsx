import React from 'react';
import { DocumentsRepository } from '@/components/documents/DocumentsRepository';

export const dynamic = 'force-dynamic';

export default function DocumentsPage() {
    return (
        <div className="animate-in fade-in duration-700">
            <DocumentsRepository />
        </div>
    );
}
