
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, X, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from './icons';


const KB = {
    "Common Cold": {
        "description": "A mild viral infection of the nose and throat. Usually resolves in 7–10 days.",
        "causes": "Caused by viruses like rhinovirus. Spread through droplets and close contact.",
        "advice": "Rest, stay hydrated, drink warm fluids, use steam inhalation to ease congestion.",
        "medicine": "Paracetamol for fever, antihistamines or decongestants if severe. Avoid antibiotics.",
        "triage": "Routine"
    },
    "Fever": {
        "description": "A temporary rise in body temperature, often a sign of infection.",
        "causes": "Commonly caused by viral/bacterial infections, inflammation, or heat exhaustion.",
        "advice": "Drink fluids, rest, wear light clothing.",
        "medicine": "Paracetamol or ibuprofen can reduce fever. See doctor if it lasts >3 days.",
        "triage": "Routine"
    },
    "Chest Pain": {
        "description": "Pain in the chest, may come from the heart, lungs, stomach, or muscles.",
        "causes": "Could be heart problems, lung issues, acid reflux, or muscle strain.",
        "advice": "If mild and related to movement, it may be muscular. If sudden or severe → EMERGENCY.",
        "medicine": "Avoid self-medicating. In emergency, aspirin may be given until medical help arrives.",
        "triage": "Emergency"
    },
    "Period Pain": {
        "description": "Cramping in the lower abdomen during menstruation.",
        "causes": "Caused by uterine contractions due to hormonal changes.",
        "advice": "Use a heating pad, drink warm water, try relaxation exercises.",
        "medicine": "Ibuprofen or mefenamic acid may help. Use only if prescribed.",
        "triage": "Routine"
    },
    "Morning Sickness": {
        "description": "Nausea and vomiting common in early pregnancy.",
        "causes": "Due to hormonal changes, especially high hCG in pregnancy.",
        "advice": "Eat small frequent meals, avoid spicy foods, get fresh air.",
        "medicine": "Vitamin B6 is sometimes used. Always consult a doctor in pregnancy.",
        "triage": "Routine"
    }
};

type Message = {
  text: string;
  sender: 'user' | 'bot' | 'system';
};

type ChatStep = 'gender' | 'pregnant' | 'period' | 'symptoms';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [gender, setGender] = useState<string | undefined>();
  const [isPregnant, setIsPregnant] = useState<string | undefined>();
  const [isOnPeriod, setIsOnPeriod] = useState<string | undefined>();
  const [chatStep, setChatStep] = useState<ChatStep>('gender');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const resetChat = () => {
    setMessages([{ text: "Select your gender:", sender: 'bot' }]);
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

  const handleSelection = (value: string, displayValue?: string) => {
    const userMessage: Message = { text: displayValue || value, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);

    if (chatStep === 'gender') {
      setGender(value);
      if (value === 'woman') {
        setChatStep('pregnant');
        setMessages(prev => [...prev, { text: "Are you currently pregnant?", sender: 'bot' }]);
      } else {
        setChatStep('symptoms');
        setMessages(prev => [...prev, { text: "Select your symptom:", sender: 'bot' }]);
      }
    } else if (chatStep === 'pregnant') {
      setIsPregnant(value);
      setChatStep('period');
      setMessages(prev => [...prev, { text: "Are you on your period right now?", sender: 'bot' }]);
    } else if (chatStep === 'period') {
      setIsOnPeriod(value);
      setChatStep('symptoms');
      setMessages(prev => [...prev, { text: "Select your symptom:", sender: 'bot' }]);
    } else if (chatStep === 'symptoms') {
      const condition = Object.keys(KB).find(key => key === value) as keyof typeof KB | undefined;
      if (condition) {
        const data = KB[condition];
        let response = `🩺 Condition: ${condition}\n`;
        response += `📖 What it is: ${data.description}\n`;
        response += `⚡ Causes: ${data.causes}\n`;
        response += `✅ Advice: ${data.advice}\n`;
        response += `💊 Medicine (general): ${data.medicine}\n`;
        response += `🚨 Triage: ${data.triage}`;

        if (gender === 'woman' && isPregnant === 'yes') {
          response += "\n⚠️ Since you are pregnant, please avoid self-medication and consult your doctor first.";
        }
        if (gender === 'woman' && isOnPeriod === 'yes' && condition !== "Period Pain") {
          response += "\nℹ️ Note: Some symptoms may overlap with period-related changes.";
        }

        setMessages(prev => [...prev, { text: response, sender: 'bot' }, {text: "Select your symptom:", sender: 'bot'}]);
      }
    }
  };


  const renderButtons = () => {
    const commonButtonClasses = "m-1";
    switch (chatStep) {
        case 'gender':
            return (
                <div className="flex justify-center p-2">
                    <Button variant="outline" className={commonButtonClasses} onClick={() => handleSelection('man', 'Man')}>Man</Button>
                    <Button variant="outline" className={commonButtonClasses} onClick={() => handleSelection('woman', 'Woman')}>Woman</Button>
                </div>
            );
        case 'pregnant':
        case 'period':
            return (
                <div className="flex justify-center p-2">
                    <Button variant="outline" className={commonButtonClasses} onClick={() => handleSelection('yes', 'Yes')}>Yes</Button>
                    <Button variant="outline" className={commonButtonClasses} onClick={() => handleSelection('no', 'No')}>No</Button>
                </div>
            );
        case 'symptoms':
            return (
                <ScrollArea className="h-32">
                    <div className="grid grid-cols-2 gap-2 p-2">
                        {Object.keys(KB).map(symptom => (
                            <Button key={symptom} variant="outline" onClick={() => handleSelection(symptom)}>
                                {symptom}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            )
        default:
            return null;
    }
  }


  return (
    <>
        <motion.div
            className="fixed bottom-8 right-8 z-50"
            whileHover={{ scale: 1.1 }}
            animate={{
                scale: [1, 1.05, 1, 1.05, 1],
                transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            }}
        >
            <Button 
                size="icon" 
                className="rounded-full w-16 h-16 bg-primary shadow-lg flex items-center justify-center"
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
                        <CardDescription>Select options to get information. This is not a diagnosis.</CardDescription>
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
                            </div>
                        </ScrollArea>
                        {renderButtons()}
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
