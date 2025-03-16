import { AuthHeader } from '@/components/AuthHeader';
import { MainContent } from '@/components/MainContent';
import { Dock } from '@/components/Dock';

const DashboardPage = () => {
  return (
    <>
      <AuthHeader tabName="Dashboard" />
      <MainContent />
      <Dock />
    </>
  );
};

export default DashboardPage;
