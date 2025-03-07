import { Dock } from '@/components/Dock';

const DashboardPage = () => {
  return (
    <>
      <h2 className="flex justify-center text-2xl font-semibold p-4">Dashboard Page</h2>
      <div className="flex items-center justify-center">{/* Content goes here */}</div>
      <Dock />
    </>
  );
};

export default DashboardPage;
