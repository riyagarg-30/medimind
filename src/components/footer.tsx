
import { Linkedin, Facebook, Twitter, Mail, Phone, Book, Shield, FileText } from 'lucide-react';
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
             <h3 className="text-lg font-semibold mb-4">Learn More</h3>
             <ul className="space-y-2 text-sm">
                <li>
                    <Link href="/dashboard/about" className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary">
                        <Book className="h-4 w-4"/>
                        About Us
                    </Link>
                </li>
                <li>
                    <Link href="#" className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary">
                        <Shield className="h-4 w-4"/>
                        Privacy Policy
                    </Link>
                </li>
                <li>
                    <Link href="#" className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary">
                        <FileText className="h-4 w-4"/>
                        Terms of Service
                    </Link>
                </li>
             </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MediMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
