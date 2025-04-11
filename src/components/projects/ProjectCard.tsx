import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { Calendar, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CountdownTimer } from '../CountdownTimer';
import { ProjectSummaryResponse } from '@/hooks/projects/projectInterfaces';
import { useProjects } from '@/hooks/projects/useProjects';
import { ButtonWithTooltip } from '../ButtonWithToolTip';

// Shape of the project object sent to the ProjectCard component
interface ProjectCardProps {
  project: ProjectSummaryResponse;
  groupId: string;
  isAdmin?: boolean;
}

export const ProjectCard = ({ project, groupId, isAdmin = false }: ProjectCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteProjectResponse } = useProjects(groupId);
  // Use useRef to track the timeout for deletion
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format the due date to display
  const formattedDueDate = project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline';

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to project page
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!isAdmin) {
      toast.error('You do not have permission to delete this project');
      return;
    }
    setShowDeleteDialog(false);

    // Cancel any existing timeout first
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Create a timeout that will execute the delete after the toast duration
    const timeoutId = setTimeout(() => {
      deleteProjectResponse.mutate(project.projectId);
      // Clear the reference after executing
      deleteTimeoutRef.current = null;
    }, 4000); // Match sonner's default 4 second duration

    // Store the timeout ID in the ref
    deleteTimeoutRef.current = timeoutId;

    // Show toast with undo button
    toast.warning(`Deleting ${project.projectName}`, {
      description: (
        <div>
          <p>This project will be deleted in a few seconds</p>
          <CountdownTimer duration={4000} />
        </div>
      ),
      duration: 4000,
      action: {
        label: 'Undo',
        onClick: () => {
          // Clear the timeout if user clicks undo
          if (deleteTimeoutRef.current) {
            clearTimeout(deleteTimeoutRef.current);
            deleteTimeoutRef.current = null;
            toast.info(`Deletion of ${project.projectName} canceled`);
          }
        },
      },
    });
  };

  const getStatusColor = () => {
    if (project.progress >= 75) return 'text-emerald-500 bg-emerald-500/10';
    if (project.progress >= 25) return 'text-amber-500 bg-amber-500/10';
    return 'text-blue-500 bg-blue-500/10';
  };

  // Get status text based on progress
  const getStatusText = () => {
    if (project.progress >= 75) return 'Near completion';
    if (project.progress >= 25) return 'In progress';
    return 'Just started';
  };

  // Get gradient overlay based on progress
  const getStatusGradient = () => {
    if (project.progress >= 75) return 'from-emerald-900/50 to-emerald-700/20';
    if (project.progress >= 25) return 'from-amber-900/50 to-amber-700/20';
    return 'from-blue-900/50 to-blue-700/20';
  };

  return (
    <div className="w-full p-[2px] rounded-xl bg-gradient-to-br from-blue-400 via-cyan-300 to-teal-400 shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_20px_5px_rgba(56,189,248,0.25)] hover:from-blue-500 hover:via-cyan-400 hover:to-teal-500 group/wrapper">
      <Link
        to={`/app/groups/${groupId}/projects/${project.projectId}`}
        state={{
          projectDetails: project,
        }}
        className="w-full group/card block h-full relative"
      >
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <ButtonWithTooltip
            variant="destructive"
            size="sm"
            className="h-9 w-9 rounded-full p-0 bg-destructive shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-destructive/90 hover:scale-105 transition-transform duration-150 cursor-pointer"
            onClick={handleDeleteClick}
            disabled={!isAdmin}
            tooltipText={isAdmin ? 'Delete project' : 'Only group admins can delete projects.'}
          >
            <Trash2 className="h-5 w-5 text-white" />
            <span className="sr-only">Delete project</span>
          </ButtonWithTooltip>
        </div>

        <div
          className={cn(
            'cursor-pointer overflow-hidden relative h-[calc(9rem-4px)] rounded-[calc(0.75rem-1px)] shadow-sm flex flex-col justify-between p-4 transition-all duration-300 bg-card',
            'bg-cover bg-center'
          )}
        >
          {/* Base overlay with translucent black */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-[2px] opacity-60 transition-opacity duration-300 group-hover/card:opacity-75"></div>

          {/* Status-based gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getStatusGradient()} opacity-40 transition-opacity duration-300 group-hover/card:opacity-60`}
          ></div>

          {/* Top section with progress indicator */}
          <div className="flex justify-start z-10">
            <Badge
              variant="outline"
              className={cn(
                'px-2 py-0.5 border border-white/20 shadow-sm text-xs',
                'backdrop-blur-md bg-black/30',
                getStatusColor()
              )}
            >
              {getStatusText()}
            </Badge>
          </div>

          {/* Content container */}
          <div className="flex flex-col justify-end h-full z-10">
            <div className="inline-flex flex-col px-3 py-2 bg-black/30 border border-white/10 backdrop-blur-md rounded-lg transition-all duration-300 group-hover/card:bg-black/40 w-full">
              <h2 className="font-bold text-base text-primary-foreground font-heading tracking-tight mb-0.5 truncate">
                {project.projectName}
              </h2>

              {/* Project metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 backdrop-blur-sm border-white/10 text-white text-xs truncate max-w-[120px]"
                  >
                    <Calendar className="h-2.5 w-2.5 text-cyan-400 shrink-0" />
                    <span className="truncate text-[10px]">{formattedDueDate}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-xl">
              <span className="text-emerald-300">Delete</span> Project
            </AlertDialogTitle>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent"></div>
            <AlertDialogDescription className="font-sans text-base">
              <div className="mb-3">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">"{project.projectName}"</span>?
              </div>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-md">
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-destructive mt-0.5">•</span>
                  All project tasks and resources will be permanently removed
                </div>
                <div className="flex items-start gap-2 mt-1">
                  <span className="text-destructive mt-0.5">•</span>
                  You can undo this action for a few seconds after confirmation
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="font-heading mt-4 space-x-3">
            <AlertDialogCancel className="hover:bg-background/80 transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow transition-all duration-200 hover:shadow-md"
            >
              Delete Project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
