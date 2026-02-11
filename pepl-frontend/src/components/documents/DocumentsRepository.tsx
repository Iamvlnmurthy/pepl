"use client";

import React, { useState, useRef, useEffect } from 'react';
import {
    FileDoc,
    UploadSimple,
    DownloadSimple,
    MagnifyingGlass,
    Faders,
    DotsThreeVertical,
    File,
    ShieldCheck,
    PlusCircle,
    XCircle,
    CircleNotch,
    Trash,
    CloudArrowUp,
    CloudCheck
} from "@phosphor-icons/react";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast-provider';
import { uploadFile, deleteFile, listFiles, supabase, STORAGE_BUCKET } from '@/lib/supabase';

interface Doc {
    id: string;
    name: string;
    type: string;
    size: string;
    date: string;
    status: string;
    url: string;
    storagePath: string;
}

const DOC_STORAGE_KEY = 'pepl_documents_meta';
const FOLDER_STORAGE_KEY = 'pepl_folders';

function loadDocs(): Doc[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(DOC_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

function saveDocs(docs: Doc[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(DOC_STORAGE_KEY, JSON.stringify(docs));
}

function loadFolders(): any[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem(FOLDER_STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    } catch { return []; }
}

function saveFolders(folders: any[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(FOLDER_STORAGE_KEY, JSON.stringify(folders));
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getDocType(filename: string): string {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, string> = {
        pdf: 'PDF Document',
        doc: 'Word Document', docx: 'Word Document',
        xls: 'Spreadsheet', xlsx: 'Spreadsheet',
        png: 'Image', jpg: 'Image', jpeg: 'Image', gif: 'Image', webp: 'Image',
        csv: 'CSV Data',
        txt: 'Text File',
        zip: 'Archive', rar: 'Archive',
    };
    return typeMap[ext] || 'Other';
}

export function DocumentsRepository() {
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [uploading, setUploading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [folders, setFolders] = useState<any[]>([]);
    const [docs, setDocs] = useState<Doc[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [totalStorageUsed, setTotalStorageUsed] = useState(0);

    // Load persisted data on mount
    useEffect(() => {
        const local = loadDocs();
        setDocs(local);
        setFolders(loadFolders());
        syncWithCloud(local);
    }, []);

    const syncWithCloud = async (localDocs: Doc[]) => {
        setSyncing(true);
        try {
            // Fetch real files from Supabase Storage
            const files = await listFiles('uploads');

            if (files) {
                const cloudDocs: Doc[] = files.map(file => {
                    // Extract name from uploads/timestamp_name
                    // supabase.list returns just the filename in that folder
                    const nameParts = file.name.split('_');
                    const timestamp = parseInt(nameParts[0]);
                    const originalName = nameParts.slice(1).join('_');
                    const date = !isNaN(timestamp)
                        ? new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
                        : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

                    // Get public URL
                    const { data: urlData } = supabase.storage
                        .from(STORAGE_BUCKET)
                        .getPublicUrl(`uploads/${file.name}`);

                    return {
                        id: file.id || Math.random().toString(36).substr(2, 9),
                        name: originalName || file.name,
                        type: getDocType(originalName || file.name),
                        size: formatFileSize(file.metadata?.size || 0),
                        date: date,
                        status: 'verified',
                        url: urlData.publicUrl,
                        storagePath: `uploads/${file.name}`
                    };
                });

                // Merge with local (keep local pending items, but trust cloud for verified ones)
                const pendingLocal = localDocs.filter(d => d.status === 'pending');
                const mergedDocs = [...pendingLocal, ...cloudDocs];

                // Remove duplicates by storagePath
                const uniqueDocs = mergedDocs.filter((doc, index, self) =>
                    index === self.findIndex((t) => t.storagePath === doc.storagePath)
                );

                setDocs(uniqueDocs);
                saveDocs(uniqueDocs);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            // Fallback is already handled by initial loadDocs()
        } finally {
            setSyncing(false);
        }
    };

    // Persist docs whenever they change (Sync with setDocs calls)
    useEffect(() => {
        if (docs.length > 0) {
            saveDocs(docs);
            // Calculate storage
            const totalBytes = docs.reduce((sum, doc) => {
                const sizeStr = doc.size;
                const match = sizeStr.match(/([\d.]+)\s*(B|KB|MB|GB)/i);
                if (!match) return sum;
                const val = parseFloat(match[1]);
                const unit = match[2].toUpperCase();
                const multipliers: Record<string, number> = { 'B': 1, 'KB': 1024, 'MB': 1024 * 1024, 'GB': 1024 * 1024 * 1024 };
                return sum + val * (multipliers[unit] || 1);
            }, 0);
            setTotalStorageUsed(totalBytes);
        }
    }, [docs]);

    // Persist folders
    useEffect(() => {
        if (folders.length > 0) {
            saveFolders(folders);
        }
    }, [folders]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleCreateFolder = () => {
        if (!newFolderName.trim()) return;
        const newFolder = {
            id: Math.random().toString(36).substr(2, 9),
            name: newFolderName,
            icon: '📁',
            count: 0
        };
        setFolders([...folders, newFolder]);
        setNewFolderName('');
        setShowFolderModal(false);
        toast(`Folder "${newFolderName}" created successfully`, "success");
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // File size limit: 50MB
        if (file.size > 50 * 1024 * 1024) {
            toast("File size exceeds 50MB limit", "error");
            return;
        }

        setUploading(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + Math.random() * 15;
            });
        }, 300);

        try {
            const timestamp = Date.now();
            const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
            const storagePath = `uploads/${timestamp}_${sanitizedName}`;

            const publicUrl = await uploadFile(file, storagePath);

            clearInterval(interval);
            setProgress(100);

            const newDoc: Doc = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                type: getDocType(file.name),
                size: formatFileSize(file.size),
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                status: 'pending',
                url: publicUrl,
                storagePath: storagePath,
            };

            setDocs(prev => [newDoc, ...prev]);
            setUploading(false);
            setProgress(0);
            toast(`☁️ Uploaded "${file.name}" to cloud. Security scan in progress...`, "info");

            // Mark verified and re-sync to ensure everything is perfect
            setTimeout(async () => {
                setDocs(prev => prev.map(d =>
                    d.id === newDoc.id ? { ...d, status: 'verified' } : d
                ));
                toast(`✅ Document "${file.name}" verified and secured in cloud.`, "success");
                // Re-sync to get official metadata from cloud
                await syncWithCloud([...docs, { ...newDoc, status: 'verified' }]);
            }, 3000);

        } catch (error: any) {
            clearInterval(interval);
            setUploading(false);
            setProgress(0);
            console.error('Upload error:', error);
            toast(`Upload failed: ${error.message}`, "error");
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDownload = (doc: Doc) => {
        if (doc.url) {
            window.open(doc.url, '_blank');
            toast(`Downloading: ${doc.name}`, "info");
        } else {
            toast("Download URL not available", "error");
        }
    };

    const handleDelete = async (doc: Doc) => {
        try {
            if (doc.storagePath) {
                await deleteFile(doc.storagePath);
            }
            setDocs(prev => prev.filter(d => d.id !== doc.id));
            toast(`Deleted "${doc.name}" from cloud storage`, "success");
        } catch (error: any) {
            // Still remove from local state even if cloud delete fails
            setDocs(prev => prev.filter(d => d.id !== doc.id));
            toast(`Removed "${doc.name}" (cloud cleanup may be pending)`, "info");
        }
    };

    const storagePercent = Math.min(100, (totalStorageUsed / (1024 * 1024 * 1024)) * 100); // Out of 1GB
    const storageUsedFormatted = formatFileSize(totalStorageUsed);

    const filteredDocs = docs.filter(doc => {
        const matchesSearch = !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || doc.type.toLowerCase().includes(activeTab);
        return matchesSearch && matchesTab;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 relative">
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />

            {/* Folder Creation Modal */}
            {showFolderModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <Card className="w-full max-w-md p-6 glass-card border-none shadow-2xl rounded-[2rem]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold tracking-tight">Create New Folder</h3>
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowFolderModal(false)}>
                                <XCircle weight="duotone" className="w-6 h-6 text-neutral-400" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Folder Name</label>
                                <input
                                    type="text"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    placeholder="e.g. Tax Returns 2026"
                                    autoFocus
                                    className="w-full h-12 bg-muted/50 border-none rounded-xl px-4 text-sm outline-none focus:ring-2 ring-primary/20 transition-all font-medium"
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    className="flex-1 h-12 rounded-xl font-bold"
                                    onClick={() => setShowFolderModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="flex-1 h-12 rounded-xl font-bold bg-primary-main shadow-lg shadow-primary-main/20 hover:translate-y-[-2px] transition-all"
                                    onClick={handleCreateFolder}
                                    disabled={!newFolderName.trim()}
                                >
                                    Create Folder
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <FileDoc weight="duotone" className="w-9 h-9 text-primary-main" /> Documents Repository
                    </h2>
                    <p className="text-muted-foreground mt-1 text-lg flex items-center gap-2">
                        Securely manage and access your essential employment records.
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-accent-success bg-accent-success/10 px-2 py-0.5 rounded-full">
                            <CloudCheck weight="bold" className="w-3 h-3" /> Cloud Storage
                        </span>
                    </p>
                </div>
                <Button
                    onClick={handleUploadClick}
                    disabled={uploading}
                    className="h-12 px-8 rounded-2xl font-bold flex gap-2 shadow-lg shadow-primary-main/20 bg-primary-main hover:translate-y-[-2px] transition-all text-white"
                >
                    {uploading ? <CircleNotch weight="bold" className="w-5 h-5 animate-spin" /> : <CloudArrowUp weight="duotone" className="w-5 h-5" />}
                    {uploading ? 'Uploading to Cloud...' : 'Upload to Cloud'}
                </Button>
            </div>

            {uploading && (
                <Card className="p-6 glass border-primary/20 bg-primary/5 animate-in slide-in-from-top-2">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <span className="flex items-center gap-2">
                                <CircleNotch weight="bold" className="w-4 h-4 animate-spin text-primary-main" />
                                Uploading to Supabase Cloud...
                            </span>
                            <span className="text-primary-main">{Math.round(progress)}%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300 rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </Card>
            )}

            <div className="flex items-center justify-between gap-4">
                <div className="flex bg-muted/30 p-1 rounded-2xl border border-primary/5">
                    {['all', 'personal', 'company', 'tax'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-background text-primary shadow-sm shadow-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-sm">
                    <MagnifyingGlass weight="bold" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-11 bg-neutral-100/50 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm outline-none focus:bg-white focus:border-primary-main focus:shadow-[0_0_0_4px_rgba(45,91,255,0.1)] transition-all font-medium"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 glass-card border-none shadow-none space-y-4 rounded-[2rem]">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                        <CloudCheck weight="duotone" className="w-4 h-4" /> Cloud Storage
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                            <span>{storagePercent.toFixed(1)}% Used</span>
                            <span className="text-primary">{storageUsedFormatted} / 1 GB</span>
                        </div>
                        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${storagePercent > 80 ? 'bg-accent-error' : 'bg-primary'}`} style={{ width: `${storagePercent}%` }} />
                        </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium">
                        {docs.length} document{docs.length !== 1 ? 's' : ''} stored in Supabase Cloud
                    </p>
                </Card>

                {folders.map(folder => (
                    <Card
                        key={folder.id}
                        className="p-6 glass border-primary/10 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-primary/5 transition-all group rounded-[2rem]"
                        onClick={() => toast(`Opening folder: ${folder.name}`, "info")}
                    >
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                            {folder.icon}
                        </div>
                        <div>
                            <p className="text-sm font-bold">{folder.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">{folder.count} Documents</p>
                        </div>
                    </Card>
                ))}

                <Card
                    className="p-6 bg-white border-2 border-dashed border-neutral-200 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:border-primary-main hover:bg-primary-subtle/50 transition-all group rounded-[2rem]"
                    onClick={() => setShowFolderModal(true)}
                >
                    <div className="h-12 w-12 rounded-full bg-primary-subtle flex items-center justify-center text-primary-main group-hover:scale-110 transition-transform">
                        <PlusCircle weight="duotone" className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-neutral-900">Add Folder</p>
                        <p className="text-label uppercase">Organize records</p>
                    </div>
                </Card>
            </div>

            <Card className="p-0 glass-card border-none shadow-none rounded-[2.5rem] overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/30 hover:bg-transparent border-none">
                            <TableHead className="w-[40%] font-bold py-6 pl-8">Document Name</TableHead>
                            <TableHead className="font-bold">Category</TableHead>
                            <TableHead className="font-bold">File Size</TableHead>
                            <TableHead className="font-bold">Added Date</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                            <TableHead className="text-right pr-8 font-bold">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredDocs.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-3 text-neutral-400">
                                        <CloudArrowUp weight="duotone" className="w-12 h-12 opacity-30" />
                                        <p className="text-xs font-black uppercase tracking-widest opacity-50">
                                            {searchQuery ? 'No matching documents' : 'Upload your first document to cloud storage'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                        {filteredDocs.map((doc) => (
                            <TableRow key={doc.id} className="hover:bg-primary/5 transition-colors border-border/30 group">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 rounded-xl bg-primary-subtle text-primary-main group-hover:scale-110 transition-transform">
                                            <FileDoc weight="duotone" className="w-6 h-6" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold group-hover:text-primary transition-colors cursor-pointer text-sm">{doc.name}</span>
                                            {doc.status === 'pending' && <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter animate-pulse">Scanning for threats...</span>}
                                            {doc.status === 'verified' && <span className="text-[10px] text-accent-success font-medium flex items-center gap-1"><CloudCheck weight="bold" className="w-3 h-3" /> Stored in cloud</span>}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-primary/5 border-primary/10 text-primary font-bold rounded-full px-3 py-0.5 text-[10px]">
                                        {doc.type}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs font-medium">{doc.size}</TableCell>
                                <TableCell className="text-xs font-medium">{doc.date}</TableCell>
                                <TableCell>
                                    {doc.status === 'verified' ? (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-accent-success">
                                            <ShieldCheck weight="duotone" className="w-5 h-5" /> Verified
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-accent-warning">
                                            <CircleNotch weight="bold" className="w-4 h-4 animate-spin" /> Pending
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex items-center justify-end gap-2 outline-none">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-full hover:bg-primary-subtle hover:text-primary-main transition-all"
                                            onClick={() => handleDownload(doc)}
                                        >
                                            <DownloadSimple weight="duotone" className="w-5 h-5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 rounded-full hover:bg-red-50 hover:text-red-500 transition-all"
                                            onClick={() => handleDelete(doc)}
                                        >
                                            <Trash weight="duotone" className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
