import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, PencilIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { useProjects } from '@/hooks/projects/useProjects';
import { ProjectData, ProjectDetailsDialog } from './ProjectDetailsDialog';
import { toast } from 'sonner';
import { UpdatedProject } from '@/hooks/projects/projectInterfaces';

interface ProjectDetailsHeaderProps {
  projectDetails: {
    id: string;
    name: string;
    description: string;
    creationDate: string;
    size: number;
    image: string;
  };
}

export const ProjectDetailsHeader = ({ projectDetails }: ProjectDetailsHeaderProps) => {
  // Add local state for optimistic updates
  const [localDetails, setLocalDetails] = useState(projectDetails);

  // Update local state if prop changes (e.g. from parent component)
  useEffect(() => {
    setLocalDetails(projectDetails);
  }, [projectDetails]);

  const { id, name, size, image, description, creationDate } = localDetails;

  const formattedDate = formatDate(creationDate);

  const { editProjectDetailsResponse } = useProjects();

  // Handler for groject edit submission
  const handleEditProject = (formattedData: ProjectData | UpdatedProject) => {
    // Type guard to ensure we're working with an UpdatedProject
    if ('projectId' in formattedData) {
      // Immediately update local state for optimistic UI update
      setLocalDetails({
        ...localDetails,
        name: formattedData.projectName,
        description: formattedData.projectDetails,
        image: formattedData.imgUrl,
      });

      // Then submit to the backend
      editProjectDetailsResponse.mutate(formattedData as UpdatedProject, {
        onError: (error) => {
          console.error('Edit groject error:', error);
          // If error occurs, revert to original data
          setLocalDetails(projectDetails);
          toast.error('Failed to update project details', {
            description: 'Please try again later',
          });
        },
      });
    }
  };

  const prefillData: UpdatedProject = {
    projectId: id,
    projectName: name,
    projectDetails: description,
    imgUrl: image,
  };

  return (
    <div className="w-full">
      {/* Header with background image overlay and gradient */}
      <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg project">
        {/* Edit button - appears on hover using project-hover */}
        <div className="absolute top-3 right-3 z-20 opacity-0 groject-hover:opacity-100 transition-opacity duration-200">
          <ProjectDetailsDialog
            onSubmit={handleEditProject}
            isUpdating={editProjectDetailsResponse.isPending}
            projectId={id}
            prefillData={prefillData}
            trigger={
              <Button
                size="sm"
                className="h-9 w-9 rounded-full p-0 bg-primary shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-primary/90 hover:scale-105 transition-transform duration-150 hover:cursor-pointer"
              >
                <PencilIcon className="h-4 w-4 text-white" />
                <span className="sr-only">Edit project</span>
              </Button>
            }
          />
        </div>

        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image || '/groject-icon-1.jpg'})` }}
        />

        <div className="absolute inset-[-1px] backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-background/80 to-background/95"></div>

        {/* Content */}
        <div className="relative p-5 sm:p-6">
          {/* Top row with image and main info */}
          <div className="flex items-start gap-5">
            {/* Enlarged rectangular image preview */}
            <div className="h-24 w-32 sm:h-32 sm:w-44 rounded-lg overflow-hidden ring-1 ring-primary/30 shadow-md flex-shrink-0">
              <img src={image || '/groject-icon-1.jpg'} alt={name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-start">
              {/* Project name */}
              <h1 className="text-2xl sm:text-4xl text-foreground font-heading font-extrabold truncate">{name}</h1>

              {/* Member badge on its own line */}
              <div className="mt-2 mb-3">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1 bg-background/50 border-primary/20 text-base"
                >
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {size} {size > 1 ? 'members' : 'member'}
                  </span>
                </Badge>
              </div>

              {/* Additional stats on a separate line */}
              <div className="flex space-x-5 text-sm text-muted-foreground pl-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Created on {formattedDate}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Active 2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row with description/actions */}
          <div className="flex justify-between items-center pt-3 mt-4 border-t border-border/40">
            <p className="text-sm text-muted-foreground max-w-xl">
              {description || "You can add more details about the groject's purpose and activities here."}
            </p>

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">{/* Any action buttons could go here */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
