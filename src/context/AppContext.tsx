import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Project,
  Page,
  Block,
  Habit,
  HabitLog,
  TimeBlock,
  SyncQueueItem,
  CloudBackupSnapshot,
  ViewMode,
  TaskPriority,
  TaskStatus,
  ThemePalette,
  ThemeOption,
  WallpaperOption,
  ImageNoteItem,
  LectureItem,
  UserEnergyProfile,
  AIPerformancePlan,
  AIProviderConfig,
  AIProviderType,
  ProviderSpecificConfig,
} from '../types';
import { sqliteEngine, DEFAULT_WALLPAPERS } from '../db/sqliteStorage';

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: 'kawaii',
    name: 'Kawaii Pastel',
    tagline: 'Tươi sáng, dễ thương với tông pastel hồng & mint',
    icon: '🌸',
    previewColors: {
      bg: '#FFF8F0',
      sidebar: '#FFF5EE',
      card: '#ffffff',
      primary: '#FF8FAB',
      accent: '#A78BFA',
      text: '#4A3728',
    },
  },
  {
    id: 'default',
    name: 'Notion Classic',
    tagline: 'Timeless warm stone with indigo accents',
    icon: '🪐',
    previewColors: {
      bg: '#f5f5f4',
      sidebar: '#fafaf9',
      card: '#ffffff',
      primary: '#4f46e5',
      accent: '#6366f1',
      text: '#1c1917',
    },
  },
  {
    id: 'forest',
    name: 'Forest Emerald',
    tagline: 'Deep pine moss with radiant emerald & sage',
    icon: '🌲',
    previewColors: {
      bg: '#051c14',
      sidebar: '#02130d',
      card: '#0a2e22',
      primary: '#059669',
      accent: '#10b981',
      text: '#ecfdf5',
    },
  },
  {
    id: 'midnight',
    name: 'Obsidian Midnight',
    tagline: 'Deep space navy with neon sapphire & cyan glow',
    icon: '🌌',
    previewColors: {
      bg: '#070b14',
      sidebar: '#050810',
      card: '#0d1527',
      primary: '#0284c7',
      accent: '#38bdf8',
      text: '#f0f9ff',
    },
  },
  {
    id: 'sunset',
    name: 'Dusk Sunset',
    tagline: 'Warm terracotta, golden honey & twilight coral',
    icon: '🌅',
    previewColors: {
      bg: '#1a0c0f',
      sidebar: '#120709',
      card: '#291319',
      primary: '#ea580c',
      accent: '#f97316',
      text: '#fff1f2',
    },
  },
  {
    id: 'nord',
    name: 'Arctic Nord',
    tagline: 'Glacier slate, frosty ice cyan & arctic calm',
    icon: '❄️',
    previewColors: {
      bg: '#242933',
      sidebar: '#1d212a',
      card: '#2e3440',
      primary: '#475569',
      accent: '#38bdf8',
      text: '#eceff4',
    },
  },
  {
    id: 'lavender',
    name: 'Velvet Lavender',
    tagline: 'Muted dusty amethyst & twilight violet plum',
    icon: '🔮',
    previewColors: {
      bg: '#150a21',
      sidebar: '#0e0617',
      card: '#231238',
      primary: '#7c3aed',
      accent: '#a855f7',
      text: '#faf5ff',
    },
  },
  {
    id: 'starbucks',
    name: 'Starbucks Reserve',
    tagline: 'Warm café cream canvas with four-tier Starbucks green & gold',
    icon: '☕',
    previewColors: {
      bg: '#f2f0eb',
      sidebar: '#edebe9',
      card: '#ffffff',
      primary: '#00754A',
      accent: '#cba258',
      text: '#1E3932',
    },
  },
];

