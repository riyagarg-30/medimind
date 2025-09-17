
'use client';

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/icons";
import Link from "next/link";
import { motion } from 'framer-motion';

export default function HomePage() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 20 }}
                className="flex justify-center mb-6"
            >
                <Logo className="size-20 text-primary" />
            </motion.div>
            
            <h1 className="text-5xl font-bold tracking-tight mb-4">
                Welcome to MediMind
            </h1>
            
            <p className="text-xl text-muted-foreground mb-12">
                Your AI-Powered Health Companion
            </p>

            <div className="flex gap-4">
                <Link href="/login" passHref>
                    <Button size="lg">Log In</Button>
                </Link>
                <Link href="/signup" passHref>
                    <Button size="lg" variant="outline">Create Account</Button>
                </Link>
            </div>
        </motion.div>
    </div>
  );
}
