import { Filter, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useDashboard, TaskStatus, DateFilter, SortOrder } from '@/hooks/dashboard/useDashboard';
import { TaskCard } from './TaskCard';
import { useNavigate } from 'react-router';
import { cn } from '@/lib/utils';

export interface TaskListProps {
  searchQuery?: string;
  initialPage?: number;
  limit?: number;
  initialStatus?: TaskStatus;
  initialDateFilter?: DateFilter;
  initialGroupId?: string | null;
  initialSortOrder?: SortOrder;
  onTaskToggle?: (taskId: string, completed: boolean) => void;
}

export function TaskList({ searchQuery, initialPage = 0, limit = 10 }: TaskListProps) {
  // Use the dashboard hook
  const {
    tasks,
    totalPages,
    page,
    setPage,
    status,
    setStatus,
    dateFilter,
    setDateFilter,
    sortOrder,
    setSortOrder,
    isLoading,
    isError,
    isDueToday,
    isOverdue,
    refetch,
  } = useDashboard({ initialPage, limit, searchQuery });
  const navigate = useNavigate();
  // Generate pagination numbers
  const paginationItems = () => {
    const items = [];
    const maxDisplayedPages = 5;

    // Logic to display limited pagination numbers with ellipsis
    if (totalPages <= maxDisplayedPages) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink isActive={page === 1} onClick={() => setPage(1)}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Calculate middle range
      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(page + 1, totalPages - 1);

      // Add ellipsis if needed before middle range
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Add middle range
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink isActive={page === i} onClick={() => setPage(i)}>
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Add ellipsis if needed before last page
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink isActive={page === totalPages} onClick={() => setPage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  // Handle task click
  const handleTaskClick = (taskId: string) => {
    const taskInfo = tasks.find((task) => task.taskId === taskId);
    if (taskInfo) {
      navigate(`/app/groups/${taskInfo.groupId}/projects/${taskInfo.projectId}`, {
        state: { taskInfo },
      });
    }
  };

  return (
    <div className="w-full space-y-4 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {searchQuery ? `Search Results: "${searchQuery}"` : 'Your Tasks'}
        </h2>

        <div className="flex items-center gap-2 self-end">
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn('h-4 w-4 transition-transform', isLoading && 'animate-spin')} />
            <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 ">
              <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={status === 'All'} onCheckedChange={() => setStatus('All')}>
                All tasks
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={status === 'To Do'} onCheckedChange={() => setStatus('To Do')}>
                To Do
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={status === 'In Progress'}
                onCheckedChange={() => setStatus('In Progress')}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={status === 'Done'} onCheckedChange={() => setStatus('Done')}>
                Done
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={status === 'Other'} onCheckedChange={() => setStatus('Other')}>
                Other Statuses
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by date</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked={dateFilter === 'all'} onCheckedChange={() => setDateFilter('all')}>
                All dates
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem checked={dateFilter === 'today'} onCheckedChange={() => setDateFilter('today')}>
                Due today
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dateFilter === 'upcoming'}
                onCheckedChange={() => setDateFilter('upcoming')}
              >
                Upcoming
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={dateFilter === 'overdue'}
                onCheckedChange={() => setDateFilter('overdue')}
              >
                Overdue
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1 cursor-pointer hover:bg-primary/10 hover:text-primary hover:border-primary/30"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Oldest first</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Newest first</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-3 items-center justify-end text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-amber-400"></div>
          <span>Due Today</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-400"></div>
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-400"></div>
          <span>Other Statuses</span>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center p-8 text-muted-foreground">Loading tasks...</div>
        ) : isError ? (
          <div className="text-center p-8 text-destructive">Error loading tasks. Please try again.</div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            {searchQuery ? 'No tasks match your search' : 'No tasks to display'}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.taskId}
              task={task}
              onClick={handleTaskClick}
              isDueToday={isDueToday}
              isOverdue={isOverdue}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={page <= 1}
              />
            </PaginationItem>

            {paginationItems()}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
