import { useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { CountdownTimer } from '../CountdownTimer';

import { useGroups } from '@/hooks/groups/useGroups';

import { AlertTriangle } from 'lucide-react';
import { useProjects } from '@/hooks/projects/useProjects';
import { ButtonWithTooltip } from '../ButtonWithToolTip';

interface DeleteGroupDialogProps {
  trigger: React.ReactNode;
  groupId: string;
  groupName: string;
  isAdmin?: boolean;
}

export const DeleteGroupDialog = ({ trigger, groupId, groupName, isAdmin = false }: DeleteGroupDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteGroupResponse } = useGroups();
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { fetchProjectsSummaryResponse } = useProjects(groupId);
  const { data: projectsData } = fetchProjectsSummaryResponse;
  const projects = projectsData?.projects;
  const projectsCount = projects ? projects.length : 0;

  const confirmDelete = () => {
    setIsOpen(false);
    // Cancel any existing timeout first
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Create a timeout that will execute the delete after the toast duration
    const timeoutId = setTimeout(() => {
      deleteGroupResponse.mutate({
        groupId: groupId,
      });
      // Clear the reference after executing
      deleteTimeoutRef.current = null;
    }, 4000); // Match sonner's default 4 second duration

    // Store the timeout ID in the ref
    deleteTimeoutRef.current = timeoutId;

    // Show toast with undo button
    toast.warning(`Deleting ${groupName}`, {
      description: (
        <div>
          <p>This group will be deleted in a few seconds</p>
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
            toast.info(`Deletion of ${groupName} canceled`);
          }
        },
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="max-w-md shadow-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-heading text-xl">
            <span className="text-destructive">Delete</span> Group
          </AlertDialogTitle>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent"></div>

          <AlertDialogDescription className="font-sans text-base mb-3">
            <div>
              Are you sure you want to delete <span className="font-semibold text-foreground">"{groupName}"</span>?
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-destructive/10 border border-amber-200 rounded-lg p-3 text-md mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <p className="text-amber-900 font-semibold">Warning: This action cannot be undone.</p>
              <p className="text-sm text-muted-foreground">
                All data associated with this group will be permanently deleted.
              </p>

              {projectsCount > 0 && (
                <>
                  <p className="font-semibold">Important:</p>
                  <p className="mt-1">Please delete all projects within this group before proceeding.</p>
                  <p className="mt-1">
                    This group contains <span className="font-semibold text-foreground">{projectsCount} projects</span>.
                    Please delete them first.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <AlertDialogFooter className="font-heading space-x-3">
          <AlertDialogCancel className="hover:bg-background/80 transition-colors cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <ButtonWithTooltip
            variant="destructive"
            className=" bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow transition-all duration-200 hover:shadow-md"
            tooltipText={projectsCount > 0 ? 'Please delete all projects first' : `Delete ${groupName}`}
            onClick={confirmDelete}
            disabled={!isAdmin || projectsCount > 0}
          >
            Delete Group
          </ButtonWithTooltip>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
