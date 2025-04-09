import { ProjectCard } from './ProjectCard';
import { useProjects } from '@/hooks/projects/useProjects';
import { CardSkeleton } from '../CardSkeleton';
import { CustomError } from '@/utils/ErrorClasses';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';

const getImageUrl = (url: string | null | undefined) => {
  // fallback to project image 1 if server sends no image url
  if (!url) {
    return '/group-icon-1.jpg';
  }

  // if it's a relative path starting with / or a full URL, use it directly
  if (url.startsWith('/') || url.startsWith('http')) {
    return url;
  }

  // assume filename inside public folder
  return `/${url}`;
};

export const ProjectGrid = () => {
  const { fetchProjectsResponse } = useProjects();
  const { data, isLoading, isError, error, refetch } = fetchProjectsResponse;

  // show loading skeletons for the project cards while data is being fetched
  if (isLoading) {
    return <CardSkeleton variant="project" count={6} />;
  }

  // show error message inside the grid if fetch failed
  if (isError) {
    return (
      <div className="w-full p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h4 className="text-lg font-heading font-semibold text-foreground">
            {error instanceof CustomError ? error.title : 'Failed to load projects'}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : 'Please try again later.'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-destructive/20 hover:bg-destructive/10 gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // if no projects exist, display welcome message
  if (!data?.projects || data.projects.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-border">
        <h3 className="text-xl font-heading font-semibold mb-2">No projects yet</h3>
        <p className="text-muted-foreground">
          Create your first project to start organizing projects and collaborating with team members.
        </p>
      </div>
    );
  }

  // show projects
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
      {data.projects.map((project) => (
        <ProjectCard
          key={project.projectId}
          project={{
            id: project.projectId,
            name: project.projectName,
            size: project.projectMembers,
            description: project.projectDescription,
            creationDate: project.projectCreationDate,
            image: getImageUrl(project.imgUrl),
          }}
        />
      ))}
    </div>
  );
};
