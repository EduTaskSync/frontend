import { Dock } from '@/components/Dock';
import { AuthHeader } from '@/components/AuthHeader';

const DashboardPage = () => {
  return (
    <>
      <AuthHeader tabName="Dashboard" />
      <h2 className="flex justify-center text-2xl font-semibold p-4">Dashboard Page</h2>
      <div className="flex items-center justify-center">{/* Content goes here */}</div>
      <Dock />
    </>
  );
};

export default DashboardPage;
