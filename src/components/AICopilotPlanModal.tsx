import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Flame, 
  Send, 
  Loader2, 
  Settings2, 
  ArrowRight, 
  ShieldCheck, 
  Coffee, 
  Brain, 
  RotateCcw,
  Zap,
  Check,
  ChevronDown,
  ChevronUp,
  Sliders
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIPerformancePlan, TimeBlock, TaskPriority } from '../types';

export const AICopilotPlanModal: React.FC = () => {
  const {
    isPlanModalOpen,
    setIsPlanModalOpen,
    tasks,
    habits,
    lectures,
    timeBlocks: currentBlocks,
    applyAISchedule,
    energyProfile,
    updateEnergyProfile,
    triggerCelebration,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recalibrationPrompt, setRecalibrationPrompt] = useState('');
  const [planResult, setPlanResult] = useState<AIPerformancePlan | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<Record<number, boolean>>({});
  const [showSettings, setShowSettings] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(true);

  // Settings form state
  const [workStart, setWorkStart] = useState(energyProfile.workStart);
  const [workEnd, setWorkEnd] = useState(energyProfile.workEnd);
  const [lunchStart, setLunchStart] = useState(energyProfile.lunchStart);
  const [peakFocusPeriod, setPeakFocusPeriod] = useState(energyProfile.peakFocusPeriod);

  // Generate or re-generate plan
  const fetchAIPlan = async (customPrompt?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const activeTasks = tasks.filter((t) => t.status !== 'done');
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });

      const response = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: activeTasks.map((t) => ({
            id: t.id,
            title: t.title,
            priority: t.priority,
            estimatedMinutes: t.estimatedMinutes || 45,
            dueDate: t.dueDate,
            dueTime: t.dueTime,
            tags: t.tags,
          })),
          habits: habits.map((h) => ({
            id: h.id,
            title: h.title,
            category: h.category,
            frequency: h.frequency,
          })),
          lectures: lectures.slice(0, 2).map((l) => ({
            id: l.id,
            title: l.title,
            subject: l.subject,
          })),
          currentBlocks: currentBlocks.map((b) => ({
            timeSlot: b.timeSlot,
            title: b.title,
            completed: b.completed,
          })),
          currentTime,
          currentDate,
          energyProfile,
          recalibrationPrompt: customPrompt || recalibrationPrompt || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Server responded with ${response.status}`);
      }

      const data: AIPerformancePlan = await response.json();
      setPlanResult(data);

      // Select all generated blocks by default
      const initialSelection: Record<number, boolean> = {};
      data.timeBlocks.forEach((_, idx) => {
        initialSelection[idx] = true;
      });
      setSelectedBlocks(initialSelection);
      if (customPrompt) setRecalibrationPrompt('');
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setError(err.message || 'Failed to generate schedule. Please verify your GEMINI_API_KEY.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto trigger on initial modal open if no plan loaded
  useEffect(() => {
    if (isPlanModalOpen && !planResult && !isLoading) {
      fetchAIPlan();
    }
  }, [isPlanModalOpen]);

  if (!isPlanModalOpen) return null;

  const handleApply = () => {
    if (!planResult) return;
    const blocksToApply = planResult.timeBlocks
      .filter((_, idx) => selectedBlocks[idx] !== false)
      .map((b) => ({
        ...b,
        completed: false,
        isAutoPlanned: true,
      }));

    applyAISchedule(blocksToApply, replaceExisting);
    setIsPlanModalOpen(false);
  };

  const toggleBlockSelect = (idx: number) => {
    setSelectedBlocks((prev) => ({
      ...prev,
      [idx]: prev[idx] === false ? true : false,
    }));
  };

  const handleSaveSettings = () => {
    updateEnergyProfile({
      workStart,
      workEnd,
      lunchStart,
      peakFocusPeriod,
    });
    setShowSettings(false);
    // Re-plan with new profile
    fetchAIPlan();
  };

  const getCategoryColor = (category: TimeBlock['category']) => {
    switch (category) {
      case 'deep_work':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'meeting':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'break':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
      case 'personal':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
      default:
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    }
  };

  const getRiskBadge = (score: 'low' | 'moderate' | 'high') => {
    if (score === 'low') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <ShieldCheck className="w-3.5 h-3.5" /> Low Cognitive Load
        </span>
      );
    }
    if (score === 'moderate') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Flame className="w-3.5 h-3.5" /> Balanced Load
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/30">
        <AlertTriangle className="w-3.5 h-3.5" /> High Intensity / Paced
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-stone-900/95 border border-stone-700/60 shadow-2xl text-stone-100 overflow-hidden backdrop-blur-2xl"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800/80 bg-stone-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                Executive AI Copilot
                <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Adaptive Scheduler
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Optimized by circadian focus peaks & priority weighting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-all text-xs flex items-center gap-1.5 border ${
                showSettings 
                  ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300' 
                  : 'bg-stone-800/60 border-stone-700 hover:bg-stone-700/60 text-stone-300'
              }`}
              title="Energy & Work Hours Profile"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </button>
            <button
              onClick={() => setIsPlanModalOpen(false)}
              className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Collapsible Energy Profile Drawer */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-b border-stone-800 bg-stone-950/60 px-6 py-4 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-300 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" /> Circadian Energy & Schedule Profile
                </span>
                <button
                  onClick={handleSaveSettings}
                  className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all"
                >
                  Save & Recalibrate
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Work Start</label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Work End</label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Lunch Hour</label>
                  <input
                    type="time"
                    value={lunchStart}
                    onChange={(e) => setLunchStart(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Peak Focus Window</label>
                  <select
                    value={peakFocusPeriod}
                    onChange={(e: any) => setPeakFocusPeriod(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="morning">Morning (08:30 - 12:00)</option>
                    <option value="afternoon">Afternoon (13:00 - 16:30)</option>
                    <option value="evening">Evening (17:00 - 21:00)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Sparkles className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-200">
                  Synthesizing optimal daily timeline...
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm">
                  Analyzing task urgencies, matching high-load work to {energyProfile.peakFocusPeriod} peak focus, and budgeting rest breaks.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
                <AlertTriangle className="w-4 h-4" /> AI Planning Error
              </div>
              <p className="text-xs text-rose-300/90">{error}</p>
              <button
                onClick={() => fetchAIPlan()}
                className="px-4 py-1.5 rounded-lg bg-rose-800/50 hover:bg-rose-700/60 text-xs font-medium transition-all"
              >
                Try Again
              </button>
            </div>
          ) : planResult ? (
            <>
              {/* Executive Briefing & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="md:col-span-2 p-4 rounded-xl bg-gradient-to-br from-stone-850 to-stone-900 border border-stone-800/90 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                    <Sparkles className="w-24 h-24 text-indigo-400" />
                  </div>
                  <div className="relative z-10 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                        Executive Strategy
                      </span>
                      {getRiskBadge(planResult.burnoutRiskScore)}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                      "{planResult.strategySummary}"
                    </p>
                    <p className="text-[11px] text-stone-400 pt-1 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span><strong className="text-stone-300">Coach Insight:</strong> {planResult.coachAdvice}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-850/80 border border-stone-800/90 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Planned Deep Work
                    </span>
                    <div className="text-2xl font-black text-white mt-1">
                      {Math.floor(planResult.totalDeepWorkMinutes / 60)}h {planResult.totalDeepWorkMinutes % 60}m
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{planResult.timeBlocks.length} scheduled time slots</span>
                  </div>
                </div>
              </div>

              {/* Recalibration & Natural Language Prompt Bar */}
              <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-2.5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (recalibrationPrompt.trim()) fetchAIPlan(recalibrationPrompt.trim());
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <Sparkles className="w-4 h-4 text-indigo-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={recalibrationPrompt}
                      onChange={(e) => setRecalibrationPrompt(e.target.value)}
                      placeholder="Prompt Copilot to adjust (e.g. 'Push workout to 18:00', 'Make afternoon lighter', 'Add 30m sprint')..."
                      className="w-full bg-stone-900/90 border border-stone-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!recalibrationPrompt.trim() || isLoading}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Recalibrate</span>
                  </button>
                </form>

                {/* Preset quick adjustment pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-semibold text-stone-500 mr-1">Quick Tuning:</span>
                  {[
                    'Lighten afternoon load',
                    'Push gym to 18:00',
                    'Add 15m focus breathing',
                    'Prioritize urgent tasks first',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => fetchAIPlan(preset)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-700/50 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposed Timeline Blocks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400 font-semibold px-1">
                  <span>PROPOSED DAY TIMELINE ({planResult.timeBlocks.length} BLOCKS)</span>
                  <span>SELECT TO APPLY</span>
                </div>

                <div className="space-y-2">
                  {planResult.timeBlocks.map((block, idx) => {
                    const isSelected = selectedBlocks[idx] !== false;
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleBlockSelect(idx)}
                        className={`group p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-stone-850/90 border-stone-700/80 hover:border-indigo-500/50 shadow-sm'
                            : 'bg-stone-900/40 border-stone-800/40 opacity-50'
                        }`}
                      >
                        {/* Checkbox */}
                        <div className="pt-0.5">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'border border-stone-600 bg-stone-800/60'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                        </div>

                        {/* Time Slot Pill */}
                        <div className="min-w-[100px]">
                          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-stone-300 bg-stone-950/60 px-2 py-1 rounded-lg border border-stone-800">
                            <Clock className="w-3 h-3 text-indigo-400" />
                            {block.timeSlot}
                          </span>
                        </div>

                        {/* Title & Rationale */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-semibold text-stone-100">
                              {block.title}
                            </span>
                            <span
                              className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${getCategoryColor(
                                block.category
                              )}`}
                            >
                              {block.category.replace('_', ' ')}
                            </span>
                          </div>
                          {block.rationale && (
                            <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                              💡 {block.rationale}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Unplaced Tasks Notification */}
              {planResult.unplacedTasks && planResult.unplacedTasks.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1.5">
                  <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                    <Coffee className="w-3.5 h-3.5" /> Paced Tasks (Deferred to Protect Focus):
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px]">
                    {planResult.unplacedTasks.map((t, i) => (
                      <li key={i}>
                        <strong className="text-amber-300">{t.title}</strong> — {t.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-800/80 bg-stone-950/50">
          <div className="flex items-center gap-2">
            <label className="text-xs text-stone-400 flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={replaceExisting}
                onChange={(e) => setReplaceExisting(e.target.checked)}
                className="rounded bg-stone-800 border-stone-700 text-indigo-600 focus:ring-0"
              />
              Replace existing timeline blocks
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlanModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={!planResult || isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 fill-current" />
              Apply to Daily Agenda
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
