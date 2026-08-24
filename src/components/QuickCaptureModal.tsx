import React, { useState } from 'react';
import { 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  Tag, 
  Folder, 
  CheckCircle2,
  Sparkles,
  CheckSquare,
  Image as ImageIcon,
  GraduationCap,
  Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskPriority, TaskStatus } from '../types';

export const QuickCaptureModal: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    projects,
    addTask,
    addImageNote,
    addLecture,
    addHabit,
    triggerCelebration,
  } = useApp();

  const [captureType, setCaptureType] = useState<'task' | 'image' | 'lecture' | 'habit'>('task');

  // Task form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [projectId, setProjectId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [tagsInput, setTagsInput] = useState<string>('QuickPlan');

  // Image Note form
  const [imgTitle, setImgTitle] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imgCaption, setImgCaption] = useState('');

  // Lecture form
  const [lecTitle, setLecTitle] = useState('');
  const [lecSubject, setLecSubject] = useState('Cognitive Science');
  const [lecNotesCount, setLecNotesCount] = useState(12);

  // Habit form
  const [habitTitle, setHabitTitle] = useState('');
  const [habitIcon, setHabitIcon] = useState('⚡');

  if (!isQuickCaptureOpen) return null;

  const quickPresets = [
    { label: 'Buy-food', priority: 'medium' as TaskPriority },
    { label: 'GYM', priority: 'high' as TaskPriority },
    { label: 'Invest', priority: 'urgent' as TaskPriority },
    { label: 'Deep Work', priority: 'high' as TaskPriority },
    { label: 'Read 20p', priority: 'low' as TaskPriority },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (captureType === 'task') {
      if (!title.trim()) return;
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      addTask({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        projectId: projectId || undefined,
        dueDate: dueDate || undefined,
        tags,
        subtasks: [],
        order: 0,
      });
    } else if (captureType === 'image') {
      if (!imgTitle.trim() || !imgUrl.trim()) return;
      addImageNote({
        title: imgTitle.trim(),
        caption: imgCaption.trim() || 'Visual capture note',
        imageUrl: imgUrl.trim(),
        tags: ['QuickCapture', 'Visual'],
        isFavorite: false,
      });
    } else if (captureType === 'lecture') {
      if (!lecTitle.trim()) return;
      addLecture({
        title: lecTitle.trim(),
        subject: lecSubject.trim(),
        notesCount: lecNotesCount,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
        summary: 'Study stack notes added via quick capture.',
        isFavorite: false,
      });
    } else if (captureType === 'habit') {
      if (!habitTitle.trim()) return;
      addHabit({
        title: habitTitle.trim(),
        icon: habitIcon || '⚡',
        frequency: 'daily',
        targetDaysPerWeek: 7,
      });
    }

    triggerCelebration();
    setTitle('');
    setDescription('');
    setImgTitle('');
    setImgUrl('');
    setLecTitle('');
    setHabitTitle('');
    setIsQuickCaptureOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        id="quick-capture-dialog"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Quick Add & Capture
            </h3>
          </div>
          <button
            onClick={() => setIsQuickCaptureOpen(false)}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
            id="close-quick-capture-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Type Selector Tabs */}
        <div className="grid grid-cols-4 border-b border-stone-200 dark:border-stone-800 text-xs">
          <button
            onClick={() => setCaptureType('task')}
            className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors ${
              captureType === 'task'
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Task</span>
          </button>
          <button
            onClick={() => setCaptureType('image')}
            className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors ${
              captureType === 'image'
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Image Note</span>
          </button>
          <button
            onClick={() => setCaptureType('lecture')}
            className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors ${
              captureType === 'lecture'
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            <span>Lecture</span>
          </button>
          <button
            onClick={() => setCaptureType('habit')}
            className={`py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors ${
              captureType === 'habit'
                ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Habit</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {captureType === 'task' && (
            <>
              {/* Quick Options Presets */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 self-center">
                  Presets:
                </span>
                {quickPresets.map((qp) => (
                  <button
                    key={qp.label}
                    type="button"
                    onClick={() => {
                      setTitle(qp.label);
                      setPriority(qp.priority);
                    }}
                    className="rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-stone-800 dark:hover:bg-stone-700 px-2.5 py-1 text-xs text-stone-700 dark:text-stone-300 transition-colors"
                  >
                    + {qp.label}
                  </button>
                ))}
              </div>

              {/* Title Input */}
              <div>
                <input
                  type="text"
                  autoFocus
                  placeholder="What needs to get done? (e.g. Buy-food, GYM, Invest)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm font-semibold text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
                  id="quick-task-title-input"
                />
              </div>

              {/* Description */}
              <div>
                <textarea
                  rows={2}
                  placeholder="Optional context, notes, or details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs text-stone-800 dark:text-stone-200 bg-stone-50 dark:bg-stone-800/60 p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden resize-none"
                />
              </div>

              {/* Property Selectors Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200"
                  >
                    <option value="todo">🎯 To Do</option>
                    <option value="in_progress">⚡ In Progress</option>
                    <option value="done">✅ Done</option>
                    <option value="backlog">📥 Backlog</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200"
                  >
                    <option value="urgent">🔴 Urgent</option>
                    <option value="high">🟠 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg p-2 text-xs text-stone-800 dark:text-stone-200"
                  />
                </div>
              </div>
            </>
          )}

          {captureType === 'image' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Image Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Visual Note / Reference"
                  value={imgTitle}
                  onChange={(e) => setImgTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Caption
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes about this visual item..."
                  value={imgCaption}
                  onChange={(e) => setImgCaption(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {captureType === 'lecture' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Lecture Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. System Architecture & Latency"
                  value={lecTitle}
                  onChange={(e) => setLecTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={lecSubject}
                    onChange={(e) => setLecSubject(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Notes Count
                  </label>
                  <input
                    type="number"
                    value={lecNotesCount}
                    onChange={(e) => setLecNotesCount(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {captureType === 'habit' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Habit Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10,000 Steps, Meditation"
                  value={habitTitle}
                  onChange={(e) => setHabitTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-xs text-stone-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Emoji Icon
                </label>
                <input
                  type="text"
                  value={habitIcon}
                  onChange={(e) => setHabitIcon(e.target.value)}
                  className="mt-1 w-20 text-center rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 p-2 text-base"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span className="text-[11px] text-stone-400">
              Persisted instantly in SQLite
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsQuickCaptureOpen(false)}
                className="px-3 py-1.5 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5"
                id="save-quick-capture-btn"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save to Life OS</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

