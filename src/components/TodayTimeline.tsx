import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle } from 'lucide-react';

export const TodayTimeline: React.FC = () => {
  const { tasks, toggleTaskCompletion } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getWeekDays = (baseDate: Date) => {
    const days = [];
    const currentDay = baseDate.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1; // 0 is Sunday
    
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - distanceToMonday);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(selectedDate);
  const selectedDateStr = selectedDate.toLocaleDateString('sv-SE'); // YYYY-MM-DD local

  const headerDateStr = selectedDate.toLocaleDateString('en-US', { 
    weekday: 'long', 
    day: 'numeric',
    month: 'long'
  });

  const displayTasks = tasks.filter(t => t.dueDate === selectedDateStr);
  
  // Sort by time
  const sortedTasks = [...displayTasks].sort((a, b) => {
    if (!a.dueTime) return 1;
    if (!b.dueTime) return -1;
    return a.dueTime.localeCompare(b.dueTime);
  });

  // Calculate current task
  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  
  let currentTaskIndex = -1;
  if (isToday(selectedDate)) {
    for (let i = 0; i < sortedTasks.length; i++) {
      const t = sortedTasks[i];
      if (t.dueTime) {
        const [h, m] = t.dueTime.split(':').map(Number);
        const startMins = h * 60 + m;
        const duration = t.estimatedMinutes || 60; // default 60 mins if not set
        const endMins = startMins + duration;

        if (currentMinutes >= startMins && currentMinutes <= endMins) {
          currentTaskIndex = i;
          break;
        }
      }
    }
  }

  // Format time AM/PM
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="flex-1 max-w-md mx-auto w-full p-6 pt-10 pb-32 bg-white dark:bg-stone-950 min-h-screen">
      <div className="mb-8 pl-2">
        <p className="text-stone-500 dark:text-stone-400 font-medium text-sm mb-1">
          {headerDateStr}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-stone-900 dark:text-white leading-none">
          {isToday(selectedDate) ? 'Today' : selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
        </h1>
      </div>

      {/* Week Calendar Swipe */}
      <div className="flex justify-between items-center mb-10 overflow-x-auto hide-scrollbar gap-2 pb-2 px-2">
        {weekDays.map((day, i) => {
          const isSelected = day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth();
          const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
          const dayNum = day.getDate();
          
          return (
            <button 
              key={i}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center justify-center min-w-[44px] shrink-0 gap-2 transition-colors focus:outline-none"
            >
              <span className={`text-[13px] font-semibold ${isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-stone-400 dark:text-stone-500'}`}>
                {dayName}
              </span>
              <span className={`text-lg font-bold w-9 h-9 flex items-center justify-center rounded-full ${isSelected ? 'text-blue-500 dark:text-blue-400' : 'text-stone-800 dark:text-stone-200'}`}>
                {dayNum}
              </span>
              <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-500 dark:bg-blue-400' : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative pl-1">
        {/* Continuous Vertical Line */}
        <div className="absolute left-[20px] top-4 bottom-4 w-px bg-stone-200 dark:bg-stone-800"></div>

        <div className="space-y-5 relative">
          {sortedTasks.length === 0 ? (
            <div className="pl-12 text-stone-400 text-sm py-10 font-medium">
              No schedule for this day.
            </div>
          ) : (
            sortedTasks.map((task, index) => {
              const isDone = task.status === 'done';
              const isActive = index === currentTaskIndex;
              
              const startTimeDisplay = formatTime(task.dueTime) || 'Anytime';
              let subtitle = '';
              
              if (task.description) {
                subtitle = task.description;
              } else {
                const parts = [];
                if (task.project || task.projectId) parts.push(task.project || task.projectId);
                if (task.estimatedMinutes) parts.push(`${task.estimatedMinutes} min`);
                subtitle = parts.join(' · ');
              }

              return (
                <div key={task.id} className="relative flex items-start gap-5 group">
                  {/* Timeline Node */}
                  <div className="w-10 shrink-0 flex justify-center mt-3 relative z-10">
                    <div className={`w-3.5 h-3.5 rounded-full border-[3px] bg-white dark:bg-stone-950 ${
                      isActive 
                        ? 'border-blue-500 dark:border-blue-400 ring-[4px] ring-blue-100 dark:ring-blue-900/30' 
                        : 'border-stone-300 dark:border-stone-700'
                    }`} />
                  </div>
                  
                  {/* Card */}
                  <button 
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`flex-1 rounded-[20px] p-4 text-left transition-all active:scale-[0.98] ${
                      isActive 
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-stone-50 dark:bg-stone-900 border border-stone-100 dark:border-stone-800 hover:border-stone-200 dark:hover:border-stone-700'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h3 className={`text-[15px] font-semibold tracking-tight ${
                        isActive ? 'text-white' : 'text-stone-900 dark:text-stone-100'
                      } ${isDone && !isActive ? 'line-through text-stone-400 dark:text-stone-600' : ''}`}>
                        {task.title}
                      </h3>
                      <span className={`text-[13px] font-semibold whitespace-nowrap pt-0.5 ${
                        isActive ? 'text-blue-100' : 'text-stone-400 dark:text-stone-500'
                      }`}>
                        {startTimeDisplay}
                      </span>
                    </div>
                    
                    {subtitle && (
                      <p className={`text-[13px] mt-1.5 font-medium leading-relaxed ${
                        isActive ? 'text-blue-100' : 'text-stone-500 dark:text-stone-400'
                      }`}>
                        {subtitle}
                      </p>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
