import React, { useState, useEffect, useMemo } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  Legend 
} from 'recharts';
import { 
  Clock, 
  CheckCircle2, 
  Circle, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Flame, 
  Target, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TimeBlock, Task } from '../types';

export const DailyAgenda: React.FC = () => {
  const {
    tasks,
    timeBlocks,
    toggleTimeBlock,
    addTimeBlock,
    deleteTimeBlock,
    triggerCelebration,
    updateTask,
    projects,
  } = useApp();

  // Pomodoro timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimerMode, setActiveTimerMode] = useState<'focus' | 'break'>('focus');

  // New timeblock modal/inline state
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState('14:00 - 15:00');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<TimeBlock['category']>('deep_work');

  // Daily Scratchpad state
  const [scratchpad, setScratchpad] = useState(() => {
    return localStorage.getItem('notionlife_daily_scratchpad') || '• Key priority for today: Ship Tauri Android offline sync\n• Reminder: Drink 2L water & take evening walk';
  });

  // Task Category Breakdown for Time Spent
  const categoryData = useMemo(() => {
    // Look at tasks that have estimated or actual minutes (actual is preferred, but fallback to estimated)
    const validTasks = tasks.filter(t => t.actualMinutes || t.estimatedMinutes);
    const categoryTime: Record<string, number> = {};
    
    validTasks.forEach(task => {
      // Prioritize actual time spent. Otherwise fallback to estimated time.
      const time = task.actualMinutes || task.estimatedMinutes || 0;
      if (time <= 0) return;
      
      let catName = 'Uncategorized';
      if (task.projectId) {
        const proj = projects.find(p => p.id === task.projectId);
        if (proj) catName = proj.name;
      } else if (task.tags && task.tags.length > 0) {
        catName = task.tags[0];
      }
      
      categoryTime[catName] = (categoryTime[catName] || 0) + time;
    });

    return Object.entries(categoryTime)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [tasks, projects]);

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b', '#06b6d4', '#d946ef'];

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerCelebration();
      if (activeTimerMode === 'focus') {
        alert('🎉 Focus session completed! Time for a 5-minute break.');
        setActiveTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        alert('☕ Break finished! Ready to focus?');
        setActiveTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, activeTimerMode, triggerCelebration]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTimeBlock({
      timeSlot: newTimeSlot,
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
    });
    setNewTitle('');
    setIsAddingBlock(false);
  };

  const handleScratchpadChange = (val: string) => {
    setScratchpad(val);
    localStorage.setItem('notionlife_daily_scratchpad', val);
  };

  // Find top frog task (first urgent or high priority todo task)
  const frogTask = tasks.find((t) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'done');

  const getCategoryColor = (cat: TimeBlock['category']) => {
    switch (cat) {
      case 'deep_work':
        return 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'meeting':
        return 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'break':
        return 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'admin':
        return 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700';
      case 'personal':
        return 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  const generateSmartSchedule = () => {
    if (timeBlocks.length === 0) {
      return [
        { label: '🧠 Deep Work', time: '08:30 – 11:00', type: 'deep_work' },
        { label: '📋 Admin', time: '13:30 – 14:30', type: 'admin' },
        { label: '🏋️ Exercise', time: '18:00 – 19:00', type: 'personal' },
        { label: '🔋 Low-energy tasks', time: '19:30 – 20:30', type: 'break' }
      ];
    }

    const categories: Record<string, { start: string; end: string }> = {};
    timeBlocks.forEach(tb => {
      const parts = tb.timeSlot.split('-');
      if (parts.length === 2) {
        const start = parts[0].trim();
        const end = parts[1].trim();
        
        if (!categories[tb.category]) {
          categories[tb.category] = { start, end };
        } else {
          if (start < categories[tb.category].start) categories[tb.category].start = start;
          if (end > categories[tb.category].end) categories[tb.category].end = end;
        }
      }
    });

    const formatCat = (cat: string) => {
      switch(cat) {
        case 'deep_work': return '🧠 Deep Work';
        case 'admin': return '📋 Admin';
        case 'meeting': return '👥 Meeting';
        case 'personal': return '🌿 Personal / Exercise';
        case 'break': return '🔋 Low-energy tasks';
        default: return cat;
      }
    };

    const schedule = Object.entries(categories).map(([cat, data]) => ({
      label: formatCat(cat),
      time: `${data.start} – ${data.end}`,
      startVal: data.start,
      type: cat
    }));
    
    schedule.sort((a, b) => a.startVal.localeCompare(b.startVal));
    
    return schedule.map(s => ({ label: s.label, time: s.time, type: s.type }));
  };

  const smartSchedule = generateSmartSchedule();
  
  // Find highest energy phase for Frog card banner
  const deepWorkBlock = smartSchedule.find(s => s.type === 'deep_work');
  const frogEnergyPhase = deepWorkBlock ? `Peak Focus Phase: ${deepWorkBlock.time}` : 'Adaptive Energy Phase Active';

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto bg-stone-50/50 dark:bg-stone-950 space-y-6">
      {/* Top Banner: Eat That Frog, Smart Schedule & Focus Sprint Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Eat That Frog Card */}
        <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200 dark:border-amber-900/60 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider mb-1">
              <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Today's #1 Focus Target (Eat That Frog)</span>
            </div>

            {frogTask ? (
              <div className="mt-2 flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                    {frogTask.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 line-clamp-2">
                    {frogTask.description || 'Conquer this priority first before checking non-essential notifications.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                🎉 All top priority tasks for today are completed! Great job.
              </div>
            )}
          </div>
          
          <div className="mt-3">
             {frogTask && (
                <button
                  onClick={() => {
                    updateTask(frogTask.id, { status: 'done' });
                    triggerCelebration();
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs flex items-center space-x-1 mb-3 w-max"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Done</span>
                </button>
             )}
            <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center justify-between text-[11px] text-amber-700 dark:text-amber-400 gap-2">
              <span>{frogEnergyPhase}</span>
              <span>Zero Distraction Rule</span>
            </div>
          </div>
        </div>

        {/* AI Smart Schedule Insight */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI Smart Schedule</span>
              </div>
            </div>
            
            <div className="space-y-2.5">
              {smartSchedule.slice(0, 4).map(s => (
                <div key={s.label} className="flex justify-between items-center text-xs">
                  <span className="font-medium text-stone-700 dark:text-stone-300">{s.label}</span>
                  <span className="text-stone-500 dark:text-stone-400 font-mono tracking-tight">{s.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-stone-100 dark:border-stone-800 text-[10px] text-stone-400">
            Adapted from your behavior & energy patterns
          </div>
        </div>

        {/* Pomodoro Sprint Timer */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 flex flex-col items-center justify-center shadow-2xs">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
            {activeTimerMode === 'focus' ? '🧠 Deep Focus Sprint' : '☕ Recovery Break'}
          </div>

          <div className="text-3xl font-mono font-black text-stone-900 dark:text-stone-100 my-1">
            {formatTimer(timerSeconds)}
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2 rounded-full text-white shadow-xs transition-transform active:scale-95 ${
                isTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(activeTimerMode === 'focus' ? 25 * 60 : 5 * 60);
              }}
              className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Section: Timeblocked Schedule & Scratchpad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeblocks Schedule (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Time-Blocked Schedule
              </h2>
            </div>

            <button
              onClick={() => setIsAddingBlock(true)}
              className="text-xs bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 px-2.5 py-1 rounded-md flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Block</span>
            </button>
          </div>

          {/* New Timeblock Inline Form */}
          {isAddingBlock && (
            <form onSubmit={handleCreateBlock} className="mb-4 p-3 bg-stone-50 dark:bg-stone-800/80 rounded-lg border border-stone-200 dark:border-stone-700 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="e.g. 14:00 - 15:00"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1 text-xs text-stone-900 dark:text-stone-100"
                />
                <input
                  type="text"
                  placeholder="Activity / Goal..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="sm:col-span-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2.5 py-1 text-xs text-stone-900 dark:text-stone-100"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between">
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded px-2 py-1 text-xs text-stone-800 dark:text-stone-200"
                >
                  <option value="deep_work">🧠 Deep Work</option>
                  <option value="meeting">👥 Meeting</option>
                  <option value="break">☕ Break</option>
                  <option value="admin">📋 Admin</option>
                  <option value="personal">🌿 Personal</option>
                </select>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingBlock(false)}
                    className="text-xs text-stone-500 hover:text-stone-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Timeblocks List */}
          <div className="space-y-2">
            {timeBlocks.map((tb) => (
              <div
                key={tb.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${
                  tb.completed
                    ? 'bg-stone-50 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-60'
                    : 'bg-white dark:bg-stone-800/80 border-stone-200 dark:border-stone-700 shadow-2xs'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <button
                    onClick={() => {
                      toggleTimeBlock(tb.id);
                      if (!tb.completed) triggerCelebration();
                    }}
                    className="text-stone-400 hover:text-emerald-500 transition-colors shrink-0"
                  >
                    {tb.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <div className="font-mono text-xs text-stone-500 dark:text-stone-400 min-w-[95px] shrink-0">
                    {tb.timeSlot}
                  </div>

                  <div className={`text-xs font-medium text-stone-900 dark:text-stone-100 truncate ${tb.completed ? 'line-through text-stone-400' : ''}`}>
                    {tb.title}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getCategoryColor(tb.category)}`}>
                    {tb.category.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => deleteTimeBlock(tb.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-500 transition-opacity"
                    title="Delete block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Scratchpad & Notes (1 col) */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs flex flex-col">
          <div className="flex items-center space-x-2 mb-3">
            <Edit3 className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Daily Scratchpad & Capture
            </h2>
          </div>

          <textarea
            value={scratchpad}
            onChange={(e) => handleScratchpadChange(e.target.value)}
            placeholder="Jot down quick thoughts, phone numbers, or fleeting ideas..."
            className="flex-1 w-full bg-stone-50 dark:bg-stone-800/60 p-3 rounded-lg border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-hidden resize-none font-mono min-h-[220px]"
          />

          <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
            <span>Auto-saved to local SQLite storage</span>
            <span>Zero latency</span>
          </div>
        </div>
      </div>
      {/* Time Allocation Breakdown */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs">
        <div className="flex items-center space-x-2 mb-4">
          <Circle className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
            Time Allocation Breakdown
          </h2>
        </div>
        
        {categoryData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number) => [`${value} min`, 'Time']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 w-full flex items-center justify-center text-sm text-stone-400 dark:text-stone-500">
            No task data with estimated or actual minutes found.
          </div>
        )}
      </div>
    </div>
  );
};
