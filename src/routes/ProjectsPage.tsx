import { Outlet, useParams } from 'react-router';
import { useState } from 'react';
import { ProjectGrid } from '@/components/projects/ProjectGrid';
import { MainContent } from '@/components/MainContent';
import { AddProjectDialog } from '@/components/projects/AddProjectDialog';
import { useProjects } from '@/hooks/projects/useProjects';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { CreateProjectDto } from '@/hooks/projects/projectInterfaces';

export const ProjectsPage = () => {
  const [error, setError] = useState<string | null>(null);

  const { createProjectResponse } = useProjects();

  // check path to decide whether to output Project list Project detail page
  const { groupsId } = useParams();
  const isDetailsPage = groupsId;

  const handleProjectCreation = (formattedData: CreateProjectDto) => {
    console.log('Received formatted data:', formattedData);

    // Clear any previous errors
    setError(null);

    // Send the data to the backend
    createProjectResponse.mutate(formattedData, {
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error('Failed to create Project', {
          description: 'Please try again later',
        });
      },
    });
  };

  return (
    <>
      { isDetailsPage ? (
        <Outlet />
      ) : (
        <MainContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl sm:text-3xl text-purple-400 font-heading font-extrabold">Group Projects</h1>
            <AddProjectDialog trigger="Create Project" onSubmit={handleProjectCreation} 
               isLoading={createProjectResponse.isPending} groupId= ""/>
          </div>
          <ProjectGrid />
          <Outlet />
        </MainContent>
      )}
    </>
  );
};
