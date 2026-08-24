import React, { useState } from 'react';
import { 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  CheckSquare, 
  AlertCircle,
  Tag,
  GripVertical,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskStatus, TaskPriority } from '../types';

interface ColumnDef {
  id: TaskStatus;
  title: string;
  color: string;
  bgLight: string;
  icon: string;
}

const COLUMNS: ColumnDef[] = [
  { id: 'backlog', title: 'Backlog & Ideas', color: 'text-stone-600 dark:text-stone-400', bgLight: 'bg-stone-100/70 dark:bg-stone-900/50', icon: '📥' },
  { id: 'todo', title: 'To Do', color: 'text-sky-600 dark:text-sky-400', bgLight: 'bg-sky-50/50 dark:bg-sky-950/20', icon: '🎯' },
  { id: 'in_progress', title: 'In Progress', color: 'text-amber-600 dark:text-amber-400', bgLight: 'bg-amber-50/50 dark:bg-amber-950/20', icon: '⚡' },
  { id: 'in_review', title: 'In Review', color: 'text-purple-600 dark:text-purple-400', bgLight: 'bg-purple-50/50 dark:bg-purple-950/20', icon: '🔍' },
  { id: 'done', title: 'Done', color: 'text-emerald-600 dark:text-emerald-400', bgLight: 'bg-emerald-50/50 dark:bg-emerald-950/20', icon: '✅' },
];

