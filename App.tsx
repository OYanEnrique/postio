import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  TouchSensor,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Column as ColumnType, Task, UniqueId } from './types';
import { Column } from './components/Column';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { Eye, EyeOff, RotateCcw, Download } from 'lucide-react';
import { IconButton } from './components/IconButton';
import { APP_DATA } from './data';

const PostioLogo = () => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M25 35 Q25 20 40 20" stroke="#539190" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
    <rect x="20" y="32" width="45" height="45" rx="10" transform="rotate(-12 42.5 54.5)" fill="#539190" />
    <rect x="38" y="18" width="45" height="45" rx="10" transform="rotate(12 60.5 40.5)" fill="#83ecbb" />
    <path d="M75 75 Q75 90 60 90" stroke="#539190" strokeWidth="4" strokeLinecap="round" opacity="0.4"/>
  </svg>
);

function App() {
  const [isEditable, setIsEditable] = useState(true);
  const [columns] = useState<ColumnType[]>(APP_DATA.columns);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('kanban-tasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Error parsing local storage", e);
      }
    }
    return APP_DATA.tasks;
  });

  const [activeId, setActiveId] = useState<UniqueId | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumnId, setTargetColumnId] = useState<UniqueId>('todo');

  useEffect(() => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
        activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, { 
        activationConstraint: { delay: 300, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleAddTask = (columnId: UniqueId) => {
    if (!isEditable) return;
    setEditingTask(null);
    setTargetColumnId(columnId);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    if (!isEditable) return;
    setEditingTask(task);
    setTargetColumnId(task.columnId);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        columnId: targetColumnId,
        title: taskData.title || 'Nova Tarefa',
        description: taskData.description,
        color: taskData.color || 'bg-white border-transparent',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleDeleteTask = (id: UniqueId) => {
    if (!isEditable) return;
    setTasks(tasks.filter(t => t.id !== id));
  };

  const handleToggleComplete = (id: UniqueId) => {
    if (!isEditable) return;
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const isNowCompleted = !t.completed;
        return { 
          ...t, 
          completed: isNowCompleted,
          completedAt: isNowCompleted ? new Date().toISOString() : undefined 
        };
      }
      return t;
    }));
  };

  const handleResetBoard = () => {
    if (!isEditable) return;
    if(window.confirm('Deseja restaurar as tarefas originais? Isso apagará as mudanças locais.')) {
        setTasks(APP_DATA.tasks);
        localStorage.removeItem('kanban-tasks');
    }
  };

  // NEW: Function to export data.ts content
  const handleExportData = () => {
    const dataContent = `import { Column, Task } from './types';

// Este arquivo define o estado inicial do seu aplicativo.
// Como o app é somente para uso pessoal, os dados são persistidos no navegador.

export const APP_DATA: { columns: Column[]; tasks: Task[] } = {
  "columns": ${JSON.stringify(columns, null, 2)},
  "tasks": ${JSON.stringify(tasks, null, 2)}
};`;

    const blob = new Blob([dataContent], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.ts';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (!isEditable) return;
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    if (!isEditable) return;
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(newTasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        if (tasks[activeIndex].columnId !== overId) {
          const newTasks = [...tasks];
          newTasks[activeIndex].columnId = overId;
          return arrayMove(newTasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditable) return;
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (isActiveTask && isOverTask) {
       setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            const newTasks = [...tasks];
            newTasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(newTasks, activeIndex, overIndex);
        }
        return arrayMove(tasks, activeIndex, overIndex);
       });
    }
  };

  const activeTask = useMemo(() => tasks.find((t) => t.id === activeId), [activeId, tasks]);

  return (
    <div className="flex flex-col h-screen bg-md-sys-surface text-md-sys-onSurface font-sans overflow-hidden">
      <header className="flex-none px-6 py-4 flex items-center justify-between border-b border-md-sys-outline/10 bg-md-sys-surface z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-sm overflow-hidden shrink-0 p-1">
             <PostioLogo />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-md-sys-primary">Postio</h1>
        </div>
        
        <div className="flex items-center gap-2">
             <IconButton 
                onClick={handleExportData}
                title="Exportar data.ts para GitHub"
                className="text-md-sys-primary hover:bg-md-sys-primary/10"
             >
                <Download size={20} />
             </IconButton>

             <IconButton 
                onClick={() => setIsEditable(!isEditable)} 
                title={isEditable ? "Modo Visualização" : "Modo Edição"}
                className={isEditable ? "bg-md-sys-primaryContainer text-md-sys-onPrimaryContainer" : ""}
             >
                {isEditable ? <Eye size={20} /> : <EyeOff size={20} />}
             </IconButton>
             
             {isEditable && (
                <IconButton onClick={handleResetBoard} title="Resetar Quadro">
                    <RotateCcw size={20}/>
                </IconButton>
             )}
        </div>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-8 min-w-max mx-auto items-start">
            {columns.map((col) => (
              <Column
                key={col.id}
                column={col}
                tasks={tasks.filter((t) => t.columnId === col.id)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
                isReadOnly={!isEditable}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
                <div className="transform rotate-3 cursor-grabbing">
                     <TaskCard 
                        task={activeTask} 
                        isOverlay 
                        onEdit={()=>{}} 
                        onDelete={()=>{}} 
                        onToggleComplete={()=>{}} 
                     />
                </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        columnId={targetColumnId}
      />
    </div>
  );
}

export default App;