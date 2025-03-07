import { FloatingDock } from '@/components/ui/floating-dock';
import { Home, Calendar, Folder } from 'lucide-react';

export const Dock = () => {
  const items = [
    { title: 'Home', icon: <Home className="w-full h-full" />, href: '/dashboard' },
    { title: 'Projects', icon: <Folder className="w-full h-full" />, href: '/projects' },
    { title: 'Calendar', icon: <Calendar className="w-full h-full" />, href: '/calendar' },
  ];

  return (
    <footer className="fixed bottom-6 left-0 right-0 flex justify-center items-center z-50">
      <div className="shadow-lg rounded-full backdrop-blur-sm bg-white/10 dark:bg-black/10 p-1">
        <FloatingDock items={items} />
      </div>
    </footer>
  );
};
