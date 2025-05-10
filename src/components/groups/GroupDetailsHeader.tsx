import { Users, Calendar, Clock, PencilIcon, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate, cn, getImageUrl } from '@/lib/utils';
import { useGroups } from '@/hooks/groups/useGroups';
import { GroupData, GroupDetailsDialog } from './GroupDetailsDialog';
import { GroupDetailsResponse, UpdatedGroup } from '@/hooks/groups/groupInterfaces';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useParams } from 'react-router';
import { Skeleton } from '@/components/ui/skeleton';
import { CustomError } from '@/utils/ErrorClasses';

export const GroupDetailsHeader = () => {
  const { groupId } = useParams();
  const { editGroupDetailsResponse, getGroupDetailsResponse } = useGroups(groupId);
  const { data, isError, error, isLoading, refetch } = getGroupDetailsResponse;

  console.log('header img url from backend', data?.imgUrl);

  // ahndle loading state
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="relative rounded-xl overflow-hidden mb-4 shadow-md border border-border bg-card">
          <div className="p-5 sm:p-6">
            {/* loading skeleton for header */}
            <div className="flex items-start gap-5">
              {/* image skeleton */}
              <div className="p-[2px] rounded-lg bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-indigo-400/20 shadow-sm flex-shrink-0">
                <Skeleton className="h-24 w-32 sm:h-32 sm:w-44 rounded-[calc(0.5rem-1px)]" />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                {/* title skeleton */}
                <Skeleton className="h-8 w-3/4" />

                {/* member badge skeleton */}
                <Skeleton className="h-6 w-24 mt-2" />

                {/* stats skeleton */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-8 w-40" />
                </div>
              </div>
            </div>

            {/* description section skeleton */}
            <div className="bg-card/90 rounded-lg p-4 border border-border mt-5">
              <Skeleton className="h-4 w-32 mb-3" />
              <Separator className="mb-3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // handle error state
  if (isError) {
    return (
      <div className="w-full p-6 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <h4 className="font-heading font-semibold text-foreground text-lg">
            {error instanceof CustomError ? error.title : 'Failed to load group details'}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-destructive/20 hover:bg-destructive/10 hover:cursor-pointer gap-2"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // extract data once we know it's available
  const {
    groupId: id,
    groupCreationDate,
    groupDescription,
    groupMembers: size,
    groupName,
    imgUrl,
  } = data as GroupDetailsResponse;
  const formattedDate = formatDate(groupCreationDate);

  // handler for group edit submission
  const handleEditGroup = (formattedData: GroupData | UpdatedGroup) => {
    console.log('Submit data for edit:', formattedData);
    editGroupDetailsResponse.mutate(formattedData as UpdatedGroup);
  };

  const prefillData: UpdatedGroup = {
    groupId: id,
    groupName,
    groupDetails: groupDescription,
    imgUrl,
    groupIsHidden: false,
  };

  return (
    <div className="w-full">
      {/* header with background image overlay and gradient */}
      <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg group border border-border">
        {/* edit button - appears on hover using group-hover */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <GroupDetailsDialog
            onSubmit={handleEditGroup}
            isUpdating={editGroupDetailsResponse.isPending}
            groupId={groupId}
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

        {/* background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getImageUrl(imgUrl)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-background/80 to-background/95"></div>

        {/* content */}
        <div className="relative p-5 sm:p-6">
          {/* top row with image and main info */}
          <div className="flex items-start gap-5">
            {/* enlarged rectangular image preview with gradient border */}
            <div className="p-[2px] rounded-lg bg-gradient-to-br from-purple-400 via-pink-300 to-indigo-400 shadow-sm flex-shrink-0">
              <div className="h-24 w-32 sm:h-32 sm:w-44 rounded-[calc(0.5rem-1px)] overflow-hidden">
                <img src={getImageUrl(imgUrl)} alt={'Group image'} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-start">
              {/* group name */}
              <h1 className="text-2xl sm:text-4xl text-white font-heading font-extrabold truncate">{groupName}</h1>

              {/* member stat - custom design to make it stand out */}
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

              {/* second row stats */}
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

          {/* bottom row with description/actions*/}
          <div className="bg-card/90 rounded-lg p-4 border border-border mt-5">
            <p className="text-md font-heading font-medium mb-2 text-purple-400">Group details</p>
            <Separator className="mb-3" />
            {groupDescription ? (
              <Textarea
                value={groupDescription}
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
