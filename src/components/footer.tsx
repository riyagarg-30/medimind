
import { Linkedin, Facebook, Twitter, Mail } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './icons';

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="space-y-4 flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2">
              <Logo className="size-8 text-primary" />
              <span className="text-xl font-semibold">MediMind</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your AI-Powered Health Companion.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4"/>
                <a href="mailto:contact@medimind.com" className="hover:text-primary">
                    contact@medimind.com
                </a>
            </div>
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
             <div className="flex justify-center md:justify-start space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Linkedin className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Facebook className="h-6 w-6" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                    <Twitter className="h-6 w-6" />
                </Link>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MediMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
