import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';
import { Pencil, Trash2, CheckCircle2, Circle, GripVertical, Check, X } from 'lucide-react';
import { IconButton } from './IconButton';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string | number) => void;
  onToggleComplete: (id: string | number) => void;
  isOverlay?: boolean;
  isReadOnly?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onEdit, 
  onDelete, 
  onToggleComplete,
  isOverlay,
  isReadOnly = false
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay || isReadOnly || showConfirmDelete
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('pt-BR', { 
            day: '2-digit', 
            month: 'short', 
            hour: '2-digit', 
            minute: '2-digit' 
        }).format(date);
    } catch (e) {
        return '';
    }
  };

  const isDarkBg = task.color.includes('text-white');
  const textColor = isDarkBg ? 'text-white' : 'text-md-sys-onSurface';
  const subTextColor = isDarkBg ? 'text-white/80' : 'text-gray-600';
  const metaTextColor = isDarkBg ? 'text-white/60' : 'text-gray-500/80';
  const iconColor = isDarkBg ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-md-sys-primary';

  const CardContent = (
    <div
      className={`
        relative group rounded-[16px] p-4 mb-3 border
        transition-all duration-200
        ${task.color} 
        ${task.completed ? 'opacity-60 saturate-50' : 'shadow-sm hover:shadow-md'}
        ${isOverlay ? 'shadow-xl scale-105 cursor-grabbing z-50 ring-2 ring-md-sys-primary' : ''}
        ${showConfirmDelete ? 'ring-2 ring-red-500' : ''}
      `}
    >
      {showConfirmDelete ? (
        <div className="flex flex-col items-center justify-center py-2 animate-in fade-in zoom-in-95 duration-200">
          <p className={`text-sm font-medium mb-3 ${textColor}`}>Excluir esta tarefa?</p>
          <div className="flex gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowConfirmDelete(false); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/5 hover:bg-black/10 text-xs font-bold transition-colors"
            >
              <X size={14} /> CANCELAR
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 text-xs font-bold shadow-sm transition-colors"
            >
              <Check size={14} /> EXCLUIR
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start gap-3">
             {!isReadOnly && (
               <div 
                  {...attributes} 
                  {...listeners}
                  className={`mt-1 cursor-grab active:cursor-grabbing touch-none p-1 -m-1 ${iconColor}`}
               >
                  <GripVertical size={18} />
               </div>
             )}

             <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 
                    className={`font-medium text-base truncate pr-2 ${textColor} ${task.completed ? 'line-through opacity-70' : ''}`}
                    title={task.title}
                  >
                    {task.title}
                  </h3>
                </div>
                
                {task.description && (
                  <p className={`mt-1 text-sm line-clamp-2 ${subTextColor} ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}

                <div className={`flex flex-wrap gap-x-3 gap-y-1 mt-3 text-[10px] uppercase font-bold tracking-wider ${metaTextColor}`}>
                    {task.createdAt && (
                        <span className="flex items-center gap-1">
                            {formatDate(task.createdAt)}
                        </span>
                    )}
                    {task.completed && task.completedAt && (
                        <span className={`flex items-center gap-1 ${isDarkBg ? 'text-white/70' : 'text-green-600/80'}`}>
                            ✓ {formatDate(task.completedAt)}
                        </span>
                    )}
                </div>
             </div>

             <button 
               onClick={(e) => {
                 e.stopPropagation();
                 if (!isReadOnly) onToggleComplete(task.id);
               }}
               disabled={isReadOnly}
               className={`mt-0.5 transition-colors flex-shrink-0 ${iconColor} ${!isReadOnly ? 'cursor-pointer' : 'cursor-default'}`}
             >
               {task.completed ? (
                 <CheckCircle2 size={22} className={isDarkBg ? "text-white" : "text-green-600"} />
               ) : (
                 <Circle size={22} />
               )}
             </button>
          </div>

          {!isReadOnly && (
            <div className={`
              flex justify-end gap-1 mt-1 pt-2 border-t ${isDarkBg ? 'border-white/10' : 'border-black/5'}
              transition-opacity duration-200
              ${isOverlay ? 'hidden' : ''}
            `}>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                className={`h-8 w-8 p-1.5 ${isDarkBg ? 'text-white hover:bg-white/10' : ''}`} 
                title="Editar"
              >
                <Pencil size={14} />
              </IconButton>
              <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmDelete(true);
                }}
                className={`h-8 w-8 p-1.5 ${isDarkBg ? 'text-white hover:bg-white/10' : 'text-red-500 hover:bg-red-50'}`} 
                title="Excluir"
              >
                <Trash2 size={14} />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );

  if (isOverlay) return CardContent;

  return (
    <div ref={setNodeRef} style={style}>
      {CardContent}
    </div>
  );
};