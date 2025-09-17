
'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, User, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { askChatbot } from '@/ai/flows/chatbot';
import { Part } from 'genkit/cohere';

type Message = {
    role: 'user' | 'model';
    parts: Part[];
};

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const newMessages: Message[] = [...messages, { role: 'user', parts: [{ text: input }] }];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await askChatbot({
                query: input,
                history: messages
            });
            setMessages([...newMessages, { role: 'model', parts: [{ text: response }] }]);
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
