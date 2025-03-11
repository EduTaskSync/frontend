import { AuthHeader } from '@/components/AuthHeader';

const GroupsPage = () => {
  return (
    <>
      <AuthHeader tabName="Groups" />
      <main claassName="flex flex-col  items-center justify-center h-screen bg-gray-100">
        <h1 className="text-2xl font-bold">Groups Page</h1>
      </main>
    </>
  );
};

export default GroupsPage;
