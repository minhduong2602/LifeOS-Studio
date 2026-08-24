import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  Plus, 
  Check, 
  Trash2, 
  Trophy, 
  Calendar,
  Smile,
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Habit } from '../types';

export const HabitTracker: React.FC = () => {
  const {
    habits,
    habitLogs,
    toggleHabit,
    addHabit,
    deleteHabit,
    triggerCelebration,
  } = useApp();

  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('✨');
  const [newCategory, setNewCategory] = useState<Habit['category']>('productivity');
  const [newTargetDays, setNewTargetDays] = useState(7);

  // Generate the last 7 dates
  const today = new Date(2026, 7, 23); // Aug 23, 2026
  const weekDates: { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    weekDates.push({ dateStr, dayName, dayNum, isToday: i === 0 });
  }

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      icon: newIcon,
      color: 'indigo',
      frequency: 'daily',
      targetDaysPerWeek: newTargetDays,
      category: newCategory,
    });
    setNewTitle('');
    setIsAddingHabit(false);
    triggerCelebration();
  };

  const isHabitCompletedOnDate = (habitId: string, dateStr: string) => {
    const log = habitLogs.find((l) => l.habitId === habitId && l.date === dateStr);
    return !!log?.completed;
  };

  const calculateWeekCompletion = (habitId: string) => {
    let count = 0;
    weekDates.forEach((w) => {
      if (isHabitCompletedOnDate(habitId, w.dateStr)) count++;
    });
    return Math.round((count / 7) * 100);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto bg-stone-50/50 dark:bg-stone-950 space-y-6">
      {/* Header Summary */}
      <div className="bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-rose-500/10 border border-indigo-200 dark:border-indigo-900/60 rounded-xl p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Habit Mastery & Streak Matrix</span>
          </div>
          <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100">
            Compound 1% Daily Improvements
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
            Click on each day pill to record completions. Stored in local SQLite storage.
          </p>
        </div>

        <button
          onClick={() => setIsAddingHabit(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Add Habit Modal / Inline */}
      {isAddingHabit && (
        <form
          onSubmit={handleCreateHabit}
          className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-xs space-y-3"
        >
          <div className="text-xs font-bold text-stone-800 dark:text-stone-200">Create New Daily Habit</div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="w-12 text-center text-lg bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded py-1"
                title="Habit Emoji"
              />
              <input
                type="text"
                placeholder="Habit title (e.g. Read 20 pages)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1.5 text-xs text-stone-900 dark:text-stone-100"
                autoFocus
              />
            </div>

            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1.5 text-xs text-stone-900 dark:text-stone-100"
            >
              <option value="health">💧 Health & Wellness</option>
              <option value="productivity">🧠 Productivity</option>
              <option value="fitness">🏋️ Fitness</option>
              <option value="learning">📖 Learning</option>
              <option value="mindfulness">🧘 Mindfulness</option>
            </select>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-stone-500">Target:</span>
              <input
                type="number"
                min={1}
                max={7}
                value={newTargetDays}
                onChange={(e) => setNewTargetDays(parseInt(e.target.value, 10))}
                className="w-16 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-1.5 text-xs text-stone-900 dark:text-stone-100"
              />
              <span className="text-xs text-stone-500">days/wk</span>
            </div>

            <div className="flex items-center space-x-2 justify-end">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-1.5 rounded"
              >
                Save Habit
              </button>
              <button
                type="button"
                onClick={() => setIsAddingHabit(false)}
                className="text-xs text-stone-500 hover:text-stone-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Habit Matrix Table View */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 font-semibold">
                <th className="py-3 px-4 min-w-[220px]">Habit Routine</th>
                <th className="py-3 px-3 text-center">Streak</th>
                {weekDates.map((w) => (
                  <th
                    key={w.dateStr}
                    className={`py-3 px-2 text-center w-12 ${
                      w.isToday ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
                    }`}
                  >
                    <div>{w.dayName}</div>
                    <div className="text-[10px] font-normal">{w.dayNum}</div>
                  </th>
                ))}
                <th className="py-3 px-3 text-center min-w-[90px]">7-Day Rate</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {habits.map((habit) => {
                const completionRate = calculateWeekCompletion(habit.id);
                return (
                  <tr
                    key={habit.id}
                    className="hover:bg-stone-50/70 dark:hover:bg-stone-800/40 transition-colors group"
                  >
                    {/* Habit Title & Icon */}
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2.5">
                        <span className="text-lg">{habit.icon}</span>
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-stone-100">
                            {habit.title}
                          </div>
                          <div className="text-[10px] text-stone-400 capitalize">
                            {habit.category} • {habit.targetDaysPerWeek}x / week
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Streak Badge */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-300 font-bold text-xs border border-orange-200 dark:border-orange-900">
                        <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                        <span>{habit.streak}d</span>
                      </span>
                    </td>

                    {/* Week Check Days */}
                    {weekDates.map((w) => {
                      const completed = isHabitCompletedOnDate(habit.id, w.dateStr);
                      return (
                        <td key={w.dateStr} className="py-3 px-2 text-center">
                          <button
                            onClick={() => toggleHabit(habit.id, w.dateStr)}
                            className={`w-7 h-7 mx-auto rounded-lg flex items-center justify-center transition-all ${
                              completed
                                ? 'bg-emerald-500 text-white shadow-2xs scale-105'
                                : 'bg-stone-100 dark:bg-stone-800 text-stone-300 dark:text-stone-600 hover:bg-stone-200 dark:hover:bg-stone-700'
                            } ${w.isToday && !completed ? 'ring-1 ring-indigo-400' : ''}`}
                            title={`Toggle for ${w.dayName} (${w.dateStr})`}
                          >
                            {completed && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>
                        </td>
                      );
                    })}

                    {/* Progress Bar Rate */}
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-stone-100 dark:bg-stone-800 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              completionRate >= 80 ? 'bg-emerald-500' : completionRate >= 50 ? 'bg-indigo-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-stone-500">{completionRate}%</span>
                      </div>
                    </td>

                    {/* Delete action */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${habit.title}"?`)) deleteHabit(habit.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 transition-opacity"
                        title="Delete habit"
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
