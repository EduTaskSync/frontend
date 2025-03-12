import { GroupCard } from './GroupCard';

// Mock data - replace with actual data when available
const mockGroups = [
  {
    id: '1',
    name: 'FIT2199',
    projects: 3,
    image: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?q=80&w=400',
  },
  {
    id: '2',
    name: 'FIT3178',
    projects: 2,
    image: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?q=80&w=400',
  },
  {
    id: '3',
    name: 'FIT3170',
    projects: 4,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400',
  },
  {
    id: '4',
    name: 'FIT3168',
    projects: 1,
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=400',
  },
  {
    id: '5',
    name: 'FIT2101',
    projects: 5,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=400',
  },
  {
    id: '6',
    name: 'FIT3163',
    projects: 2,
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=400',
  },
];

export const GroupGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <GroupCard group={mockGroups[0]} />
      <GroupCard group={mockGroups[1]} />
      <GroupCard group={mockGroups[2]} />
      <GroupCard group={mockGroups[3]} />
      <GroupCard group={mockGroups[4]} />
      <GroupCard group={mockGroups[5]} />
    </div>
  );
};
