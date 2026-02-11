'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';

export default function AIToolsPage() {
    const [prompt, setPrompt] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loading, setLoading] = useState(false);

    const [analyzeText, setAnalyzeText] = useState('');
    const [sentiment, setSentiment] = useState('');

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/ai/generate', { prompt });
            setGeneratedText(data.result);
        } catch (error) {
            alert('AI Generation failed');
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        setLoading(true);
        try {
            const { data } = await api.post('/ai/sentiment', { message: analyzeText });
            setSentiment(data.result);
        } catch (error) {
            alert('Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-purple-600" />
                <h2 className="text-3xl font-bold tracking-tight">AI Studio (Gemini Powered)</h2>
            </div>

            <Tabs defaultValue="generator">
                <TabsList>
                    <TabsTrigger value="generator">Message Generator</TabsTrigger>
                    <TabsTrigger value="analyzer">Sentiment Analyzer</TabsTrigger>
                </TabsList>

                <TabsContent value="generator" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate Professional Messages</CardTitle>
                            <CardDescription>Enter a topic or intent, and AI will write the message for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Textarea
                                placeholder="e.g. Write a polite reminder for an overdue invoice..."
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                rows={4}
                            />
                            <Button onClick={handleGenerate} disabled={loading || !prompt}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Generate
                            </Button>
                            {generatedText && (
                                <div className="bg-gray-50 p-4 rounded-md border mt-4">
                                    <h4 className="text-sm font-bold mb-2">Result:</h4>
                                    <p className="text-sm">{generatedText}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analyzer" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sentiment Analysis</CardTitle>
                            <CardDescription>Analyze customer replies to gauge satisfaction.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Input
                                placeholder="Paste message here..."
                                value={analyzeText}
                                onChange={e => setAnalyzeText(e.target.value)}
                            />
                            <Button onClick={handleAnalyze} disabled={loading || !analyzeText}>
                                Analyze Sentiment
                            </Button>
                            {sentiment && (
                                <div className="mt-4">
                                    Status: <span className={`font-bold uppercase ${sentiment === 'positive' ? 'text-green-600' : sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'}`}>{sentiment}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
