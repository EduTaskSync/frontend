import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/ui/button';
import { CircleArrowLeft, Users, Calendar, FolderKanban } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { GroupDetailsHeader } from '@/components/groups/GroupDetailsHeader';
import { GroupMemberList } from '@/components/groups/GroupMemberList';
import { InviteMemberDialog } from '@/components/groups/InviteMemberDialog';
import { useGroups } from '@/hooks/groups/useGroups';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { AddProjectDialog } from '@/components/projects/AddProjectDialog';
import { ProjectSummary } from '@/hooks/projects/projectInterfaces';

const GroupDetailPage = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { inviteGroupMemberResponse } = useGroups(groupId);

  const mockGroupProjects: ProjectSummary[] = [
    {
      projectId: '1',
      projectName: 'Project 1',
      deadline: new Date('2023-12-31'),
      progress: 50,
    },
    {
      projectId: '2',
      projectName: 'Project 2',
      deadline: new Date('2024-01-15'),
      progress: 75,
    },
  ];

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
              <Button size="sm" className="gap-1 font-heading text-sm hover:cursor-pointer">
                <span>Invite Member</span>
              </Button>
            }
            onSubmit={handleSendInvite}
            isLoading={inviteGroupMemberResponse.isPending}
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
              <Button size="sm" className="gap-2 font-heading text-sm hover:cursor-pointer">
                <span>New Project</span>
              </Button>
            }
            onSubmit={(data) => {
              // Handle project creation here
              console.log('Creating project:', data);
              // You'll want to add your API call to create a project
            }}
            groupId={groupId || ''}
            isLoading={false} // Set to your API loading state
          />
        </div>

        {mockGroupProjects.length > 0 ? (
          <div className="flex flex-col space-y-4">
            {mockGroupProjects.map((project) => (
              <div key={project.projectId} className="w-full">
                <ProjectCard project={project} groupId={groupId || ''} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
            No projects yet. Click New Project to get started.
          </div>
        )}
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
