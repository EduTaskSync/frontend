import ColourfulText from '@/components/ui/colourful-text';
import DropdownMenuWithAvatar from './profile/AvatarWithDropdown';
import { useUserContext } from '@/contexts/UserContext';
import { useScrollContext } from '@/contexts/ScrollContext';
import { Link } from 'react-router';
import { routes } from '@/constants/routes';

interface AuthHeaderProps {
  tabName: string;
}

export const AuthHeader = ({ tabName }: AuthHeaderProps) => {
  const { user } = useUserContext();
  const { visible } = useScrollContext();

  if (!user) return null;

  return (
    <div
      className={`sticky top-0 z-50 w-full flex justify-center transition-transform duration-300 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      {/* Use a fixed-width container to prevent shifting */}
      <div className="w-full max-w-4xl px-4 py-2 mx-auto relative bg-transparent">
        {/* Outer soft blurred border glow */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full w-full mx-auto opacity-70 pointer-events-none">
          <div className="absolute inset-x-0 mx-auto top-1/2 -translate-y-1/2 w-[99%] h-12 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-400/20 via-pink-400/20 to-indigo-400/20 blur-[30px]"></div>
        </div>

        <header className="flex flex-row h-12 sm:h-14 items-center w-full min-w-[320px] mx-auto px-3 sm:px-6 bg-card/70 text-card-foreground border border-white/10 rounded-xl sm:rounded-2xl shadow-md backdrop-blur-md transition-all duration-200 relative z-10">
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
        </header>
      </div>
    </div>
  );
};
