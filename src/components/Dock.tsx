import { FloatingDock } from '@/components/ui/floating-dock';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { useScrollContext } from '@/contexts/ScrollContext';
import { Home, Calendar, Users } from 'lucide-react';

export const Dock = () => {
  const { visible } = useScrollContext();

  const items = [
    {
      title: 'Home',
      icon: <Home className="w-full h-full text-primary-foreground" />,
      href: '/app/dashboard',
    },
    {
      title: 'Groups',
      icon: <Users className="w-full h-full text-primary-foreground" />,
      href: '/app/groups',
    },
    {
      title: 'Calendar',
      icon: <Calendar className="w-full h-full text-primary-foreground" />,
      href: '/app/calendar',
    },
  ];

  return (
    <footer
      className={`fixed bottom-6 left-0 right-0 flex justify-center items-center z-50 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <BackgroundGradient className="p-1 rounded-xl">
        <FloatingDock
          items={items}
          desktopClassName="bg-card/95 backdrop-blur-md border-none shadow-none rounded-xl"
          mobileClassName="bg-card/95 backdrop-blur-md border-none shadow-none rounded-xl"
          iconBackgroundClassName="bg-primary hover:bg-primary/90 border-2 border-primary-foreground/20"
        />
      </BackgroundGradient>
    </footer>
  );
};
