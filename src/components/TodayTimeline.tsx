import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Plus, 
  Clock, 
  Trash2, 
  Flame, 
  Check,
  Bot,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Sunset,
  Coffee,
  Brain,
  BookOpen,
  Dumbbell,
  Users,
  Heart,
  Zap,
  Star,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TimeBlock, Task } from '../types';

const VI_WEEKDAYS = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const VI_WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const getGreeting = (hour: number) => {
  if (hour < 12) return { text: 'Chào buổi sáng!', sub: 'Bắt đầu ngày mới tràn đầy năng lượng', Icon: Sun, color: 'text-amber-500' };
  if (hour < 17) return { text: 'Chào buổi chiều!', sub: 'Tiếp tục hoàn thành mục tiêu hôm nay', Icon: Coffee, color: 'text-orange-500' };
  if (hour < 21) return { text: 'Buổi tối vui vẻ!', sub: 'Hoàn tất công việc và thư giãn nhé', Icon: Sunset, color: 'text-pink-500' };
  return { text: 'Chúc ngủ ngon!', sub: 'Nghỉ ngơi để ngày mai tốt hơn', Icon: Moon, color: 'text-indigo-400' };
};

export const TodayTimeline: React.FC = () => {
  const { 
    tasks, 
    timeBlocks, 
    toggleTaskCompletion, 
    toggleTimeBlock, 
    deleteTimeBlock,
    setIsPlanModalOpen,
    setIsQuickCaptureOpen,
    triggerCelebration 
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getWeekDays = (baseDate: Date) => {
    const days = [];
    const currentDay = baseDate.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
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
  const selectedDateStr = selectedDate.toLocaleDateString('sv-SE');
  const dayTasks = tasks.filter((t) => t.dueDate === selectedDateStr);

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'deep_work':
        return { label: 'Tập trung cao', Icon: Brain, bubbleClass: 'kawaii-bubble-lavender' };
      case 'routine':
        return { label: 'Thói quen', Icon: Coffee, bubbleClass: 'kawaii-bubble-sky' };
      case 'rest':
        return { label: 'Nghỉ ngơi', Icon: Heart, bubbleClass: 'kawaii-bubble-mint' };
      case 'fitness':
        return { label: 'Thể dục', Icon: Dumbbell, bubbleClass: 'kawaii-bubble-peach' };
      case 'meeting':
        return { label: 'Cuộc họp', Icon: Users, bubbleClass: 'kawaii-bubble-yellow' };
      case 'learning':
        return { label: 'Học tập', Icon: BookOpen, bubbleClass: 'kawaii-bubble-teal' };
      case 'mindfulness':
        return { label: 'Thư giãn', Icon: Star, bubbleClass: 'kawaii-bubble-coral' };
      default:
        return { label: 'Công việc', Icon: Target, bubbleClass: 'kawaii-bubble-pink' };
    }
  };

  const completedBlocksCount = timeBlocks.filter((b) => b.completed).length;
  const progressPercent = timeBlocks.length > 0 ? Math.round((completedBlocksCount / timeBlocks.length) * 100) : 0;
  const greeting = getGreeting(currentDate.getHours());
  const GreetingIcon = greeting.Icon;

  return (
    <div className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 pt-6 pb-28 overflow-y-auto">
      {/* Greeting Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center ${greeting.color}`}>
                <GreetingIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                  {greeting.text}
                </h1>
                <p className="text-xs font-medium" style={{ color: 'var(--text-dim)' }}>
                  {greeting.sub}
                </p>
              </div>
            </div>
          </div>

          {/* AI Plan Button */}
          <button
            onClick={() => setIsPlanModalOpen(true)}
            className="kawaii-btn px-4 py-2.5 text-white text-xs font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF8FAB, #A78BFA)', boxShadow: '0 4px 14px rgba(255,143,171,0.3)' }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Lập Kế Hoạch</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>

        {/* Date subtitle */}
        <p className="text-xs font-semibold mt-3 flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <CalendarIcon className="w-3.5 h-3.5" />
          {VI_WEEKDAYS[selectedDate.getDay()]}, {selectedDate.getDate()} tháng {selectedDate.getMonth() + 1}, {selectedDate.getFullYear()}
        </p>
      </div>

      {/* Week Day Selector — Pastel Pills */}
      <div className="flex justify-between items-center mb-6 gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {weekDays.map((day, i) => {
          const isSelected =
            day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth();
          const dayNum = day.getDate();
          const dayShort = VI_WEEKDAYS_SHORT[day.getDay()];

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center justify-center min-w-[46px] py-2.5 px-1.5 rounded-2xl transition-all cursor-pointer"
              style={isSelected ? {
                background: 'linear-gradient(135deg, #FFB5C2, #FF8FAB)',
                color: 'white',
                fontWeight: 800,
                boxShadow: '0 4px 12px rgba(255,143,171,0.3)',
                transform: 'scale(1.08)',
              } : {
                background: 'var(--bg-card)',
                border: '1.5px solid var(--border-card)',
              }}
            >
              <span className={`text-[11px] font-bold ${isSelected ? 'text-white/80' : ''}`}
                style={!isSelected ? { color: 'var(--text-dim)' } : undefined}>
                {dayShort}
              </span>
              <span className={`text-base font-black mt-0.5 ${isSelected ? 'text-white' : ''}`}
                style={!isSelected ? { color: 'var(--text-main)' } : undefined}>
                {dayNum}
              </span>
            </button>
          );
        })}
      </div>

      {/* Progress Bar — Rainbow Pastel */}
      {timeBlocks.length > 0 && (
        <div className="mb-6 kawaii-card p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5" style={{ color: 'var(--text-main)' }}>
              <div className="w-6 h-6 rounded-lg kawaii-bubble-mint flex items-center justify-center">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span>Tiến độ hôm nay</span>
            </span>
            <span style={{ color: '#FF8FAB' }} className="font-black">
              {completedBlocksCount}/{timeBlocks.length} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner-box)' }}>
            <div
              className="h-full rounded-full transition-all duration-700 kawaii-progress"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {progressPercent === 100 && (
            <p className="text-xs font-bold text-center" style={{ color: '#FF8FAB' }}>
              Tuyệt vời! Bạn đã hoàn thành tất cả!
            </p>
          )}
        </div>
      )}

      {/* Time Blocks & Tasks */}
      <div className="space-y-3">
        {timeBlocks.length === 0 && dayTasks.length === 0 ? (
          /* Empty State — Cute Illustrated */
          <div className="py-16 px-6 text-center kawaii-card space-y-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              <div className="kawaii-bubble kawaii-bubble-pink kawaii-float" style={{ animationDelay: '0s' }}>
                <Star className="w-5 h-5" />
              </div>
              <div className="kawaii-bubble kawaii-bubble-lavender kawaii-float" style={{ animationDelay: '0.5s', width: 52, height: 52, borderRadius: 16 }}>
                <Brain className="w-6 h-6" />
              </div>
              <div className="kawaii-bubble kawaii-bubble-mint kawaii-float" style={{ animationDelay: '1s' }}>
                <Heart className="w-5 h-5" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-black" style={{ color: 'var(--text-main)' }}>
                Chưa có lịch trình cho ngày này
              </h3>
              <p className="text-xs font-medium mt-1.5 max-w-xs mx-auto" style={{ color: 'var(--text-dim)' }}>
                Hãy để Trợ lý AI tự động sắp xếp lịch trình tối ưu nhất cho bạn nhé!
              </p>
            </div>
            <button
              onClick={() => setIsPlanModalOpen(true)}
              className="kawaii-btn px-6 py-3 text-white text-xs font-black shadow-lg inline-flex items-center gap-2 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #FF8FAB, #A78BFA)', boxShadow: '0 6px 20px rgba(255,143,171,0.3)' }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tạo lịch trình với AI</span>
            </button>
          </div>
        ) : (
          <>
            {/* Time Block Cards — Kawaii Pastel Style */}
            {timeBlocks.map((block, index) => {
              const { label, Icon: CategoryIcon, bubbleClass } = getCategoryStyle(block.category);
              const isDone = block.completed;

              return (
                <motion.div
                  key={block.id}
                  layout
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
                  className={`group kawaii-card p-4 flex items-center gap-3.5 cursor-pointer transition-all ${
                    isDone ? 'opacity-50' : ''
                  }`}
                  onClick={() => {
                    toggleTimeBlock(block.id);
                    if (!isDone) triggerCelebration();
                  }}
                >
                  {/* Category Bubble Icon */}
                  <div className={`kawaii-bubble ${bubbleClass} ${isDone ? 'opacity-40' : ''}`}>
                    {isDone ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <CategoryIcon className="w-5 h-5" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className={`text-sm font-bold truncate ${isDone ? 'line-through' : ''}`}
                        style={{ color: isDone ? 'var(--text-dim)' : 'var(--text-main)' }}>
                        {block.title}
                      </h3>
                      <span className="text-[11px] font-black shrink-0 px-2 py-0.5 rounded-lg"
                        style={{ background: 'var(--bg-inner-box)', color: 'var(--text-muted)' }}>
                        {block.timeSlot}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold"
                        style={{
                          background: isDone ? 'var(--bg-inner-box)' : 'var(--kawaii-cream)',
                          color: isDone ? 'var(--text-dim)' : 'var(--text-muted)',
                          border: '1px solid var(--border-inner)',
                        }}>
                        {label}
                      </span>
                      {block.isAutoPlanned && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"
                          style={{ background: 'linear-gradient(135deg, #EDE9FE, #FEF3C7)', color: '#7C3AED' }}>
                          <Sparkles className="w-2.5 h-2.5" />
                          AI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTimeBlock(block.id);
                    }}
                    className="p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    style={{ color: 'var(--text-dim)' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}

            {/* Day Tasks Section */}
            {dayTasks.length > 0 && (
              <div className="pt-4 space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider px-1" style={{ color: 'var(--text-dim)' }}>
                  Nhiệm vụ hạn chót hôm nay ({dayTasks.length})
                </h4>
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="kawaii-card p-3.5 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          toggleTaskCompletion(t.id);
                          if (t.status !== 'done') triggerCelebration();
                        }}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center border-2 transition-all cursor-pointer ${
                          t.status === 'done'
                            ? 'border-transparent'
                            : ''
                        }`}
                        style={t.status === 'done'
                          ? { background: 'linear-gradient(135deg, #B8E8D0, #6EE7B7)', color: 'white' }
                          : { borderColor: 'var(--border-inner)', color: 'var(--text-dim)' }
                        }
                      >
                        {t.status === 'done' && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>
                      <span className={`text-xs font-bold ${t.status === 'done' ? 'line-through' : ''}`}
                        style={{ color: t.status === 'done' ? 'var(--text-dim)' : 'var(--text-main)' }}>
                        {t.title}
                      </span>
                    </div>
                    {t.priority === 'urgent' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                        style={{ background: '#FEE2E2', color: '#DC2626' }}>
                        Khẩn cấp
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
