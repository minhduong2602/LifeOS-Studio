export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  projectId?: string;
  tags: string[];
  subtasks: Subtask[];
  estimatedMinutes?: number;
  actualMinutes?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  synced: boolean;
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type BlockType = 
  | 'text' 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'todo' 
  | 'bullet' 
  | 'numbered' 
  | 'toggle' 
  | 'callout' 
  | 'quote' 
  | 'code' 
  | 'divider' 
  | 'image';

export interface Block {
  id: string;
  pageId: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  isOpen?: boolean; // For toggle blocks
  calloutIcon?: string;
  language?: string;
  order: number;
  updatedAt: string;
}

export interface Page {
  id: string;
  title: string;
  icon: string;
  coverImage?: string;
  parentId?: string | null;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
}

export interface Habit {
  id: string;
  title: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  targetDaysPerWeek: number;
  category: 'health' | 'productivity' | 'learning' | 'mindfulness' | 'fitness';
  streak: number;
  bestStreak: number;
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number;
  note?: string;
}

export interface TimeBlock {
  id: string;
  timeSlot: string; // "09:00 - 10:00"
  title: string;
  taskId?: string;
  category: 'deep_work' | 'meeting' | 'admin' | 'break' | 'personal';
  completed: boolean;
}

export interface SyncQueueItem {
  id: string;
  table: string;
  recordId: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: string; // JSON
  timestamp: string;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'synced';
}

export interface CloudBackupSnapshot {
  id: string;
  name: string;
  timestamp: string;
  itemCount: {
    tasks: number;
    pages: number;
    blocks: number;
    habits: number;
  };
  dataPayload: string;
  sizeKb: number;
}

export type ViewMode = 
  | 'glass_dashboard'
  | 'kanban' 
  | 'list' 
  | 'calendar' 
  | 'daily_agenda' 
  | 'page' 
  | 'habit_tracker' 
  | 'image_notes'
  | 'lectures'
  | 'sqlite_console' 
  | 'sync_center' 
  | 'android_build';

export interface WallpaperOption {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  description: string;
}

export interface ImageNoteItem {
  id: string;
  title: string;
  caption: string;
  imageUrl: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
}

export interface LectureItem {
  id: string;
  title: string;
  subject: string;
  notesCount: number;
  lastStudied: string;
  isFavorite: boolean;
  coverImage?: string;
  summary: string;
}

export type ThemePalette = 'default' | 'forest' | 'midnight' | 'sunset' | 'nord' | 'lavender';

export interface ThemeOption {
  id: ThemePalette;
  name: string;
  tagline: string;
  icon: string;
  previewColors: {
    bg: string;
    sidebar: string;
    card: string;
    primary: string;
    accent: string;
    text: string;
  };
}
