
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = () => {
        try {
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                const users = JSON.parse(savedUsers);
                const user = users.find((u: any) => u.email === email && u.role === role);

                if (user && user.password === password) { // In a real app, compare hashed passwords
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    toast({
                        title: "Login Successful",
                        description: `Welcome back, ${user.name}!`,
                    });
                    router.push('/dashboard');
                } else {
                     toast({
                        title: "Login Failed",
                        description: "Invalid credentials or role.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Login Failed",
                    description: "No accounts found. Please sign up to create an account.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Error",
                description: "An error occurred during login. Please try again.",
                variant: "destructive",
            });
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
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
                <CardTitle>Welcome Back!</CardTitle>
                <CardDescription>Log in to access your dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Login as</Label>
                    <RadioGroup defaultValue="user" value={role} onValueChange={setRole} className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="user" id="r1" />
                            <Label htmlFor="r1">User</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="clinician" id="r2" />
                            <Label htmlFor="r2">Clinician</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button className="w-full" onClick={handleLogin}>Log In</Button>
                <p className="text-xs text-center text-muted-foreground">
                Don't have an account?{' '}
                <Link href="/signup" className="underline">
                    Sign Up
                </Link>
                </p>
            </CardFooter>
            </Card>
        </motion.div>
    </div>
  );
}
