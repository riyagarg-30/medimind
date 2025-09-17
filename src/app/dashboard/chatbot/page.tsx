
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, User, Loader2, WifiOff } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { askChatbot } from '@/ai/flows/chatbot';
import type { Part } from '@genkit-ai/googleai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { askOfflineChatbot } from '@/ai/flows/offline-chatbot';

type Message = {
    role: 'user' | 'model';
    parts: Part[];
};

type HistoryItem = {
    id: number;
    date: string;
    inputType: "Symptoms" | "Report";
    input: string;
    result: string;
};

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOffline, setIsOffline] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Function to update online status
        const updateOnlineStatus = () => {
            const online = navigator.onLine;
            setIsOffline(!online);
        };
        
        // Load history from local storage
        try {
            const userStr = localStorage.getItem('currentUser');
            if (userStr) {
                const currentUser = JSON.parse(userStr);
                const historyKey = `symptomHistory_${currentUser.id}`;
                const savedHistory = localStorage.getItem(historyKey);
                if (savedHistory) {
                    setHistory(JSON.parse(savedHistory));
                }
            }
        } catch (error) {
             console.error("Could not load history from local storage:", error);
        }

        // Add event listeners for online/offline events
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Initial check
        updateOnlineStatus();

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);


    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const saveToHistory = (query: string, response: string) => {
        const newItem: HistoryItem = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            inputType: 'Symptoms',
            input: query,
            result: response.split('\n\n')[0], // Save a summary
        };

        try {
            const userStr = localStorage.getItem('currentUser');
            if (!userStr) return;
            const currentUser = JSON.parse(userStr);
            const historyKey = `symptomHistory_${currentUser.id}`;

            const savedHistory = localStorage.getItem(historyKey);
            const currentHistory: HistoryItem[] = savedHistory ? JSON.parse(savedHistory) : [];
            // Add new item to the beginning of the array
            const updatedHistory = [newItem, ...currentHistory];
            localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
            setHistory(updatedHistory); // Update state
        } catch (error) {
            console.error("Failed to save to history:", error);
        }
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: userMessage }] }];
        setMessages(newMessages);
        setInput('');
        
        setIsLoading(true);

        if (isOffline) {
            const offlineResponse = await askOfflineChatbot(userMessage, history);
            setMessages([...newMessages, { role: 'model', parts: [{ text: offlineResponse }] }]);
            setIsLoading(false);
            return;
        }

        try {
            const response = await askChatbot({
                query: userMessage,
                history: messages
            });
            setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
            saveToHistory(userMessage, response);
        } catch (error) {
            console.error("Error asking chatbot:", error);
            setMessages([...newMessages, { role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] p-4 md:p-8">
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Conversational Chatbot</CardTitle>
                    <CardDescription>
                        Ask me your medical questions. Describe your symptoms for a preliminary analysis.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                    {isOffline && (
                        <Alert variant="destructive">
                            <WifiOff className="h-4 w-4" />
                            <AlertTitle>You are currently offline</AlertTitle>
                            <AlertDescription>
                                AI diagnostics are disabled. You are interacting with the offline assistant, which has access to your past analysis history.
                            </AlertDescription>
                        </Alert>
                    )}
                    <ScrollArea className="flex-1 p-4 border rounded-lg bg-secondary/30" ref={scrollAreaRef}>
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                                >
                                    {msg.role === 'model' && (
                                        <AvatarIcon>
                                            <Bot className="text-primary" />
                                        </AvatarIcon>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-card'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.parts[0].text}</p>
                                    </div>
                                    {msg.role === 'user' && (
                                        <AvatarIcon>
                                            <User />
                                        </AvatarIcon>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-3">
                                    <AvatarIcon>
                                        <Bot className="text-primary" />
                                    </AvatarIcon>
                                    <div className="rounded-lg px-4 py-2 max-w-[80%] bg-card flex items-center">
                                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleSubmit} className="flex items-center gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your symptoms here..."
                            className="flex-1"
                            disabled={isLoading}
                        />
                        <Button type="submit" disabled={isLoading || !input.trim()}>
                            Send
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full bg-card border flex items-center justify-center shrink-0">
        {children}
    </div>
);
