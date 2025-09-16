
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, User, Bot, X } from 'lucide-react';
import { askChatbot } from '@/ai/flows/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './icons';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type ChatStep = 'gender' | 'pregnant' | 'period' | 'chatting';


export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState<string | undefined>();
  const [isPregnant, setIsPregnant] = useState<string | undefined>();
  const [isOnPeriod, setIsOnPeriod] = useState<string | undefined>();
  const [chatStep, setChatStep] = useState<ChatStep>('gender');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const resetChat = () => {
    setMessages([
        { text: "Hi there! I am a medical Q&A chatbot.", sender: 'bot' },
        { text: "First, are you a man or woman?", sender: 'bot' }
    ]);
    setInput('');
    setIsLoading(false);
    setGender(undefined);
    setIsPregnant(undefined);
    setIsOnPeriod(undefined);
    setChatStep('gender');
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);
  
  useEffect(() => {
    if (isOpen) {
        resetChat();
    }
  }, [isOpen])

  const handleInitialSetup = (value: string) => {
    const userMessage: Message = { text: value, sender: 'user'};
    setMessages(prev => [...prev, userMessage]);

    if (chatStep === 'gender') {
      setGender(value);
      if (value === 'woman') {
        setChatStep('pregnant');
        setMessages(prev => [...prev, { text: "Are you currently pregnant? (yes/no)", sender: 'bot' }]);
      } else {
        setChatStep('chatting');
        setMessages(prev => [...prev, { text: "Great. Now tell me your symptoms one by one.", sender: 'bot' }]);
      }
    } else if (chatStep === 'pregnant') {
      setIsPregnant(value);
      setChatStep('period');
      setMessages(prev => [...prev, { text: "Are you on your period right now? (yes/no)", sender: 'bot' }]);
    } else if (chatStep === 'period') {
      setIsOnPeriod(value);
      setChatStep('chatting');
      setMessages(prev => [...prev, { text: "Great. Now tell me your symptoms one by one.", sender: 'bot' }]);
    }
  };


  const handleSendMessage = async () => {
    if (!input.trim() || chatStep !== 'chatting') return;

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
      const contextMessage = `Context: gender: ${gender}, isPregnant: ${isPregnant === 'yes'}, isOnPeriod: ${isOnPeriod === 'yes'}`;
      history.unshift({role: 'user', parts: [{text: contextMessage}]});

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

  const renderInitialQuestions = () => {
      const commonButtonClasses = "m-1";
      switch (chatStep) {
          case 'gender':
              return (
                  <div className="flex justify-center p-2">
                      <Button variant="outline" className={commonButtonClasses} onClick={() => handleInitialSetup('man')}>Man</Button>
                      <Button variant="outline" className={commonButtonClasses} onClick={() => handleInitialSetup('woman')}>Woman</Button>
                  </div>
              );
          case 'pregnant':
          case 'period':
              return (
                  <div className="flex justify-center p-2">
                      <Button variant="outline" className={commonButtonClasses} onClick={() => handleInitialSetup('yes')}>Yes</Button>
                      <Button variant="outline" className={commonButtonClasses} onClick={() => handleInitialSetup('no')}>No</Button>
                  </div>
              );
          default:
              return null;
      }
  }


  return (
    <>
        <motion.div
            className="fixed bottom-8 right-8 z-50"
            whileHover={{ scale: 1.1 }}
        >
            <Button 
                size="icon" 
                className="rounded-full w-16 h-16 bg-primary shadow-lg animate-bounce flex items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={32} /> : <Logo className="size-8 text-primary-foreground" />}
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
                    <CardHeader>
                        <CardTitle>Medical Q&A Chatbot</CardTitle>
                        <CardDescription>I share general health info only. This is not a diagnosis.</CardDescription>
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
                        {chatStep !== 'chatting' ? renderInitialQuestions() : (
                            <div className="flex items-center gap-2">
                                <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                placeholder="Type your symptoms..."
                                disabled={isLoading}
                                />
                                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                                Send
                                </Button>
                            </div>
                        )}
                    </CardContent>
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
