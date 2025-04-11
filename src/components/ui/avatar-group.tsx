import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number;
}

export function AvatarGroup({ className, limit = 3, children, ...props }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const limitedChildren = childrenArray.slice(0, limit);
  const overflow = childrenArray.length - limitedChildren.length;

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {limitedChildren}
      {overflow > 0 && (
        <Avatar className="h-6 w-6 bg-muted text-muted-foreground ring-2 ring-background">
          <AvatarFallback className="text-[10px]">+{overflow}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
