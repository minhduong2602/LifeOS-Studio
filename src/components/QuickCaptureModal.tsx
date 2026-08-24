import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles,
  Send,
  Loader2,
  Calendar,
  Clock,
  Tag,
  Folder,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskPriority } from '../types';

export const QuickCaptureModal: React.FC = () => {
  const {
    isQuickCaptureOpen,
    setIsQuickCaptureOpen,
    addTask,
    addImageNote,
    addLecture,
    addHabit,
    triggerCelebration,
    projects,
    tasks,
  } = useApp();

  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'input' | 'preview'>('input');
  const [parsedData, setParsedData] = useState<any>(null);

  // Routine Predictor Logic
  const routines = useMemo(() => {
    const counts: Record<string, { title: string; time?: string; duration?: number; count: number; project?: string }> = {};
    tasks.forEach(t => {
      if (!t.dueTime && !t.estimatedMinutes) return;
      const key = t.title.toLowerCase().trim();
      if (key.length < 3) return;

      if (!counts[key]) {
        counts[key] = { 
          title: t.title, 
          time: t.dueTime, 
          duration: t.estimatedMinutes, 
          project: t.projectId || t.tags?.[0],
          count: 0 
        };
      }
      counts[key].count++;
    });
    return Object.values(counts)
      .filter(r => r.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [tasks]);

  const suggestedRoutines = prompt.trim() === '' 
    ? routines 
    : routines.filter(r => r.title.toLowerCase().includes(prompt.toLowerCase().trim()));

  if (!isQuickCaptureOpen) return null;

  const handleParse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const history = tasks
        .filter(t => t.dueTime || t.estimatedMinutes)
        .slice(-30)
        .map(t => ({
          title: t.title,
          time: t.dueTime,
          duration: t.estimatedMinutes,
          project: t.projectId || t.tags?.[0]
        }));

      const response = await fetch('/api/parse-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), history }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse request');
      }

      const data = await response.json();
      setParsedData({
        ...data,
        type: data.type || 'task',
        priority: data.priority || 'medium',
      });
      setMode('preview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    if (!parsedData) return;
    const data = parsedData;

    switch (data.type) {
      case 'task':
        addTask({
          title: data.title,
          description: '',
          status: 'todo',
          priority: data.priority as TaskPriority,
          projectId: data.projectId, // mapped if matched
          dueDate: data.dueDate || undefined,
          dueTime: data.dueTime || undefined,
          estimatedMinutes: data.estimatedMinutes || undefined,
          tags: data.tags || [],
          subtasks: [],
          order: 0,
        });
        break;
      case 'lecture':
        addLecture({
          title: data.title,
          subject: data.project || data.tags?.[0] || 'Uncategorized',
          notesCount: 0,
          coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
          summary: 'Added via Life OS AI capture.',
          isFavorite: false,
        });
        break;
      case 'habit':
        addHabit({
          title: data.title,
          icon: '⚡',
          frequency: 'daily',
          targetDaysPerWeek: 7,
        });
        break;
      case 'image':
        addImageNote({
          title: data.title,
          caption: 'Added via Life OS AI capture.',
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
          tags: data.tags || ['AI Capture'],
          isFavorite: false,
        });
        break;
      default:
        addTask({
          title: data.title || prompt.trim(),
          description: '',
          status: 'todo',
          priority: data.priority as TaskPriority || 'medium',
          tags: data.tags || ['Uncategorized'],
          subtasks: [],
          order: 0,
        });
    }

    triggerCelebration();
    setPrompt('');
    setParsedData(null);
    setMode('input');
    setIsQuickCaptureOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
        id="quick-capture-dialog"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/50 dark:bg-stone-800/30">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Life OS AI Parser
            </h3>
          </div>
          <button
            onClick={() => {
              setIsQuickCaptureOpen(false);
              setMode('input');
              setParsedData(null);
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            id="close-quick-capture-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-5 space-y-4">
          {mode === 'input' ? (
            <form onSubmit={handleParse}>
              <textarea
                autoFocus
                rows={3}
                placeholder="What's on your mind? (e.g. 'mai 8h đi gym 1 tiếng', 'add a new habit to drink water daily', 'read 20 pages tonight')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full text-lg font-medium text-stone-900 dark:text-stone-100 bg-stone-50 dark:bg-stone-800/60 p-4 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 resize-none placeholder:text-stone-400 dark:placeholder:text-stone-500 transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleParse(e);
                  }
                }}
              />
              
              {/* Routine Predictor Suggestions */}
              {suggestedRoutines.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 animate-in fade-in duration-200">
                  {suggestedRoutines.map((routine, idx) => {
                    const today = new Date();
                    let targetDate = new Date();
                    let isTomorrow = false;
                    if (routine.time) {
                      const [h, m] = routine.time.split(':').map(Number);
                      if (today.getHours() > h || (today.getHours() === h && today.getMinutes() > m)) {
                        targetDate.setDate(today.getDate() + 1);
                        isTomorrow = true;
                      }
                    }

                    const timeStr = routine.time || '';
                    const durStr = routine.duration ? `${routine.duration} min` : '';
                    const detailStr = [isTomorrow ? 'Tomorrow' : 'Today', timeStr, durStr].filter(Boolean).join(' · ');

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setParsedData({
                            type: 'task',
                            title: routine.title,
                            dueDate: targetDate.toLocaleDateString('sv-SE'),
                            dueTime: routine.time,
                            estimatedMinutes: routine.duration,
                            project: routine.project,
                            priority: 'medium',
                            inferredFromHistory: true
                          });
                          setMode('preview');
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium transition-all text-left group"
                      >
                        <Sparkles className="w-3 h-3 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div>
                          <span className="font-bold">{routine.title}</span>
                          {detailStr && <span className="opacity-70 ml-1.5 font-normal tracking-tight">{detailStr}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {error && (
                <div className="text-red-500 text-xs px-2 mt-2">
                  Error: {error}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between">
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  Natural language processing
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsQuickCaptureOpen(false)}
                    className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !prompt.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-md flex items-center space-x-1.5 disabled:opacity-50 transition-all"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isProcessing ? 'Thinking...' : 'Analyze'}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="px-1 space-y-1.5">
                {parsedData?.inferredFromHistory && (
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Schedule like usual</span>
                  </div>
                )}
                <h4 className="text-xl font-semibold text-stone-900 dark:text-stone-100 leading-tight">
                  {parsedData?.title}
                </h4>
                
                <div className="flex flex-wrap items-center gap-1.5 text-sm text-stone-500 dark:text-stone-400 font-medium">
                  {parsedData?.dueDate && <span>{parsedData.dueDate}</span>}
                  {(parsedData?.dueDate && parsedData?.dueTime) && <span>·</span>}
                  {parsedData?.dueTime && <span>{parsedData.dueTime}</span>}
                  {(parsedData?.dueTime && parsedData?.estimatedMinutes) && <span>·</span>}
                  {parsedData?.estimatedMinutes && <span>{parsedData.estimatedMinutes} min</span>}
                </div>
                
                {parsedData?.project && (
                  <div className="text-sm font-medium text-stone-400 dark:text-stone-500">
                    {parsedData.project}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setMode('input')}
                  className="px-2 py-1.5 text-xs text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-medium transition-colors"
                >
                  ← Edit Prompt
                </button>
                <button
                  onClick={handleSave}
                  className="bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 text-sm font-semibold px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

