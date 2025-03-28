import { cn } from '@/lib/utils';
import { Link } from 'react-router';
import { Users, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGroups } from '@/hooks/groups/useGroups';
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

// shape of the group object sent to the GroupCard component
interface GroupCardProps {
  group: {
    id: string;
    name: string;
    size: number;
    image: string;
  };
}

export const GroupCard = ({ group }: GroupCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteGroupResponse } = useGroups();
  // Use useRef instead of useState to track the timeout
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to group page
    e.stopPropagation(); // Prevent event bubbling
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setShowDeleteDialog(false);

    // Cancel any existing timeout first
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
    }

    // Create a timeout that will execute the delete after the toast duration
    const timeoutId = setTimeout(() => {
      deleteGroupResponse.mutate({
        groupId: group.id,
      });
      // Clear the reference after executing
      deleteTimeoutRef.current = null;
    }, 4000); // Match sonner's default 4 second duration

    // Store the timeout ID in the ref
    deleteTimeoutRef.current = timeoutId;

    // Show toast with undo button
    toast.info(`Deleting ${group.name}`, {
      description: (
        <div>
          <p> This group will be deleted in a few seconds</p>
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
            toast.success(`Deletion of ${group.name} canceled`);
          }
        },
      },
    });
  };

  return (
    <div className="w-full p-[2px] rounded-xl bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)] transition-all duration-300 hover:shadow-[0_0px_20px_5px_rgba(168,85,247,0.25)] hover:from-purple-500 hover:via-pink-400 hover:to-indigo-500 group/wrapper">
      <Link
        to={`${group.id}`}
        state={{
          groupDetails: {
            id: group.id,
            name: group.name,
            size: group.size,
            image: group.image,
          },
        }}
        className="w-full group/card block h-full relative"
      >
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200">
          <Button
            variant="destructive"
            size="sm"
            className="h-9 w-9 rounded-full p-0 bg-destructive shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-destructive/90 hover:scale-105 transition-transform duration-150 cursor-pointer"
            onClick={handleDeleteClick}
          >
            <Trash2 className="h-5 w-5 text-white" />
            <span className="sr-only">Delete group</span>
          </Button>
        </div>

        <div
          className={cn(
            'cursor-pointer overflow-hidden relative h-[calc(12rem-4px)] rounded-[calc(0.75rem-1px)] shadow-sm flex flex-col justify-between p-4 transition-all duration-300 bg-card',
            'bg-cover bg-center'
          )}
          style={{ backgroundImage: `url(${group.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-[2px] opacity-60 transition-opacity duration-300 group-hover/card:opacity-75"></div>
          {/* Content container */}
          <div className="flex flex-col justify-end h-full z-10">
            <div className="inline-flex flex-col px-3 py-2 bg-black/30 border border-white/10 backdrop-blur-md rounded-lg transition-all duration-300 group-hover/card:bg-black/40 max-w-full">
              <h2 className="font-bold text-lg text-primary-foreground font-heading tracking-tight mb-1 truncate">
                {group.name}
              </h2>

              {/* Simplified badge */}
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-sm border-white/10 text-white text-md font-bold"
                >
                  <Users className="h-3 w-3 text-purple-500" />
                  <span className="font-sans font-bold">{group.size}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Delete confirmation dialog*/}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-md shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-xl">
              <span className="text-purple-300">Delete</span> Group
            </AlertDialogTitle>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/20 to-transparent"></div>
            <AlertDialogDescription className="font-sans text-base">
              <p className="mb-3">
                Are you sure you want to delete <span className="font-semibold text-foreground">"{group.name}"</span> ?
              </p>
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-md">
                <p className="flex items-start gap-2 mt-1">
                  <span className="text-destructive mt-0.5">•</span>
                  You can undo this action for a few seconds after confirmation
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="font-heading mt-4 space-x-3">
            <AlertDialogCancel className="hover:bg-background/80 transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow transition-all duration-200 hover:shadow-md"
            >
              Delete Group
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
