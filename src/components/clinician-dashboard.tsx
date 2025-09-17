
'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PatientDataTable } from "./patient-data-table";
import { Loader2, Users } from "lucide-react";

type User = {
    id: number;
    name: string;
    email: string;
    age: number | '';
    address: string;
    role: 'user' | 'clinician';
    profilePic: string;
}

export function ClinicianDashboard() {
    const [patients, setPatients] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const allUsersString = localStorage.getItem('users');
            if (allUsersString) {
                const allUsers = JSON.parse(allUsersString);
                const patientUsers = allUsers.filter((user: User) => user.role === 'user');
                setPatients(patientUsers);
            }
        } catch (error) {
            console.error("Failed to load patient data from local storage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading patient data...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="w-full max-w-6xl mx-auto">
                 <h1 className="text-4xl font-bold text-primary mb-12 flex items-center justify-center gap-3">
                    Clinician Dashboard
                </h1>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
                            Patient Overview
                        </CardTitle>
                        <CardDescription>
                            A list of all registered patients in the system.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PatientDataTable patients={patients} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

    