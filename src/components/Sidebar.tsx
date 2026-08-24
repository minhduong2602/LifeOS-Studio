import React, { useState } from 'react';
import { 
  LayoutDashboard,
  CheckSquare, 
  Calendar, 
  Sparkles, 
  Database, 
  Cloud, 
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
  Edit2,
  Palette,
  Image as ImageIcon,
  GraduationCap,
  Bot,
  Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode, Project, Page } from '../types';
import { ProjectManagerModal } from './ProjectManagerModal';
import { PageManagerModal } from './PageManagerModal';

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
    updatePage,
    deletePage,
    deleteProject,
    theme,
    availableThemes,
    setIsThemeModalOpen,
    setIsWallpaperModalOpen,
  } = useApp();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);

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
          {/* Main Core Views */}
          <div className="space-y-0.5">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
              Không gian chính
            </div>

            <button
              id="nav-btn-today"
              onClick={() => handleNavClick('today')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors font-medium cursor-pointer ${
                activeView === 'today'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Hôm nay & Lịch trình</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                Hôm nay
              </span>
            </button>

            <button
              id="nav-btn-tasks"
              onClick={() => handleNavClick('tasks')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors font-medium cursor-pointer ${
                activeView === 'tasks'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CheckSquare className="w-4 h-4 text-emerald-500" />
                <span>Nhiệm vụ & Việc làm</span>
              </div>
              {pendingTasksCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            <button
              id="nav-btn-calendar"
              onClick={() => handleNavClick('calendar')}
              className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition-colors font-medium cursor-pointer ${
                activeView === 'calendar'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-bold'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-sky-500" />
                <span>Lịch biểu</span>
              </div>
            </button>
          </div>

          {/* Projects Filter Section */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase flex items-center justify-between">
              <span>Dự án</span>
              <div className="flex items-center space-x-1">
                <button
                  id="sidebar-create-project-btn"
                  onClick={() => {
                    setEditingProject(null);
                    setIsProjectModalOpen(true);
                  }}
                  title="Tạo dự án mới"
                  className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                {selectedProjectId !== 'all' && (
                  <button
                    onClick={() => setSelectedProjectId('all')}
                    className="text-[10px] text-stone-400 hover:text-stone-200"
                  >
                    hiện tất cả
                  </button>
                )}
              </div>
            </div>

            <button
              id="project-filter-all"
              onClick={() => {
                setSelectedProjectId('all');
                if (activeView !== 'tasks') setActiveView('tasks');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                selectedProjectId === 'all' && activeView === 'tasks'
                  ? 'bg-stone-200/60 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 font-medium'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Folder className="w-3.5 h-3.5 text-stone-400" />
                <span>Tất cả dự án</span>
              </div>
              <span className="text-[10px] text-stone-400">{tasks.length}</span>
            </button>

            {projects.map((proj) => {
              const projTasksCount = tasks.filter((t) => t.projectId === proj.id).length;
              const isSelected = selectedProjectId === proj.id;
              return (
                <div
                  key={proj.id}
                  id={`project-filter-${proj.id}`}
                  onClick={() => {
                    setSelectedProjectId(proj.id);
                    if (activeView !== 'tasks') setActiveView('tasks');
                  }}
                  className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-medium'
                      : 'hover:bg-stone-100 dark:hover:bg-stone-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate min-w-0">
                    <span className="text-xs shrink-0">{proj.icon}</span>
                    <span className="truncate">{proj.name}</span>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <span className="text-[10px] text-stone-400 group-hover:hidden">{projTasksCount}</span>
                    <div className="hidden group-hover:flex items-center space-x-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject(proj);
                          setIsProjectModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-white/20 text-stone-400 hover:text-indigo-400 transition-colors"
                        title="Sửa dự án"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Xóa dự án "${proj.name}"? Các nhiệm vụ liên quan sẽ chuyển về Không gán.`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        className="p-1 rounded hover:bg-white/20 text-stone-400 hover:text-rose-400 transition-colors"
                        title="Xóa dự án"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Notion Pages Tree */}
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase flex items-center justify-between">
              <span>Tài liệu & Wiki</span>
              <button
                id="sidebar-create-page-btn"
                onClick={() => {
                  setEditingPage(null);
                  setIsPageModalOpen(true);
                }}
                title="Tạo tài liệu / Ghi chú mới"
                className="p-1 rounded hover:bg-white/10 text-stone-400 hover:text-indigo-400 cursor-pointer transition-colors"
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
                  <div className="flex items-center space-x-2 truncate min-w-0">
                    <span className="text-xs shrink-0">{p.icon || '📄'}</span>
                    <span className="truncate">{p.title || 'Chưa đặt tên'}</span>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0">
                    {p.isFavorite && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400 group-hover:hidden" />
                    )}
                    <div className="hidden group-hover:flex items-center space-x-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updatePage(p.id, { isFavorite: !p.isFavorite });
                        }}
                        className="p-1 rounded hover:bg-white/20 text-stone-400 hover:text-amber-400 transition-colors"
                        title={p.isFavorite ? 'Bỏ ghim' : 'Ghim tài liệu'}
                      >
                        <Star className={`w-3 h-3 ${p.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPage(p);
                          setIsPageModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-white/20 text-stone-400 hover:text-indigo-400 transition-colors"
                        title="Đổi tên & biểu tượng"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Xóa tài liệu "${p.title}"?`)) {
                            deletePage(p.id);
                          }
                        }}
                        className="p-1 rounded hover:bg-white/20 text-stone-400 hover:text-rose-400 transition-colors"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Engine & Storage */}
          <div className="space-y-0.5 pt-2 border-t border-stone-200 dark:border-stone-800">
            <div className="px-2 py-1 text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase">
              Hệ thống & Lưu trữ
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
                <span>Cơ sở dữ liệu SQLite</span>
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
                <span>Sao lưu & Đồng bộ</span>
              </div>
              {syncQueue.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-semibold">
                  {syncQueue.length}
                </span>
              )}
            </button>

            <button
              id="nav-btn-settings"
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors font-medium ${
                activeView === 'settings'
                  ? 'bg-stone-200/80 dark:bg-stone-800 text-stone-900 dark:text-stone-100'
                  : 'hover:bg-stone-100 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>Cài đặt AI & Hệ thống</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                Cài đặt
              </span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer with Theme & Wallpaper Switchers */}
        <div className="p-3 border-t border-stone-200 dark:border-stone-800 bg-black/10 space-y-2">
          {/* Quick Backdrop selector button */}
          <button
            id="sidebar-wallpaper-btn"
            onClick={() => setIsWallpaperModalOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded-lg theme-inner-box border hover:brightness-110 transition-all text-xs cursor-pointer"
            title="Hình nền không gian (Atmospheric Wallpaper)"
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold theme-text-main">Hình nền không gian</span>
            </div>
            <span className="text-[10px] theme-text-muted">Chọn</span>
          </button>

          {/* Theme Palette Switcher */}
          <button
            id="sidebar-theme-manager-btn"
            onClick={() => setIsThemeModalOpen(true)}
            className="w-full flex items-center justify-between p-2 rounded-lg theme-inner-box border hover:brightness-110 transition-all text-xs cursor-pointer"
            title="Đổi bảng màu giao diện (Lưu trong SQLite)"
          >
            <div className="flex items-center space-x-2">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-semibold theme-text-main">{currentThemeObj.name}</span>
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
              <span>Offline-First</span>
            </div>
            <button
              id="sidebar-toggle-online-btn"
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors ${
                isOnline
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
              title="Nhấn để chuyển đổi mô phỏng Trực tuyến / Ngoại tuyến"
            >
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'Trực tuyến' : 'Ngoại tuyến'}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Project Creation & Edit Modal */}
      <ProjectManagerModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setEditingProject(null);
        }}
        projectToEdit={editingProject}
      />

      {/* Page / Wiki Document Creation & Edit Modal */}
      <PageManagerModal
        isOpen={isPageModalOpen}
        onClose={() => {
          setIsPageModalOpen(false);
          setEditingPage(null);
        }}
        pageToEdit={editingPage}
      />
    </>
  );
};
