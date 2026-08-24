import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Calendar, 
  Clock, 
  Trash2, 
  Plus, 
  Folder,
  Tag,
  Search,
  Filter,
  Check,
  Flame,
  Sparkles,
  PenLine,
  AlertTriangle,
  ArrowUp,
  ListChecks
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus } from '../types';

const PRIORITY_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  urgent: { bg: '#FEE2E2', color: '#DC2626', border: '#FECACA' },
  high:   { bg: '#FEF3C7', color: '#D97706', border: '#FDE68A' },
  medium: { bg: '#E0F2FE', color: '#0284C7', border: '#BAE6FD' },
  low:    { bg: '#D1FAE5', color: '#059669', border: '#A7F3D0' },
};

export const TaskListView: React.FC = () => {
  const {
    tasks,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    searchQuery,
    setSearchQuery,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    addTask,
    setIsQuickCaptureOpen,
    triggerCelebration,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TaskStatus | 'all' | 'urgent'>('all');
  const [quickInput, setQuickInput] = useState('');

  const filteredTasks = tasks.filter((task) => {
    if (selectedProjectId !== 'all' && task.projectId !== selectedProjectId) return false;
    if (activeTab === 'urgent') {
      if (task.priority !== 'urgent') return false;
    } else if (activeTab !== 'all') {
      if (task.status !== activeTab) return false;
    }
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

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    addTask({
      title: quickInput.trim(),
      status: 'todo',
      priority: 'medium',
      projectId: selectedProjectId !== 'all' ? selectedProjectId : undefined,
      order: 0,
    });
    setQuickInput('');
    triggerCelebration();
  };

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const pendingCount = tasks.filter((t) => t.status !== 'done').length;

  const tabs = [
    { id: 'all', label: 'Tất cả', count: tasks.length, bg: '#FFB5C2', activeBg: 'linear-gradient(135deg, #FFB5C2, #FF8FAB)' },
    { id: 'todo', label: 'Cần làm', count: tasks.filter((t) => t.status === 'todo').length, bg: '#BDE0FE', activeBg: 'linear-gradient(135deg, #BDE0FE, #93C5FD)' },
    { id: 'in_progress', label: 'Đang làm', count: tasks.filter((t) => t.status === 'in_progress').length, bg: '#E8D5F5', activeBg: 'linear-gradient(135deg, #E8D5F5, #C4B5FD)' },
    { id: 'urgent', label: 'Khẩn cấp', count: tasks.filter((t) => t.priority === 'urgent').length, bg: '#FECDD3', activeBg: 'linear-gradient(135deg, #FECDD3, #FDA4AF)' },
    { id: 'done', label: 'Đã xong', count: completedCount, bg: '#B8E8D0', activeBg: 'linear-gradient(135deg, #B8E8D0, #6EE7B7)' },
  ];

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 overflow-y-auto max-w-3xl mx-auto w-full pb-28">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
            Công Việc & Nhiệm Vụ
          </h1>
          <p className="text-xs font-semibold mt-0.5" style={{ color: 'var(--text-dim)' }}>
            {pendingCount} việc cần làm · {completedCount} đã hoàn thành
          </p>
        </div>

        {/* Project Selector */}
        <select
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
          className="text-xs font-bold py-2 px-3 rounded-2xl focus:outline-none cursor-pointer"
          style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-card)', color: 'var(--text-main)' }}
        >
          <option value="all">Tất cả dự án</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.icon} {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Add Bar — Kawaii Pill */}
      <form onSubmit={handleQuickAdd} className="mb-5">
        <div className="kawaii-card flex items-center p-1.5"
          style={{ boxShadow: '0 2px 8px rgba(255,143,171,0.1)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ml-1" 
            style={{ background: 'var(--bg-inner-box)', color: 'var(--text-dim)' }}>
            <PenLine className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            placeholder="Thêm công việc mới (nhấn Enter)..."
            className="w-full bg-transparent px-3 py-2 text-xs font-semibold focus:outline-none"
            style={{ color: 'var(--text-main)' }}
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="kawaii-btn shrink-0 px-4 py-2 text-white text-xs font-black flex items-center gap-1.5 disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #FF8FAB, #A78BFA)' }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm</span>
          </button>
        </div>
      </form>

      {/* Filter Chips — Pastel Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="kawaii-btn px-3.5 py-2 text-xs shrink-0 flex items-center gap-1.5 transition-all"
              style={isActive ? {
                background: tab.activeBg,
                color: 'white',
                boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
                transform: 'scale(1.04)',
              } : {
                background: 'var(--bg-card)',
                color: 'var(--text-muted)',
                border: '1.5px solid var(--border-card)',
              }}
            >
              <span className="font-bold">{tab.label}</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full"
                style={isActive ? { background: 'rgba(255,255,255,0.25)', color: 'white' } : { background: 'var(--bg-inner-box)' }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Task List */}
      <div className="space-y-2.5 flex-1">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-16 text-center kawaii-card"
            >
              <div className="kawaii-bubble kawaii-bubble-sky mx-auto mb-3 kawaii-float">
                <ListChecks className="w-5 h-5" />
              </div>
              <p className="text-sm font-bold" style={{ color: 'var(--text-main)' }}>Không có công việc nào</p>
              <p className="text-xs font-medium mt-1" style={{ color: 'var(--text-dim)' }}>Dùng thanh thêm nhanh ở trên để tạo mới</p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => {
              const isDone = task.status === 'done';
              const project = projects.find((p) => p.id === task.projectId);
              const priorityStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.medium;

              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`group kawaii-card p-3.5 flex items-center gap-3 cursor-pointer transition-all ${
                    isDone ? 'opacity-50' : ''
                  }`}
                  style={{ borderLeft: `4px solid ${priorityStyle.color}20` }}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleDone(e, task)}
                    className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer"
                    style={isDone
                      ? { background: 'linear-gradient(135deg, #B8E8D0, #6EE7B7)', borderColor: 'transparent', color: 'white' }
                      : { borderColor: priorityStyle.color + '40', color: priorityStyle.color }
                    }
                  >
                    {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold truncate ${isDone ? 'line-through' : ''}`}
                        style={{ color: isDone ? 'var(--text-dim)' : 'var(--text-main)' }}>
                        {task.title}
                      </span>
                      {task.priority === 'urgent' && (
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-black"
                          style={{ background: priorityStyle.bg, color: priorityStyle.color }}>
                          Khẩn cấp
                        </span>
                      )}
                      {task.priority === 'high' && (
                        <span className="shrink-0 text-[10px] px-2 py-0.5 rounded-full font-black"
                          style={{ background: priorityStyle.bg, color: priorityStyle.color }}>
                          Ưu tiên
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 mt-1 text-[11px] flex-wrap" style={{ color: 'var(--text-dim)' }}>
                      {project && (
                        <span className="flex items-center gap-1 font-semibold">
                          <Folder className="w-3 h-3" />
                          <span>{project.name}</span>
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{task.dueDate}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    style={{ color: 'var(--text-dim)' }}
                    title="Xóa công việc"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
