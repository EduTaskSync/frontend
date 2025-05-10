import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarClock, Clock, Trash2, Pencil, UserPlus, UserMinus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AvatarGroup } from '@/components/ui/avatar-group';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewTaskData, Task, UpdatedTaskData } from '@/hooks/projects/kanban/kanbanInterfaces';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { DeleteKanbanTaskDialog } from './DeleteKanbanTaskDialog';
import { KanbanTaskDetailsDialog } from './KanbanTaskDetailsDialog';
import { useParams } from 'react-router';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGroups } from '@/hooks/groups/useGroups';
import { useKanbanTasks } from '@/hooks/projects/kanban/useKanban';

interface TaskCardProps {
  task: Task;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (data: NewTaskData | UpdatedTaskData) => void;
  isDeletePending?: boolean;
  isEditPending?: boolean;
}

export const TaskCard = React.memo(
  ({ task, onDeleteTask, onEditTask, isDeletePending = false, isEditPending = false }: TaskCardProps) => {
    const { projectId: assertedProjectId, groupId: assertedGroupId } = useParams<{
      projectId: string;
      groupId: string;
    }>();
    if (!assertedProjectId || !assertedGroupId) {
      throw new Error('Project ID and Group ID are required for TaskCard');
    }

    const { assignTaskResponse, unassignTaskResponse } = useKanbanTasks(assertedProjectId, task.columnId);
    const { getGroupMembersResponse } = useGroups(assertedGroupId);
    console.log(getGroupMembersResponse);
    const { data: groupMembers } = getGroupMembersResponse;

    const { setNodeRef, listeners, transform, transition, attributes, isDragging } = useSortable({
      id: task.taskId,
      data: {
        type: 'Task',
        task,
      },
    });

    const style = {
      transition,
      transform: CSS.Transform.toString(transform),
      opacity: isDragging ? 0.4 : 1,
    };

    // Format dates for display
    const formattedCreationDate = useMemo(() => new Date(task.taskCreationTime), [task.taskCreationTime]);
    const formattedDeadline = useMemo(() => new Date(task.taskDeadline), [task.taskDeadline]);
    const isPastDeadline = useMemo(() => new Date() > formattedDeadline, [formattedDeadline]);

    // Filter out already assigned members
    const availableMembers = useMemo(() => {
      if (!groupMembers?.users) return [];
      return groupMembers.users.filter(
        (member) => !task.taskAssignees.some((assignee) => assignee.userId === member.userId)
      );
    }, [groupMembers?.users, task.taskAssignees]);

    const handleAssignTask = (assigneeId: string) => {
      assignTaskResponse.mutate({ taskId: task.taskId, assigneeId });
    };

    const handleUnassignTask = (assigneeId: string) => {
      unassignTaskResponse.mutate({ taskId: task.taskId, assigneeId });
    };

    //? drop preview
    if (isDragging) {
      return (
        <div
          ref={setNodeRef}
          style={style}
          className=" w-full my-2 h-[150px] rounded-xl border-2 border-purple-500 bg-card shadow-sm"
        />
      );
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative w-full">
        <Card className="border shadow-sm bg-card/95 group w-full">
          {/* Action buttons - shown on hover */}
          <div
            className={cn(
              'absolute top-2 right-2 flex gap-1.5 z-10',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200'
            )}
          >
            <KanbanTaskDetailsDialog
              columnId={task.columnId}
              taskIndex={task.taskIndex}
              prefillData={{
                taskId: task.taskId,
                taskName: task.taskName,
                taskDeadline: task.taskDeadline,
                projectId: assertedProjectId,
                columnId: task.columnId,
              }}
              isSubmitting={isEditPending}
              onSubmitHandler={onEditTask}
              trigger={
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-background/70 border shadow-sm
                         hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              }
            />

            <DeleteKanbanTaskDialog
              task={task}
              onDeleteTask={onDeleteTask}
              isSubmitting={isDeletePending}
              trigger={
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-background/70 border shadow-sm
                         hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              }
            />
          </div>

          <CardContent className="p-4">
            {/* Task name with proper word wrapping */}
            <p className="font-heading text-sm font-medium leading-tight mb-3 break-all">{task.taskName}</p>

            {/* Date information row with more compact layout */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{format(formattedCreationDate, 'MMM d')}</span>
              </div>

              <Badge
                variant={isPastDeadline ? 'destructive' : 'outline'}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-0.5 h-5 text-[10px] font-medium flex-shrink-0',
                  !isPastDeadline && 'bg-primary/5 text-primary border-primary/20'
                )}
              >
                <CalendarClock className="h-3 w-3 flex-shrink-0" />
                <span>Due {format(formattedDeadline, 'MMM d')}</span>
              </Badge>
            </div>

            {/* Assignees section */}
            <div className="flex items-center justify-between pt-2 border-t border-border/30">
              <span className="text-[10px] text-muted-foreground font-medium truncate">
                {task.taskAssignees.length === 1 ? 'Assignee' : 'Assignees'}
              </span>

              <div className="flex items-center gap-2">
                <AvatarGroup limit={3} className="justify-end -space-x-2 flex-shrink-0">
                  {task.taskAssignees.map((assignee) => (
                    <DropdownMenu key={assignee.userId}>
                      <DropdownMenuTrigger asChild>
                        <Avatar className="h-6 w-6 border-2 border-background ring-0 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all">
                          <AvatarImage
                            src={assignee.profilePicture}
                            alt={`${assignee.firstName} ${assignee.lastName}`}
                          />
                          <AvatarFallback className="text-[9px] bg-primary/5 text-primary border-primary/20">
                            {assignee.firstName[0]}
                            {assignee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive cursor-pointer"
                          onClick={() => handleUnassignTask(assignee.userId)}
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove assignee
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </AvatarGroup>

                {availableMembers.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-background/70 border shadow-sm
                               hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                      >
                        <UserPlus className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {availableMembers.map((member) => (
                        <DropdownMenuItem
                          key={member.userId}
                          className="cursor-pointer"
                          onClick={() => handleAssignTask(member.userId)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={member.profilePicture} alt={`${member.firstName} ${member.lastName}`} />
                              <AvatarFallback className="text-[9px]">
                                {member.firstName[0]}
                                {member.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {member.firstName} {member.lastName}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
);

TaskCard.displayName = 'TaskCard';
