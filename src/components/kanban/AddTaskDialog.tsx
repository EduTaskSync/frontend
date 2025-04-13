// UI components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { taskFormSchema, taskFormValues } from '@/utils/taskSchema';
import { nullable } from 'zod';
import { Id, Column, TaskData } from './KanbanBoard';

// task data for POST request
export interface TaskPostData {
  taskName: string;
  projectId: Id;
  columnId: Id;
  taskDeadline: Date | null;
}

interface TaskDetailsDialogProps {
  onSubmit: (formattedData: TaskData ) => void;
  isUpdating?: boolean;
  columnId?: Id;
  prefillData?: TaskData;
  trigger?: React.ReactNode;
}

interface AddTaskDialogProps {
  columnId: Id;
  onAddTask?: (task: TaskData) => void;
}

export const AddTaskDialog : React.FC<AddTaskDialogProps> = ({ columnId, onAddTask }) =>
//({
//  onSubmit,
//  isUpdating = false,
//  columnId,
//  prefillData,
//  trigger,
//}: TaskDetailsDialogProps) => 
{
  const [open, setOpen] = useState(false);

  const [taskInput, setTaskInput] = useState('');
  const [taskDeadline, setTaskDeadline] = useState<string>('');
  
  // initialize form with react-hook-form
  //const form = useForm<taskFormValues>({
  //  resolver: zodResolver(taskFormSchema),
  //  defaultValues: {
  //    taskName: prefillData?.taskName || '',
  //    taskDeadline: prefillData?.taskDeadline || null,
      
  // },
  //});

  // add a task
  const handleAddTask = () => {
    
    //if (taskInput.trim() !== '') {
      const taskToAdd: TaskData = {
        taskName: taskInput,
        taskDeadline: taskDeadline ? new Date(taskDeadline) : null,
      };
      
      onAddTask?.(taskToAdd);
      console.log('Add task to column:', columnId, taskToAdd);
            
      setTaskInput('');
      setTaskDeadline('');
      setOpen(false);
    //}
  };
  

  const handleSubmitTask = (values: TaskPostData) => {
        
      let formattedData: TaskPostData;
      
      formattedData = {
          taskName: values.taskName,
          projectId: values.projectId,
          columnId: values.columnId,
          taskDeadline: values.taskDeadline,
      };
  
      // send form data over to the backend
      //onSubmit(formattedData);
  
      // close the dialog after submission
      setOpen(false);
      //form.reset();
  };

  return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            //form.reset();
          }
          setOpen(isOpen);
        }}
      >
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 font-heading hover:cursor-pointer">
              {'Add Task'}
            </Button>
          </DialogTrigger>
          
          <DialogContent className="bg-gray-900 border-purple-600">
            <DialogHeader>
              <DialogTitle>New Task</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-3">
              {'Task'}
              <Input
                placeholder="Input Task"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
              />
              {'Deadline'}
              <Input
                type="date"
                value={taskDeadline}
                onChange={(e) => setTaskDeadline(e.target.value)}
              />
            </div>

            <DialogFooter className="mt-4 flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTask}>OK</Button>
              
            </DialogFooter>
          </DialogContent>
        

      </Dialog>
  )
}