import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export type CardSkeletonVariant = 'group' | 'task' | 'member' | 'group-header' | 'event' | 'project';

interface CardSkeletonProps {
  variant: CardSkeletonVariant;
  count?: number;
  className?: string;
  containerClassName?: string;
  horizontal?: boolean;
}

export const CardSkeleton = ({
  variant,
  count = 3,
  className,
  containerClassName,
  horizontal = false,
}: CardSkeletonProps) => {
  const cards = Array(count).fill(0);

  // Container styles for other variants
  const containerStyles = cn(
    horizontal ? 'flex space-x-4 w-full overflow-hidden' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
    containerClassName
  );

  return (
    <div className={containerStyles}>
      {cards.map((_, index) => {
        return (
          <div key={index} className={cn(className, horizontal && 'shrink-0')}>
            {/* Group card skeleton */}
            {variant === 'group' && (
              <div className="w-full p-[2px] rounded-xl bg-gradient-to-br from-purple-400/20 via-pink-300/20 to-indigo-400/20">
                <Skeleton className="h-[calc(12rem-4px)] rounded-[calc(0.75rem-1px)] w-full bg-card/50" />
              </div>
            )}

            {/* Group Member skeleton */}
            {variant === 'member' && (
              <div className="w-44 flex flex-col items-center p-4 rounded-xl bg-card/80 border border-border/40 shadow-sm">
                <div className="relative mb-3">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-pink-300/10 to-indigo-400/10 rounded-full blur-md"></div>
                  <Skeleton className="h-20 w-20 rounded-full" />
                </div>
                <div className="flex flex-col items-center gap-2 w-full">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            )}

            {/* Task card skeleton */}
            {variant === 'task' && (
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-5 w-5 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center mt-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            )}

            {/* Event card skeleton */}
            {variant === 'event' && (
              <div className="w-72 shrink-0">
                <div className="border rounded-xl p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center gap-2 mt-3">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
