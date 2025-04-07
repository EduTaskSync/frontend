import { GroupCard } from './GroupCard';
import { useGroups } from '@/hooks/groups/useGroups';
import { CardSkeleton } from '../CardSkeleton';
import { CustomError } from '@/utils/ErrorClasses';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertCircle } from 'lucide-react';
import { getImageUrl } from '@/lib/utils';

export const GroupGrid = () => {
  const { fetchGroupsResponse } = useGroups();
  const { data, isLoading, isError, error, refetch } = fetchGroupsResponse;

  // show loading skeletons for the group cards while data is being fetched
  if (isLoading) {
    return <CardSkeleton variant="group" count={6} />;
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
            {error instanceof CustomError ? error.title : 'Failed to load groups'}
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

  // if no groups exist, display welcome message
  if (!data?.groups || data.groups.length === 0) {
    return (
      <div className="p-8 text-center rounded-lg border border-border">
        <h3 className="text-xl font-heading font-semibold mb-2">No groups yet</h3>
        <p className="text-muted-foreground">
          Create your first group to start organizing projects and collaborating with team members.
        </p>
      </div>
    );
  }

  // show groups
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans">
      {data.groups.map((group) => (
        <GroupCard
          key={group.groupId}
          group={{
            id: group.groupId,
            name: group.groupName,
            size: group.groupMembers,
            image: getImageUrl(group.imgUrl),
          }}
        />
      ))}
    </div>
  );
};
