/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { TodayTimeline } from './components/TodayTimeline';
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
import { AICopilotPlanModal } from './components/AICopilotPlanModal';
import { Plus } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setIsQuickCaptureOpen } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'today':
        return <TodayTimeline />;
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
        return <TodayTimeline />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-stone-100 dark:bg-stone-950 font-sans antialiased text-stone-900 dark:text-stone-100 relative">
      {/* Notion-Style Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar />

        {/* View Surface Area */}
        <main className="flex-1 overflow-y-auto relative pb-24 lg:pb-0">
          {renderActiveView()}
        </main>
        
        {/* Mobile Universal Capture Floating Button */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setIsQuickCaptureOpen(true)}
            className="w-14 h-14 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
            title="Universal Capture"
            id="mobile-nav-quick-add"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Global Modals & Drawers */}
      <QuickCaptureModal />
      <TaskDetailModal />
      <ThemeManagerModal />
      <WallpaperSelectorModal />
      <AICopilotPlanModal />
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
