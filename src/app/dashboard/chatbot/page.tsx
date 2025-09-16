
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, User, Bot } from 'lucide-react';
import { askChatbot } from '@/ai/flows/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type ChatStep = 'gender' | 'pregnant' | 'period' | 'chatting';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi there! How are you feeling today?", sender: 'bot' },
    { text: "First, can I ask — are you a man, woman, or other?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState<string | undefined>();
  const [isPregnant, setIsPregnant] = useState<string | undefined>();
  const [isOnPeriod, setIsOnPeriod] = useState<string | undefined>();
  const [chatStep, setChatStep] = useState<ChatStep>('gender');
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

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
        setMessages(prev => [...prev, { text: "Alright, thank you for sharing. Now tell me your symptoms (or just chat with me).", sender: 'bot' }]);
      }
    } else if (chatStep === 'pregnant') {
      setIsPregnant(value);
      setChatStep('period');
      setMessages(prev => [...prev, { text: "Are you on your period right now? (yes/no)", sender: 'bot' }]);
    } else if (chatStep === 'period') {
      setIsOnPeriod(value);
      setChatStep('chatting');
      setMessages(prev => [...prev, { text: "Alright, thank you for sharing. Now tell me your symptoms (or just chat with me).", sender: 'bot' }]);
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
                    <Button variant="outline" className={commonButtonClasses} onClick={() => handleInitialSetup('other')}>Other</Button>
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
    <div className="flex flex-col h-[calc(100vh-5rem)] p-4 md:p-8">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Medical Chatbot</CardTitle>
          <CardDescription>Ask me anything about your symptoms, conditions, or general health.</CardDescription>
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
                    placeholder="Type your message..."
                    disabled={isLoading}
                    />
                    <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                    Send
                    </Button>
                </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full bg-card border flex items-center justify-center shrink-0">
        {children}
    </div>
)
