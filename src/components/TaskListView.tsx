import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  MoreHorizontal,
  Folder
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';

export const TaskListView: React.FC = () => {
  const {
    tasks,
    projects,
    selectedProjectId,
    searchQuery,
    filterPriority,
    filterStatus,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    setIsQuickCaptureOpen,
    triggerCelebration,
  } = useApp();

  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const handleToggleDone = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (task.status === 'done') {
      updateTask(task.id, { status: 'todo' });
    } else {
      updateTask(task.id, { status: 'done' });
      triggerCelebration();
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-medium">Urgent</span>;
      case 'high':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium">High</span>;
      case 'medium':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">Medium</span>;
      case 'low':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">Low</span>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'backlog':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">Backlog</span>;
      case 'todo':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-medium">To Do</span>;
      case 'in_progress':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-medium">In Progress</span>;
      case 'in_review':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">In Review</span>;
      case 'done':
        return <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">Done</span>;
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto bg-stone-50/50 dark:bg-stone-950">
      {/* Table Container */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Database Table View ({filteredTasks.length} entries)
          </div>
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Row</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 font-medium">
                <th className="py-2.5 px-4 w-10">Done</th>
                <th className="py-2.5 px-4 min-w-[200px]">Task Title</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Project</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Estimate</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredTasks.map((task) => {
                const project = projects.find((p) => p.id === task.projectId);
                return (
                  <tr
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 cursor-pointer transition-colors group"
                  >
                    <td className="py-2.5 px-4" onClick={(e) => handleToggleDone(e, task)}>
                      {task.status === 'done' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      ) : (
                        <Circle className="w-4 h-4 text-stone-400 hover:text-stone-600" />
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-stone-900 dark:text-stone-100">
                      <span className={task.status === 'done' ? 'line-through text-stone-400' : ''}>
                        {task.title}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">{getStatusBadge(task.status)}</td>
                    <td className="py-2.5 px-3">{getPriorityBadge(task.priority)}</td>
                    <td className="py-2.5 px-3 text-stone-600 dark:text-stone-300">
                      {project ? (
                        <span className="flex items-center space-x-1">
                          <span>{project.icon}</span>
                          <span>{project.name}</span>
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-stone-600 dark:text-stone-300">
                      {task.dueDate || <span className="text-stone-400">—</span>}
                    </td>
                    <td className="py-2.5 px-3 text-stone-500">
                      {task.estimatedMinutes ? `${task.estimatedMinutes} min` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${task.title}"?`)) deleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 transition-opacity"
                        title="Delete task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
