/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { GlassDashboard } from './components/GlassDashboard';
import { ImageNotesView } from './components/ImageNotesView';
import { LecturesView } from './components/LecturesView';
import { KanbanBoard } from './components/KanbanBoard';
import { TaskListView } from './components/TaskListView';
import { CalendarView } from './components/CalendarView';
import { NotionBlockEditor } from './components/NotionBlockEditor';
import { DailyAgenda } from './components/DailyAgenda';
import { HabitTracker } from './components/HabitTracker';
import { SQLiteConsole } from './components/SQLiteConsole';
import { SyncCenter } from './components/SyncCenter';
import { AndroidBuildModal } from './components/AndroidBuildModal';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ThemeManagerModal } from './components/ThemeManagerModal';
import { WallpaperSelectorModal } from './components/WallpaperSelectorModal';
import { 
  LayoutDashboard,
  CheckSquare, 
  Clock, 
  Sparkles, 
  FileText, 
  Plus, 
  Image as ImageIcon,
  GraduationCap
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, setIsQuickCaptureOpen } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'glass_dashboard':
        return <GlassDashboard />;
      case 'image_notes':
        return <ImageNotesView />;
      case 'lectures':
        return <LecturesView />;
      case 'kanban':
        return <KanbanBoard />;
      case 'list':
        return <TaskListView />;
      case 'calendar':
        return <CalendarView />;
      case 'daily_agenda':
        return <DailyAgenda />;
      case 'habit_tracker':
        return <HabitTracker />;
      case 'page':
        return <NotionBlockEditor />;
      case 'sqlite_console':
        return <SQLiteConsole />;
      case 'sync_center':
        return <SyncCenter />;
      case 'android_build':
        return <AndroidBuildModal />;
      default:
        return <GlassDashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-950 font-sans antialiased text-stone-900 dark:text-stone-100">
      {/* Notion-Style Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* View Surface Area */}
        <main className="flex-1 overflow-y-auto relative pb-16 lg:pb-0">
          {renderActiveView()}
        </main>

        {/* Mobile Bottom Navigation Bar (Visible on mobile/tablet screens) */}
        <nav
          id="mobile-bottom-nav"
          className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 flex items-center justify-around px-2 z-30 shadow-lg select-none"
        >
          <button
            onClick={() => setActiveView('glass_dashboard')}
            className={`flex flex-col items-center justify-center w-12 py-1 text-[10px] font-medium transition-colors ${
              activeView === 'glass_dashboard'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            id="mobile-nav-dashboard"
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveView('kanban')}
            className={`flex flex-col items-center justify-center w-12 py-1 text-[10px] font-medium transition-colors ${
              activeView === 'kanban' || activeView === 'list' || activeView === 'calendar'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            id="mobile-nav-tasks"
          >
            <CheckSquare className="w-4 h-4 mb-0.5" />
            <span>Tasks</span>
          </button>

          {/* Center Floating Quick Add Button */}
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="-mt-5 w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white flex items-center justify-center shadow-lg transition-transform"
            title="Quick Capture"
            id="mobile-nav-quick-add"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            onClick={() => setActiveView('lectures')}
            className={`flex flex-col items-center justify-center w-12 py-1 text-[10px] font-medium transition-colors ${
              activeView === 'lectures'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            id="mobile-nav-lectures"
          >
            <GraduationCap className="w-4 h-4 mb-0.5" />
            <span>Lectures</span>
          </button>

          <button
            onClick={() => setActiveView('image_notes')}
            className={`flex flex-col items-center justify-center w-12 py-1 text-[10px] font-medium transition-colors ${
              activeView === 'image_notes'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
            id="mobile-nav-images"
          >
            <ImageIcon className="w-4 h-4 mb-0.5" />
            <span>Gallery</span>
          </button>
        </nav>
      </div>

      {/* Global Modals & Drawers */}
      <QuickCaptureModal />
      <TaskDetailModal />
      <ThemeManagerModal />
      <WallpaperSelectorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
