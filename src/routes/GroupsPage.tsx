import { GroupGrid } from '@/components/GroupGrid';
import { MainContent } from '@/components/MainContent';
import { Dock } from '@/components/Dock';
import { CreateGroupDialog, FormValues } from '@/components/CreateGroupDialog';
import { useGroups } from '@/hooks/groups/useGroups';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useState } from 'react';

const GroupsPage = () => {
  const [error, setError] = useState<string | null>(null);

  const { createGroupResponse } = useGroups();

  const handleGroupCreation = (values: FormValues) => {
    setError(null); // Clear any previous errors

    const formData = {
      groupName: values.groupName,
      imgUrl: values.groupImage ? URL.createObjectURL(values.groupImage) : '',
    };

    createGroupResponse.mutate(formData, {
      onError: () => {
        setError('Failed to create group. Please try again.');
      },
    });
  };

  return (
    <>
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
      <Dock />
    </>
  );
};

export default GroupsPage;
