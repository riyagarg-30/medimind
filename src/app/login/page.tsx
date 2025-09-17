
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

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = () => {
        try {
            const savedDetails = localStorage.getItem('userDetails');
            if (savedDetails) {
                const userDetails = JSON.parse(savedDetails);
                // In a real app, you'd also check the hashed password.
                if (userDetails.email === email && userDetails.password === password) {
                    toast({
                        title: "Login Successful",
                        description: "Welcome back!",
                    });
                    router.push('/dashboard');
                } else {
                     toast({
                        title: "Login Failed",
                        description: "Invalid email or password.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Login Failed",
                    description: "No account found. Please sign up to create an account.",
                    variant: "destructive",
                });
            }
        } catch (error) {
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
