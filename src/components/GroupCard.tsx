import { cn } from '@/lib/utils';

// shape of the group object sent to the GroupCard component
interface GroupCardProps {
  group: {
    id: string;
    name: string;
    projects: number;
    image: string;
  };
}

export const GroupCard = ({ group }: GroupCardProps) => {
  return (
    <div className="w-full group/card">
      <div
        className={cn(
          'cursor-pointer overflow-hidden relative h-48 rounded-xl shadow-md flex flex-col justify-between p-4 transition-all duration-300 hover:shadow-xl',
          'bg-cover bg-center'
        )}
        style={{ backgroundImage: `url(${group.image})` }}
      >
        <div className="absolute w-full h-full top-0 left-0 bg-black opacity-40 transition duration-300 group-hover/card:opacity-60"></div>

        <div className="flex flex-row items-center justify-between z-10">
          <div className="px-3 py-1 bg-primary/80 backdrop-blur-sm rounded-md text-primary-foreground text-xs font-bold">
            {group.name}
          </div>
        </div>

        <div className="text content z-10">
          <h2 className="font-bold text-lg text-white mb-1">{group.name}</h2>
          <p className="text-sm text-gray-200 font-medium">
            {group.projects} {group.projects === 1 ? 'Project' : 'Projects'}
          </p>
        </div>
      </div>
    </div>
  );
};
