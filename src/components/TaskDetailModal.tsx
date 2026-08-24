import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Calendar, 
  Clock, 
  Folder, 
  Tag, 
  CheckSquare, 
  AlertCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, TaskPriority, TaskStatus, Subtask } from '../types';

export const TaskDetailModal: React.FC = () => {
  const {
    tasks,
    projects,
    selectedTaskId,
    setSelectedTaskId,
    updateTask,
    deleteTask,
    triggerCelebration,
  } = useApp();

  const task = tasks.find((t) => t.id === selectedTaskId);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newTagInput, setNewTagInput] = useState('');

  if (!task) return null;

  const project = projects.find((p) => p.id === task.projectId);

  const handleToggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    updateTask(task.id, { subtasks: updatedSubtasks });
    
    // Check if all subtasks are completed
    if (updatedSubtasks.every((st) => st.completed)) {
      triggerCelebration();
    }
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: 'st-' + Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };

    updateTask(task.id, {
      subtasks: [...(task.subtasks || []), newSubtask],
    });
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    updateTask(task.id, {
      subtasks: task.subtasks.filter((st) => st.id !== subtaskId),
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const clean = newTagInput.trim();
      if (!task.tags?.includes(clean)) {
        updateTask(task.id, { tags: [...(task.tags || []), clean] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateTask(task.id, {
      tags: task.tags.filter((t) => t !== tagToRemove),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-stone-900/40 backdrop-blur-xs">
      <div
        className="w-full max-w-xl h-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header Controls */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (task.status === 'done') {
                  updateTask(task.id, { status: 'todo' });
                } else {
                  updateTask(task.id, { status: 'done' });
                  triggerCelebration();
                }
              }}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer"
            >
              {task.status === 'done' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Đã hoàn thành</span>
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 text-stone-400" />
                  <span className="text-stone-700 dark:text-stone-300">Đánh dấu hoàn thành</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (confirm(`Xóa nhiệm vụ "${task.title}"?`)) {
                  deleteTask(task.id);
                }
              }}
              className="p-1.5 text-stone-400 hover:text-rose-500 rounded-md cursor-pointer"
              title="Xóa nhiệm vụ"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedTaskId(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Editable Title */}
          <div>
            <textarea
              rows={2}
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              placeholder="Tiêu đề nhiệm vụ..."
              className="w-full text-xl font-bold text-stone-900 dark:text-stone-100 bg-transparent border-none focus:outline-hidden resize-none placeholder:text-stone-400"
            />
          </div>

          {/* Properties Table (Notion Property Style) */}
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-xl p-4 border border-stone-200 dark:border-stone-700 space-y-3 text-xs">
            {/* Status Row */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-stone-500 flex items-center space-x-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Trạng thái</span>
              </span>
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2.5 py-1 font-medium text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="backlog">📥 Chưa phân loại (Backlog)</option>
                <option value="todo">🎯 Cần làm (To Do)</option>
                <option value="in_progress">⚡ Đang làm (In Progress)</option>
                <option value="in_review">🔍 Đang kiểm tra (In Review)</option>
                <option value="done">✅ Đã xong (Done)</option>
              </select>
            </div>

            {/* Priority Row */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-stone-500 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Mức độ ưu tiên</span>
              </span>
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2.5 py-1 font-medium text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="urgent">🔴 Khẩn cấp</option>
                <option value="high">🟠 Cao</option>
                <option value="medium">🟡 Trung bình</option>
                <option value="low">🟢 Thấp</option>
              </select>
            </div>

            {/* Project Row */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-stone-500 flex items-center space-x-1.5">
                <Folder className="w-3.5 h-3.5" />
                <span>Thuộc dự án</span>
              </span>
              <select
                value={task.projectId || ''}
                onChange={(e) => updateTask(task.id, { projectId: e.target.value || undefined })}
                className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2.5 py-1 text-stone-800 dark:text-stone-200 cursor-pointer"
              >
                <option value="">(Không thuộc dự án)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Row */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-stone-500 flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Hạn chót</span>
              </span>
              <input
                type="date"
                value={task.dueDate || ''}
                onChange={(e) => updateTask(task.id, { dueDate: e.target.value || undefined })}
                className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2.5 py-1 text-stone-800 dark:text-stone-200"
              />
            </div>

            {/* Estimate Minutes */}
            <div className="grid grid-cols-3 items-center">
              <span className="text-stone-500 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Thời gian (phút)</span>
              </span>
              <input
                type="number"
                min={0}
                step={5}
                value={task.estimatedMinutes || ''}
                onChange={(e) => updateTask(task.id, { estimatedMinutes: parseInt(e.target.value, 10) || undefined })}
                className="col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-md px-2.5 py-1 text-stone-800 dark:text-stone-200"
              />
            </div>
          </div>

          {/* Tags list & Adder */}
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Nhãn & Thẻ phân loại</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {task.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-md text-xs flex items-center space-x-1 border border-stone-200 dark:border-stone-700"
                >
                  <span>{tag}</span>
                  <button onClick={() => handleRemoveTag(tag)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                    ×
                  </button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Thêm nhãn (nhấn Enter)"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                className="bg-transparent text-xs text-stone-700 dark:text-stone-300 placeholder:text-stone-400 px-2 py-1 border border-dashed border-stone-300 dark:border-stone-700 rounded-md focus:outline-hidden"
              />
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center space-x-1.5">
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Nhiệm vụ con & Mục tiêu</span>
              </div>
              <span className="text-xs text-stone-400">
                {task.subtasks?.filter((st) => st.completed).length || 0} / {task.subtasks?.length || 0}
              </span>
            </div>

            {/* Subtasks list */}
            <div className="space-y-1.5 mb-2">
              {task.subtasks?.map((st) => (
                <div
                  key={st.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800/50 group"
                >
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                    />
                    <span className={`text-xs text-stone-800 dark:text-stone-200 ${st.completed ? 'line-through text-stone-400' : ''}`}>
                      {st.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Thêm nhiệm vụ con..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden"
              />
              <button
                type="submit"
                className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 text-xs px-3 py-1.5 rounded-md font-bold cursor-pointer"
              >
                Thêm
              </button>
            </form>
          </div>

          {/* Long Description / Notes */}
          <div>
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Ghi chú & Mô tả chi tiết</span>
            </div>
            <textarea
              rows={6}
              value={task.description || ''}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              placeholder="Viết yêu cầu chi tiết, tiêu chí hoàn thành hoặc ghi chú nhanh..."
              className="w-full bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 rounded-lg p-3 text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-hidden resize-y"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