export const KanbanBoard: React.FC = () => {
  const {
    tasks,
    projects,
    selectedProjectId,
    searchQuery,
    filterPriority,
    filterStatus,
    moveTaskStatus,
    setSelectedTaskId,
    addTask,
    updateTask,
    deleteTask,
    triggerCelebration,
  } = useApp();

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [inlineNewTaskCol, setInlineNewTaskCol] = useState<TaskStatus | null>(null);
  const [inlineTitle, setInlineTitle] = useState('');

  // Filter tasks by project, search, priority, status
  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      const matchTag = task.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTag) return false;
    }
    return true;
  });

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-medium">🔴 Urgent</span>;
      case 'high':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium">🟠 High</span>;
      case 'medium':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">🟡 Medium</span>;
      case 'low':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">🟢 Low</span>;
    }
  };

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== colId) {
      setDragOverColumn(colId);
    }
  };

  const handleDragLeave = (colId: TaskStatus) => {
    if (dragOverColumn === colId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetCol: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      moveTaskStatus(taskId, targetCol);
    }
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleInlineSubmit = (col: TaskStatus) => {
    if (!inlineTitle.trim()) {
      setInlineNewTaskCol(null);
      return;
    }
    addTask({
      title: inlineTitle.trim(),
      description: '',
      status: col,
      priority: 'medium',
      projectId: selectedProjectId !== 'all' ? selectedProjectId : undefined,
      tags: [],
      subtasks: [],
      order: tasks.filter((t) => t.status === col).length,
    });
    setInlineTitle('');
    setInlineNewTaskCol(null);
  };

  const handleQuickToggleDone = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (task.status === 'done') {
      updateTask(task.id, { status: 'todo' });
    } else {
      updateTask(task.id, { status: 'done' });
      triggerCelebration();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-hidden bg-stone-50/50 dark:bg-stone-950">
      {/* Board Header Stats */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs text-stone-500 dark:text-stone-400">
          <span>Total Tasks: <strong className="text-stone-800 dark:text-stone-200">{filteredTasks.length}</strong></span>
          <span>•</span>
          <span>In Progress: <strong className="text-amber-600">{filteredTasks.filter((t) => t.status === 'in_progress').length}</strong></span>
          <span>•</span>
          <span>Completed: <strong className="text-emerald-600">{filteredTasks.filter((t) => t.status === 'done').length}</strong></span>
        </div>

        <div className="text-xs text-stone-400">
          Tip: Drag cards between columns to change status
        </div>
      </div>

      {/* Kanban Columns Horizontal Scroll Area */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <div className="flex space-x-4 h-full min-w-max pb-2">
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            const isOver = dragOverColumn === col.id;

            return (
              <div
                key={col.id}
                id={`kanban-col-${col.id}`}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={() => handleDragLeave(col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`w-72 md:w-80 flex flex-col rounded-xl border transition-all duration-150 ${
                  isOver
                    ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/30 scale-[1.01]'
                    : 'border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60'
                }`}
              >
                {/* Column Header */}
                <div className="p-3 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between select-none">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{col.icon}</span>
                    <h3 className={`font-semibold text-xs ${col.color}`}>{col.title}</h3>
                    <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                      {colTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setInlineNewTaskCol(col.id);
                      setInlineTitle('');
                    }}
                    className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 transition-colors"
                    title={`Add task to ${col.title}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Cards Container */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2.5">
                  {colTasks.map((task) => {
                    const isDragging = draggedTaskId === task.id;
                    const project = projects.find((p) => p.id === task.projectId);
                    const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
                    const totalSubtasks = task.subtasks?.length || 0;

                    return (
                      <div
                        key={task.id}
                        id={`task-card-${task.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => setSelectedTaskId(task.id)}
                        className={`group bg-white dark:bg-stone-800 rounded-lg p-3 border border-stone-200 dark:border-stone-700 shadow-2xs hover:shadow-xs hover:border-stone-300 dark:hover:border-stone-600 cursor-pointer transition-all ${
                          isDragging ? 'opacity-40 scale-95' : 'opacity-100'
                        }`}
                      >
                        {/* Card Header & Checkbox */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start space-x-2 flex-1">
                            <button
                              onClick={(e) => handleQuickToggleDone(e, task)}
                              className="mt-0.5 text-stone-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shrink-0"
                              title={task.status === 'done' ? 'Mark Incomplete' : 'Mark Done'}
                            >
                              {task.status === 'done' ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <span
                              className={`text-xs font-medium leading-snug text-stone-900 dark:text-stone-100 ${
                                task.status === 'done' ? 'line-through text-stone-400 dark:text-stone-500' : ''
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>

                          <GripVertical className="w-3.5 h-3.5 text-stone-300 dark:text-stone-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab shrink-0" />
                        </div>

                        {/* Description excerpt */}
                        {task.description && (
                          <p className="mt-1.5 text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2 pl-6">
                            {task.description}
                          </p>
                        )}

                        {/* Tags & Subtasks */}
                        <div className="mt-2.5 pl-6 flex flex-wrap items-center gap-1.5">
                          {getPriorityBadge(task.priority)}

                          {project && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 font-medium truncate max-w-[120px]">
                              {project.icon} {project.name}
                            </span>
                          )}

                          {totalSubtasks > 0 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300 flex items-center space-x-1">
                              <CheckSquare className="w-3 h-3 text-stone-400" />
                              <span>{completedSubtasks}/{totalSubtasks}</span>
                            </span>
                          )}

                          {task.dueDate && (
                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded flex items-center space-x-1 ${
                                task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'done'
                                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-semibold'
                                  : 'bg-stone-100 dark:bg-stone-700/60 text-stone-600 dark:text-stone-300'
                              }`}
                            >
                              <Calendar className="w-3 h-3" />
                              <span>{task.dueDate}</span>
                            </span>
                          )}

                          {task.estimatedMinutes && (
                            <span className="text-[10px] text-stone-400 flex items-center space-x-0.5">
                              <Clock className="w-3 h-3" />
                              <span>{task.estimatedMinutes}m</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Inline Add Card Input */}
                  {inlineNewTaskCol === col.id ? (
                    <div className="bg-white dark:bg-stone-800 rounded-lg p-2.5 border border-indigo-300 dark:border-indigo-600 shadow-xs">
                      <textarea
                        autoFocus
                        rows={2}
                        placeholder="What needs to be done?"
                        value={inlineTitle}
                        onChange={(e) => setInlineTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleInlineSubmit(col.id);
                          } else if (e.key === 'Escape') {
                            setInlineNewTaskCol(null);
                          }
                        }}
                        className="w-full text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 resize-none focus:outline-hidden bg-transparent"
                      />
                      <div className="mt-2 flex items-center justify-between">
                        <button
                          onClick={() => handleInlineSubmit(col.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-medium px-2.5 py-1 rounded shadow-2xs"
                        >
                          Add Card
                        </button>
                        <button
                          onClick={() => setInlineNewTaskCol(null)}
                          className="text-[11px] text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setInlineNewTaskCol(col.id);
                        setInlineTitle('');
                      }}
                      className="w-full py-2 px-2 text-left rounded-lg border border-dashed border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500 hover:bg-white/50 dark:hover:bg-stone-800/50 text-xs text-stone-500 dark:text-stone-400 flex items-center space-x-1.5 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Card</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
