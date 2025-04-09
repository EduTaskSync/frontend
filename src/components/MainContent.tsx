import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface MainContentProps {
  children?: ReactNode;
}

export const MainContent = ({ children }: MainContentProps) => {
  return (
    <motion.main
      className="w-full flex justify-center px-4 sm:px-6 py-4 sm:py-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="w-full min-w-[1400px] max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl bg-card text-card-foreground border-1 border-purple-400 rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md p-4 sm:p-6">
        {children || (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl sm:text-2xl font-heading font-semibold">Content Area</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              This area will display the main content for this section.
            </p>
          </div>
        )}
      </div>
    </motion.main>
  );
};
