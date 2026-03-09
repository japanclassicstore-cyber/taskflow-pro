'use client';

import { motion } from 'framer-motion';
import { Clock, Tag, Trash2, Edit2, Calendar } from 'lucide-react';
import { Task } from '@/types';
import { formatDate, getPriorityColor, isOverdue } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-foreground flex-1 pr-2">{task.title}</h3>
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 rounded hover:bg-accent"
          >
            <Edit2 className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 rounded hover:bg-destructive/10"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </motion.button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center space-x-1">
              <Tag className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {task.tags.length}
              </span>
            </div>
          )}
        </div>

        {task.dueDate && (
          <div className={`flex items-center space-x-1 text-xs ${
            overdue ? 'text-destructive' : 'text-muted-foreground'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
