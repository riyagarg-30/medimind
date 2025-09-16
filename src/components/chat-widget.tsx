
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, User, Bot, MessageCircle, X } from 'lucide-react';
import { askChatbot } from '@/ai/flows/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPregnant, setIsPregnant] = useState<string | undefined>();
  const [isOnPeriod, setIsOnPeriod] = useState<string | undefined>();
  const [initialQuestionsDone, setInitialQuestionsDone] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);
  
  useEffect(() => {
    // Reset state when widget is closed
    if (!isOpen) {
        setMessages([]);
        setInput('');
        setIsLoading(false);
        setIsPregnant(undefined);
        setIsOnPeriod(undefined);
        setInitialQuestionsDone(false);
    }
  }, [isOpen])

  const handleInitialSetup = () => {
      if(isPregnant !== undefined && isOnPeriod !== undefined) {
        setInitialQuestionsDone(true);
        // Start conversation with a greeting
        const botMessage: Message = { text: 'Hello! Tell me your symptoms, or just chat 🙂', sender: 'bot' };
        setMessages([botMessage]);
      }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !initialQuestionsDone) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
          role: m.sender === 'user' ? 'user' as const : 'model' as const,
          parts: [{ text: m.text }],
      }));
      // Add context to history
      history.unshift({role: 'user', parts: [{text: `Context: isPregnant: ${isPregnant === 'yes'}, isOnPeriod: ${isOnPeriod === 'yes'}`}]});

      const botResponse = await askChatbot({ query: input, history });
      const botMessage: Message = { text: botResponse, sender: 'bot' };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
        <motion.div
            className="fixed bottom-8 right-8 z-50"
            whileHover={{ scale: 1.1 }}
        >
            <Button 
                size="icon" 
                className="rounded-full w-16 h-16 bg-primary shadow-lg animate-bounce"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={32} /> : <MessageCircle size={32} />}
            </Button>
        </motion.div>
        
        <AnimatePresence>
        {isOpen && (
             <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-28 right-8 z-40"
             >
                <Card className="w-[380px] h-[600px] flex flex-col shadow-2xl">
                     {!initialQuestionsDone ? (
                        <>
                            <CardHeader>
                                <CardTitle>A couple of questions...</CardTitle>
                                <CardDescription>This helps me provide more relevant information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-base">Are you pregnant?</Label>
                                    <RadioGroup onValueChange={setIsPregnant} value={isPregnant}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="popup-preg-yes" />
                                            <Label htmlFor="popup-preg-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="popup-preg-no" />
                                            <Label htmlFor="popup-preg-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="space-y-4">
                                    <Label className="text-base">Are you currently on your period?</Label>
                                    <RadioGroup onValueChange={setIsOnPeriod} value={isOnPeriod}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="yes" id="popup-period-yes" />
                                            <Label htmlFor="popup-period-yes">Yes</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="no" id="popup-period-no" />
                                            <Label htmlFor="popup-period-no">No</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <Button onClick={handleInitialSetup} disabled={isPregnant === undefined || isOnPeriod === undefined}>Start Chat</Button>
                            </CardContent>
                        </>
                    ) : (
                        <>
                            <CardHeader>
                                <CardTitle>Medical Chatbot</CardTitle>
                                <CardDescription>Ask me anything about your health.</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                                <ScrollArea className="flex-1 p-4 border rounded-lg bg-secondary/30" ref={scrollAreaRef}>
                                    <div className="space-y-4">
                                    {messages.map((msg, index) => (
                                        <div
                                        key={index}
                                        className={`flex items-start gap-3 ${
                                            msg.sender === 'user' ? 'justify-end' : ''
                                        }`}
                                        >
                                        {msg.sender === 'bot' && (
                                            <AvatarIcon>
                                            <Bot className="text-primary" />
                                            </AvatarIcon>
                                        )}
                                        <div
                                            className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${
                                            msg.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-card'
                                            }`}
                                        >
                                            <p className="text-sm">{msg.text}</p>
                                        </div>
                                        {msg.sender === 'user' && (
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
                                        <div className="rounded-lg px-4 py-2 bg-card flex items-center">
                                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        </div>
                                        </div>
                                    )}
                                    </div>
                                </ScrollArea>
                                <div className="flex items-center gap-2">
                                    <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                    />
                                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                                    Send
                                    </Button>
                                </div>
                            </CardContent>
                        </>
                    )}
                </Card>
             </motion.div>
        )}
        </AnimatePresence>
    </>
  );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full bg-card border flex items-center justify-center shrink-0">
        {children}
    </div>
)
