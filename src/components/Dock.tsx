import { FloatingDock } from '@/components/ui/floating-dock';
import { Home, Calendar, Folder } from 'lucide-react';

export const Dock = () => {
  const items = [
    { title: 'Home', icon: <Home className="w-full h-full text-primary" />, href: '/app/dashboard' },
    { title: 'Groups', icon: <Folder className="w-full h-full text-primary" />, href: '/app/groups' },
    { title: 'Calendar', icon: <Calendar className="w-full h-full text-primary" />, href: '/app/calendar' },
  ];

  return (
    <footer className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-50">
      <FloatingDock items={items} />
    </footer>
  );
};
