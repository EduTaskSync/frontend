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
    <div className="group w-44 flex flex-col items-center p-4 rounded-xl bg-background/40 dark:bg-card/30 backdrop-blur-md border border-muted dark:border-border hover:shadow-md dark:shadow-lg shadow-muted/5 dark:shadow-black/5 transition-all duration-300 relative overflow-hidden">
      {/* Border gradient animation on hover */}
      <div className="absolute inset-0 rounded-xl p-[1px] -m-[1px] bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/50 group-hover:via-primary/30 group-hover:to-primary/50 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>

      {/* Very subtle background tint on hover - keeping this minimal */}
      <div className="absolute inset-[1px] rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300 pointer-events-none"></div>

      <div className="relative mb-3 z-10">
        {/* Removing the avatar ring highlight on hover */}

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

        {/* Admin badge now uses gradient in both light and dark mode */}
        {role.toLowerCase() === 'admin' ? (
          <Badge
            variant="default"
            className="text-xs font-semibold px-3 py-0.5 shadow-sm backdrop-blur-sm bg-gradient-to-r from-primary/80 to-purple-500/80 border border-primary/30 text-white"
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
