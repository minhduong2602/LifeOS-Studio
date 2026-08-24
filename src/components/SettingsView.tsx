import React from 'react';
import { 
  Bot, 
  Cpu, 
  Key, 
  Globe, 
  Sliders, 
  Database, 
  ShieldCheck, 
  Sparkles, 
  Palette, 
  Clock, 
  Wifi, 
  Cloud, 
  Zap,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    aiConfig,
    getActiveAIConfig,
    setIsAISettingsModalOpen,
    energyProfile,
    updateEnergyProfile,
    theme,
    setIsThemeModalOpen,
    availableThemes,
    isOnline,
    setIsOnline,
    timeBlocks,
    tasks,
    habits,
    pages,
    setActiveView
  } = useApp();

  const currentThemeObj = availableThemes.find((t) => t.id === theme) || availableThemes[0];
  const activeAI = getActiveAIConfig();

  return (
    <div className="h-full flex flex-col p-4 md:p-8 overflow-y-auto space-y-6 max-w-5xl mx-auto text-stone-900 dark:text-stone-100">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight">Cài Đặt Hệ Thống & AI</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              LifeOS Core
            </span>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Cấu hình nhà cung cấp AI linh hoạt (OpenRouter, Gemini, OpenAI, Ollama), nhịp sinh học Circadian và cơ sở dữ liệu SQLite.
          </p>
        </div>

        <button
          onClick={() => setIsAISettingsModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 shrink-0 cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>Cấu hình Nhà Cung Cấp AI</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Active AI Provider Summary */}
        <div className="p-5 rounded-2xl theme-card border shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold theme-text-main">Nhà Cung Cấp AI Đang Dùng</h2>
                <p className="text-[11px] theme-text-muted">Phân tích ngôn ngữ tự nhiên & Trợ lý Copilot</p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase font-mono">{activeAI.provider}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-xl theme-inner-box border space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="theme-text-muted font-semibold">Mô hình AI:</span>
              <span className="font-mono font-bold text-indigo-400">{activeAI.model}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="theme-text-muted font-semibold">Khóa API:</span>
              <span className="font-mono theme-text-main">
                {activeAI.apiKey ? `${activeAI.apiKey.slice(0, 7)}••••••••` : activeAI.provider === 'gemini' ? 'Khóa mặc định máy chủ (.env)' : 'Chưa cấu hình khóa'}
              </span>
            </div>
            {activeAI.baseUrl && (
              <div className="flex items-center justify-between">
                <span className="theme-text-muted font-semibold">Đường dẫn Base URL:</span>
                <span className="font-mono theme-text-main text-[11px] truncate max-w-[200px]">{activeAI.baseUrl}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="theme-text-muted font-semibold">Độ sáng tạo (Temp):</span>
              <span className="font-mono theme-text-main font-bold">{activeAI.temperature ?? 0.2}</span>
            </div>
          </div>

          <button
            onClick={() => setIsAISettingsModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl theme-inner-box hover:brightness-110 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border cursor-pointer active:scale-98"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Đổi Nhà Cung Cấp hoặc Thử Nghiệm Kết Nối</span>
          </button>
        </div>

        {/* Card 2: Circadian Energy Profile */}
        <div className="p-5 rounded-2xl theme-card border shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold theme-text-main">Nhịp Sinh Học & Giờ Làm</h2>
                <p className="text-[11px] theme-text-muted">Khung giờ làm việc và khoảng thời gian tập trung cao</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block theme-text-muted font-semibold mb-1">Bắt đầu làm việc</label>
              <input
                type="time"
                value={energyProfile.workStart}
                onChange={(e) => updateEnergyProfile({ workStart: e.target.value })}
                className="w-full theme-inner-box border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block theme-text-muted font-semibold mb-1">Kết thúc làm việc</label>
              <input
                type="time"
                value={energyProfile.workEnd}
                onChange={(e) => updateEnergyProfile({ workEnd: e.target.value })}
                className="w-full theme-inner-box border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block theme-text-muted font-semibold mb-1">Giờ ăn trưa</label>
              <input
                type="time"
                value={energyProfile.lunchStart}
                onChange={(e) => updateEnergyProfile({ lunchStart: e.target.value })}
                className="w-full theme-inner-box border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block theme-text-muted font-semibold mb-1">Khoảng tập trung cao nhất</label>
              <select
                value={energyProfile.peakFocusPeriod}
                onChange={(e: any) => updateEnergyProfile({ peakFocusPeriod: e.target.value })}
                className="w-full theme-inner-box border rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="morning">Buổi sáng (08:30 - 12:00)</option>
                <option value="afternoon">Buổi chiều (13:00 - 16:30)</option>
                <option value="evening">Buổi tối (17:00 - 21:00)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 3: Embedded SQLite Database Engine */}
        <div className="p-5 rounded-2xl theme-card border shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold theme-text-main">Bộ Lưu Trữ Cục Bộ SQLite</h2>
                <p className="text-[11px] theme-text-muted">Lưu trữ Offline-first tốc độ cao và an toàn</p>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">SQLite DB</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl theme-inner-box border">
              <div className="text-xl font-black theme-text-main">{tasks.length}</div>
              <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Nhiệm vụ</div>
            </div>
            <div className="p-2.5 rounded-xl theme-inner-box border">
              <div className="text-xl font-black theme-text-main">{habits.length}</div>
              <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Thói quen</div>
            </div>
            <div className="p-2.5 rounded-xl theme-inner-box border">
              <div className="text-xl font-black theme-text-main">{pages.length}</div>
              <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Tài liệu</div>
            </div>
            <div className="p-2.5 rounded-xl theme-inner-box border">
              <div className="text-xl font-black theme-text-main">{timeBlocks.length}</div>
              <div className="text-[10px] font-bold theme-text-muted uppercase tracking-wider mt-0.5">Khung giờ</div>
            </div>
          </div>

          <button
            onClick={() => setActiveView('sqlite_console')}
            className="w-full py-2 px-3 rounded-xl theme-inner-box hover:brightness-110 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border cursor-pointer active:scale-98"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Mở Bảng Điều Khiển SQL SQLite Trực Tiếp</span>
          </button>
        </div>

        {/* Card 4: Aesthetics & Theme */}
        <div className="p-5 rounded-2xl theme-card border shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold theme-text-main">Giao Diện & Bảng Màu</h2>
                <p className="text-[11px] theme-text-muted">Bảng màu đang kích hoạt: {currentThemeObj.name}</p>
              </div>
            </div>
            <span className="text-xl">{currentThemeObj.icon}</span>
          </div>

          <div className="p-3 rounded-xl theme-inner-box border flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold theme-text-main">{currentThemeObj.name}</span>
              <p className="text-[11px] theme-text-muted font-medium">{currentThemeObj.tagline}</p>
            </div>
            <div className="flex items-center space-x-1 shrink-0">
              <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: currentThemeObj.previewColors.primary }} />
              <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-xs" style={{ backgroundColor: currentThemeObj.previewColors.accent }} />
            </div>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl theme-inner-box hover:brightness-110 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all border cursor-pointer active:scale-98"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Mở Trình Quản Lý Bảng Màu Giao Diện</span>
          </button>
        </div>
      </div>
    </div>
  );
};
