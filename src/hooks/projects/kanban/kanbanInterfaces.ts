export interface NewKanbanColumn {
  columnName: string;
  projectId: string;
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
