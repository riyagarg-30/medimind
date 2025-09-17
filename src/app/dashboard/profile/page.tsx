
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type User = {
    id: number;
    name: string;
    email: string;
    age: number | '';
    address: string;
    profilePic: string;
    password?: string;
}

export default function ProfilePage() {
    const { toast } = useToast();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        try {
            const savedDetails = localStorage.getItem('currentUser');
            if (savedDetails) {
                setCurrentUser(JSON.parse(savedDetails));
            } else {
                // Handle case where user is not logged in, maybe redirect or show a message.
                // For now, we'll just log an error.
                console.error("No current user found in local storage.");
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
        if (e.target.files && e.target.files[0] && currentUser) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const newPic = event.target?.result as string;
                setCurrentUser({ ...currentUser, profilePic: newPic });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleFieldChange = (field: keyof User, value: string | number) => {
        if (currentUser) {
            setCurrentUser({ ...currentUser, [field]: value });
        }
    };

    const handleSaveChanges = () => {
        if (!currentUser) return;

        try {
            // Update the currentUser in localStorage
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Also update the user's details in the main users array
            const allUsersString = localStorage.getItem('users');
            if (allUsersString) {
                let allUsers = JSON.parse(allUsersString);
                const userIndex = allUsers.findIndex((u: User) => u.id === currentUser.id);
                if (userIndex > -1) {
                    allUsers[userIndex] = currentUser;
                    localStorage.setItem('users', JSON.stringify(allUsers));
                }
            }

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

    if (!isClient || !currentUser) {
        // You can return a loader here
        return (
            <div className="p-4 md:p-8 flex justify-center items-start">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Loading your personal details...
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

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
                                <AvatarImage src={currentUser.profilePic} alt="Profile picture" data-ai-hint="female portrait" />
                                <AvatarFallback>
                                    {currentUser.name?.charAt(0).toUpperCase() || 'U'}
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
                            <Input id="name" value={currentUser.name} onChange={e => handleFieldChange('name', e.target.value)} placeholder="Jane Doe" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" value={currentUser.email} onChange={e => handleFieldChange('email', e.target.value)} placeholder="jane.doe@example.com"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input id="age" type="number" value={currentUser.age} onChange={e => handleFieldChange('age', e.target.value === '' ? '' : Number(e.target.value))} placeholder="28" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={currentUser.address} onChange={e => handleFieldChange('address', e.target.value)} placeholder="456 Health Ave, Wellness Town"/>
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
