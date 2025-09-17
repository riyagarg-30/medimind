
import { Linkedin, Facebook, Twitter, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './icons';

export function Footer() {
  return (
    <footer className="bg-secondary border-t mt-auto">
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
            <div className="space-y-2 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4"/>
                    <a href="mailto:medimind84@gmail.com" className="hover:text-primary">
                        medimind84@gmail.com
                    </a>
                </div>
                <p className="text-xs text-muted-foreground/80">(Official Contact Mail)</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground pt-2">
                    <Phone className="h-4 w-4"/>
                    <span>+91 78145 68422</span>
                </div>
            </div>
          </div>

          <div>
             <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
             <div className="flex justify-center md:justify-start space-x-4">
                <Link href="https://www.linkedin.com/in/riya-garg-98a09a334?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
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
