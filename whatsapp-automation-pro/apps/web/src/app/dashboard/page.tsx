'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Send, MessageSquare, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState({
        contacts: 0,
        campaigns: 0,
        messagesSent: 0
    });

    // Mock stats for now, replace with API call later
    useEffect(() => {
        // const fetchStats = async () => {
        //   const { data } = await api.get('/stats');
        //   setStats(data);
        // };
        // fetchStats();
        setStats({ contacts: 1250, campaigns: 5, messagesSent: 4500 });
    }, []);

    const [whatsappStatus, setWhatsappStatus] = useState<any>(null);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const { data } = await api.get('/whatsapp/status');
                setWhatsappStatus(data);
            } catch (error) {
                console.error('Failed to get WhatsApp status');
            }
        };
        checkStatus();
    }, []);

    const initializeWhatsapp = async () => {
        try {
            await api.post('/whatsapp/initialize');
            alert('Initialization started. Check server logs for QR code (Frontend QR display coming soon).');
        } catch (error) {
            alert('Failed to initialize');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex gap-2">
                    <Button onClick={initializeWhatsapp} variant={whatsappStatus?.isConnected ? "outline" : "default"}>
                        {whatsappStatus?.isConnected ? 'WhatsApp Connected' : 'Connect WhatsApp'}
                    </Button>
                    <Button onClick={() => router.push('/dashboard/campaigns/new')}>New Campaign</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.contacts}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
                        <Send className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.campaigns}</div>
                        <p className="text-xs text-muted-foreground">2 running, 3 scheduled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.messagesSent}</div>
                        <p className="text-xs text-muted-foreground">+15% from last week</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex items-center justify-center text-gray-400">
                            Chart Placeholder (Recharts coming soon)
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            You sent 240 messages today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Activity items would go here */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">Campaign "Summer Sale" started</p>
                                    <p className="text-sm text-muted-foreground">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">New contact added</p>
                                    <p className="text-sm text-muted-foreground">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
