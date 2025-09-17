
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";

type User = {
    id: number;
    name: string;
    email: string;
    age: number | '';
    address: string;
    role: 'user' | 'clinician';
    profilePic: string;
    lastCondition?: string;
}

interface PatientDataTableProps {
    patients: User[];
}

export function PatientDataTable({ patients }: PatientDataTableProps) {
    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[80px]">Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-center">Age</TableHead>
                    <TableHead>Last Condition</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.length > 0 ? patients.map((patient) => (
                        <TableRow key={patient.id}>
                            <TableCell>
                                <Avatar>
                                    <AvatarImage src={patient.profilePic} alt={patient.name} />
                                    <AvatarFallback>{patient.name.charAt(0).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.email}</TableCell>
                            <TableCell className="text-center">{patient.age || 'N/A'}</TableCell>
                            <TableCell>
                                {patient.lastCondition ? (
                                    <Badge variant="destructive">{patient.lastCondition}</Badge>
                                ) : (
                                    <span className="text-muted-foreground text-xs">No analysis run</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">Active</Badge>
                            </TableCell>
                        </TableRow>
                    )) : (
                         <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No patients found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

    