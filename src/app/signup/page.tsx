
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function SignupPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const router = useRouter();
    const { toast } = useToast();

    const handleCreateAccount = () => {
        if (!name || !email || !password || !role) {
            toast({
                title: "Incomplete Form",
                description: "Please fill out all required fields.",
                variant: "destructive",
            });
            return;
        }

        const newUser = {
            id: Date.now(),
            name,
            email,
            address,
            age: age === '' ? '' : Number(age),
            password, // In a real app, this should be hashed!
            role,
            profilePic: `https://picsum.photos/seed/${Date.now()}/128/128`
        };

        try {
            const savedUsers = localStorage.getItem('users');
            const users = savedUsers ? JSON.parse(savedUsers) : [];

            const userExists = users.some((user: any) => user.email === email);

            if (userExists) {
                toast({
                    title: "Account Exists",
                    description: "An account with this email already exists. Please log in.",
                    variant: "destructive",
                });
                return;
            }
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));

            toast({
                title: "Account Created!",
                description: "You can now log in with your new account.",
            });
            router.push('/login');
        } catch (error) {
            console.error("Signup error:", error);
            toast({
                title: "Error",
                description: "Could not create account. Please try again.",
                variant: "destructive",
            });
        }
    };

  return (
    <div className="flex items-center justify-center p-4 py-8 min-h-screen bg-background">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full"
        >
            <Card className="w-full max-w-md mx-auto border-0 shadow-2xl shadow-primary/10">
            <CardHeader className="text-center">
                <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                className="flex justify-center mb-4"
                >
                <Logo className="size-12 text-primary" />
                </motion.div>
                <CardTitle>Create Your MediMind Account</CardTitle>
                <CardDescription>Join us to start your health journey.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Register as</Label>
                    <RadioGroup defaultValue="user" value={role} onValueChange={setRole} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="user" id="r1" />
                            <Label htmlFor="r1">Patient</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clinician" id="r2" />
                            <Label htmlFor="r2">Clinician</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Wellness St, Health City" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input id="age" type="number" placeholder="30" required value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" onClick={handleCreateAccount}>Create Account</Button>
                <p className="text-xs text-center text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                    Sign In
                </Link>
                </p>
            </CardFooter>
            </Card>
        </motion.div>
    </div>
  );
}