export const DEFAULT_AI_CONFIG: AIProviderConfig = {
  activeProvider: 'gemini',
  providers: {
    gemini: {
      apiKey: '',
      model: 'gemini-2.5-flash',
      baseUrl: '',
      temperature: 0.2,
    },
    openrouter: {
      apiKey: '',
      model: 'google/gemini-2.5-flash',
      baseUrl: 'https://openrouter.ai/api/v1/chat/completions',
      temperature: 0.2,
    },
    openai: {
      apiKey: '',
      model: 'gpt-4o-mini',
      baseUrl: 'https://api.openai.com/v1/chat/completions',
      temperature: 0.2,
    },
    custom: {
      apiKey: '',
      model: 'llama3.3',
      baseUrl: 'http://localhost:11434/v1',
      temperature: 0.2,
    },
  },
};

interface AppContextType {
  // State
  tasks: Task[];
  projects: Project[];
  pages: Page[];
  habits: Habit[];
  habitLogs: HabitLog[];
  timeBlocks: TimeBlock[];
  syncQueue: SyncQueueItem[];
  backups: CloudBackupSnapshot[];
  imageNotes: ImageNoteItem[];
  lectures: LectureItem[];
  
  // Wallpaper & Theme State
  theme: ThemePalette;
  setTheme: (theme: ThemePalette) => void;
  availableThemes: ThemeOption[];
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  wallpapers: WallpaperOption[];
  activeWallpaper: string;
  setActiveWallpaper: (url: string) => void;
  isWallpaperModalOpen: boolean;
  setIsWallpaperModalOpen: (open: boolean) => void;

  // Navigation & Selection
  activeView: ViewMode;
  setActiveView: (view: ViewMode) => void;
  selectedPageId: string | null;
  setSelectedPageId: (id: string | null) => void;
  selectedTaskId: string | null;
  setSelectedTaskId: (id: string | null) => void;
  selectedProjectId: string | 'all';
  setSelectedProjectId: (id: string | 'all') => void;
  
  // Search & Filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterPriority: TaskPriority | 'all';
  setFilterPriority: (priority: TaskPriority | 'all') => void;
  filterStatus: TaskStatus | 'all';
  setFilterStatus: (status: TaskStatus | 'all') => void;

  // UI Controls
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isQuickCaptureOpen: boolean;
  setIsQuickCaptureOpen: (open: boolean) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  isSyncing: boolean;
  triggerSync: () => Promise<void>;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTaskStatus: (taskId: string, newStatus: TaskStatus, newIndex?: number) => void;
  reorderTasks: (tasks: Task[]) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addQuickTask: (title: string, priority?: TaskPriority) => Task;
  
  // Image Notes Actions
  addImageNote: (note: Omit<ImageNoteItem, 'id' | 'updatedAt'>) => ImageNoteItem;
  updateImageNote: (id: string, updates: Partial<ImageNoteItem>) => void;
  deleteImageNote: (id: string) => void;
  toggleImageNoteFavorite: (id: string) => void;

  // Lectures Actions
  addLecture: (lecture: Omit<LectureItem, 'id' | 'lastStudied'>) => LectureItem;
  updateLecture: (id: string, updates: Partial<LectureItem>) => void;
  deleteLecture: (id: string) => void;
  toggleLectureFavorite: (id: string) => void;

