import ColourfulText from '@/components/ui/colourful-text';
import { motion, AnimatePresence } from 'motion/react';
import DropdownMenuWithAvatar from './AvatarWithDropdown';
import { useUserContext } from '@/contexts/UserContext';
import { Link } from 'react-router';
import { routes } from '@/constants/routes';

interface AuthHeaderProps {
  tabName: string;
}

export const AuthHeader = ({ tabName }: AuthHeaderProps) => {
  const { user } = useUserContext();

  if (!user) return;

  return (
    <div className="sticky top-1 sm:top-3 z-10 px-2 sm:px-4 flex justify-center pt-1">
      <AnimatePresence mode="wait">
        <motion.header
          key={location.pathname}
          className="flex flex-row h-12 sm:h-14 items-center w-full min-w-[320px] max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl px-2 sm:px-6 bg-card text-card-foreground border border-border rounded-xl sm:rounded-2xl shadow-sm sm:shadow-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-20 sm:w-1/3 min-w-[70px]">
            <Link to={routes.dashboard}>
              <h1 className="text-xs sm:text-lg font-heading font-semibold truncate whitespace-nowrap">
                <span className="hidden sm:inline">EduTask</span>
                <span className="sm:hidden">ET</span>
                <ColourfulText text="Sync" />
              </h1>
            </Link>
          </div>

          {/* Tab Name Section */}
          <div className="flex-1 flex justify-center min-w-[100px] px-2">
            <p className="text-sm sm:text-xl font-tab-name text-primary truncate max-w-full">{tabName}</p>
          </div>

          {/* Avatar Section */}
          <div className="w-20 sm:w-1/3 min-w-[50px] flex justify-end">
            <DropdownMenuWithAvatar user={user} />
          </div>
        </motion.header>
      </AnimatePresence>
    </div>
  );
};
