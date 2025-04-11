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
