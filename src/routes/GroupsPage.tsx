import { GroupGrid } from '@/components/groups/GroupGrid';
import { MainContent } from '@/components/MainContent';
import { CreateGroupDialog } from '@/components/groups/CreateGroupDialog';
import { useGroups } from '@/hooks/groups/useGroups';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Outlet, useParams } from 'react-router';
import { GroupFormData } from '@/components/groups/CreateGroupDialog';

const GroupsPage = () => {
  const [error, setError] = useState<string | null>(null);

  const { createGroupResponse } = useGroups();

  // check path to decide whether to output group list group detail page
  const { groupId } = useParams();
  const isDetailsPage = groupId;

  const handleGroupCreation = (formattedData: GroupFormData) => {
    console.log('Received formatted data:', formattedData);

    // Clear any previous errors
    setError(null);

    // Send the data to the backend
    createGroupResponse.mutate(formattedData, {
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error('Failed to create group', {
          description: 'Please try again later',
        });
      },
    });
  };

  return (
    <>
      {isDetailsPage ? (
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
            <h1 className="text-2xl sm:text-3xl text-purple-400 font-heading font-extrabold">My Groups</h1>
            <CreateGroupDialog onCreateGroup={handleGroupCreation} isCreating={createGroupResponse.isPending} />
          </div>
          <GroupGrid />
        </MainContent>
      )}
    </>
  );
};

export default GroupsPage;
