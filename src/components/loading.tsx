import { Logo } from './icons';

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="relative">
        <Logo className="size-24 text-primary" />
      </div>
    </div>
  );
}
