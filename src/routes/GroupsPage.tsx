import { AuthHeader } from '@/components/AuthHeader';
import { GroupGrid } from '@/components/GroupGrid';
import { MainContent } from '@/components/MainContent';

const GroupsPage = () => {
  return (
    <>
      <AuthHeader tabName="Groups" />
      <MainContent>
        <h1 className="text-xl sm:text-4xl md:text-2xl text-purple-500 font-heading font-bold mb-5">My Groups</h1>
        <GroupGrid />
      </MainContent>
    </>
  );
};

export default GroupsPage;
