
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Bot, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Knowledge Base based on the Python script
const KB = {
    "Common Cold": {
        "description": "A mild viral infection of the nose and throat.",
        "causes": "Usually caused by rhinovirus or similar viruses.",
        "advice": "Rest, hydration, warm fluids, steam inhalation.",
        "medicine": "Paracetamol for fever, antihistamines for congestion. Avoid antibiotics.",
        "triage": "Routine"
    },
    "Fever": {
        "description": "A rise in body temperature, often due to infection.",
        "causes": "Viral or bacterial infection, inflammation, heat exhaustion.",
        "advice": "Drink fluids, rest, wear light clothes.",
        "medicine": "Paracetamol or ibuprofen. Doctor visit if >3 days.",
        "triage": "Routine"
    },
    "Flu": {
        "description": "Influenza, a viral respiratory infection.",
        "causes": "Caused by influenza virus, spreads through droplets.",
        "advice": "Rest, fluids, avoid contact with others.",
        "medicine": "Paracetamol for fever, antivirals only if doctor prescribes.",
        "triage": "Routine"
    },
    "Chest Pain": {
        "description": "Pain in chest, possibly heart-related.",
        "causes": "Could be heart attack, angina, lung issue, reflux, or muscle strain.",
        "advice": "If severe or sudden → EMERGENCY. If mild and movement-related, may be muscle pain.",
        "medicine": "No self-medication. Aspirin only if suspected heart attack until help arrives.",
        "triage": "Emergency"
    },
    "Headache": {
        "description": "Pain in head, common but sometimes serious.",
        "causes": "Stress, dehydration, migraine, sinus infection, rarely brain issues.",
        "advice": "Rest, hydration, dim lights if migraine.",
        "medicine": "Paracetamol or ibuprofen. If persistent, see doctor.",
        "triage": "Routine"
    },
    "Stomach Pain": {
        "description": "Pain in abdominal region.",
        "causes": "Could be indigestion, food poisoning, ulcers, appendicitis.",
        "advice": "Rest, avoid spicy food, hydrate.",
        "medicine": "Antacids for acidity, ORS for diarrhea. Severe pain → doctor.",
        "triage": "Routine"
    },
    "Diabetes": {
        "description": "A chronic condition affecting sugar metabolism.",
        "causes": "Insulin deficiency or resistance.",
        "advice": "Follow diabetic diet, exercise, regular sugar check.",
        "medicine": "Metformin or insulin (doctor prescribed only).",
        "triage": "Chronic"
    },
    "Hypertension": {
        "description": "High blood pressure often without symptoms.",
        "causes": "Stress, obesity, salt intake, genetics.",
        "advice": "Low-salt diet, regular exercise, stress management.",
        "medicine": "BP medicines (doctor prescribed only).",
        "triage": "Chronic"
    },
    "Back Pain": {
        "description": "Pain in back, common in adults.",
        "causes": "Poor posture, muscle strain, slipped disc.",
        "advice": "Rest, correct posture, light stretching.",
        "medicine": "Pain relievers, hot/cold compress.",
        "triage": "Routine"
    },
    "Skin Rash": {
        "description": "Red patches or irritation on skin.",
        "causes": "Allergy, infection, eczema.",
        "advice": "Avoid scratching, keep area clean.",
        "medicine": "Antihistamines, mild creams. Severe → dermatologist.",
        "triage": "Routine"
    },
    "Anemia": {
        "description": "Low hemoglobin levels.",
        "causes": "Iron deficiency, chronic disease, blood loss.",
        "advice": "Eat iron-rich food, check blood test.",
        "medicine": "Iron supplements (doctor prescribed).",
        "triage": "Routine"
    },
    "Period Pain": {
        "description": "Cramping during menstruation.",
        "causes": "Uterine contractions during cycle.",
        "advice": "Heating pad, warm water, relaxation.",
        "medicine": "Ibuprofen or mefenamic acid (doctor guided).",
        "triage": "Routine"
    },
    "Morning Sickness": {
        "description": "Nausea/vomiting in pregnancy.",
        "causes": "Hormonal changes (high hCG).",
        "advice": "Eat small meals, avoid spicy food.",
        "medicine": "Vitamin B6 (only with doctor’s approval).",
        "triage": "Routine"
    }
};

type Message = {
    text: string;
    sender: 'user' | 'bot' | 'system';
    results?: string[];
};

type ChatStep = 'gender' | 'pregnant' | 'period' | 'symptoms';

