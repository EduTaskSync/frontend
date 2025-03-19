import { AuthHeader } from '@/components/AuthHeader.tsx';
import { ProjectGrid } from '@/components/ProjectGrid.tsx';
import { MainContent } from '@/components/MainContent.tsx';

const ProjectDetailPage = () => {
  return (
    <>
      Project detail Page
      <AuthHeader tabName="Projects" />
        <MainContent>
          <h1 className="text-xl sm:text-4xl md:text-2xl text-purple-500 font-heading font-bold mb-5">project</h1>
              
        </MainContent>
      <ProjectGrid />
    </>
  );
};

export default ProjectDetailPage;
