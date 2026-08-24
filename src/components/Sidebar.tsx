import React from 'react';
import { 
  LayoutDashboard,
  CheckSquare, 
  Calendar, 
  Sparkles, 
  Database, 
  Cloud, 
  Smartphone, 
  Plus, 
  Search, 
  ChevronRight, 
  FileText, 
  Folder, 
  Flame, 
  Zap, 
  Wifi, 
  WifiOff, 
  Clock, 
  ShieldCheck,
  Star,
  Trash2,
  Palette,
  Image as ImageIcon,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';

export const Sidebar: React.FC = () => {
  const {
    tasks,
    projects,
    pages,
    habits,
    syncQueue,
    imageNotes,
    lectures,
    activeView,
    setActiveView,
    selectedPageId,
    setSelectedPageId,
    selectedProjectId,
    setSelectedProjectId,
    isSidebarOpen,
    setIsSidebarOpen,
    isOnline,
    setIsOnline,
    setIsQuickCaptureOpen,
    addPage,
    deletePage,
    theme,
    availableThemes,
    setIsThemeModalOpen,
    setIsWallpaperModalOpen,
  } = useApp();

  const currentThemeObj = availableThemes.find((t) => t.id === theme) || availableThemes[0];

  const handleNavClick = (view: ViewMode) => {
    setActiveView(view);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handlePageSelect = (pageId: string) => {
    setSelectedPageId(pageId);
    setActiveView('page');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleCreateNewPage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const title = prompt('Enter new page title:') || 'Untitled Page';
    addPage({
      title,
      icon: '📄',
      parentId: null,
      isFavorite: false,
    });
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;
  const activeHabitsCount = habits.length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          id="sidebar-mobile-backdrop"
          className="fixed inset-0 bg-stone-900/50 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 bg-stone-50 dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 flex flex-col transition-transform duration-300 ease-in-out select-none ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Workspace Brand Header */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              ✦
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-semibold text-stone-900 dark:text-stone-100 text-sm tracking-tight">
                  Life OS Studio
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                  SQLite
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                <span>{isOnline ? 'Active Synced' : 'Offline Mode'}</span>
              </div>
            </div>
          </div>

          {/* Quick Capture trigger button */}
          <button
            id="sidebar-quick-add-btn"
            onClick={() => setIsQuickCaptureOpen(true)}
            title="Quick Capture"
            className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Navigation Tree */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs text-stone-700 dark:text-stone-300">
          {/* Main Life Hub Views */}
          <div className="space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
              Views & Dashboard
            </div>

            <button
              id="nav-btn-dashboard"
              onClick={() => handleNavClick('glass_dashboard')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'glass_dashboard'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                <span>Glass Dashboard</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                Home
              </span>
            </button>

            <button
              id="nav-btn-lectures"
              onClick={() => handleNavClick('lectures')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'lectures'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <GraduationCap className="w-4 h-4 text-emerald-500" />
                <span>My Lectures</span>
              </div>
              <span className="text-[10px] text-stone-400">{lectures.length}</span>
            </button>

            <button
              id="nav-btn-image-notes"
              onClick={() => handleNavClick('image_notes')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'image_notes'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ImageIcon className="w-4 h-4 text-sky-500" />
                <span>Image Notes Gallery</span>
              </div>
              <span className="text-[10px] text-stone-400">{imageNotes.length}</span>
            </button>

            <button
              id="nav-btn-kanban"
              onClick={() => handleNavClick('kanban')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'kanban'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <span>Task Board & Kanban</span>
              </div>
              {pendingTasksCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            <button
              id="nav-btn-daily-agenda"
              onClick={() => handleNavClick('daily_agenda')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'daily_agenda'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Daily Planner & Agenda</span>
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                Today
              </span>
            </button>

            <button
              id="nav-btn-habits"
              onClick={() => handleNavClick('habit_tracker')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'habit_tracker'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Sparkles className="w-4 h-4 text-rose-500" />
                <span>Habit Streak Matrix</span>
              </div>
              <span className="flex items-center space-x-1 text-[11px] text-orange-500 font-semibold">
                <Flame className="w-3 h-3 fill-orange-500" />
                <span>{activeHabitsCount}</span>
              </span>
            </button>
          </div>

          {/* Projects Filter Section */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase flex items-center justify-between">
              <span>Projects</span>
              <button
                onClick={() => setSelectedProjectId('all')}
                className="text-[10px] lowercase text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
              >
                {selectedProjectId !== 'all' ? 'show all' : ''}
              </button>
            </div>

            <button
              id="project-filter-all"
              onClick={() => {
                setSelectedProjectId('all');
                if (activeView !== 'kanban') setActiveView('kanban');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                selectedProjectId === 'all' && activeView === 'kanban'
                  ? 'bg-stone-200/60 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-medium'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Folder className="w-3.5 h-3.5 text-stone-400" />
                <span>All Projects</span>
              </div>
              <span className="text-[10px] text-stone-400">{tasks.length}</span>
            </button>

            {projects.map((proj) => {
              const projTasksCount = tasks.filter((t) => t.projectId === proj.id).length;
              const isSelected = selectedProjectId === proj.id;
              return (
                <button
                  key={proj.id}
                  id={`project-filter-${proj.id}`}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    if (activeView !== 'kanban') setActiveView('kanban');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                    isSelected
                      ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-xs">{proj.icon}</span>
                    <span className="truncate">{proj.name}</span>
                  </div>
                  <span className="text-[10px] text-stone-400">{projTasksCount}</span>
                </button>
              );
            })}
          </div>

          {/* Notion Pages Tree */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase flex items-center justify-between">
              <span>Pages & Wiki</span>
              <button
                id="sidebar-create-page-btn"
                onClick={handleCreateNewPage}
                title="New Notion Page"
                className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {pages.map((p) => {
              const isSelected = activeView === 'page' && selectedPageId === p.id;
              return (
                <div
                  key={p.id}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                  onClick={() => handlePageSelect(p.id)}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <span className="text-xs">{p.icon || '📄'}</span>
                    <span className="truncate">{p.title || 'Untitled'}</span>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {p.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete "${p.title}"?`)) {
                          deletePage(p.id);
                        }
                      }}
                      className="p-1 hover:text-rose-500"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engine & Distribution */}
          <div className="space-y-0.5 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
              Engine & Storage
            </div>

            <button
              id="nav-btn-sqlite"
              onClick={() => handleNavClick('sqlite_console')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'sqlite_console'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Database className="w-4 h-4 text-emerald-500" />
                <span>SQLite DB & Console</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">.db</span>
            </button>

            <button
              id="nav-btn-sync"
              onClick={() => handleNavClick('sync_center')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'sync_center'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Cloud className="w-4 h-4 text-sky-500" />
                <span>Cloud Sync & Backups</span>
              </div>
              {syncQueue.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                  {syncQueue.length}
                </span>
              )}
            </button>

            <button
              id="nav-btn-android-build"
              onClick={() => handleNavClick('android_build')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'android_build'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Smartphone className="w-4 h-4 text-purple-500" />
                <span>Android ARM64 APK</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium">
                ARM64
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer with Theme & Wallpaper Switchers */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 space-y-2">
          {/* Quick Backdrop selector button */}
          <button
            id="sidebar-wallpaper-btn"
            onClick={() => setIsWallpaperModalOpen(true)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-300 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-xs"
            title="Atmospheric Backdrop Wallpapers"
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-medium">Atmospheric Wallpaper</span>
            </div>
            <span className="text-[10px] text-stone-400">Select</span>
          </button>

          {/* Theme Palette Switcher */}
          <button
            id="sidebar-theme-manager-btn"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full flex items-center justify-between p-1.5 rounded-lg bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-300 hover:border-emerald-400 dark:hover:border-emerald-600 transition-all text-xs"
            title="Open Theme Palette Manager (Persisted in SQLite)"
          >
            <div className="flex items-center space-x-2">
              <Palette className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-medium">{currentThemeObj.name}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span 
                className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-600" 
                style={{ backgroundColor: currentThemeObj.previewColors.primary }} 
              />
              <span 
                className="w-2.5 h-2.5 rounded-full border border-stone-300 dark:border-stone-600" 
                style={{ backgroundColor: currentThemeObj.previewColors.accent }} 
              />
            </div>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-[11px] text-stone-600 dark:text-stone-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Offline-First Engine</span>
            </div>
            <button
              id="sidebar-toggle-online-btn"
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
              title="Click to simulate offline / online network states"
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
