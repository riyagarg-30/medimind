
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { motion } from 'framer-motion';
import Image from "next/image";

export default function SignupPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-background">
       <div className="flex items-center justify-center p-4 py-8">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Doe" required />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Wellness St, Health City" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" placeholder="30" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Link href="/dashboard" className="w-full">
                    <Button className="w-full">Create Account</Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                    Already have an account?{' '}
                    <a href="#" className="underline">
                        Sign In
                    </a>
                    </p>
                </CardFooter>
                </Card>
            </motion.div>
       </div>
        <div className="hidden lg:block relative">
             <Image 
                src="https://picsum.photos/seed/201/1200/1800"
                alt="Healthcare professional"
                fill
                className="object-cover"
                data-ai-hint="healthcare professional"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-70"></div>
        </div>
    </div>
  );
}
