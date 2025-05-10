import { MainContent } from '@/components/MainContent';
import { Search } from '@/components/Search';
import { TaskList } from '@/components/dashboard/TaskList';
import { useState } from 'react';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <>
      <MainContent>
        <Search className="w-full" placeholder="Search projects..." onSearch={handleSearch} />
        <TaskList searchQuery={searchQuery} />
      </MainContent>
    </>
  );
};

export default DashboardPage;
