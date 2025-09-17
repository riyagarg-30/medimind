
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

export function PrivacyPolicyDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Shield className="h-4 w-4"/>
            Privacy Policy
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Privacy Policy for MediMind</DialogTitle>
          <DialogDescription>
            Last Updated: {new Date().toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-6">
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Welcome to MediMind. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.
            </p>

            <h3 className="font-semibold text-foreground">1. Information We Collect</h3>
            <p>
              We may collect personal information that you voluntarily provide to us when you register on the application, express an interest in obtaining information about us or our products and services, when you participate in activities on the application, or otherwise when you contact us. The personal information we collect may include:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li><strong>Personal Identification Information:</strong> Name, email address, age.</li>
              <li><strong>Health Information:</strong> Symptoms, medical reports, and other health-related data you provide for analysis.</li>
              <li><strong>Usage Data:</strong> We may automatically collect certain information when you visit, use, or navigate the application. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and other technical information.</li>
            </ul>

            <h3 className="font-semibold text-foreground">2. How We Use Your Information</h3>
            <p>
              We use the information we collect or receive:
            </p>
             <ul className="list-disc list-inside space-y-1 pl-4">
                <li>To create and manage your account.</li>
                <li>To provide you with our services, including AI-powered diagnostic analysis.</li>
                <li>To save your analysis history for your personal reference.</li>
                <li>To respond to your inquiries and offer support.</li>
                <li>To improve our application and services.</li>
            </ul>

            <h3 className="font-semibold text-foreground">3. Data Storage and Security</h3>
             <p>
              This prototype application stores all user data, including personal and health information, in the browser's <strong>local storage</strong> on your device. This means your data is not transmitted to or stored on our servers.
            </p>
             <ul className="list-disc list-inside space-y-1 pl-4">
                <li><strong>Data Localization:</strong> Your data remains on your own computer or device. We do not have access to it.</li>
                <li><strong>Security Measures:</strong> While we do not have access to your data, you are responsible for securing your own device. We recommend using a secure password and ensuring your device's operating system is up to date.</li>
                <li><strong>Data Deletion:</strong> You can clear your data at any time by clearing your browser's cache and local storage.</li>
            </ul>

             <h3 className="font-semibold text-foreground">4. Disclosure of Your Information</h3>
            <p>
              Since all data is stored locally on your device, we do not have access to it and therefore cannot and do not share, sell, rent, or trade any of your information with any third parties for their promotional purposes.
            </p>

            <h3 className="font-semibold text-foreground">5. Third-Party Services</h3>
            <p>
              Our application uses Google's Generative AI models to provide diagnostic analysis. The symptoms and report data you submit are sent to Google for processing. Google's use of this data is governed by their own privacy policies. We do not store this information after the analysis is complete.
            </p>

            <h3 className="font-semibold text-foreground">6. Your Privacy Rights</h3>
            <p>
              You have the right to access, update, or delete the information on your device. You can manage your profile information and clear your history directly within the application.
            </p>

            <h3 className="font-semibold text-foreground">7. Contact Us</h3>
            <p>
              If you have questions or comments about this policy, you may email us at medimind84@gmail.com.
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
