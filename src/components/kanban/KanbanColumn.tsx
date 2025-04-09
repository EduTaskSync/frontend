import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ClipboardPlus, Trash2 } from 'lucide-react';
import { Badge } from '../ui/badge';
import { KanbanColumn as Column } from '@/hooks/projects/kanban/kanbanInterfaces';

interface KanbanColumnProps {
  column: Column;
  onDeleteCol: (columnId: string) => void;
}

const getColumnStyle = (colType: string) => {
  switch (colType) {
    case 'To Do':
      return {
        headerClass: 'bg-blue-500/10 border-b-blue-500/20 text-blue-500',
        borderClass: 'border-t-blue-500/30',
        gradientClass: 'from-blue-500/5 to-transparent',
      };
    case 'In Progress':
      return {
        headerClass: 'bg-amber-500/10 border-b-amber-500/20 text-amber-500',
        borderClass: 'border-t-amber-500/30',
        gradientClass: 'from-amber-500/5 to-transparent',
      };
    case 'Done':
      return {
        headerClass: 'bg-emerald-500/10 border-b-emerald-500/20 text-emerald-500',
        borderClass: 'border-t-emerald-500/30',
        gradientClass: 'from-emerald-500/5 to-transparent',
      };
    default:
      return {
        headerClass: 'bg-primary/10 border-b-primary/20 text-primary',
        borderClass: 'border-t-primary/30',
        gradientClass: 'from-primary/5 to-transparent',
      };
  }
};

export const KanbanColumn = ({ column, onDeleteCol }: KanbanColumnProps) => {
  const { borderClass, gradientClass, headerClass } = getColumnStyle(column.columnName);

  return (
    <Card className="flex flex-col h-[500px] w-[300px] border border-border shadow-sm overflow-hidden rounded-xl bg-card ">
      <CardHeader className={cn(headerClass, 'p-3 mx-5 border rounded-xl flex flex-row items-center justify-between')}>
        <Badge variant="destructive" className="font-heading text-sm">
          {' '}
          4
        </Badge>
        <CardTitle className=" font-heading text-xl">{column.columnName}</CardTitle>
        <Trash2 color="white" onClick={() => onDeleteCol(column.columnId)} />
      </CardHeader>

      <CardContent>
        <p>Card Content</p>
      </CardContent>

      <CardFooter
        className={cn(borderClass, gradientClass, 'p-2 flex items-center justify-center border-t bg-gradient-to-b')}
      >
        <Button
          variant="ghost"
          size="sm"
          className="p-2 font-heading justify-start text-muted-foreground hover:text-foreground gap-2"
        >
          <ClipboardPlus className="h-4 w-4" />
          Add Task
        </Button>
      </CardFooter>
    </Card>
  );
};
