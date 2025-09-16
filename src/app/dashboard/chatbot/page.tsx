
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

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPregnant, setIsPregnant] = useState<string | undefined>();
  const [isOnPeriod, setIsOnPeriod] = useState<string | undefined>();
  const [initialQuestionsDone, setInitialQuestionsDone] = useState(false);
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

  const handleInitialSetup = () => {
      if(isPregnant !== undefined && isOnPeriod !== undefined) {
        const setupMessage: Message = { text: `Initial context: I am ${isPregnant === 'yes' ? '' : 'not '}pregnant and I am ${isOnPeriod === 'yes' ? '' : 'not '}on my period.`, sender: 'user' };
        setMessages([setupMessage]);
        setInitialQuestionsDone(true);
        // Start conversation with a greeting
        const botMessage: Message = { text: 'Hello! Tell me your symptoms, or just chat 🙂', sender: 'bot' };
        setMessages(prev => [...prev, botMessage]);
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

  if (!initialQuestionsDone) {
    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] p-4 md:p-8">
            <Card className="flex-1 flex flex-col max-w-lg mx-auto">
                <CardHeader>
                    <CardTitle>A couple of questions...</CardTitle>
                    <CardDescription>This helps me provide more relevant information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                     <div className="space-y-4">
                        <Label className="text-base">Are you pregnant?</Label>
                        <RadioGroup onValueChange={setIsPregnant} value={isPregnant}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="preg-yes" />
                                <Label htmlFor="preg-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="preg-no" />
                                <Label htmlFor="preg-no">No</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     <div className="space-y-4">
                        <Label className="text-base">Are you currently on your period?</Label>
                        <RadioGroup onValueChange={setIsOnPeriod} value={isOnPeriod}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="period-yes" />
                                <Label htmlFor="period-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="period-no" />
                                <Label htmlFor="period-no">No</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button onClick={handleInitialSetup} disabled={isPregnant === undefined || isOnPeriod === undefined}>Start Chat</Button>
                </CardContent>
            </Card>
        </div>
    )
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
              {messages.slice(1).map((msg, index) => ( // slice(1) to hide the initial context message
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
      </Card>
    </div>
  );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full bg-card border flex items-center justify-center shrink-0">
        {children}
    </div>
)

    