/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { BottomNavBar } from './components/BottomNavBar';
import { TodayTimeline } from './components/TodayTimeline';
import { TaskListView } from './components/TaskListView';
import { CalendarView } from './components/CalendarView';
import { NotionBlockEditor } from './components/NotionBlockEditor';
import { SQLiteConsole } from './components/SQLiteConsole';
import { SyncCenter } from './components/SyncCenter';
import { QuickCaptureModal } from './components/QuickCaptureModal';
import { TaskDetailModal } from './components/TaskDetailModal';
import { ThemeManagerModal } from './components/ThemeManagerModal';
import { WallpaperSelectorModal } from './components/WallpaperSelectorModal';
import { AICopilotPlanModal } from './components/AICopilotPlanModal';
import { AISettingsModal } from './components/AISettingsModal';
import { SettingsView } from './components/SettingsView';
import { StarbucksFrapButton } from './components/StarbucksFrapButton';
import { Plus } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setIsQuickCaptureOpen } = useApp();

  const renderActiveView = () => {
    switch (activeView) {
      case 'today':
        return <TodayTimeline />;
      case 'tasks':
      case 'projects':
        return <TaskListView />;
      case 'calendar':
        return <CalendarView />;
      case 'page':
        return <NotionBlockEditor />;
      case 'sqlite_console':
        return <SQLiteConsole />;
      case 'sync_center':
        return <SyncCenter />;
      case 'settings':
        return <SettingsView />;
      default:
        return <TodayTimeline />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden antialiased relative"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)', fontFamily: "'Nunito', system-ui, sans-serif" }}>
      {/* Notion-Style Sidebar Navigation (collapsible / desktop) */}
      <Sidebar />

      {/* Main Workspace Stage */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Top Navbar */}
        <Navbar />

        {/* View Surface Area */}
        <main className="flex-1 overflow-y-auto relative pb-20 md:pb-0">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile-First Native Bottom Navigation Bar */}
      <BottomNavBar />

      {/* Global Modals & Drawers */}
      <QuickCaptureModal />
      <TaskDetailModal />
      <ThemeManagerModal />
      <WallpaperSelectorModal />
      <AICopilotPlanModal />
      <AISettingsModal />

      {/* Signature Starbucks Frap Floating Action Button */}
      <StarbucksFrapButton />
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
