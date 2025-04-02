import { GroupMember } from '@/hooks/groups/groupInterfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface GroupMemberCardProps {
  groupMember: GroupMember;
}

export const GroupMemberCard = ({ groupMember }: GroupMemberCardProps) => {
  const { role, firstName, lastName, profilePicture } = groupMember;
  const fullName = `${firstName} ${lastName}`;
  // serves as a nice visual fallback in case image doesn't load
  const fallbackPic = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  // this generates an avatar based on user initials
  const defaultPic = `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`;

  const profilePic = profilePicture && profilePicture.startsWith('https://') ? profilePicture : defaultPic;

  return (
    <div className="group w-44 flex flex-col items-center p-4 rounded-xl bg-background/40 dark:bg-card/30 backdrop-blur-md border border-muted dark:border-border hover:border-primary/40 shadow-md dark:shadow-lg shadow-muted/5 dark:shadow-black/5 hover:shadow-primary/10 transition-all duration-300 relative overflow-hidden">
      {/* Glass-like overlay elements - theme aware */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/20 to-background/5 dark:from-white/5 dark:to-white/0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      {/* Subtle light reflections - theme aware */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 dark:bg-white/5 rounded-full blur-xl transform rotate-45 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

      <div className="relative mb-3 z-10">
        {/* More subtle gradient ring around avatar */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 dark:from-purple-500/30 dark:via-pink-400/30 dark:to-indigo-500/30 rounded-full opacity-0 group-hover:opacity-40 blur-sm transition-opacity duration-300"></div>

        {/* Reduced gradient glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/10 to-primary/10 dark:from-purple-400/20 dark:via-pink-300/20 dark:to-indigo-400/20 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

        <Avatar
          className={cn(
            'h-20 w-20 relative z-10 transition-all duration-300',
            'border-2 border-muted dark:border-border group-hover:border-transparent'
          )}
        >
          <AvatarImage src={profilePic} alt={fullName} />
          <AvatarFallback className="bg-gradient-to-br from-background/80 to-muted dark:from-primary/15 dark:to-purple-300/15 text-primary font-heading text-lg">
            {fallbackPic}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center gap-2 w-full text-center z-10">
        <p className="font-medium text-sm truncate w-full px-1">{fullName}</p>

        {/* Enhanced role badges with improved visibility - theme aware */}
        {role.toLowerCase() === 'admin' ? (
          <Badge
            variant="default"
            className={cn(
              'text-xs font-semibold px-3 py-0.5 shadow-sm backdrop-blur-sm',
              'bg-primary/80 text-primary-foreground border border-primary/30',
              'dark:bg-gradient-to-r dark:from-primary/80 dark:to-purple-500/80 dark:text-white'
            )}
          >
            Admin
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className={cn(
              'text-xs font-semibold px-3 py-0.5 shadow-sm backdrop-blur-sm',
              'bg-secondary/30 text-secondary-foreground border border-secondary/30',
              'dark:bg-secondary/20 dark:border-primary/30 dark:text-secondary-foreground/90'
            )}
          >
            Member
          </Badge>
        )}
      </div>
    </div>
  );
};
