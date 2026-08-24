import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task } from '../types';

export const CalendarView: React.FC = () => {
  const { tasks, setSelectedTaskId, setIsQuickCaptureOpen, updateTask, triggerCelebration } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 7, 23)); // August 2026

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const gotoToday = () => setCurrentDate(new Date(2026, 7, 23));

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  const getTasksForDay = (day: number): Task[] => {
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((t) => t.dueDate === formatted);
  };

  const handleToggleDone = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (task.status === 'done') {
      updateTask(task.id, { status: 'todo' });
    } else {
      updateTask(task.id, { status: 'done' });
      triggerCelebration();
    }
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto bg-stone-50/50 dark:bg-stone-950">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4 bg-white dark:bg-stone-900 p-3 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
        <div className="flex items-center space-x-3">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            {monthName} {year}
          </h2>
          <button
            onClick={gotoToday}
            className="px-2 py-1 text-xs font-medium rounded-md border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextMonth}
            className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-stone-500 mb-1">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 flex-1 auto-rows-fr">
        {blanksArray.map((_, i) => (
          <div key={`blank-${i}`} className="min-h-[100px] p-2 bg-stone-100/40 dark:bg-stone-900/30 rounded-lg border border-dashed border-stone-200 dark:border-stone-800/60" />
        ))}

        {daysArray.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isToday = day === 23 && month === 7 && year === 2026;

          return (
            <div
              key={`day-${day}`}
              className={`min-h-[100px] p-1.5 bg-white dark:bg-stone-900 rounded-lg border flex flex-col transition-colors ${
                isToday
                  ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/20 ring-1 ring-indigo-500'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${
                    isToday
                      ? 'bg-indigo-600 text-white'
                      : 'text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {day}
                </span>

                <button
                  onClick={() => setIsQuickCaptureOpen(true)}
                  className="text-stone-400 hover:text-stone-600 p-0.5"
                  title="Add task on this day"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Task Chips */}
              <div className="flex-1 space-y-1 overflow-y-auto max-h-24">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTaskId(t.id)}
                    className="flex items-center space-x-1 p-1 rounded bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-700/60 transition-colors group"
                  >
                    <button
                      onClick={(e) => handleToggleDone(e, t)}
                      className="shrink-0 text-stone-400 hover:text-emerald-500"
                    >
                      {t.status === 'done' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </button>
                    <span className={`truncate ${t.status === 'done' ? 'line-through text-stone-400' : 'text-stone-800 dark:text-stone-200'}`}>
                      {t.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
