import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  RefreshCw, 
  LayoutGrid,
  LayoutDashboard, 
  List, 
  Calendar as CalendarIcon,
  Filter,
  Wifi,
  WifiOff,
  Zap,
  Palette,
  ChevronDown,
  Image as ImageIcon,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TaskPriority, ViewMode, ThemePalette } from '../types';

export const Navbar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    selectedPageId,
    pages,
    projects,
    selectedProjectId,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    isSidebarOpen,
    setIsSidebarOpen,
    isOnline,
    setIsOnline,
    isSyncing,
    triggerSync,
    syncQueue,
    setIsQuickCaptureOpen,
    theme,
    setTheme,
    availableThemes,
    setIsThemeModalOpen,
    setIsWallpaperModalOpen,
    aiConfig,
    getActiveAIConfig,
    setIsAISettingsModalOpen,
  } = useApp();

  const activeAI = getActiveAIConfig();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const currentThemeObj = availableThemes.find((t) => t.id === theme) || availableThemes[0];

  const activePage = pages.find((p) => p.id === selectedPageId);
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  const getBreadcrumbTitle = () => {
    switch (activeView) {
      case 'today':
        return 'Hôm nay & Lịch trình';
      case 'tasks':
      case 'calendar':
        return activeProject ? `${activeProject.icon} ${activeProject.name}` : 'Nhiệm vụ & Công việc';
      case 'daily_agenda':
        return 'Lập kế hoạch ngày';
      case 'page':
        return activePage ? `${activePage.icon || '📄'} ${activePage.title}` : 'Tài liệu & Ghi chú';
      case 'projects':
        return 'Trung tâm dự án';
      case 'sqlite_console':
        return 'Cơ sở dữ liệu SQLite';
      case 'sync_center':
        return 'Đồng bộ & Sao lưu';
      case 'settings':
        return 'Cài đặt AI & Hệ thống';
      default:
        return 'Life OS';
    }
  };

  const isTaskView = activeView === 'tasks' || activeView === 'calendar';

  return (
    <header className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left side: Hamburger & Breadcrumb */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <button
          id="nav-menu-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 md:hidden cursor-pointer"
          title="Mở menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
          <span className="text-stone-400 hidden sm:inline">Life OS /</span>
          <span className="truncate font-semibold">{getBreadcrumbTitle()}</span>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Search Bar */}
        <div className="relative hidden md:block w-44 lg:w-56">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            id="navbar-search-input"
            type="text"
            placeholder="Tìm kiếm mọi thứ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full theme-inner-box text-xs theme-text-main pl-8 pr-3 py-1.5 rounded-md border border-stone-200/40 dark:border-stone-700/40 focus:outline-hidden transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-200"
            >
              ×
            </button>
          )}
        </div>

        {/* Task View Switcher (Feed / Calendar) */}
        {isTaskView && (
          <div className="hidden sm:flex items-center theme-inner-box p-0.5 rounded-lg border border-stone-200/40 dark:border-stone-700/40">
            <button
              id="view-toggle-list"
              onClick={() => setActiveView('tasks')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                activeView === 'tasks'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'theme-text-muted hover:theme-text-main'
              }`}
              title="Xem dạng danh sách"
            >
              <List className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
            <button
              id="view-toggle-calendar"
              onClick={() => setActiveView('calendar')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors cursor-pointer ${
                activeView === 'calendar'
                  ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                  : 'theme-text-muted hover:theme-text-main'
              }`}
              title="Xem dạng lịch"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Lịch</span>
            </button>
          </div>
        )}

        {/* Priority Filter (in Task view) */}
        {isTaskView && (
          <div className="hidden sm:flex items-center space-x-1">
            <select
              id="navbar-priority-filter"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
              className="theme-inner-box text-xs theme-text-main py-1.5 px-2 rounded-md border border-stone-200/40 dark:border-stone-700/40 focus:outline-hidden font-semibold cursor-pointer"
            >
              <option value="all">Tất cả mức độ</option>
              <option value="urgent">🔴 Khẩn cấp</option>
              <option value="high">🟠 Cao</option>
              <option value="medium">🟡 Trung bình</option>
              <option value="low">🟢 Thấp</option>
            </select>
          </div>
        )}

        {/* Backdrop Wallpaper Trigger */}
        <button
          onClick={() => setIsWallpaperModalOpen(true)}
          className="p-1.5 rounded-md text-xs font-semibold border border-stone-200/40 dark:border-stone-700/40 theme-inner-box theme-text-main hover:brightness-110 flex items-center space-x-1.5 transition-all cursor-pointer"
          title="Đổi hình nền không gian"
          id="navbar-wallpaper-btn"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline text-xs">Hình nền</span>
        </button>

        {/* Theme Palette Switcher */}
        <div className="relative">
          <button
            id="navbar-theme-btn"
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="p-1.5 rounded-md text-xs font-semibold border border-stone-200/40 dark:border-stone-700/40 theme-inner-box theme-text-main hover:brightness-110 flex items-center space-x-1.5 transition-all cursor-pointer"
            title={`Chủ đề: ${currentThemeObj.name}`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline text-xs font-semibold">{currentThemeObj.name.split(' ')[0]}</span>
            <div 
              className="w-2.5 h-2.5 rounded-full border border-stone-400/50 shadow-2xs" 
              style={{ backgroundColor: currentThemeObj.previewColors.primary }} 
            />
            <ChevronDown className="w-3 h-3 theme-text-muted" />
          </button>

          {/* Quick Theme Dropdown Popover */}
          {isThemeDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsThemeDropdownOpen(false)} 
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                  <span>Bảng màu giao diện</span>
                  <span className="text-[9px] text-emerald-500 font-mono">SQLite DB</span>
                </div>

                {availableThemes.map((opt) => {
                  const isCur = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      id={`nav-theme-select-${opt.id}`}
                      onClick={() => {
                        setTheme(opt.id);
                        setIsThemeDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isCur
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{opt.icon}</span>
                        <span>{opt.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: opt.previewColors.primary }} 
                        />
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: opt.previewColors.accent }} 
                        />
                      </div>
                    </button>
                  );
                })}

                <div className="pt-1.5 border-t border-stone-200 dark:border-stone-800">
                  <button
                    id="nav-theme-open-modal-btn"
                    onClick={() => {
                      setIsThemeDropdownOpen(false);
                      setIsThemeModalOpen(true);
                    }}
                    className="w-full text-center py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors cursor-pointer"
                  >
                    Quản lý Bảng màu...
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* AI Provider Config Quick Button */}
        <button
          id="navbar-ai-settings-btn"
          onClick={() => setIsAISettingsModalOpen(true)}
          className="p-1.5 rounded-md text-xs font-medium border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center space-x-1.5 transition-all cursor-pointer"
          title={`Nhà cung cấp AI: ${activeAI.provider} (${activeAI.model})`}
        >
          <Bot className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden sm:inline font-mono text-[10px] uppercase font-bold">{activeAI.provider}</span>
        </button>

        {/* Cloud Sync Button */}
        <button
          id="navbar-sync-btn"
          onClick={() => triggerSync()}
          disabled={!isOnline || isSyncing}
          className={`p-1.5 rounded-md text-xs font-medium border flex items-center space-x-1.5 transition-all cursor-pointer ${
            !isOnline
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 cursor-not-allowed'
              : syncQueue.length > 0
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
          title={isOnline ? (syncQueue.length > 0 ? `${syncQueue.length} thay đổi đang chờ đồng bộ` : 'Toàn bộ dữ liệu đã được lưu') : 'Ngoại tuyến: Dữ liệu được lưu an toàn trong SQLite'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
          <span className="hidden lg:inline">
            {isSyncing ? 'Đang đồng bộ...' : syncQueue.length > 0 ? `Đồng bộ (${syncQueue.length})` : 'Đã đồng bộ'}
          </span>
        </button>

        {/* Primary Quick Capture Button */}
        <button
          id="navbar-quick-add-btn"
          onClick={() => setIsQuickCaptureOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white px-3 py-1.5 rounded-md text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Thêm Nhanh</span>
        </button>
      </div>
    </header>
  );
};
