import { ProjectCard } from './ProjectCard';
import { useProjects } from '@/hooks/projects/useProjects';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomError } from '@/utils/ErrorClasses';
import { useParams } from 'react-router';
import { ProjectSummaryListResponse } from '@/hooks/projects/projectInterfaces';
import { Spinner } from '../ui/spinner';
import { useUserContext } from '@/contexts/UserContext';
import { useGroups } from '@/hooks/groups/useGroups';
import { GroupRole } from '@/constants/general';

export const ProjectList = () => {
  const { groupId } = useParams<{ groupId: string }>();

  // Use the projects hook with the current groupId
  const { user } = useUserContext();
  const { getGroupMembersResponse } = useGroups(groupId);
  const { data: membersData } = getGroupMembersResponse;
  const isAdmin =
    membersData?.users.some((member) => member.userId === user?.userId && member.role === GroupRole.ADMIN) || false;

  const { fetchProjectsSummaryResponse } = useProjects(groupId);
  const { data, isLoading, isError, error } = fetchProjectsSummaryResponse as {
    data: ProjectSummaryListResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
  };

  // Get projects from the response or default to empty array
  const projects = data?.projects || [];

  if (isError) {
    return (
      <div className="w-full p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <h4 className="font-heading font-semibold text-foreground">
            {error instanceof CustomError ? error.title : 'Failed to load projects'}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-destructive/20 hover:bg-destructive/10 hover:cursor-pointer"
            onClick={() => fetchProjectsSummaryResponse.refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
          <Spinner className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm">Loading projects...</span>
        </div>
      ) : projects.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {projects.map((project) => (
            <div key={project.projectId} className="w-full">
              <ProjectCard project={project} groupId={groupId || ''} isAdmin={isAdmin} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-[140px] rounded-lg border-2 border-dashed border-border/50 text-muted-foreground">
          No projects yet. Click New Project to get started.
        </div>
      )}
    </div>
  );
};
