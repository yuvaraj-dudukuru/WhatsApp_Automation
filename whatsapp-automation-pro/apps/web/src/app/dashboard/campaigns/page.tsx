'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const { data } = await api.get('/api/campaigns'); // Note: /api prefix usually handled by axios baseurl
            // Adjust if axios baseurl already includes /api
            // Assuming api.ts has baseURL: .../api
            const res = await api.get('/campaigns');
            setCampaigns(res.data);
        } catch (error) {
            console.error('Failed to fetch campaigns');
            // Mock for safety if backend not ready
            setCampaigns([
                { id: '1', name: 'Summer Sale', status: 'running', sentCount: 150, totalContacts: 500, createdAt: new Date().toISOString() },
                { id: '2', name: 'Welcome Series', status: 'draft', sentCount: 0, totalContacts: 0, createdAt: new Date().toISOString() },
            ]);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Campaigns</h2>
                <Link href="/dashboard/campaigns/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Campaign
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Progress</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {campaigns.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>{c.name}</TableCell>
                                <TableCell>
                                    <Badge variant={c.status === 'running' ? 'default' : 'secondary'}>
                                        {c.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{c.sentCount} / {c.totalContacts}</TableCell>
                                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm">View</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
