import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Task, CARD_COLORS } from '../types';
import { Button } from './Button';
import { IconButton } from './IconButton';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
  initialTask?: Task | null;
  columnId?: string | number;
}

export const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTask,
  columnId 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(CARD_COLORS[0].value);

  useEffect(() => {
    if (isOpen) {
      if (initialTask) {
        setTitle(initialTask.title);
        setDescription(initialTask.description || '');
        setColor(initialTask.color);
      } else {
        setTitle('');
        setDescription('');
        setColor(CARD_COLORS[0].value);
      }
    }
  }, [isOpen, initialTask]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onSave({
      id: initialTask?.id,
      title,
      description,
      color,
      columnId: initialTask?.columnId || columnId,
      completed: initialTask?.completed || false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-md-sys-surface rounded-[28px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-white/50">
        <div className="flex items-center justify-between px-6 py-4 border-b border-md-sys-outline/10">
          <h2 className="text-xl text-md-sys-onSurface font-normal">
            {initialTask ? 'Edit Task' : 'New Task'}
          </h2>
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-xs font-bold uppercase tracking-wider text-md-sys-primary mb-1">Title</label>
              <input
                id="title"
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-md-sys-surfaceContainerHigh rounded-xl focus:outline-none focus:ring-2 focus:ring-md-sys-primary transition-all text-md-sys-onSurface"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-md-sys-primary mb-1">Description</label>
              <textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-md-sys-surfaceContainerHigh rounded-xl focus:outline-none focus:ring-2 focus:ring-md-sys-primary transition-all text-md-sys-onSurface resize-none"
                placeholder="Add details..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-md-sys-primary mb-2">Color</label>
              <div className="flex flex-wrap gap-3">
                {CARD_COLORS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={`w-10 h-10 rounded-full shadow-sm flex items-center justify-center transition-transform hover:scale-110 ${c.value} ring-1 ring-black/5`}
                    title={c.name}
                  >
                    {color === c.value && <Check size={16} className={c.value.includes('text-white') ? 'text-white' : 'text-md-sys-primary'} />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="text" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="filled" disabled={!title.trim()}>
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};