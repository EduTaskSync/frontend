import { AuthHeader } from '@/components/AuthHeader';
import { MainContent } from '@/components/MainContent';
import { Dock } from '@/components/Dock';

const CalendarPage = () => {
  return (
    <>
      <AuthHeader tabName="Calendar" />
      <MainContent />
      <Dock />
    </>
  );
};

export default CalendarPage;
