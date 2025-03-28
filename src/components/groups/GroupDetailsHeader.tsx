import { Users, Calendar, Clock, PencilIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface GroupDetailsHeaderProps {
  groupDetails: {
    id: string;
    name: string;
    size: number;
    image: string;
  };
}

export const GroupDetailsHeader = ({ groupDetails }: GroupDetailsHeaderProps) => {
  const { name, size, image } = groupDetails;

  return (
    <div className="w-full">
      {/* Header with background image overlay and gradient */}
      <div className="relative rounded-xl overflow-hidden mb-4 shadow-lg group">
        {/* Edit button - appears on hover using group-hover */}
        <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="sm"
            className="h-9 w-9 rounded-full p-0 bg-primary shadow-lg border-2 border-white/20 backdrop-blur-md hover:bg-primary/90 hover:scale-105 transition-transform duration-150"
            onClick={() => console.log('Edit group details')}
          >
            <PencilIcon className="h-4 w-4 text-white" />
            <span className="sr-only">Edit group</span>
          </Button>
        </div>

        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image || '/group-icon-1.jpg'})` }}
        />

        <div className="absolute inset-[-1px] backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/50 via-background/80 to-background/95"></div>

        {/* Content */}
        <div className="relative p-5 sm:p-6">
          {/* Top row with image and main info */}
          <div className="flex items-start gap-5 mb-4">
            {/* Enlarged rectangular image preview */}
            <div className="h-24 w-32 sm:h-32 sm:w-44 rounded-lg overflow-hidden ring-1 ring-primary/30 shadow-md flex-shrink-0">
              <img src={image || '/group-icon-1.jpg'} alt={name} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center h-24 sm:h-32">
              <h1 className="text-2xl sm:text-4xl text-foreground font-heading font-extrabold truncate">{name}</h1>

              {/* Stats row*/}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-lg text-muted-foreground">
                <Badge
                  variant="outline"
                  className="flex items-center gap-1.5 px-3 py-1 bg-background/50 border-primary/20 text-base"
                >
                  <Users className="h-4 w-4 text-primary" />
                  <span>
                    {size} {size > 1 ? 'members' : 'member'}
                  </span>
                </Badge>

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span>Created March 15, 2023</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  <span>Active 2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row with description/actions */}
          <div className="flex justify-between items-center pt-2 border-t border-border/40">
            <p className="text-sm text-muted-foreground max-w-xl">
              You can add more details about the group's purpose and activities here.
            </p>

            <div className="flex items-center gap-2 flex-shrink-0 ml-4">{/* Any action buttons could go here */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
