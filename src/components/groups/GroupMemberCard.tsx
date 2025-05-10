import { GroupMember } from '@/hooks/groups/groupInterfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, UserPlus, UserMinus } from 'lucide-react';
import { useGroups } from '@/hooks/groups/useGroups';
import { useParams } from 'react-router';
import { toast } from 'sonner';

interface GroupMemberCardProps {
  groupMember: GroupMember;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
}

export const GroupMemberCard = ({ groupMember, isCurrentUser = false, isAdmin = false }: GroupMemberCardProps) => {
  const { role, firstName, lastName, profilePicture, userId } = groupMember;
  const { groupId } = useParams<{ groupId: string }>();
  const { promoteGroupMemberResponse, removeGroupMemberResponse } = useGroups(groupId);
  const fullName = `${firstName} ${lastName}`;
  // serves as a nice visual fallback in case image doesn't load
  const fallbackPic = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  // this generates an avatar based on user initials
  const defaultPic = `https://api.dicebear.com/9.x/initials/svg?seed=${firstName} ${lastName}`;

  const profilePic = profilePicture && profilePicture.startsWith('https://') ? profilePicture : defaultPic;

  const handlePromoteMember = async () => {
    if (!groupId) return;
    try {
      await promoteGroupMemberResponse.mutateAsync({ groupId, userId });
      toast.success('Member promoted successfully');
    } catch (error) {
      toast.error('Failed to promote member' + error);
    }
  };

  const handleRemoveMember = async () => {
    if (!groupId) return;
    try {
      await removeGroupMemberResponse.mutateAsync({ groupId, userId });
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member' + error);
    }
  };

  const cardContent = (
    <>
      {/* Glass-like overlay elements - theme aware */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br pointer-events-none',
          !isCurrentUser && 'from-background/20 to-background/5 dark:from-white/5 dark:to-white/0',
          isCurrentUser && 'from-primary/10 to-primary/5 dark:from-primary/15 dark:to-primary/5'
        )}
      ></div>

      {/* Hover effect - enhanced for current user */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-300 pointer-events-none',
          !isCurrentUser && 'bg-primary/5 opacity-0 group-hover:opacity-100',
          isCurrentUser && 'bg-primary/10 opacity-30 group-hover:opacity-50'
        )}
      ></div>

      {/* Subtle light reflections - theme aware */}
      <div
        className={cn(
          'absolute -top-20 -right-20 w-40 h-40 rounded-full blur-xl transform rotate-45 transition-opacity duration-500',
          !isCurrentUser && 'bg-primary/5 dark:bg-white/5 opacity-0 group-hover:opacity-20',
          isCurrentUser && 'bg-primary/10 dark:bg-primary/15 opacity-10 group-hover:opacity-30'
        )}
      ></div>

      <div className="relative mb-3 z-10">
        {/* More subtle gradient ring around avatar - enhanced for current user */}
        <div
          className={cn(
            'absolute rounded-full blur-sm transition-opacity duration-300',
            !isCurrentUser &&
              '-inset-1 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/10 dark:from-purple-500/30 dark:via-pink-400/30 dark:to-indigo-500/30 opacity-0 group-hover:opacity-40',
            isCurrentUser &&
              '-inset-2 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 dark:from-primary/40 dark:via-purple-400/40 dark:to-primary/40 opacity-30 group-hover:opacity-60'
          )}
        ></div>

        {/* Reduced gradient glow effect on hover - enhanced for current user */}
        <div
          className={cn(
            'absolute rounded-full blur-md transition-opacity duration-300',
            !isCurrentUser &&
              'inset-0 bg-gradient-to-br from-primary/10 via-primary/10 to-primary/10 dark:from-purple-400/20 dark:via-pink-300/20 dark:to-indigo-400/20 opacity-0 group-hover:opacity-50',
            isCurrentUser &&
              'inset-0 bg-gradient-to-br from-primary/20 via-primary/20 to-primary/20 dark:from-primary/30 dark:via-purple-300/30 dark:to-primary/30 opacity-30 group-hover:opacity-70'
          )}
        ></div>

        <Avatar
          className={cn(
            'relative z-10 transition-all duration-300',
            !isCurrentUser && 'h-20 w-20 border-2 border-muted dark:border-border group-hover:border-transparent',
            isCurrentUser &&
              'h-20 w-20 border-2 border-primary/50 dark:border-primary/60 ring-2 ring-primary/30 ring-offset-2 ring-offset-background dark:ring-offset-background'
          )}
        >
          <AvatarImage src={profilePic} alt={fullName} />
          <AvatarFallback
            className={cn(
              'font-heading text-lg',
              !isCurrentUser &&
                'bg-gradient-to-br from-background/80 to-muted dark:from-primary/15 dark:to-purple-300/15 text-primary',
              isCurrentUser &&
                'bg-gradient-to-br from-primary/20 to-primary/10 dark:from-primary/30 dark:to-purple-400/20 text-primary'
            )}
          >
            {fallbackPic}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center gap-2 w-full text-center z-10">
        <div className="flex items-center gap-1">
          <p
            className={cn(
              'font-medium truncate px-1',
              !isCurrentUser && 'text-sm',
              isCurrentUser && 'text-sm font-bold text-primary dark:text-primary'
            )}
          >
            {fullName}
          </p>
          {isAdmin && !isCurrentUser && <MoreVertical className="h-4 w-4 text-muted-foreground" />}
        </div>

        {/* Enhanced role badges with improved visibility - theme aware */}
        {role.toLowerCase() === 'admin' ? (
          <Badge
            variant="default"
            className={cn(
              'text-xs font-semibold px-3 py-0.5 shadow-sm backdrop-blur-sm',
              !isCurrentUser &&
                'bg-primary/80 text-primary-foreground border border-primary/30 dark:bg-gradient-to-r dark:from-primary/80 dark:to-purple-500/80 dark:text-white',
              isCurrentUser &&
                'bg-primary text-primary-foreground border border-primary/50 dark:bg-gradient-to-r dark:from-primary dark:to-purple-500 dark:text-white'
            )}
          >
            Admin
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className={cn(
              'text-xs font-semibold px-3 py-0.5 shadow-sm backdrop-blur-sm',
              !isCurrentUser &&
                'bg-secondary/30 text-secondary-foreground border border-secondary/30 dark:bg-secondary/20 dark:border-primary/30 dark:text-secondary-foreground/90',
              isCurrentUser &&
                'bg-secondary/50 text-secondary-foreground border border-secondary/40 dark:bg-secondary/30 dark:border-primary/40 dark:text-secondary-foreground'
            )}
          >
            Member
          </Badge>
        )}
      </div>
    </>
  );

  if (isAdmin && !isCurrentUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'group w-44 flex flex-col items-center p-4 rounded-xl backdrop-blur-md shadow-md dark:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer',
              'bg-background/40 dark:bg-card/30 border border-muted dark:border-border hover:border-primary/40 shadow-muted/5 dark:shadow-black/5 hover:shadow-primary/10'
            )}
          >
            {cardContent}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {role.toLowerCase() !== 'admin' && (
            <DropdownMenuItem onClick={handlePromoteMember} className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Promote to Admin
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleRemoveMember} className="flex items-center gap-2 text-destructive">
            <UserMinus className="h-4 w-4" />
            Remove Member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div
      className={cn(
        'group w-44 flex flex-col items-center p-4 rounded-xl backdrop-blur-md shadow-md dark:shadow-lg transition-all duration-300 relative overflow-hidden',
        // Regular user styling
        !isCurrentUser &&
          'bg-background/40 dark:bg-card/30 border border-muted dark:border-border hover:border-primary/40 shadow-muted/5 dark:shadow-black/5 hover:shadow-primary/10',
        // Current user styling - more prominent
        isCurrentUser &&
          'bg-primary/5 dark:bg-primary/10 border-2 border-primary/30 dark:border-primary/40 shadow-primary/20 dark:shadow-primary/10 hover:shadow-primary/30'
      )}
    >
      {cardContent}
    </div>
  );
};
