import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/ui/button';
import { CircleArrowLeft, Users, Calendar, FolderKanban } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { GroupDetailsHeader } from '@/components/groups/GroupDetailsHeader';
import { GroupMemberList } from '@/components/groups/GroupMemberList';
import { InviteMemberDialog } from '@/components/groups/InviteMemberDialog';
import { useGroups } from '@/hooks/groups/useGroups';
import { AddProjectDialog } from '@/components/projects/AddProjectDialog';
import { useProjects } from '@/hooks/projects/useProjects';
import { ProjectList } from '@/components/projects/ProjectList';
import { ButtonWithTooltip } from '@/components/ButtonWithToolTip';
import { GroupRole } from '@/constants/general';
import { useUserContext } from '@/contexts/UserContext';

const GroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { inviteGroupMemberResponse, getGroupMembersResponse } = useGroups(groupId);
  const { user } = useUserContext();
  const { data: membersData } = getGroupMembersResponse;
  const isAdmin =
    membersData?.users.some((member) => member.userId === user?.userId && member.role === GroupRole.ADMIN) || false;
  const { createProjectResponse } = useProjects(groupId);

  const handleCreateProject = (data: { projectName: string; deadline: Date | null }) => {
    if (!groupId) return;

    createProjectResponse.mutate({
      projectName: data.projectName,
      deadline: data.deadline,
      creation_time: new Date(),
    });
  };

  const handleSendInvite = (data: { email: string }) => {
    if (!groupId) return;

    inviteGroupMemberResponse.mutate({
      email: data.email,
      groupId: groupId,
    });
  };

  return (
    <MainContent>
      {/* Back button */}
      <div className="flex mb-6 font-heading">
        <Button variant="ghost" size="lg" asChild className="gap-2 pl-1 hover:cursor-pointer">
          <Link to="..">
            <CircleArrowLeft />
            <span>Back to Groups</span>
          </Link>
        </Button>
      </div>

      {/* Group Header */}
      <div className="mb-8">
        <GroupDetailsHeader />
      </div>

      {/* Members Section header - Horizontal Layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="font-heading font-semibold text-lg">Members</h3>
          </div>
          <InviteMemberDialog
            trigger={
              <ButtonWithTooltip
                size="sm"
                className="gap-1 font-heading text-sm hover:cursor-pointer"
                tooltipText={isAdmin ? 'Invite a new member to this group' : 'Only group admins can invite members.'}
              >
                <span>Invite Member</span>
              </ButtonWithTooltip>
            }
            onSubmit={handleSendInvite}
            isLoading={inviteGroupMemberResponse.isPending}
            isAdmin={isAdmin}
          />
        </div>

        {/* Horizontally scrollable member list */}
        <GroupMemberList />
      </div>

      {/* Projects Section - Single Project Per Row */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-emerald-400" />
            <h3 className="font-heading font-semibold text-lg">Projects</h3>
          </div>

          <AddProjectDialog
            trigger={
              <ButtonWithTooltip
                size="sm"
                className="gap-2 font-heading text-sm hover:cursor-pointer"
                tooltipText={isAdmin ? 'Create a new project in this group.' : 'Only group admins can create projects.'}
              >
                <span>New Project</span>
              </ButtonWithTooltip>
            }
            onSubmit={handleCreateProject}
            groupId={groupId || ''}
            isLoading={false}
            isAdmin={isAdmin}
          />
        </div>
        <ProjectList />
      </div>

      {/* Upcoming Tasks Section - Horizontal Layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h3 className="font-heading font-semibold text-lg">Upcoming Tasks</h3>
          </div>
        </div>

        {/* Horizontally scrollable event cards */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4 min-h-[140px]">
            {/* Task cards will go here */}
            <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
              No upcoming tasks. Tasks from your projects will appear here.
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </MainContent>
  );
};

export default GroupDetailPage;
