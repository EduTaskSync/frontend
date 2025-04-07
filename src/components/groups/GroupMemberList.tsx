import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { CardSkeleton } from '../CardSkeleton';
import { GroupMemberCard } from './GroupMemberCard';
import { useGroups } from '@/hooks/groups/useGroups';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomError } from '@/utils/ErrorClasses';
import { useParams } from 'react-router';
import { GetGroupMembersResponse } from '@/hooks/groups/groupInterfaces';
import { useUserContext } from '@/contexts/UserContext';
import { useMemo } from 'react';

export const GroupMemberList = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useUserContext();

  // groupId needed as a parameter for get members request
  const { getGroupMembersResponse } = useGroups(groupId);
  const { data, isLoading, isError, error } = getGroupMembersResponse as {
    data: GetGroupMembersResponse | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => void;
  };

  // Sort members to put current user first
  const sortedMembers = useMemo(() => {
    const members = data?.users || [];

    if (!user) return members;

    return [...members].sort((a, b) => {
      // Current user comes first
      if (a.userId === user.userId) return -1;
      if (b.userId === user.userId) return 1;
      // Sort by name
      return a.firstName.localeCompare(b.firstName);
    });
  }, [data?.users, user]);

  if (isError) {
    return (
      <div className="w-full p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-5 w-5 text-destructive" />
          </div>
          <h4 className="font-heading font-semibold text-foreground">
            {error instanceof CustomError ? error.title : 'Failed to load members'}
          </h4>
          <p className="text-sm text-muted-foreground max-w-md">
            {error instanceof Error ? error.message : 'Please try again later'}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 border-destructive/20  hover:bg-destructive/10 hover:cursor-pointer"
            onClick={() => getGroupMembersResponse.refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex space-x-4">
        {isLoading ? (
          <CardSkeleton variant="member" count={5} horizontal={true} />
        ) : (
          sortedMembers.map((member) => (
            <GroupMemberCard key={member.userId} groupMember={member} isCurrentUser={user?.userId === member.userId} />
          ))
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
