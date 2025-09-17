
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from './icons';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function ChatWidget() {
  return (
    <Link href="/dashboard/chatbot" passHref>
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
            >
                <Logo className="size-8 text-primary-foreground" />
            </Button>
        </motion.div>
    </Link>
  );
}
