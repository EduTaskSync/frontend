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

  // Container styles with better responsiveness
  const containerStyles = cn(
    variant === 'task'
      ? 'grid grid-cols-1 gap-3' // One task per row
      : horizontal
        ? 'flex space-x-4 w-full overflow-hidden'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4',
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

            {/* Task card skeleton - refined to match TaskCard appearance */}
            {variant === 'task' && (
              <div className="border border-border/40 shadow-sm rounded-lg p-3 space-y-2.5 bg-card/80 hover:shadow-md transition-all duration-200">
                {/* Task title */}
                <Skeleton className="h-5 w-3/4" />

                {/* Task metadata row */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {/* Created date */}
                  <div className="flex items-center gap-1.5">
                    <Skeleton className="h-3.5 w-3.5 rounded-full" /> {/* Clock icon */}
                    <Skeleton className="h-3.5 w-20" /> {/* Date text */}
                  </div>

                  {/* Spacer */}
                  <div className="flex-1"></div>

                  {/* Deadline badge */}
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>

                {/* Assignees section - with proper spacing */}
                <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/30">
                  <Skeleton className="h-3.5 w-16" /> {/* "Assignees" text */}
                  {/* Avatar group with proper overlapping */}
                  <div className="flex -space-x-2">
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                    <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                  </div>
                </div>
              </div>
            )}

            {/* Kanban Column skeleton - updated to match dimensions of actual columns */}
            {variant === 'kanban-column' && (
              <div className="w-[400px] p-[2px] rounded-xl bg-gradient-to-br from-blue-400/20 via-cyan-300/20 to-blue-500/20 shadow-[0_2px_10px_0px_rgba(0,0,0,0.1)]">
                <div className="flex flex-col h-[700px] w-full rounded-[calc(0.75rem-1px)] border-0 shadow-sm overflow-hidden bg-card/95 backdrop-blur-sm">
                  {/* Header skeleton with gradient similar to your kanban columns */}
                  <div className="mx-3 mt-3 p-2 pb-1 border rounded-xl backdrop-blur-sm bg-background/80">
                    <div className="flex items-center gap-2 w-full">
                      {/* Left: Edit button */}
                      <Skeleton className="flex-shrink-0 h-8 w-8 rounded-full" />

                      {/* Center: Column name and badge */}
                      <div className="flex-1 flex flex-col items-center">
                        <Skeleton className="h-5 w-32 mb-1" /> {/* Column name */}
                        <Skeleton className="h-5 w-16 rounded-full" /> {/* Badge */}
                      </div>

                      {/* Right: Delete button */}
                      <Skeleton className="flex-shrink-0 h-8 w-8 rounded-full" />
                    </div>
                  </div>

                  {/* Task list container */}
                  <div className="flex-1 p-3 pt-2 overflow-hidden">
                    {/* Add Task button skeleton */}
                    <Skeleton className="h-9 w-full mb-3 rounded-md" />

                    {/* Task cards */}
                    <div className="space-y-2">
                      {Array(3)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="border border-border/40 shadow-sm rounded-lg p-3 space-y-2.5 bg-card/80"
                          >
                            {/* Task title */}
                            <Skeleton className="h-5 w-3/4" />

                            {/* Task metadata row */}
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <div className="flex items-center gap-1.5">
                                <Skeleton className="h-3.5 w-3.5 rounded-full" />
                                <Skeleton className="h-3.5 w-20" />
                              </div>
                              <div className="flex-1"></div>
                              <Skeleton className="h-5 w-24 rounded-full" />
                            </div>

                            {/* Assignees section */}
                            <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/30">
                              <Skeleton className="h-3.5 w-16" />
                              <div className="flex -space-x-2">
                                <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                                <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                                <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-2 flex items-center justify-center border-t bg-gradient-to-b from-blue-500/5 to-blue-500/10 backdrop-blur-sm">
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
