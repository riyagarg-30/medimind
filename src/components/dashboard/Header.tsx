import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, Download, Search } from 'lucide-react';
import { Input } from '../ui/input';

interface HeaderProps {
  patientName: string;
}

export function Header({ patientName }: HeaderProps) {
  const patientAvatar = PlaceHolderImages.find((img) => img.id === 'patient-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="relative ml-auto flex-1 md:grow-0">
        <h1 className="text-xl font-semibold">Patient: {patientName}</h1>
      </div>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Bell className="h-4 w-4" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
      <Button variant="outline" size="icon" className="h-8 w-8">
        <Download className="h-4 w-4" />
        <span className="sr-only">Export Report</span>
      </Button>
      <Avatar>
        {patientAvatar && (
          <AvatarImage src={patientAvatar.imageUrl} alt={patientAvatar.description} data-ai-hint={patientAvatar.imageHint}/>
        )}
        <AvatarFallback>{patientName.substring(0,2)}</AvatarFallback>
      </Avatar>
    </header>
  );
}
