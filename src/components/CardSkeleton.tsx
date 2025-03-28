import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

export type CardSkeletonVariant = 'group' | 'task' | 'member';

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

  // container styles
  const containerStyles = cn(
    horizontal ? 'flex space-x-4 w-full overflow-hidden' : 'grid grid-cols-1 sm:grid-cols-2 lg: grid-cols-3 gap-4',
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
              <div className="flex flex-col space-y-2 w-20 items-center">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
            )}
            {/* //todo */}
            {/* Task card skeleton */}
            {variant === 'task' && (
              <div className="border rounded-lg p-3 space-y-2">
                <Skeleton className="h-40 w-40" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
