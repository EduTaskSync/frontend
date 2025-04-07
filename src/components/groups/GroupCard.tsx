import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { Users, Trash2, EyeOff, UserPen, FolderKanban } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useGroups } from '@/hooks/groups/useGroups';
import { ButtonWithTooltip } from '../ButtonWithToolTip';
import { GroupRole } from '@/constants/general';
import { useUserContext } from '@/contexts/UserContext';
import { DeleteGroupDialog } from './DeleteGroupDialog';

// shape of the group object sent to the GroupCard component
interface GroupCardProps {
  group: {
    id: string;
    name: string;
    size: number;
    image: string;
  };
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const { user } = useUserContext();
  const { getGroupMembersResponse } = useGroups(group.id);
  const { data: membersData } = getGroupMembersResponse;
  const isAdmin =
    membersData?.users.some((member) => member.userId === user?.userId && member.role === GroupRole.ADMIN) || false;
  const deleteComponent = (
    <ButtonWithTooltip
      variant="destructive"
      size="sm"
      className="h-9 w-9 rounded-full p-0 bg-destructive shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-destructive/90 hover:scale-105 transition-transform duration-150 cursor-pointer"
      disabled={!isAdmin}
      tooltipText={isAdmin ? 'Delete group' : 'You are not an admin of this group'}
    >
      <Trash2 className="h-5 w-5 text-white" />
      <span className="sr-only">Delete group</span>
    </ButtonWithTooltip>
  );
  return (
    <div className="w-full p-[2px] rounded-xl bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_20px_5px_rgba(168,85,247,0.25)] hover:from-purple-500 hover:via-pink-400 hover:to-indigo-500 group/wrapper">
      <Link to={`${group.id}`} className="w-full group/card block h-full relative">
        <div
          className="absolute top-2 left-2 z-20 opacity-60 group-hover/card:opacity-100 transition-opacity duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <ButtonWithTooltip
            variant="secondary"
            size="sm"
            className="h-9 w-9 rounded-full p-0 bg-secondary/80 shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-secondary hover:scale-105 transition-transform duration-150 cursor-pointer"
            tooltipText="Hide group from feed"
          >
            <EyeOff className="h-5 w-5 text-secondary-foreground" />
            <span className="sr-only"> Hide group</span>
          </ButtonWithTooltip>
        </div>

        {/* Delete button on the RIGHT */}
        <div
          className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <DeleteGroupDialog trigger={deleteComponent} groupId={group.id} groupName={group.name} isAdmin={isAdmin} />
        </div>

        <div
          className={cn(
            'cursor-pointer overflow-hidden relative h-[calc(12rem-4px)] rounded-[calc(0.75rem-1px)] shadow-sm flex flex-col justify-between p-4 transition-all duration-300 bg-card',
            'bg-cover bg-center'
          )}
          style={{ backgroundImage: `url(${group.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-[2px] opacity-60 transition-opacity duration-300 group-hover/card:opacity-75"></div>
          {/* Content container */}
          <div className="flex flex-col justify-end h-full z-10">
            <div className="inline-flex flex-col px-3 py-2 bg-black/30 border border-white/10 backdrop-blur-md rounded-lg transition-all duration-300 group-hover/card:bg-black/40 max-w-full">
              <h2 className="font-bold text-lg text-primary-foreground font-heading tracking-tight mb-1 truncate">
                {group.name}
              </h2>

              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Members badge */}
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-2 py-0.5 h-5 bg-white/10 backdrop-blur-sm border-white/10 text-white text-xs font-medium"
                >
                  <Users className="h-3 w-3 text-purple-500" />
                  <span className="font-sans">{group.size}</span>
                </Badge>

                {/* Projects badge */}
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-2 py-0.5 h-5 bg-white/10 backdrop-blur-sm border-white/10 text-white text-xs font-medium"
                >
                  <FolderKanban className="h-3 w-3 text-emerald-300" />
                  <span className="font-sans">{0}</span>//todo get count from route
                </Badge>

                {/* Role badge */}
                {isAdmin ? (
                  <Badge
                    variant="default"
                    className={cn(
                      'text-xs font-medium px-3 py-0.5 h-5 shadow-sm backdrop-blur-sm flex items-center gap-1',
                      'bg-primary/80 text-primary-foreground border border-primary/50 dark:bg-gradient-to-r dark:from-primary dark:to-purple-500 dark:text-white'
                    )}
                  >
                    <UserPen className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'text-xs font-medium px-3 py-0.5 h-5 shadow-sm backdrop-blur-sm flex items-center gap-1',
                      'bg-secondary/50 text-secondary-foreground border border-secondary/40 dark:bg-secondary/30 dark:border-primary/40 dark:text-secondary-foreground'
                    )}
                  >
                    <Users className="h-3 w-3" />
                    Member
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
