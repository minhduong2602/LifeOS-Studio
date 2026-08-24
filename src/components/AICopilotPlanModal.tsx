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
  Sliders,
  Bot
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
    aiConfig,
    getActiveAIConfig,
    setIsAISettingsModalOpen,
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
          aiConfig: getActiveAIConfig(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.details || errData.error || `Server responded with status ${response.status}`);
      }

      const rawData = await response.json();
      const rawBlocks = rawData?.timeBlocks || rawData?.time_blocks || rawData?.schedule || [];
      const blocksList = Array.isArray(rawBlocks) ? rawBlocks : [];

      const normalizedData: AIPerformancePlan = {
        strategySummary: rawData?.strategySummary || rawData?.strategy_summary || 'Executive daily plan prepared.',
        totalDeepWorkMinutes: Number(rawData?.totalDeepWorkMinutes || rawData?.total_deep_work_minutes || 0),
        burnoutRiskScore: (rawData?.burnoutRiskScore || rawData?.burnout_risk_score || 'low') as 'low' | 'moderate' | 'high',
        coachAdvice: rawData?.coachAdvice || rawData?.coach_advice || 'Focus on high-priority deep work first.',
        timeBlocks: blocksList.map((b: any) => ({
          timeSlot: b.timeSlot || b.time_slot || b.slot || '09:00 - 10:00',
          title: b.title || 'Scheduled Focus Block',
          category: b.category || 'deep_work',
          taskId: b.taskId || b.task_id,
          habitId: b.habitId || b.habit_id,
          lectureId: b.lectureId || b.lecture_id,
          rationale: b.rationale || 'Optimal schedule placement based on daily goals.',
          completed: false,
          isAutoPlanned: true,
        })),
        unplacedTasks: Array.isArray(rawData?.unplacedTasks) 
          ? rawData.unplacedTasks 
          : Array.isArray(rawData?.unplaced_tasks) 
          ? rawData.unplaced_tasks 
          : [],
      };

      setPlanResult(normalizedData);

      // Select all generated blocks by default
      const initialSelection: Record<number, boolean> = {};
      normalizedData.timeBlocks.forEach((_, idx) => {
        initialSelection[idx] = true;
      });
      setSelectedBlocks(initialSelection);
      if (customPrompt) setRecalibrationPrompt('');
    } catch (err: any) {
      console.error('Plan generation failed:', err);
      setError(err.message || 'Failed to generate schedule. Please configure your AI API key in Settings.');
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
                Trợ lý AI Lập Lịch Trình
                <span className="text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Circadian AI
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Tối ưu hóa theo năng lượng sinh học & độ ưu tiên công việc
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
              title="Cấu hình khung giờ & năng lượng"
            >
              <Sliders className="w-4 h-4" />
              <span className="hidden sm:inline">Khung giờ</span>
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
                  <Brain className="w-3.5 h-3.5 text-indigo-400" /> Cấu hình Nhịp Sinh Học & Giờ Làm Việc
                </span>
                <button
                  onClick={handleSaveSettings}
                  className="px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all cursor-pointer"
                >
                  Lưu & Lập Lại Lịch
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-stone-400 mb-1">Bắt đầu làm việc</label>
                  <input
                    type="time"
                    value={workStart}
                    onChange={(e) => setWorkStart(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Kết thúc làm việc</label>
                  <input
                    type="time"
                    value={workEnd}
                    onChange={(e) => setWorkEnd(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Giờ ăn trưa</label>
                  <input
                    type="time"
                    value={lunchStart}
                    onChange={(e) => setLunchStart(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-400 mb-1">Khoảng tập trung cao nhất</label>
                  <select
                    value={peakFocusPeriod}
                    onChange={(e: any) => setPeakFocusPeriod(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="morning">Buổi sáng (08:30 - 12:00)</option>
                    <option value="afternoon">Buổi chiều (13:00 - 16:30)</option>
                    <option value="evening">Buổi tối (17:00 - 21:00)</option>
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
                  Đang tổng hợp lịch trình ngày tối ưu nhất...
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-sm">
                  Phân tích mức độ khẩn cấp, khớp công việc nặng vào đỉnh cao tập trung và đan xen thời gian nghỉ ngơi.
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 rounded-xl bg-rose-950/30 border border-rose-800/50 text-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-rose-300">
                <AlertTriangle className="w-4 h-4" /> Thông báo Dịch vụ AI
              </div>
              <p className="text-xs text-rose-300/90">{error}</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => fetchAIPlan()}
                  className="px-4 py-1.5 rounded-lg bg-rose-800/50 hover:bg-rose-700/60 text-xs font-medium transition-all cursor-pointer"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => {
                    setIsPlanModalOpen(false);
                    setIsAISettingsModalOpen(true);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Cài đặt Khóa API Nhà cung cấp AI</span>
                </button>
              </div>
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
                        Chiến lược trong ngày
                      </span>
                      {getRiskBadge(planResult.burnoutRiskScore)}
                    </div>
                    <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-medium">
                      "{planResult.strategySummary}"
                    </p>
                    <p className="text-[11px] text-stone-400 pt-1 flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400 flex-shrink-0" />
                      <span><strong className="text-stone-300">Lời khuyên:</strong> {planResult.coachAdvice}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-stone-850/80 border border-stone-800/90 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Thời lượng Tập trung Sâu
                    </span>
                    <div className="text-2xl font-black text-white mt-1">
                      {Math.floor(planResult.totalDeepWorkMinutes / 60)} giờ {planResult.totalDeepWorkMinutes % 60} phút
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{planResult.timeBlocks.length} khung giờ đã lên lịch</span>
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
                      placeholder="Yêu cầu AI điều chỉnh (VD: 'Đẩy giờ tập thể dục sang 18:00', 'Buổi chiều nhẹ nhàng hơn')..."
                      className="w-full bg-stone-900/90 border border-stone-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!recalibrationPrompt.trim() || isLoading}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Điều chỉnh</span>
                  </button>
                </form>

                {/* Preset quick adjustment pills */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] uppercase font-semibold text-stone-500 mr-1">Tinh chỉnh nhanh:</span>
                  {[
                    'Giảm tải buổi chiều',
                    'Đẩy giờ tập thể thao sang 18:00',
                    'Thêm 15p nghỉ ngơi thư giãn',
                    'Ưu tiên nhiệm vụ khẩn cấp trước',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => fetchAIPlan(preset)}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-stone-850 hover:bg-stone-800 text-stone-300 border border-stone-700/50 transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposed Timeline Blocks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-400 font-semibold px-1">
                  <span>LỊCH TRÌNH ĐỀ XUẤT ({planResult.timeBlocks.length} KHUNG GIỜ)</span>
                  <span>TÍCH CHỌN ĐỂ ÁP DỤNG</span>
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
                    <Coffee className="w-3.5 h-3.5" /> Nhiệm vụ hoãn lại để đảm bảo sự tập trung:
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
                className="rounded bg-stone-800 border-stone-700 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              <span>Thay thế toàn bộ lịch trình hiện có của ngày</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlanModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              disabled={!planResult || isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>Áp dụng vào Lịch trình Hôm nay</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
