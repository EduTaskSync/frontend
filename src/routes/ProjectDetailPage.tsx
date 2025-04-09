import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/ui/button';
import { CircleArrowLeft, Users, Calendar, FolderKanban } from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ProjectDetailsHeader } from '@/components/projects/ProjectDetailsHeader';
import { GroupMemberList } from '@/components/groups/GroupMemberList';
import { ProjectGrid } from '@/components/projects/ProjectGrid';

const ProjectDetailPage = () => {
  const { state } = useLocation();

  return (
    <MainContent>
      {/* Back button */}
      <div className="flex mb-6 font-heading">
        <Button variant="ghost" size="lg" asChild className="gap-2 pl-1 hover:cursor-pointer">
          <Link to="../">
            <CircleArrowLeft />
            <span>Back to Projects</span>
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <div className="mb-8">
        <ProjectDetailsHeader projectDetails={state.projectDetails} />
      </div>

      {/* Members Section header - Horizontal Layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-400" />
            <h3 className="font-heading font-semibold text-lg">Members</h3>
          </div>

          <Button size="sm" className="gap-1 font-heading text-sm hover:cursor-pointer">
            <span>Invite</span>
          </Button>
        </div>

        {/* Horizontally scrollable member list */}
        <GroupMemberList />
      </div>

      {/* Projects Section - Horizontal Layout */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5 text-emerald-400" />
            <h3 className="font-heading font-semibold text-lg">Projects</h3>
          </div>
        </div>

        {/* Horizontally scrollable project cards */}
        <ScrollArea className="w-full whitespace-nowrap pb-4">
          <div className="flex space-x-4 min-h-[140px]">
            {/* Project cards will go here */}
            <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
            <ProjectGrid />
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
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

export default ProjectDetailPage;
