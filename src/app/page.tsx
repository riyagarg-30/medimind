import { Suspense } from 'react';
import { Header } from '@/components/dashboard/Header';
import { PatientInfo } from '@/components/dashboard/PatientInfo';
import {
  RankedDiagnoses,
  RankedDiagnosesSkeleton,
} from '@/components/dashboard/RankedDiagnoses';
import {
  RiskStratification,
  RiskStratificationSkeleton,
} from '@/components/dashboard/RiskStratification';
import {
  UrgentAlerts,
  UrgentAlertsSkeleton,
} from '@/components/dashboard/UrgentAlerts';
import { ValidationNotes } from '@/components/dashboard/ValidationNotes';
import { Logo } from '@/components/icons';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { patientData } from '@/lib/data';
import { Stethoscope } from 'lucide-react';

export default async function DashboardPage() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-xl font-semibold">MediMind</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Stethoscope />
                <span>Patient Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Header
            patientName={`${patientData.personalInfo.name}, ${patientData.personalInfo.age}Y`}
          />
          <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-3">
                <Suspense fallback={<UrgentAlertsSkeleton />}>
                  <UrgentAlerts patient={patientData} />
                </Suspense>
              </div>

              <div className="grid auto-rows-max gap-4 lg:col-span-1 lg:gap-8">
                <Suspense fallback={<RiskStratificationSkeleton />}>
                  <RiskStratification patient={patientData} />
                </Suspense>
                <PatientInfo patient={patientData} />
              </div>

              <div className="grid auto-rows-max gap-4 lg:col-span-2 lg:gap-8">
                <Suspense fallback={<RankedDiagnosesSkeleton />}>
                  <RankedDiagnoses patient={patientData} />
                </Suspense>
                <ValidationNotes />
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}