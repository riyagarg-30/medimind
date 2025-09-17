
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [address, setAddress] = useState('');
    const [profilePic, setProfilePic] = useState('https://picsum.photos/seed/101/128/128');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedDetails = localStorage.getItem('userDetails');
            if (savedDetails) {
                const userDetails = JSON.parse(savedDetails);
                setName(userDetails.name || '');
                setEmail(userDetails.email || '');
                setAge(userDetails.age || '');
                setAddress(userDetails.address || '');
                setProfilePic(userDetails.profilePic || `https://picsum.photos/seed/${Math.random()}/128/128`);
            }
        } catch (error) {
            console.error("Failed to load user details from local storage", error);
            toast({
                title: "Error",
                description: "Could not load your profile data.",
                variant: "destructive"
            });
        }
    }, [toast]);

    const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfilePic(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSaveChanges = () => {
        try {
            const currentDetails = localStorage.getItem('userDetails');
            const parsedDetails = currentDetails ? JSON.parse(currentDetails) : {};

            const userDetails = {
                ...parsedDetails,
                name,
                email,
                age,
                address,
                profilePic,
            };
            localStorage.setItem('userDetails', JSON.stringify(userDetails));
            toast({
                title: "Profile Updated",
                description: "Your information has been successfully saved.",
            });
        } catch (error) {
            console.error("Failed to save user details to local storage", error);
            toast({
                title: "Error",
                description: "Could not save your profile data.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="p-4 md:p-8 flex justify-center items-start">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        View and update your personal details below.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-primary/20">
                                {isClient && <AvatarImage src={profilePic} alt="Profile picture" data-ai-hint="female portrait" />}
                                <AvatarFallback>
                                    {name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <label htmlFor="profile-pic-upload" className="absolute bottom-1 right-1 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                <Camera className="h-5 w-5" />
                                <input id="profile-pic-upload" type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            {isClient && <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            {isClient && <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane.doe@example.com"/>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            {isClient && <Input id="age" type="number" value={age} onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))} placeholder="28" />}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            {isClient && <Input id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="456 Health Ave, Wellness Town"/>}
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSaveChanges}>Save Changes</Button>
                </CardFooter>
            </Card>
        </div>
    );
}
