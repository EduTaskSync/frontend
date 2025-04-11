import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

export type CardSkeletonVariant = 'group' | 'task' | 'member' | 'group-header' | 'event' | 'project' | 'kanban-column';

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

            {/* Project card skeleton - designed to match ProjectCard */}
            {variant === 'project' && (
              <div className="w-full p-[2px] rounded-xl bg-gradient-to-br from-blue-400/20 via-cyan-300/20 to-teal-400/20 shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)]">
                <div className="relative h-[calc(9rem-4px)] rounded-[calc(0.75rem-1px)] shadow-sm flex flex-col justify-between p-4 bg-card overflow-hidden">
                  {/* Base overlay with translucent black */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 backdrop-blur-[2px] opacity-60"></div>

                  {/* Status-based gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-blue-700/20 opacity-40"></div>

                  {/* Top section with progress indicator */}
                  <div className="flex justify-start z-10">
                    <Skeleton className="h-5 w-20 rounded-md bg-blue-500/10 border border-white/10" />
                  </div>

                  {/* Content container */}
                  <div className="flex flex-col justify-end h-full z-10">
                    <div className="inline-flex flex-col px-3 py-2 bg-black/30 border border-white/10 backdrop-blur-md rounded-lg w-full">
                      {/* Title skeleton */}
                      <Skeleton className="h-5 w-3/4 mb-1 bg-gray-400/20" />

                      {/* Project metadata skeleton */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-4 w-24 rounded-full bg-white/10 border border-white/5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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

            {/* Task card skeleton - updated to match TaskCard component */}
            {variant === 'task' && (
              <div className="border shadow-sm rounded-lg p-3 space-y-2 bg-card hover:shadow-md transition-all duration-200">
                {/* Task title */}
                <Skeleton className="h-5 w-4/5" />

                {/* Task metadata */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {/* Created at badge */}
                  <div className="flex items-center gap-1">
                    <Skeleton className="h-3 w-3 rounded-full" /> {/* Clock icon */}
                    <Skeleton className="h-3 w-16" /> {/* Date text */}
                  </div>

                  {/* Deadline badge */}
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                {/* Assignees section - only shown if there are assignees */}
                <div className="flex justify-between items-center pt-1 mt-1">
                  <Skeleton className="h-3 w-16" /> {/* "Assignees" text */}
                  {/* Avatar group */}
                  <div className="flex -space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                  </div>
                </div>
              </div>
            )}

            {/* Kanban Column skeleton */}
            {variant === 'kanban-column' && (
              <div className="flex flex-col h-[500px] w-[300px] border border-border shadow-sm overflow-hidden rounded-xl bg-card">
                {/* Header skeleton with gradient similar to your kanban columns */}
                <div className="p-3 mx-5 mt-5 border rounded-xl bg-primary/10 border-b-primary/20">
                  <div className="flex flex-row items-center justify-between">
                    <div className="flex-shrink-0">
                      <Skeleton className="h-5 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-7 w-36" />
                    <div className="flex-shrink-0">
                      <Skeleton className="h-5 w-5" />
                    </div>
                  </div>
                </div>

                {/* Task cards skeleton */}
                <div className="px-4 py-5 flex-1 flex flex-col gap-3">
                  {/* Repeat task card skeletons 3 times */}
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="border border-border/40 rounded-lg p-3 space-y-2 bg-card/60">
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
                    ))}
                </div>

                {/* Footer skeleton with gradient */}
                <div className="p-2 flex items-center justify-center border-t border-t-primary/30 bg-gradient-to-b from-primary/5 to-transparent">
                  <div className="w-full flex justify-center">
                    <Skeleton className="h-8 w-32 rounded-md" />
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
