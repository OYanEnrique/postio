import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import { Button } from './Button';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string | number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string | number) => void;
  onToggleComplete: (id: string | number) => void;
  isReadOnly?: boolean;
}

export const Column: React.FC<ColumnProps> = ({ 
  column, 
  tasks, 
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleComplete,
  isReadOnly = false
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
        type: 'Column',
        column,
    },
    disabled: isReadOnly
  });

  const taskIds = tasks.map((t) => t.id);
  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="flex flex-col w-full min-w-[320px] max-w-[360px] h-full max-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-md-sys-primary">
            {column.title}
          </h2>
          <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-md-sys-primaryContainer text-md-sys-onPrimaryContainer">
            {completedCount}/{tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable Area */}
      <div 
        ref={setNodeRef}
        className="flex-1 p-3 bg-md-sys-surfaceContainer rounded-[24px] flex flex-col overflow-hidden shadow-inner"
      >
        <div className="overflow-y-auto overflow-x-hidden flex-1 no-scrollbar p-1">
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onToggleComplete={onToggleComplete}
                isReadOnly={isReadOnly}
              />
            ))}
          </SortableContext>
          {tasks.length === 0 && !isReadOnly && (
             <div className="h-24 flex items-center justify-center text-md-sys-outline text-sm italic border-2 border-dashed border-md-sys-outline/20 rounded-xl">
               Drop items here
             </div>
          )}
          {tasks.length === 0 && isReadOnly && (
            <div className="h-24 flex items-center justify-center text-md-sys-outline/50 text-sm italic">
              No tasks
            </div>
          )}
        </div>
        
        {!isReadOnly && (
          <div className="pt-3 mt-1 border-t border-md-sys-outline/10">
            <Button 
              variant="text" 
              className="w-full justify-start text-md-sys-secondary hover:text-md-sys-primary hover:bg-md-sys-primaryContainer/30"
              icon={<Plus size={18} />}
              onClick={() => onAddTask(column.id)}
            >
              Add Task
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};