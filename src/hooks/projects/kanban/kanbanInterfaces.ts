//? columns

export interface NewKanbanColumn {
  columnName: string;
  projectId: string;
  columnIndex: number;
}

export interface CreateKanbanColumnResponse {
  columnId: string;
}

export interface KanbanColumn {
  columnId: string;
  columnName: string;
  columnIndex: number;
}

export interface GetKanbanColumnsResponse {
  columns: KanbanColumn[];
}

export interface UpdatedColumnData {
  columnId: string;
  columnName: string;
}

export interface ReorderedColumnsData {
  projectId: string;
  columnIds: string[];
}

//? tasks
export interface NewTaskData {
  taskName: string;
  projectId: string;
  columnId: string;
  taskDeadline: string;
}

export interface UpdatedTaskData {
  taskId: string;
  taskName: string;
  taskDeadline: string;
}

export interface Task {
  taskName: string;
  taskId: string;
  columndId: string;
  taskAssignees: TaskAssignee[];
  taskDeadline: string;
  taskCreationTime: string;
  taskIndex: number;
}

export interface NewTaskResponse {
  projectName: string;
  deadline: string;
  projectId: string;
}

export interface MoveTaskData {
  taskId: string;
  targetColumnId: string;
  taskIndex: number;
  projectId: string;
  sourceColumnId: string;
}

interface TaskAssignee {
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export interface ColumnTasksResponse {
  tasks: Task[];
}

export interface UpdateTaskAssignment {
  taskId: string;
  assigneeId: string;
}