const conditionNames = Object.keys(KB);

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        { text: "Select your gender:", sender: 'bot' }
    ]);
    const [gender, setGender] = useState<string | undefined>();
    const [isPregnant, setIsPregnant] = useState<string | undefined>();
    const [isOnPeriod, setIsOnPeriod] = useState<string | undefined>();
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [chatStep, setChatStep] = useState<ChatStep>('gender');

    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }
    }, [messages]);

    const handleGenderSelection = (value: string, displayValue: string) => {
        setMessages(prev => [...prev, { text: displayValue, sender: 'user' }]);
        setGender(value);
        if (value === 'woman') {
            setChatStep('pregnant');
            setMessages(prev => [...prev, { text: "Are you currently pregnant?", sender: 'bot' }]);
        } else {
            setChatStep('symptoms');
            setMessages(prev => [...prev, { text: "Select one or more symptoms:", sender: 'bot' }]);
        }
    };

    const handlePregnantSelection = (value: string, displayValue: string) => {
        setMessages(prev => [...prev, { text: displayValue, sender: 'user' }]);
        setIsPregnant(value);
        setChatStep('period');
        setMessages(prev => [...prev, { text: "Are you currently on your period?", sender: 'bot' }]);
    };

    const handlePeriodSelection = (value: string, displayValue: string) => {
        setMessages(prev => [...prev, { text: displayValue, sender: 'user' }]);
        setIsOnPeriod(value);
        setChatStep('symptoms');
        setMessages(prev => [...prev, { text: "Select one or more symptoms:", sender: 'bot' }]);
    };

    const handleSymptomToggle = (symptom: string) => {
        setSelectedSymptoms(prev =>
            prev.includes(symptom)
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleAnalysis = () => {
        if (selectedSymptoms.length === 0) return;

        const userMessage: Message = { text: `Selected: ${selectedSymptoms.join(', ')}`, sender: 'user' };
        const botMessage: Message = {
            text: "Here is your analysis:",
            sender: 'bot',
            results: selectedSymptoms
        };

        setMessages(prev => [...prev, userMessage, botMessage, { text: "Select one or more symptoms:", sender: 'bot' }]);
        setSelectedSymptoms([]);
    };
    
    const renderButtons = () => {
        const commonButtonClasses = "m-1";
        switch (chatStep) {
            case 'gender':
                return (
                    <div className="flex justify-center p-2">
                        <Button variant="outline" className={commonButtonClasses} onClick={() => handleGenderSelection('man', 'Man')}>Man</Button>
                        <Button variant="outline" className={commonButtonClasses} onClick={() => handleGenderSelection('woman', 'Woman')}>Woman</Button>
                    </div>
                );
            case 'pregnant':
            case 'period':
                const handler = chatStep === 'pregnant' ? handlePregnantSelection : handlePeriodSelection;
                return (
                    <div className="flex justify-center p-2">
                        <Button variant="outline" className={commonButtonClasses} onClick={() => handler('yes', 'Yes')}>Yes</Button>
                        <Button variant="outline" className={commonButtonClasses} onClick={() => handler('no', 'No')}>No</Button>
                    </div>
                );
            case 'symptoms':
                return (
                    <>
                        <ScrollArea className="h-48">
                            <div className="grid grid-cols-2 gap-4 p-4">
                                {conditionNames.map(symptom => (
                                    <div key={symptom} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={symptom}
                                            checked={selectedSymptoms.includes(symptom)}
                                            onCheckedChange={() => handleSymptomToggle(symptom)}
                                        />
                                        <label
                                            htmlFor={symptom}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {symptom}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="flex justify-center p-2">
                            <Button onClick={handleAnalysis} disabled={selectedSymptoms.length === 0}>
                                Get Analysis
                            </Button>
                        </div>
                    </>
                );
            default:
                return null;
        }
    }

    const renderResults = (results: string[]) => {
        const risky = ["Chest Pain", "Fever", "Flu"];
        
        const filteredResults = results.filter(condName => {
            if (condName === "Morning Sickness" && (gender !== 'woman' || isPregnant !== 'yes')) {
                return false;
            }
            if (condName === "Period Pain" && (gender !== 'woman' || isOnPeriod !== 'yes')) {
                return false;
            }
            return true;
        })
        
        const hasMultipleRisky = filteredResults.filter(s => risky.includes(s)).length > 1;

        return (
            <div className="space-y-4 mt-2">
                {filteredResults.map(condName => {
                    const data = KB[condName as keyof typeof KB];
                    if (!data) return null;
                    return (
                        <div key={condName} className="p-3 bg-card rounded-md border">
                            <p className="font-bold text-primary">🩺 Condition: {condName}</p>
                            <p><span className="font-semibold">📖 Description:</span> {data.description}</p>
                            <p><span className="font-semibold">⚡ Causes:</span> {data.causes}</p>
                            <p><span className="font-semibold">✅ Advice:</span> {data.advice}</p>
                            <p><span className="font-semibold">💊 Medicine:</span> {data.medicine}</p>
                            <p><span className="font-semibold">🚨 Triage:</span> {data.triage}</p>
                             {gender === 'woman' && isPregnant === 'yes' && (
                                <p className="text-destructive font-semibold mt-1">⚠️ Since you are pregnant, avoid self-medicating. Confirm with your doctor first.</p>
                            )}
                        </div>
                    )
                })}
                {hasMultipleRisky && (
                     <Alert variant="destructive" className="mt-4">
                        <AlertTitle>High Risk Alert!</AlertTitle>
                        <AlertDescription>
                            Multiple serious symptoms detected. Please consult a doctor immediately.
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] p-4 md:p-8">
            <Card className="flex-1 flex flex-col">
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
                                    className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''
                                        }`}
                                >
                                    {msg.sender === 'bot' && (
                                        <AvatarIcon>
                                            <Bot className="text-primary" />
                                        </AvatarIcon>
                                    )}
                                    <div
                                        className={`rounded-lg px-4 py-2 max-w-[80%] whitespace-pre-wrap ${msg.sender === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-card'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.text}</p>
                                        {msg.sender === 'bot' && msg.results && renderResults(msg.results)}
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
        </div>
    );
}

const AvatarIcon = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 rounded-full bg-card border flex items-center justify-center shrink-0">
        {children}
    </div>
)
