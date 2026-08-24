import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  RefreshCw, 
  LayoutGrid, 
  List, 
  Calendar as CalendarIcon,
  Filter,
  Wifi,
  WifiOff,
  Zap,
  Palette,
  ChevronDown,
  Image as ImageIcon
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
  } = useApp();

  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const currentThemeObj = availableThemes.find((t) => t.id === theme) || availableThemes[0];

  const activePage = pages.find((p) => p.id === selectedPageId);
  const activeProject = projects.find((p) => p.id === selectedProjectId);

  const getBreadcrumbTitle = () => {
    switch (activeView) {
      case 'glass_dashboard':
        return 'Life Operating System';
      case 'lectures':
        return 'My Lectures & Knowledge Stacks';
      case 'image_notes':
        return 'Image Notes & Visual Assets';
      case 'kanban':
      case 'list':
      case 'calendar':
        return activeProject ? `${activeProject.icon} ${activeProject.name}` : 'Personal Task Board';
      case 'daily_agenda':
        return 'Daily Planner & Timeblocking';
      case 'habit_tracker':
        return 'Habit Streak Matrix';
      case 'page':
        return activePage ? `${activePage.icon || '📄'} ${activePage.title}` : 'Notion Document';
      case 'sqlite_console':
        return 'Local SQLite Console & Tables';
      case 'sync_center':
        return 'Cloud Sync & Zero-Lockin Snapshots';
      case 'android_build':
        return 'Android ARM64 & Tauri Release Hub';
      default:
        return 'Life OS';
    }
  };

  const isTaskView = activeView === 'kanban' || activeView === 'list' || activeView === 'calendar';

  return (
    <header className="h-14 border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left side: Hamburger & Breadcrumb */}
      <div className="flex items-center space-x-3 overflow-hidden">
        <button
          id="nav-menu-toggle-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 lg:hidden"
          title="Toggle Navigation"
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
            placeholder="Search all items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-100 dark:bg-stone-800 text-xs text-stone-900 dark:text-stone-100 pl-8 pr-3 py-1.5 rounded-md border border-transparent focus:border-stone-300 dark:focus:border-stone-700 focus:outline-hidden transition-all placeholder:text-stone-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
            >
              ×
            </button>
          )}
        </div>

        {/* Task View Switcher (Kanban / List / Calendar) */}
        {isTaskView && (
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-0.5 rounded-lg border border-stone-200 dark:border-stone-700">
            <button
              id="view-toggle-kanban"
              onClick={() => setActiveView('kanban')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors ${
                activeView === 'kanban'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              id="view-toggle-list"
              onClick={() => setActiveView('list')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors ${
                activeView === 'list'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Table List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              id="view-toggle-calendar"
              onClick={() => setActiveView('calendar')}
              className={`p-1.5 rounded-md text-xs font-medium flex items-center space-x-1 transition-colors ${
                activeView === 'calendar'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
              title="Calendar View"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Calendar</span>
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
              className="bg-stone-100 dark:bg-stone-800 text-xs text-stone-700 dark:text-stone-300 py-1.5 px-2 rounded-md border border-stone-200 dark:border-stone-700 focus:outline-hidden"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>
          </div>
        )}

        {/* Backdrop Wallpaper Trigger */}
        <button
          onClick={() => setIsWallpaperModalOpen(true)}
          className="p-1.5 rounded-md text-xs font-medium border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 flex items-center space-x-1.5 transition-all"
          title="Change Wallpaper Backdrop"
          id="navbar-wallpaper-btn"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
          <span className="hidden sm:inline text-xs">Backdrop</span>
        </button>

        {/* Theme Palette Switcher */}
        <div className="relative">
          <button
            id="navbar-theme-btn"
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            className="p-1.5 rounded-md text-xs font-medium border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-750 flex items-center space-x-1.5 transition-all"
            title={`Active Theme: ${currentThemeObj.name} (Click to toggle or manage palettes)`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline text-xs font-medium">{currentThemeObj.name.split(' ')[0]}</span>
            <div 
              className="w-2.5 h-2.5 rounded-full border border-stone-400/50 shadow-2xs"
              style={{ backgroundColor: currentThemeObj.previewColors.primary }} 
            />
            <ChevronDown className="w-3 h-3 text-stone-400" />
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
                  <span>Color Palettes</span>
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
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
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
                    className="w-full text-center py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-md transition-colors"
                  >
                    Open Palette Manager...
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cloud Sync Button */}
        <button
          id="navbar-sync-btn"
          onClick={() => triggerSync()}
          disabled={!isOnline || isSyncing}
          className={`p-1.5 rounded-md text-xs font-medium border flex items-center space-x-1.5 transition-all ${
            !isOnline
              ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 cursor-not-allowed'
              : syncQueue.length > 0
              ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
              : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-100'
          }`}
          title={isOnline ? (syncQueue.length > 0 ? `${syncQueue.length} changes pending sync` : 'All changes saved & synced') : 'Offline: Changes queued locally in SQLite'}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-500' : ''}`} />
          <span className="hidden lg:inline">
            {isSyncing ? 'Syncing...' : syncQueue.length > 0 ? `Sync (${syncQueue.length})` : 'Synced'}
          </span>
        </button>

        {/* Primary Quick Capture Button */}
        <button
          id="navbar-quick-add-btn"
          onClick={() => setIsQuickCaptureOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center space-x-1.5 shadow-xs transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Quick Add</span>
        </button>
      </div>
    </header>
  );
};