  // Project Actions
  addProject: (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Page Actions
  addPage: (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => Page;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  duplicatePage: (id: string) => Page | null;
  
  // Block Actions
  getPageBlocks: (pageId: string) => Block[];
  addBlock: (block: Omit<Block, 'id' | 'updatedAt'>) => Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  reorderBlocks: (pageId: string, blocks: Block[]) => void;

  // Habit Actions
  toggleHabit: (habitId: string, date?: string) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'createdAt'>) => Habit;
  deleteHabit: (id: string) => void;

  // TimeBlock Actions
  toggleTimeBlock: (id: string) => void;
  addTimeBlock: (tb: Omit<TimeBlock, 'id'>) => TimeBlock;
  deleteTimeBlock: (id: string) => void;
  setTimeBlocks: (blocks: TimeBlock[]) => void;
  applyAISchedule: (newTimeBlocks: Array<Omit<TimeBlock, 'id'> | TimeBlock>, clearExisting?: boolean) => void;
  clearTimeBlocks: () => void;

  // AI Copilot & Energy Profile
  isPlanModalOpen: boolean;
  setIsPlanModalOpen: (open: boolean) => void;
  energyProfile: UserEnergyProfile;
  setEnergyProfile: (profile: UserEnergyProfile) => void;
  updateEnergyProfile: (updates: Partial<UserEnergyProfile>) => void;

  // Wide-Adapt AI Provider Configuration
  aiConfig: AIProviderConfig;
  setAIConfig: (cfg: AIProviderConfig) => void;
  updateAIConfig: (updates: Partial<AIProviderConfig>) => void;
  updateProviderConfig: (provider: AIProviderType, updates: Partial<ProviderSpecificConfig>) => void;
  setActiveProvider: (provider: AIProviderType) => void;
  getActiveAIConfig: () => { provider: AIProviderType; apiKey: string; model: string; baseUrl?: string; temperature?: number };
  isAISettingsModalOpen: boolean;
  setIsAISettingsModalOpen: (open: boolean) => void;

  // Cloud & Backup Actions
  createBackup: (name?: string) => CloudBackupSnapshot;
  restoreBackup: (id: string) => boolean;
  deleteBackup: (id: string) => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => sqliteEngine.getTasks());
  const [projects, setProjects] = useState<Project[]>(() => sqliteEngine.getProjects());
  const [pages, setPages] = useState<Page[]>(() => sqliteEngine.getPages());
  const [habits, setHabits] = useState<Habit[]>(() => sqliteEngine.getHabits());
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>(() => sqliteEngine.getHabitLogs());
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(() => sqliteEngine.getTimeBlocks());
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>(() => sqliteEngine.getSyncQueue());
  const [backups, setBackups] = useState<CloudBackupSnapshot[]>(() => sqliteEngine.getBackups());
  const [imageNotes, setImageNotes] = useState<ImageNoteItem[]>(() => sqliteEngine.getImageNotes());
  const [lectures, setLectures] = useState<LectureItem[]>(() => sqliteEngine.getLectures());
  const [wallpapers] = useState<WallpaperOption[]>(() => sqliteEngine.getWallpapers());
  const [activeWallpaper, setActiveWallpaperState] = useState<string>(() => sqliteEngine.getActiveWallpaper());
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);

  // User Energy Profile for AI Copilot
  const [energyProfile, setEnergyProfileState] = useState<UserEnergyProfile>(() => {
    const saved = sqliteEngine.getSetting('user_energy_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      workStart: '08:30',
      workEnd: '18:00',
      lunchStart: '12:00',
      lunchDurationMinutes: 60,
      peakFocusPeriod: 'morning',
      bufferMinutes: 10,
    };
  });

  const updateEnergyProfile = useCallback((updates: Partial<UserEnergyProfile>) => {
    setEnergyProfileState((prev) => {
      const next = { ...prev, ...updates };
      sqliteEngine.setSetting('user_energy_profile', JSON.stringify(next));
      return next;
    });
  }, []);

  const setEnergyProfile = useCallback((profile: UserEnergyProfile) => {
    setEnergyProfileState(profile);
    sqliteEngine.setSetting('user_energy_profile', JSON.stringify(profile));
  }, []);

  // Theme state backed by SQLite
  const [theme, setThemeState] = useState<ThemePalette>(() => {
    const saved = sqliteEngine.getSetting('theme_palette', 'kawaii') as ThemePalette;
    const initial = saved || 'kawaii';
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', initial);
      if (['forest', 'midnight', 'sunset', 'nord', 'lavender'].includes(initial)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    return initial;
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAISettingsModalOpen, setIsAISettingsModalOpen] = useState(false);

  // Wide-Adapt AI Provider Configuration (Per-Provider Credentials)
  const [aiConfig, setAIConfigState] = useState<AIProviderConfig>(() => {
    const saved = sqliteEngine.getSetting('ai_provider_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.providers && parsed.activeProvider) {
          return {
            ...DEFAULT_AI_CONFIG,
            ...parsed,
            providers: {
              ...DEFAULT_AI_CONFIG.providers,
              ...parsed.providers,
            },
          };
        }
        // Migrate legacy flat structure
        const legacyProvider: AIProviderType = (parsed.provider || parsed.activeProvider || 'gemini') as AIProviderType;
        return {
          ...DEFAULT_AI_CONFIG,
          activeProvider: legacyProvider,
          providers: {
            ...DEFAULT_AI_CONFIG.providers,
            [legacyProvider]: {
              apiKey: parsed.apiKey || '',
              model: parsed.model || DEFAULT_AI_CONFIG.providers[legacyProvider]?.model || 'gemini-2.5-flash',
              baseUrl: parsed.baseUrl || DEFAULT_AI_CONFIG.providers[legacyProvider]?.baseUrl || '',
              temperature: parsed.temperature ?? 0.2,
            },
          },
        };
      } catch (e) {}
    }
    return DEFAULT_AI_CONFIG;
  });

  const updateProviderConfig = useCallback((provider: AIProviderType, updates: Partial<ProviderSpecificConfig>) => {
    setAIConfigState((prev) => {
      const currentProviderCfg = prev.providers?.[provider] || DEFAULT_AI_CONFIG.providers[provider];
      const next: AIProviderConfig = {
        ...prev,
        providers: {
          ...prev.providers,
          [provider]: {
            ...currentProviderCfg,
            ...updates,
          },
        },
      };
      sqliteEngine.setSetting('ai_provider_config', JSON.stringify(next));
      return next;
    });
  }, []);

  const setActiveProvider = useCallback((provider: AIProviderType) => {
    setAIConfigState((prev) => {
      const next: AIProviderConfig = {
        ...prev,
        activeProvider: provider,
      };
      sqliteEngine.setSetting('ai_provider_config', JSON.stringify(next));
      return next;
    });
  }, []);

  const getActiveAIConfig = useCallback(() => {
    const active = aiConfig.activeProvider || 'gemini';
    const cfg = aiConfig.providers?.[active] || DEFAULT_AI_CONFIG.providers[active] || DEFAULT_AI_CONFIG.providers.gemini;
    return {
      provider: active,
      apiKey: cfg.apiKey || '',
      model: cfg.model,
      baseUrl: cfg.baseUrl,
      temperature: cfg.temperature ?? 0.2,
    };
  }, [aiConfig]);

  const updateAIConfig = useCallback((updates: Partial<AIProviderConfig>) => {
    setAIConfigState((prev) => {
      const next = { ...prev, ...updates };
      sqliteEngine.setSetting('ai_provider_config', JSON.stringify(next));
      return next;
    });
  }, []);

  const setAIConfig = useCallback((cfg: AIProviderConfig) => {
    setAIConfigState(cfg);
    sqliteEngine.setSetting('ai_provider_config', JSON.stringify(cfg));
  }, []);

  // Default to the new glass dashboard view directly inspired by the user's uploaded screenshot
  const [activeView, setActiveView] = useState<ViewMode>('today');
  const [selectedPageId, setSelectedPageId] = useState<string | null>('page-1');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'all'>('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine ?? true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Set theme attribute & dark class on DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (['forest', 'midnight', 'sunset', 'nord', 'lavender'].includes(theme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemePalette) => {
    setThemeState(newTheme);
    sqliteEngine.setSetting('theme_palette', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    if (['forest', 'midnight', 'sunset', 'nord', 'lavender'].includes(newTheme)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Sync engine listener
  const refreshFromDb = useCallback(() => {
    setTasks(sqliteEngine.getTasks());
    setProjects(sqliteEngine.getProjects());
    setPages(sqliteEngine.getPages());
    setHabits(sqliteEngine.getHabits());
    setHabitLogs(sqliteEngine.getHabitLogs());
    setTimeBlocks(sqliteEngine.getTimeBlocks());
    setSyncQueue(sqliteEngine.getSyncQueue());
    setBackups(sqliteEngine.getBackups());
    setImageNotes(sqliteEngine.getImageNotes());
    setLectures(sqliteEngine.getLectures());
    setActiveWallpaperState(sqliteEngine.getActiveWallpaper());
    const savedTheme = sqliteEngine.getSetting('theme_palette', 'default') as ThemePalette;
    if (savedTheme && savedTheme !== theme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = sqliteEngine.subscribe(refreshFromDb);
    
    // Window online/offline listener
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Keyboard shortcut for quick capture: Ctrl+K or Cmd+K or 'N'
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unsubscribe();
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [refreshFromDb]);

  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
      });
    } catch {
      // ignore
    }
  }, []);

  const triggerSync = async () => {
    if (!isOnline) return;
    setIsSyncing(true);
    // Simulate real cloud sync handshake over network
    await new Promise((resolve) => setTimeout(resolve, 1200));
    sqliteEngine.clearSyncQueue();
    setIsSyncing(false);
  };

  // Task actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
    return sqliteEngine.addTask(taskData);
  };

  const addQuickTask = (title: string, priority: TaskPriority = 'medium') => {
    const created = sqliteEngine.addTask({
      title,
      description: '',
      status: 'todo',
      priority,
      projectId: 'proj-1',
      tags: ['QuickPlan'],
      subtasks: [],
      dueDate: new Date().toISOString().split('T')[0],
      order: 0,
    });
    return created;
  };

  const toggleTaskCompletion = (taskId: string) => {
    const task = sqliteEngine.getTaskById(taskId);
    if (!task) return;
    const nextStatus: TaskStatus = task.status === 'done' ? 'todo' : 'done';
    if (nextStatus === 'done') {
      triggerCelebration();
    }
    sqliteEngine.updateTask(taskId, { status: nextStatus });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    sqliteEngine.updateTask(id, updates);
  };

  const deleteTask = (id: string) => {
    sqliteEngine.deleteTask(id);
    if (selectedTaskId === id) setSelectedTaskId(null);
  };

  const moveTaskStatus = (taskId: string, newStatus: TaskStatus, newIndex?: number) => {
    const task = sqliteEngine.getTaskById(taskId);
    if (!task) return;

    if (newStatus === 'done' && task.status !== 'done') {
      triggerCelebration();
    }

    const currentTasks = sqliteEngine.getTasks();
    const otherTasks = currentTasks.filter((t) => t.id !== taskId);
    const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString() };

    if (newIndex !== undefined) {
      const columnTasks = otherTasks.filter((t) => t.status === newStatus);
      columnTasks.splice(newIndex, 0, updatedTask);
      const remainingTasks = otherTasks.filter((t) => t.status !== newStatus);
      const allReordered = [...remainingTasks, ...columnTasks].map((t, idx) => ({ ...t, order: idx }));
      sqliteEngine.reorderTasks(allReordered);
      sqliteEngine.updateTask(taskId, { status: newStatus });
    } else {
      sqliteEngine.updateTask(taskId, { status: newStatus });
    }
  };

  const reorderTasks = (newTasks: Task[]) => {
    sqliteEngine.reorderTasks(newTasks);
  };

  // Wallpaper action
  const setActiveWallpaper = (url: string) => {
    sqliteEngine.setActiveWallpaper(url);
    setActiveWallpaperState(url);
  };

  // Image Notes actions
  const addImageNote = (note: Omit<ImageNoteItem, 'id' | 'updatedAt'>) => {
    return sqliteEngine.addImageNote(note);
  };

  const updateImageNote = (id: string, updates: Partial<ImageNoteItem>) => {
    sqliteEngine.updateImageNote(id, updates);
  };

  const deleteImageNote = (id: string) => {
    sqliteEngine.deleteImageNote(id);
  };

  const toggleImageNoteFavorite = (id: string) => {
    sqliteEngine.toggleImageNoteFavorite(id);
  };

  // Lectures actions
  const addLecture = (lec: Omit<LectureItem, 'id' | 'lastStudied'>) => {
    return sqliteEngine.addLecture(lec);
  };

  const updateLecture = (id: string, updates: Partial<LectureItem>) => {
    sqliteEngine.updateLecture(id, updates);
  };

  const deleteLecture = (id: string) => {
    sqliteEngine.deleteLecture(id);
  };

  const toggleLectureFavorite = (id: string) => {
    sqliteEngine.toggleLectureFavorite(id);
  };

  // Project actions
  const addProject = (proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    return sqliteEngine.addProject(proj);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    sqliteEngine.updateProject(id, updates);
  };

  const deleteProject = (id: string) => {
    sqliteEngine.deleteProject(id);
    if (selectedProjectId === id) {
      setSelectedProjectId('all');
    }
  };

  // Page actions
  const addPage = (page: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'synced'>) => {
    const p = sqliteEngine.addPage(page);
    setSelectedPageId(p.id);
    setActiveView('page');
    return p;
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    sqliteEngine.updatePage(id, updates);
  };

  const deletePage = (id: string) => {
    sqliteEngine.deletePage(id);
    const remaining = sqliteEngine.getPages();
    if (selectedPageId === id) {
      setSelectedPageId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const duplicatePage = (id: string) => {
    const original = sqliteEngine.getPageById(id);
    if (!original) return null;
    const newPage = sqliteEngine.addPage({
      title: `${original.title} (Copy)`,
      icon: original.icon,
      coverImage: original.coverImage,
      parentId: original.parentId,
      isFavorite: false,
    });
    // Duplicate its blocks
    const originalBlocks = sqliteEngine.getBlocks(id);
    originalBlocks.forEach((b) => {
      sqliteEngine.addBlock({
        pageId: newPage.id,
        type: b.type,
        content: b.content,
        checked: b.checked,
        order: b.order,
        language: b.language,
        calloutIcon: b.calloutIcon,
      });
    });
    setSelectedPageId(newPage.id);
    setActiveView('page');
    return newPage;
  };

  // Block actions
  const getPageBlocks = (pageId: string) => {
    return sqliteEngine.getBlocks(pageId);
  };

  const addBlock = (block: Omit<Block, 'id' | 'updatedAt'>) => {
    return sqliteEngine.addBlock(block);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    sqliteEngine.updateBlock(id, updates);
  };

  const deleteBlock = (id: string) => {
    sqliteEngine.deleteBlock(id);
  };

  const reorderBlocks = (pageId: string, blocks: Block[]) => {
    sqliteEngine.reorderBlocks(pageId, blocks);
  };

  // Habit actions
  const toggleHabit = (habitId: string, date?: string) => {
    const todayStr = date || new Date().toISOString().split('T')[0];
    const log = sqliteEngine.toggleHabitLog(habitId, todayStr);
    if (log.completed) {
      // Check if all habits for today are now completed
      const allTodayCompleted = habits.every((h) => {
        if (h.id === habitId) return true;
        const hl = habitLogs.find((l) => l.habitId === h.id && l.date === todayStr);
        return hl?.completed;
      });
      if (allTodayCompleted) {
        triggerCelebration();
      }
    }
  };

  const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'createdAt'>) => {
    return sqliteEngine.addHabit(habit);
  };

  const deleteHabit = (id: string) => {
    sqliteEngine.deleteHabit(id);
  };

  // TimeBlock actions
  const toggleTimeBlock = (id: string) => {
    sqliteEngine.toggleTimeBlock(id);
  };

  const addTimeBlock = (tb: Omit<TimeBlock, 'id'>) => {
    return sqliteEngine.addTimeBlock(tb);
  };

  const deleteTimeBlock = (id: string) => {
    sqliteEngine.deleteTimeBlock(id);
  };

  const setTimeBlocksCustom = (blocks: TimeBlock[]) => {
    sqliteEngine.setTimeBlocks(blocks);
  };

  const applyAISchedule = (newBlocks: Array<Omit<TimeBlock, 'id'> | TimeBlock>, clearExisting: boolean = true) => {
    const formatted: TimeBlock[] = newBlocks.map((b, idx) => ({
      ...b,
      id: (b as TimeBlock).id || `tb-ai-${Date.now()}-${idx}`,
      completed: (b as TimeBlock).completed ?? false,
      isAutoPlanned: true,
    }));
    if (clearExisting) {
      sqliteEngine.setTimeBlocks(formatted);
    } else {
      const merged = [...sqliteEngine.getTimeBlocks(), ...formatted];
      sqliteEngine.setTimeBlocks(merged);
    }
    triggerCelebration();
  };

  const clearTimeBlocks = () => {
    sqliteEngine.setTimeBlocks([]);
  };

  // Cloud & Backup
  const createBackup = (name?: string) => {
    return sqliteEngine.createBackup(name);
  };

  const restoreBackup = (id: string) => {
    return sqliteEngine.restoreBackup(id);
  };

  const deleteBackup = (id: string) => {
    sqliteEngine.deleteBackup(id);
  };

  return (
    <AppContext.Provider
      value={{
        tasks,
        projects,
        pages,
        habits,
        habitLogs,
        timeBlocks,
        syncQueue,
        backups,
        imageNotes,
        lectures,
        theme,
        setTheme,
        availableThemes: AVAILABLE_THEMES,
        isThemeModalOpen,
        setIsThemeModalOpen,
        wallpapers,
        activeWallpaper,
        setActiveWallpaper,
        isWallpaperModalOpen,
        setIsWallpaperModalOpen,
        isPlanModalOpen,
        setIsPlanModalOpen,
        energyProfile,
        setEnergyProfile,
        updateEnergyProfile,
        aiConfig,
        setAIConfig,
        updateAIConfig,
        updateProviderConfig,
        setActiveProvider,
        getActiveAIConfig,
        isAISettingsModalOpen,
        setIsAISettingsModalOpen,
        activeView,
        setActiveView,
        selectedPageId,
        setSelectedPageId,
        selectedTaskId,
        setSelectedTaskId,
        selectedProjectId,
        setSelectedProjectId,
        searchQuery,
        setSearchQuery,
        filterPriority,
        setFilterPriority,
        filterStatus,
        setFilterStatus,
        isSidebarOpen,
        setIsSidebarOpen,
        isQuickCaptureOpen,
        setIsQuickCaptureOpen,
        isOnline,
        setIsOnline,
        isSyncing,
        triggerSync,
        addTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        reorderTasks,
        toggleTaskCompletion,
        addQuickTask,
        addImageNote,
        updateImageNote,
        deleteImageNote,
        toggleImageNoteFavorite,
        addLecture,
        updateLecture,
        deleteLecture,
        toggleLectureFavorite,
        addProject,
        updateProject,
        deleteProject,
        addPage,
        updatePage,
        deletePage,
        duplicatePage,
        getPageBlocks,
        addBlock,
        updateBlock,
        deleteBlock,
        reorderBlocks,
        toggleHabit,
        addHabit,
        deleteHabit,
        toggleTimeBlock,
        addTimeBlock,
        deleteTimeBlock,
        setTimeBlocks: setTimeBlocksCustom,
        applyAISchedule,
        clearTimeBlocks,
        createBackup,
        restoreBackup,
        deleteBackup,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
