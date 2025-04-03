import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ScrollContextType {
  visible: boolean;
}

const ScrollContext = createContext<ScrollContextType>({
  visible: true,
});

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Make elements visible when scrolling up or at the top of the page
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(isVisible);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return <ScrollContext.Provider value={{ visible }}>{children}</ScrollContext.Provider>;
}

export const useScrollContext = (): ScrollContextType => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};
