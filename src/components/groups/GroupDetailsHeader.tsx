import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, cn } from '@/lib/utils';
import { useGroups } from '@/hooks/groups/useGroups';
import { GroupData, GroupDetailsDialog } from './GroupDetailsDialog';
import { toast } from 'sonner';
import { UpdatedGroup } from '@/hooks/groups/groupInterfaces';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

interface GroupDetailsHeaderProps {
  groupDetails: {
    id: string;
    name: string;
    description: string;
    creationDate: string;
    size: number;
    image: string;
  };
}

export const GroupDetailsHeader = ({ groupDetails }: GroupDetailsHeaderProps) => {
  // Add local state for optimistic updates
  const [localDetails, setLocalDetails] = useState(groupDetails);

  // Update local state if prop changes (e.g. from parent component)
  useEffect(() => {
    setLocalDetails(groupDetails);
  }, [groupDetails]);

  const { id, name, size, image, description, creationDate } = localDetails;

  const formattedDate = formatDate(creationDate);

  const { editGroupDetailsResponse } = useGroups();

  // Handler for group edit submission
  const handleEditGroup = (formattedData: GroupData | UpdatedGroup) => {
    // Type guard to ensure we're working with an UpdatedGroup
    if ('groupId' in formattedData) {
      // Immediately update local state for optimistic UI update
      setLocalDetails({
        ...localDetails,
        name: formattedData.groupName,
        description: formattedData.groupDetails,
        image: formattedData.imgUrl,
      });

      // Then submit to the backend
      editGroupDetailsResponse.mutate(formattedData as UpdatedGroup, {
        onError: (error) => {
          console.error('Edit group error:', error);
          // If error occurs, revert to original data
          setLocalDetails(groupDetails);
          toast.error('Failed to update group details', {
            description: 'Please try again later',
          });
        },
      });
    }
  };

  const prefillData: UpdatedGroup = {
    groupId: id,
    groupName: name,
    groupDetails: description,
    imgUrl: image,
  };

  return (
    <div className="w-full">
      {/* Header with background image overlay and gradient */}
      <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg group border border-border">
        {/* Edit button - appears on hover using group-hover */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GroupDetailsDialog
            onSubmit={handleEditGroup}
            isUpdating={editGroupDetailsResponse.isPending}
            groupId={id}
            prefillData={prefillData}
            trigger={
              <Button
                size="sm"
                className="h-9 w-9 rounded-full p-0 bg-primary shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-primary/90 hover:scale-105 transition-transform duration-150 hover:cursor-pointer"
              >
                <PencilIcon className="h-4 w-4 text-white" />
                <span className="sr-only">Edit group</span>
              </Button>
            }
          />
        </div>

        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image || '/group-icon-1.jpg'})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-background/80 to-background/95"></div>

        {/* Content */}
        <div className="relative p-5 sm:p-6">
          {/* Top row with image and main info */}
          <div className="flex items-start gap-5">
            {/* Enlarged rectangular image preview with gradient border */}
            <div className="p-[2px] rounded-lg bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 shadow-sm flex-shrink-0">
              <div className="h-24 w-32 sm:h-32 sm:w-44 rounded-[calc(0.5rem-1px)] overflow-hidden">
                <img src={image || '/group-icon-1.jpg'} alt={name} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-start">
              {/* Group name */}
              <h1 className="text-2xl sm:text-4xl text-white font-heading font-extrabold truncate">{name}</h1>

              {/* Member stat - custom design to make it stand out */}
              <div className="mt-4 mb-3">
                <div
                  className="inline-flex items-center px-2 py-1 rounded-md border
                 shadow-md shadow-border border-primary bg-primary/90"
                >
                  <div className="bg-foreground/20 backdrop-blur-sm rounded-full p-1 mr-2 flex items-center justify-center">
                    <Users className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-semibold font-heading text-sm text-white">
                    {size} {size > 1 ? 'members' : 'member'}
                  </span>
                </div>
              </div>

              {/* Second row stats */}
              <div className="flex flex-wrap gap-2">
                <div
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1 rounded-md',
                    'bg-background border border-border text-sm backdrop-blur-md'
                  )}
                >
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span className="font-medium">Created on {formattedDate}</span>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-2 px-2.5 py-1 rounded-md',
                    'bg-background border border-border text-sm backdrop-blur-sm'
                  )}
                >
                  <Clock className="h-4 w-4 text-purple-400" />
                  <span className="font-medium">Active 2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row with description/actions*/}
          <div className="bg-card/90 rounded-lg p-4 border border-border mt-5">
            <p className="text-md font-heading font-medium mb-2 text-purple-400">Group details</p>
            <Separator className="mb-3" />
            {description ? (
              <Textarea
                value={description}
                readOnly
                className="min-h-[80px] italic resize-none bg-transparent border-none p-2 text-base leading-relaxed text-foreground focus-visible:ring-0 hover:cursor-default"
              />
            ) : (
              <div className="text-base text-muted-foreground italic p-1">
                {"You can add more details about the group's purpose and activities here."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
