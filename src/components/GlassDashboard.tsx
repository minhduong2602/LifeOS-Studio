import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Image as ImageIcon,
  BookOpen,
  Calendar,
  Layers,
  Database,
  ArrowRight,
  Trash2,
  Flame,
  Palette,
  ExternalLink,
  Smartphone,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskPriority } from '../types';

export const GlassDashboard: React.FC = () => {
  const {
    tasks,
    activeWallpaper,
    setIsWallpaperModalOpen,
    setIsThemeModalOpen,
    setActiveView,
    toggleTaskCompletion,
    addQuickTask,
    deleteTask,
    imageNotes,
    lectures,
    habits,
    habitLogs,
    toggleHabit,
    isOnline,
    syncQueue,
    setIsPlanModalOpen,
  } = useApp();

  const [quickInput, setQuickInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>('medium');

  const todayStr = new Date().toISOString().split('T')[0];
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleAddQuickTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickInput.trim()) return;
    addQuickTask(quickInput.trim(), selectedPriority);
    setQuickInput('');
  };

  const handlePresetClick = (presetTitle: string, priority: TaskPriority = 'medium') => {
    addQuickTask(presetTitle, priority);
  };

  // Primary lecture and image note to display prominently
  const primaryLecture = lectures[0] || {
    id: 'lec-1',
    title: 'My Lectures',
    subject: 'Cognitive Science & Memory Stacks',
    notesCount: 24,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Deep dive into memory consolidation, spaced repetition, and attention retention mechanisms.',
  };

  const primaryImageNote = imageNotes[0] || {
    id: 'img-1',
    title: 'Image Notes',
    caption: 'Misty golden path with mountain travelers & sunset warmth',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    tags: ['Travel', 'Inspiration', 'Photography'],
  };

  // Plan schedule tasks (filtered or top tasks)
  const scheduledTasks = tasks.slice(0, 7);

  return (
    <div
      className="relative min-h-[calc(100vh-3.5rem)] w-full bg-cover bg-center bg-fixed p-4 md:p-8 text-white transition-all duration-500"
      style={{
        backgroundImage: `url(${activeWallpaper})`,
      }}
      id="glass-dashboard-container"
    >
      {/* Dark Vignette & Optical Blur Overlay */}
      <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[3px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl space-y-6">
        {/* Top Floating Glass Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/20 bg-black/45 p-4 sm:px-6 sm:py-4 shadow-2xl backdrop-blur-xl"
          id="glass-header"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                {dateFormatted}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-stone-300">
                <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {isOnline ? 'SQLite Embedded (WAL Active)' : 'Offline Local Storage'}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white drop-shadow-sm">
              Life Operating System
            </h1>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-indigo-400/40 bg-indigo-600/50 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 backdrop-blur-md transition-all hover:bg-indigo-500/60 hover:scale-105 active:scale-95"
              id="glass-copilot-btn"
            >
              <Sparkles className="h-4 w-4 text-indigo-200 animate-pulse" />
              <span>✨ Copilot Plan</span>
            </button>

            <button
              onClick={() => setIsWallpaperModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
              id="change-wallpaper-btn"
            >
              <ImageIcon className="h-4 w-4 text-emerald-300" />
              <span>Backdrop</span>
            </button>

            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
              id="change-theme-btn"
            >
              <Palette className="h-4 w-4 text-sky-300" />
              <span>Palettes</span>
            </button>

            <button
              onClick={() => setActiveView('kanban')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 active:scale-95"
              id="open-kanban-btn"
            >
              <Layers className="h-4 w-4 text-amber-300" />
              <span>Full Board</span>
            </button>
          </div>
        </motion.div>

        {/* 2-Column Grid matching Screenshot Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: My Lectures */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/45 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:shadow-emerald-500/10"
            id="glass-card-lectures"
          >
            {/* Background Cover Image with Soft Gradient */}
            <div className="relative h-48 w-full overflow-hidden bg-stone-900">
              <img
                src={primaryLecture.coverImage}
                alt={primaryLecture.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              
              {/* Badge & Subject */}
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
                  {primaryLecture.title}
                </span>
                <span className="rounded-lg bg-emerald-500/30 px-2 py-1 text-[11px] font-bold text-emerald-200 backdrop-blur-md border border-emerald-500/40">
                  {primaryLecture.notesCount} Notes
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col justify-between flex-1 p-6 space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  {primaryLecture.subject}
                </span>
                <h3 className="mt-1 text-lg font-bold text-white tracking-tight">
                  {primaryLecture.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-stone-300 line-clamp-2">
                  {primaryLecture.summary}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  Last updated: Today in SQLite
                </span>
                <button
                  onClick={() => setActiveView('lectures')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-emerald-600 hover:text-white"
                  id="view-all-lectures-btn"
                >
                  <span>Open Lectures</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Image Notes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-black/45 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/35 hover:shadow-sky-500/10"
            id="glass-card-image-notes"
          >
            {/* Photo Preview Container */}
            <div className="relative h-48 w-full overflow-hidden bg-stone-900">
              <img
                src={primaryImageNote.imageUrl}
                alt={primaryImageNote.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
                  <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
                  {primaryImageNote.title}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col justify-between flex-1 p-6 space-y-4">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {primaryImageNote.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-medium text-stone-300 border border-white/10"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Visual Field Notes
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-stone-300 line-clamp-2">
                  {primaryImageNote.caption}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-stone-400">
                  {imageNotes.length} gallery assets saved
                </span>
                <button
                  onClick={() => setActiveView('image_notes')}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-all hover:bg-sky-600 hover:text-white"
                  id="view-all-image-notes-btn"
                >
                  <span>Explore Gallery</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section: Plan Schedule & Quick Actions + Daily Habits Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 3: Plan Schedule (2 Columns Wide) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 flex flex-col rounded-2xl border border-white/20 bg-black/45 p-6 shadow-2xl backdrop-blur-xl"
            id="glass-card-plan-schedule"
          >
            {/* Header with Title & Quick Counts */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Plan Schedule</h2>
                  <p className="text-xs text-stone-300">Fast 1-tap capture & offline task management</p>
                </div>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-stone-300 border border-white/15">
                {tasks.filter((t) => t.status === 'done').length}/{tasks.length} Completed
              </span>
            </div>

            {/* Quick Add Presets Bar (Screenshot Items: Buy-food, GYM, Invest) */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-amber-400" />
                Quick Options:
              </span>
              <button
                onClick={() => handlePresetClick('Buy-food', 'medium')}
                className="rounded-full bg-white/10 hover:bg-emerald-600/60 px-3 py-1 text-xs font-semibold text-emerald-200 border border-emerald-500/30 transition-all active:scale-95 shadow-sm"
                id="quick-preset-buy-food"
              >
                + Buy-food
              </button>
              <button
                onClick={() => handlePresetClick('GYM', 'high')}
                className="rounded-full bg-white/10 hover:bg-rose-600/60 px-3 py-1 text-xs font-semibold text-rose-200 border border-rose-500/30 transition-all active:scale-95 shadow-sm"
                id="quick-preset-gym"
              >
                + GYM
              </button>
              <button
                onClick={() => handlePresetClick('Invest', 'urgent')}
                className="rounded-full bg-white/10 hover:bg-amber-600/60 px-3 py-1 text-xs font-semibold text-amber-200 border border-amber-500/30 transition-all active:scale-95 shadow-sm"
                id="quick-preset-invest"
              >
                + Invest
              </button>
              <button
                onClick={() => handlePresetClick('Deep Work Session', 'high')}
                className="rounded-full bg-white/10 hover:bg-sky-600/60 px-3 py-1 text-xs font-semibold text-sky-200 border border-sky-500/30 transition-all active:scale-95 shadow-sm"
                id="quick-preset-deep-work"
              >
                + Deep Work
              </button>
            </div>

            {/* Inline Quick Add Input */}
            <form onSubmit={handleAddQuickTask} className="mt-4 flex gap-2">
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Quick add plan (e.g., Buy-food, GYM, Invest)..."
                className="flex-1 rounded-xl border border-white/20 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-stone-400 shadow-inner backdrop-blur-md focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                id="glass-quick-add-input"
              />
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as TaskPriority)}
                className="rounded-xl border border-white/20 bg-black/40 px-3 py-2.5 text-xs text-white focus:border-emerald-400 focus:outline-none"
                id="glass-quick-add-priority"
              >
                <option value="low" className="bg-stone-900 text-stone-200">Low</option>
                <option value="medium" className="bg-stone-900 text-stone-200">Medium</option>
                <option value="high" className="bg-stone-900 text-stone-200">High</option>
                <option value="urgent" className="bg-stone-900 text-stone-200">Urgent</option>
              </select>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 active:scale-95"
                id="glass-quick-add-submit"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </form>

            {/* Task Item Rows (Capsule style matching screenshot) */}
            <div className="mt-5 space-y-2.5 flex-1 overflow-y-auto max-h-80 pr-1">
              {scheduledTasks.map((t) => {
                const isCompleted = t.status === 'done';
                return (
                  <motion.div
                    key={t.id}
                    layout
                    className={`group flex items-center justify-between rounded-xl border p-3.5 transition-all ${
                      isCompleted
                        ? 'border-white/10 bg-white/5 opacity-65'
                        : 'border-white/20 bg-black/35 hover:border-white/40 hover:bg-black/50'
                    }`}
                    id={`task-row-${t.id}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Check Capsule Button */}
                      <button
                        onClick={() => toggleTaskCompletion(t.id)}
                        className="flex-shrink-0 text-stone-400 transition-colors hover:text-emerald-400"
                        id={`toggle-task-${t.id}`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="h-5 w-5 hover:border-emerald-400" />
                        )}
                      </button>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium tracking-tight truncate ${
                            isCompleted ? 'text-stone-400 line-through' : 'text-white'
                          }`}
                        >
                          {t.title}
                        </p>
                        {t.description && (
                          <p className="text-[11px] text-stone-400 line-clamp-1 truncate">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Priority Badge */}
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                          t.priority === 'urgent'
                            ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                            : t.priority === 'high'
                            ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                            : 'bg-stone-500/30 text-stone-300 border border-stone-500/40'
                        }`}
                      >
                        {t.priority}
                      </span>

                      {/* Delete button */}
                      <button
                        onClick={() => deleteTask(t.id)}
                        className="opacity-0 group-hover:opacity-100 rounded-lg p-1 text-stone-400 transition-all hover:bg-rose-500/20 hover:text-rose-300"
                        id={`delete-task-${t.id}`}
                        title="Delete task"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Card 4: Daily Habits & Offline Engine Status */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col justify-between rounded-2xl border border-white/20 bg-black/45 p-6 shadow-2xl backdrop-blur-xl space-y-6"
            id="glass-card-habits"
          >
            {/* Habit Tracker Section */}
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Daily Micro-Habits</h3>
                </div>
                <span className="text-[11px] text-stone-400">1-Tap Log</span>
              </div>

              <div className="mt-3 space-y-2">
                {habits.slice(0, 4).map((h) => {
                  const log = habitLogs.find((l) => l.habitId === h.id && l.date === todayStr);
                  const isDone = !!log?.completed;

                  return (
                    <button
                      key={h.id}
                      onClick={() => toggleHabit(h.id, todayStr)}
                      className={`w-full flex items-center justify-between rounded-xl border p-2.5 text-left transition-all ${
                        isDone
                          ? 'border-emerald-500/40 bg-emerald-950/30'
                          : 'border-white/15 bg-black/30 hover:border-white/30'
                      }`}
                      id={`habit-pill-${h.id}`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-sm">{h.icon}</span>
                        <span className={`text-xs font-medium truncate ${isDone ? 'text-emerald-200 font-semibold' : 'text-stone-200'}`}>
                          {h.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[10px] text-amber-300 font-bold">🔥 {h.streak}d</span>
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-stone-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Local Engine & APK Packaging Info */}
            <div className="rounded-xl border border-white/15 bg-white/5 p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5 text-emerald-400" />
                  SQLite Storage Engine
                </span>
                <span className="text-[10px] text-emerald-300 font-mono">0ms Latency</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-snug">
                Data persists locally with zero network dependency. Sync queue: {syncQueue.length} pending ops.
              </p>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => setActiveView('sqlite_console')}
                  className="flex-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-white/20 text-center"
                  id="open-sqlite-console-btn"
                >
                  SQL Console
                </button>
                <button
                  onClick={() => setActiveView('android_build')}
                  className="flex-1 rounded-lg bg-emerald-600/80 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-emerald-500 text-center flex items-center justify-center gap-1"
                  id="open-apk-builder-btn"
                >
                  <Smartphone className="h-3 w-3" />
                  APK Info
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
