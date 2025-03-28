import { GroupCard } from './GroupCard';
import { useGroups } from '@/hooks/groups/useGroups';
import { CardSkeleton } from '../CardSkeleton';
import { CustomError } from '@/utils/ErrorClasses';

const getImageUrl = (url: string | null | undefined) => {
  // fallback to group image 1 if server sends no image url
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

export const GroupGrid = () => {
  const { fetchGroupsResponse } = useGroups();
  const { data, isLoading, isError, error } = fetchGroupsResponse;

  // show loading skeletons for the group cards while data is being fetched
  if (isLoading) {
    return <CardSkeleton variant="group" count={6} />;
  }

  // show error message inside the grid if fetch failed
  if (isError) {
    return (
      <div className="p-6 text-center ">
        <p className="text-destructive font-medium">
          {error instanceof CustomError ? error.title : 'Failed to load groups'}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : 'Please try again later.'}
        </p>
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
            size: group.groupMembers.length,
            image: getImageUrl(group.imgUrl),
          }}
        />
      ))}
    </div>
  );
};
