import { defaultGroupIcons } from '@/constants/general';
import { GroupMember } from '@/hooks/groups/groupInterfaces';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '../ui/badge';

interface GroupMemberCardProps extends GroupMember {
  profileImg?: string;
}

export const GroupMemberCard = ({ userRole, userFirstName, userLastName, profileImg }: GroupMemberCardProps) => {
  const defaultPic = defaultGroupIcons[1].value;
  const profilePic = profileImg || defaultPic;
  const fullName = `${userFirstName} ${userLastName}`;
  // serves as a nice visual fallback in case image doesnt load (like Apple's default contact profiles)
  const fallbackPic = `${userFirstName.charAt(0)} ${userLastName.charAt(0)}}`;

  // assign different badges for each role
  const getBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'default';
      case 'member':
        return 'secondary';
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex items-center gap-3">
          {/* Profile pic */}
          <Avatar>
            <AvatarImage src={profilePic} alt={fullName} />
            <AvatarFallback>{fallbackPic}</AvatarFallback>
          </Avatar>
        </div>
        {/* member role badge and full name */}
        <div className="flex-1 min-w-0">
          <p className="font-medium font-sans truncate"> {fullName}</p>
          <Badge variant={getBadgeVariant(userRole)}>{userRole}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};
