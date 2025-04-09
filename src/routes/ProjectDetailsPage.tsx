import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/ui/button';
import { CircleArrowLeft, Users, Calendar, KanbanSquare } from 'lucide-react';
import { Link, useParams, useLocation } from 'react-router';
import { Separator } from '@/components/ui/separator';
import { KanbanBoard } from '@/components/kanban/KanbanBoard';

export const ProjectDetailsPage = () => {
  const { groupId } = useParams<{ groupId: string; projectId: string }>();
  const { state } = useLocation();
  const projectDetails = state?.projectDetails || {};

  return (
    <MainContent>
      {/* Back button - Goes back to group details */}
      <div className="flex mb-6 font-heading">
        <Button variant="ghost" size="lg" asChild className="gap-2 pl-1 hover:cursor-pointer">
          <Link to={`/app/groups/${groupId}`}>
            <CircleArrowLeft />
            <span>Back to Group</span>
          </Link>
        </Button>
      </div>

      {/* Project Header */}
      <div className="w-full mb-8">
        <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg group border border-border">
          {/* Background image with overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${projectDetails.image || '/project-default.jpg'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-background/80 to-background/95"></div>

          {/* Content */}
          <div className="relative p-5 sm:p-6">
            {/* Top row with image and main info */}
            <div className="flex items-start gap-5">
              {/* Project preview image with gradient border */}
              <div className="p-[2px] rounded-lg bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 shadow-sm flex-shrink-0">
                <div className="h-24 w-32 sm:h-32 sm:w-44 rounded-[calc(0.5rem-1px)] overflow-hidden">
                  <img
                    src={projectDetails.image || '/project-default.jpg'}
                    alt={projectDetails.name || 'Project image'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-start">
                {/* Project name */}
                <h1 className="text-2xl sm:text-4xl text-white font-heading font-extrabold truncate">
                  {projectDetails.name || 'Project Name'}
                </h1>

                {/* Progress indicator */}
                <div className="mt-4 mb-3">
                  <div className="inline-flex items-center px-2 py-1 rounded-md border shadow-md shadow-border border-teal-500 bg-teal-500/20">
                    <div className="bg-foreground/20 backdrop-blur-sm rounded-full p-1 mr-2 flex items-center justify-center">
                      <KanbanSquare className="h-3.5 w-3.5 text-teal-300" />
                    </div>
                    <span className="font-semibold font-heading text-sm text-white">
                      {projectDetails.progress || 0}% Complete
                    </span>
                  </div>
                </div>

                {/* Second row stats */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-background border border-border text-sm backdrop-blur-md">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">
                      Due:{' '}
                      {new Date(projectDetails.dueDate || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-background border border-border text-sm backdrop-blur-sm">
                    <Users className="h-4 w-4 text-blue-400" />
                    <span className="font-medium">
                      {projectDetails.memberCount || 0} {(projectDetails.memberCount || 0) !== 1 ? 'members' : 'member'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom row with description */}
            <div className="bg-card/90 rounded-lg p-4 border border-border mt-5">
              <p className="text-md font-heading font-medium mb-2 text-blue-400">Project description</p>
              <Separator className="mb-3" />
              <div className="min-h-[80px] italic bg-transparent p-2 text-base leading-relaxed text-foreground">
                {projectDetails.description || "This project doesn't have a description yet."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content area - Kanban Board */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <KanbanSquare className="h-5 w-5 text-teal-500" />
            <h3 className="font-heading font-semibold text-lg">Kanban Board</h3>
          </div>
          <div className="flex gap-2"></div>
        </div>

        {/* Kanban board area */}
        <div className="w-full min-h-[500px] border border-border rounded-xl bg-card/50 p-4">
          <KanbanBoard />
        </div>
      </div>
    </MainContent>
  );
};
