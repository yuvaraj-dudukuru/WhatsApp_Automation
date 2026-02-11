'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Copy } from 'lucide-react';

export default function TemplatesPage() {
    const [templates, setTemplates] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', content: '', category: 'marketing' });

    useEffect(() => {
        // fetchTemplates();
        setTemplates([
            { id: '1', name: 'Welcome Message', content: 'Hello {{name}}, welcome to our service!', category: 'greeting' },
            { id: '2', name: 'Offer Alert', content: 'Hi {{name}}, creating check out our summer sale!', category: 'marketing' }
        ]);
    }, []);

    const handleCreate = async () => {
        try {
            // await api.post('/templates', newTemplate);
            setTemplates([...templates, { ...newTemplate, id: Date.now().toString() }]);
            setOpen(false);
            setNewTemplate({ name: '', content: '', category: 'marketing' });
        } catch (error) {
            alert('Failed to create template');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Message Templates</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="mr-2 h-4 w-4" /> New Template</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Create Template</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <Input value={newTemplate.name} onChange={e => setNewTemplate({ ...newTemplate, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Content (use {'{{name}}'} for variables)</Label>
                                <Textarea value={newTemplate.content} onChange={e => setNewTemplate({ ...newTemplate, content: e.target.value })} />
                            </div>
                            <Button onClick={handleCreate} className="w-full">Create</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {templates.map(t => (
                    <Card key={t.id}>
                        <CardHeader>
                            <CardTitle className="text-lg">{t.name}</CardTitle>
                            <p className="text-xs text-muted-foreground capitalize">{t.category}</p>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{t.content}</p>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" size="sm" className="w-full"><Copy className="mr-2 h-3 w-3" /> Duplicate</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
