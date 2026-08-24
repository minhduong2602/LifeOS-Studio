import React from 'react';
import { 
  Sun, 
  CheckSquare, 
  Folder, 
  FileText, 
  Settings,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';

export const BottomNavBar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    tasks, 
    setIsQuickCaptureOpen,
    selectedPageId,
    pages,
    setSelectedPageId,
    setSelectedProjectId
  } = useApp();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;

  const navItems: Array<{
    id: ViewMode;
    label: string;
    icon: React.ReactNode;
    activeColor: string;
    activeBg: string;
    badge?: number;
    onClick?: () => void;
  }> = [
    {
      id: 'today',
      label: 'Hôm nay',
      icon: <Sun className="w-5 h-5" />,
      activeColor: '#F59E0B',
      activeBg: 'rgba(245,158,11,0.12)',
    },
    {
      id: 'tasks',
      label: 'Công việc',
      icon: <CheckSquare className="w-5 h-5" />,
      activeColor: '#FF8FAB',
      activeBg: 'rgba(255,143,171,0.12)',
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'projects',
      label: 'Dự án',
      icon: <Folder className="w-5 h-5" />,
      activeColor: '#A78BFA',
      activeBg: 'rgba(167,139,250,0.12)',
      onClick: () => {
        setSelectedProjectId('all');
        setActiveView('tasks');
      }
    },
    {
      id: 'page',
      label: 'Tài liệu',
      icon: <FileText className="w-5 h-5" />,
      activeColor: '#34D399',
      activeBg: 'rgba(52,211,153,0.12)',
      onClick: () => {
        if (!selectedPageId && pages.length > 0) {
          setSelectedPageId(pages[0].id);
        }
        setActiveView('page');
      }
    },
    {
      id: 'settings',
      label: 'Cài đặt',
      icon: <Settings className="w-5 h-5" />,
      activeColor: '#94A3B8',
      activeBg: 'rgba(148,163,184,0.12)',
    },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-2 py-1.5 flex items-center justify-around"
      style={{ 
        paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-card)',
        boxShadow: '0 -4px 20px rgba(255,143,171,0.06)',
      }}
    >
      {navItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => {
              if (item.onClick) {
                item.onClick();
              } else {
                setActiveView(item.id);
              }
            }}
            className="flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl min-w-[56px] min-h-[52px] transition-all cursor-pointer relative"
            style={isActive ? {
              background: item.activeBg,
              color: item.activeColor,
              fontWeight: 800,
              transform: 'scale(1.05)',
            } : {
              color: 'var(--text-dim)',
            }}
          >
            <div className="relative">
              {isActive ? (
                <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: item.activeBg }}>
                  {item.icon}
                </div>
              ) : (
                item.icon
              )}
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2.5 text-white text-[9px] font-black rounded-full min-w-4 h-4 px-1 flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #FF8FAB, #FF6B8A)', border: '2px solid white' }}>
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5" style={{ fontWeight: isActive ? 800 : 600 }}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
