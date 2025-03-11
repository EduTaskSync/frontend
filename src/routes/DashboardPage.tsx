import { AuthHeader } from '@/components/AuthHeader';
import { MainContent } from '@/components/MainContent';

const DashboardPage = () => {
  return (
    <>
      <AuthHeader tabName="Dashboard" />
      <MainContent />
    </>
  );
};

export default DashboardPage;
