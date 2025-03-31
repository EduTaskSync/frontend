import { defaultGroupIcons } from '@/constants/general';
import { GroupMember } from '@/hooks/groups/groupInterfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface GroupMemberCardProps {
  groupMember: GroupMember;
}

export const GroupMemberCard = ({ groupMember }: GroupMemberCardProps) => {
  const { role, firstName, lastName, profilePicture } = groupMember;
  const defaultPic = defaultGroupIcons[1].value;
  const profilePic = profilePicture || defaultPic;
  const fullName = `${firstName} ${lastName}`;
  // serves as a nice visual fallback in case image doesn't load
  const fallbackPic = `${firstName.charAt(0)}${lastName.charAt(0)}`;

  // assign different badges for each role
  const getBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'default';
      case 'member':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="group w-44 flex flex-col items-center p-4 rounded-xl bg-card/80 border border-border/40 hover:border-primary/30 shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all duration-200">
      <div className="relative mb-3">
        {/* Gradient glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-pink-300/30 to-indigo-400/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <Avatar
          className={cn(
            'h-20 w-20 border-2 border-border group-hover:border-primary/30 transition-all duration-300',
            role.toLowerCase() === 'admin' ? 'ring-2 ring-primary/30' : ''
          )}
        >
          <AvatarImage src={profilePic} alt={fullName} />
          <AvatarFallback className="bg-gradient-to-br from-primary/10 to-purple-300/10 text-primary font-heading text-lg">
            {fallbackPic}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex flex-col items-center gap-2 w-full text-center">
        <p className="font-medium text-sm truncate w-full px-1">{fullName}</p>
        <Badge
          variant={getBadgeVariant(role)}
          className={cn(
            'text-xs px-2.5 py-0.5',
            role.toLowerCase() === 'admin' ? 'bg-primary/20 text-primary border-primary/30' : 'bg-secondary/10'
          )}
        >
          {role}
        </Badge>
      </div>
    </div>
  );
};
