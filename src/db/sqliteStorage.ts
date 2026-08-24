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
  WallpaperOption,
  ImageNoteItem,
  LectureItem 
} from '../types';

const STORAGE_KEYS = {
  TASKS: 'notionlife_sqlite_tasks',
  PROJECTS: 'notionlife_sqlite_projects',
  PAGES: 'notionlife_sqlite_pages',
  BLOCKS: 'notionlife_sqlite_blocks',
  HABITS: 'notionlife_sqlite_habits',
  HABIT_LOGS: 'notionlife_sqlite_habit_logs',
  TIME_BLOCKS: 'notionlife_sqlite_time_blocks',
  SYNC_QUEUE: 'notionlife_sqlite_sync_queue',
  BACKUPS: 'notionlife_sqlite_cloud_backups',
  SETTINGS: 'notionlife_sqlite_settings',
  IMAGE_NOTES: 'notionlife_sqlite_image_notes',
  LECTURES: 'notionlife_sqlite_lectures',
  WALLPAPER: 'notionlife_sqlite_active_wallpaper',
};

export const DEFAULT_WALLPAPERS: WallpaperOption[] = [
  {
    id: 'highland_mountain',
    name: 'Highland Emerald (Screenshot)',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80',
    description: 'Moody highland mountain with vibrant green hills & dramatic skies'
  },
  {
    id: 'misty_pines',
    name: 'Misty Alpine Forest',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2000&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=300&q=80',
    description: 'Serene emerald pine forest blanketed in soft morning mist'
  },
  {
    id: 'golden_peaks',
    name: 'Dusk Mountain Peaks',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=300&q=80',
    description: 'Warm golden sunlight cutting through dramatic alpine ridges'
  },
  {
    id: 'obsidian_night',
    name: 'Obsidian Midnight Sky',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=80',
    description: 'Deep cosmic starscape with neon midnight hues'
  },
  {
    id: 'nordic_glacier',
    name: 'Arctic Nordic Range',
    url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=2000&q=85',
    thumbnail: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=300&q=80',
    description: 'Glacier peaks with cool slate and crystal ice blue reflections'
  }
];

export const DEFAULT_IMAGE_NOTES: ImageNoteItem[] = [
  {
    id: 'img-1',
    title: 'Image Notes',
    caption: 'Misty golden path with mountain travelers & sunset warmth',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
    updatedAt: '2m ago',
    isFavorite: true,
    tags: ['Travel', 'Inspiration', 'Photography']
  },
  {
    id: 'img-2',
    title: 'Architectural Studies',
    caption: 'Minimalist glass concrete pavilion in morning light',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    updatedAt: '1h ago',
    isFavorite: false,
    tags: ['Design', 'Space', 'Minimal']
  },
  {
    id: 'img-3',
    title: 'Botanical Greenhouse',
    caption: 'Highland plant species and tropical fern studies',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    updatedAt: 'Yesterday',
    isFavorite: true,
    tags: ['Nature', 'Study']
  }
];

export const DEFAULT_LECTURES: LectureItem[] = [
  {
    id: 'lec-1',
    title: 'My Lectures',
    subject: 'Cognitive Science & Memory Stacks',
    notesCount: 24,
    lastStudied: 'Today',
    isFavorite: true,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Deep dive into memory consolidation, spaced repetition, and attention retention mechanisms.'
  },
  {
    id: 'lec-2',
    title: 'Distributed Systems & WAL',
    subject: 'Computer Science',
    notesCount: 18,
    lastStudied: 'Yesterday',
    isFavorite: true,
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    summary: 'Write-ahead logging, zero-latency caching, and offline SQLite schema synchronization.'
  },
  {
    id: 'lec-3',
    title: 'Optical UI Systems & Glass',
    subject: 'Design Systems',
    notesCount: 12,
    lastStudied: '3 days ago',
    isFavorite: false,
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    summary: 'Frosted glassmorphism, optical legibility, and high-performance micro-interactions.'
  }
];

// Initial Seed Data
const DEFAULT_PROJECTS: Project[] = [
  { id: 'proj-1', name: 'Life Operating System', icon: '🌱', color: 'emerald', description: 'Core personal routines and long-term milestones', createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-20T10:00:00Z' },
  { id: 'proj-2', name: 'Work & Engineering', icon: '⚡', color: 'sky', description: 'Development tasks, sprint roadmap, architecture notes', createdAt: '2026-08-01T00:00:00Z', updatedAt: '2026-08-22T14:30:00Z' },
  { id: 'proj-3', name: 'Health & Fitness', icon: '🏃', color: 'rose', description: 'Workout split, nutrition tracker, sleep tracking', createdAt: '2026-08-05T00:00:00Z', updatedAt: '2026-08-21T08:00:00Z' },
  { id: 'proj-4', name: 'Knowledge Hub', icon: '📚', color: 'amber', description: 'Book notes, research papers, article highlights', createdAt: '2026-08-10T00:00:00Z', updatedAt: '2026-08-23T07:15:00Z' }
];

const DEFAULT_PAGES: Page[] = [
  { id: 'page-1', title: 'Daily Master Dashboard & Wiki', icon: '🪐', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', parentId: null, isFavorite: true, createdAt: '2026-08-15T09:00:00Z', updatedAt: '2026-08-23T08:00:00Z', synced: true },
  { id: 'page-2', title: 'Weekly Sprint & Goal Matrix', icon: '🎯', coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80', parentId: null, isFavorite: true, createdAt: '2026-08-18T11:00:00Z', updatedAt: '2026-08-22T19:00:00Z', synced: true },
  { id: 'page-3', title: 'Tauri & Mobile APK Build Guide', icon: '📱', coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80', parentId: null, isFavorite: false, createdAt: '2026-08-20T15:00:00Z', updatedAt: '2026-08-23T09:10:00Z', synced: true },
  { id: 'page-4', title: 'Reading & Ideas Scratchpad', icon: '💡', parentId: null, isFavorite: false, createdAt: '2026-08-21T10:00:00Z', updatedAt: '2026-08-23T09:20:00Z', synced: true }
];

const DEFAULT_BLOCKS: Block[] = [
  // Blocks for Page 1: Daily Master Dashboard & Wiki
  { id: 'blk-1', pageId: 'page-1', type: 'h1', content: 'Welcome to your Offline-First Life Operating System', order: 0, updatedAt: '2026-08-23T08:00:00Z' },
  { id: 'blk-2', pageId: 'page-1', type: 'callout', content: '🔒 Offline First: All tasks, pages, and habit records are stored in high-performance local SQLite storage. Changes sync automatically when connected.', calloutIcon: '💡', order: 1, updatedAt: '2026-08-23T08:01:00Z' },
  { id: 'blk-3', pageId: 'page-1', type: 'h2', content: '🎯 Quick Philosophy & Workflow Rules', order: 2, updatedAt: '2026-08-23T08:02:00Z' },
  { id: 'blk-4', pageId: 'page-1', type: 'bullet', content: 'Eat that frog first thing in the morning (urgent deep work before notifications)', order: 3, updatedAt: '2026-08-23T08:03:00Z' },
  { id: 'blk-5', pageId: 'page-1', type: 'bullet', content: 'Capture fast into Backlog, triage once daily during the evening review', order: 4, updatedAt: '2026-08-23T08:04:00Z' },
  { id: 'blk-6', pageId: 'page-1', type: 'bullet', content: 'Drag and drop cards across Kanban swimlanes to preserve cognitive flow', order: 5, updatedAt: '2026-08-23T08:05:00Z' },
  { id: 'blk-7', pageId: 'page-1', type: 'divider', content: '', order: 6, updatedAt: '2026-08-23T08:06:00Z' },
  { id: 'blk-8', pageId: 'page-1', type: 'h2', content: '✅ Today’s Immediate Action Checklist', order: 7, updatedAt: '2026-08-23T08:07:00Z' },
  { id: 'blk-9', pageId: 'page-1', type: 'todo', content: 'Review Tauri v2 SQLite offline schema migrations', checked: true, order: 8, updatedAt: '2026-08-23T08:08:00Z' },
  { id: 'blk-10', pageId: 'page-1', type: 'todo', content: 'Test Android ARM64 touch drag-and-drop performance on mobile viewport', checked: false, order: 9, updatedAt: '2026-08-23T08:09:00Z' },
  { id: 'blk-11', pageId: 'page-1', type: 'todo', content: 'Execute Cloud Backup snapshot test with SQLite dump', checked: false, order: 10, updatedAt: '2026-08-23T08:10:00Z' },
  { id: 'blk-12', pageId: 'page-1', type: 'quote', content: '"Simplicity is prerequisite for reliability." – Edsger W. Dijkstra', order: 11, updatedAt: '2026-08-23T08:11:00Z' },
  { id: 'blk-13', pageId: 'page-1', type: 'code', content: '// Tauri SQLite local query bridge\nconst results = await db.select("SELECT * FROM tasks WHERE status = \'todo\';");\nconsole.log(`Loaded ${results.length} local records with 0 network latency!`);', language: 'typescript', order: 12, updatedAt: '2026-08-23T08:12:00Z' },

  // Blocks for Page 3: Tauri & Mobile APK Build Guide
  { id: 'blk-14', pageId: 'page-3', type: 'h1', content: 'Android ARM64 & Tauri Architecture Notes', order: 0, updatedAt: '2026-08-20T15:00:00Z' },
  { id: 'blk-15', pageId: 'page-3', type: 'callout', content: 'This application is packaged with native Rust bindings and local SQLite for instant startup and offline fidelity on Android and Desktop.', calloutIcon: '🦀', order: 1, updatedAt: '2026-08-20T15:01:00Z' },
  { id: 'blk-16', pageId: 'page-3', type: 'numbered', content: 'Run `npm run build` to generate static assets in dist/', order: 2, updatedAt: '2026-08-20T15:02:00Z' },
  { id: 'blk-17', pageId: 'page-3', type: 'numbered', content: 'Invoke `tauri android build --target aarch64-linux-android`', order: 3, updatedAt: '2026-08-20T15:03:00Z' },
  { id: 'blk-18', pageId: 'page-3', type: 'numbered', content: 'Sign APK or debug install via ADB', order: 4, updatedAt: '2026-08-20T15:04:00Z' },
];

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-quick-1',
    title: 'Buy-food',
    description: 'Weekly grocery restock: fresh greens, avocados, sourdough bread, oat milk & olive oil',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-08-23',
    projectId: 'proj-1',
    tags: ['QuickPlan', 'Personal'],
    subtasks: [
      { id: 'sq-1', title: 'Organic greens & vegetables', completed: false },
      { id: 'sq-2', title: 'Sourdough bread & eggs', completed: true },
    ],
    order: 0,
    createdAt: '2026-08-23T08:00:00Z',
    updatedAt: '2026-08-23T08:00:00Z',
    synced: true,
  },
  {
    id: 'task-quick-2',
    title: 'GYM',
    description: 'Full body resistance session: Squats, pull-ups, overhead press & 15m sauna',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-08-23',
    dueTime: '17:00',
    projectId: 'proj-3',
    tags: ['QuickPlan', 'Fitness'],
    subtasks: [
      { id: 'sq-3', title: 'Dynamic warmup & mobility', completed: false },
      { id: 'sq-4', title: 'Working sets & core stability', completed: false },
    ],
    order: 1,
    createdAt: '2026-08-23T08:05:00Z',
    updatedAt: '2026-08-23T08:05:00Z',
    synced: true,
  },
  {
    id: 'task-quick-3',
    title: 'Invest',
    description: 'Monthly DCA index allocation & portfolio balance check',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2026-08-23',
    projectId: 'proj-1',
    tags: ['QuickPlan', 'Finance'],
    subtasks: [
      { id: 'sq-5', title: 'Review high-yield savings auto-deposit', completed: true },
      { id: 'sq-6', title: 'DCA global index fund', completed: false },
    ],
    order: 2,
    createdAt: '2026-08-23T08:10:00Z',
    updatedAt: '2026-08-23T08:10:00Z',
    synced: true,
  },
  {
    id: 'task-1',
    title: 'Configure Tauri SQLite local storage layer',
    description: 'Set up indexed embedded SQLite driver for fast offline CRUD operations and persistent schema cache.',
    status: 'done',
    priority: 'high',
    dueDate: '2026-08-23',
    dueTime: '10:00',
    projectId: 'proj-2',
    tags: ['Architecture', 'SQLite', 'Tauri'],
    subtasks: [
      { id: 'st-1', title: 'Create DB tables & indexes', completed: true },
      { id: 'st-2', title: 'Add offline sync queue listener', completed: true },
    ],
    estimatedMinutes: 60,
    actualMinutes: 45,
    order: 3,
    createdAt: '2026-08-22T08:00:00Z',
    updatedAt: '2026-08-23T08:30:00Z',
    completedAt: '2026-08-23T08:30:00Z',
    synced: true,
  },
  {
    id: 'task-2',
    title: 'Build smooth Drag-and-Drop Kanban Board',
    description: 'Provide intuitive drag-and-drop task movement between columns and intra-column priority reordering with tactile animations.',
    status: 'in_progress',
    priority: 'urgent',
    dueDate: '2026-08-23',
    dueTime: '14:00',
    projectId: 'proj-2',
    tags: ['UI/UX', 'Kanban', 'Touch'],
    subtasks: [
      { id: 'st-3', title: 'Column drop zones & visual indicators', completed: true },
      { id: 'st-4', title: 'Mobile touch gesture support', completed: false },
      { id: 'st-5', title: 'Live card counter badges', completed: true },
    ],
    estimatedMinutes: 90,
    actualMinutes: 50,
    order: 0,
    createdAt: '2026-08-22T09:00:00Z',
    updatedAt: '2026-08-23T09:00:00Z',
    synced: true,
  },
  {
    id: 'task-3',
    title: 'Implement Notion-style Slash (/) Block Editor',
    description: 'Enable markdown, callout boxes, headers, todo checkboxes, toggle dropdowns, and code blocks with full reorder handles.',
    status: 'todo',
    priority: 'high',
    dueDate: '2026-08-24',
    dueTime: '11:00',
    projectId: 'proj-1',
    tags: ['Editor', 'Notion-Clone', 'Markdown'],
    subtasks: [
      { id: 'st-6', title: 'Slash command popup menu', completed: true },
      { id: 'st-7', title: 'Block drag handles & keyboard navigation', completed: false },
    ],
    estimatedMinutes: 120,
    order: 0,
    createdAt: '2026-08-22T10:00:00Z',
    updatedAt: '2026-08-23T07:00:00Z',
    synced: true,
  },
  {
    id: 'task-4',
    title: 'Design daily time-blocking planner & focus timer',
    description: 'Time block agenda for deep work sessions, breaks, and daily frog execution.',
    status: 'todo',
    priority: 'medium',
    dueDate: '2026-08-24',
    projectId: 'proj-1',
    tags: ['Productivity', 'DailyPlan'],
    subtasks: [
      { id: 'st-8', title: 'Time slot visualization', completed: true },
      { id: 'st-9', title: 'Task link attachment', completed: false },
    ],
    estimatedMinutes: 45,
    order: 1,
    createdAt: '2026-08-22T11:00:00Z',
    updatedAt: '2026-08-23T06:00:00Z',
    synced: true,
  },
  {
    id: 'task-5',
    title: 'Habit Matrix with weekly streaks & confetti',
    description: 'Track daily micro-habits with one-click completion and visual progression tracking.',
    status: 'in_review',
    priority: 'medium',
    dueDate: '2026-08-23',
    projectId: 'proj-3',
    tags: ['Habits', 'Gamification'],
    subtasks: [
      { id: 'st-10', title: 'Weekly completion matrix', completed: true },
      { id: 'st-11', title: 'Streak calculation engine', completed: true },
    ],
    estimatedMinutes: 60,
    actualMinutes: 60,
    order: 0,
    createdAt: '2026-08-22T12:00:00Z',
    updatedAt: '2026-08-23T08:45:00Z',
    synced: true,
  },
  {
    id: 'task-6',
    title: 'Package Tauri Android ARM64 APK & Manifest',
    description: 'Generate Android APK artifact preview, package bundle info, and offline installation package configuration.',
    status: 'backlog',
    priority: 'high',
    dueDate: '2026-08-25',
    projectId: 'proj-2',
    tags: ['Android', 'ARM64', 'Tauri', 'Release'],
    subtasks: [
      { id: 'st-12', title: 'Create AndroidManifest & build config', completed: true },
      { id: 'st-13', title: 'Export unsigned/signed release APK simulation', completed: false },
    ],
    estimatedMinutes: 90,
    order: 0,
    createdAt: '2026-08-23T05:00:00Z',
    updatedAt: '2026-08-23T09:15:00Z',
    synced: true,
  },
  {
    id: 'task-7',
    title: 'Cloud Backup snapshot & SQL dump export',
    description: 'Allow 1-click cloud sync simulation, JSON snapshot restore, and raw SQL dump generation for zero data lock-in.',
    status: 'in_progress',
    priority: 'high',
    dueDate: '2026-08-23',
    projectId: 'proj-1',
    tags: ['Sync', 'Backup', 'Zero-Lockin'],
    subtasks: [
      { id: 'st-14', title: 'Snapshot creator', completed: true },
      { id: 'st-15', title: 'Auto-sync interval trigger', completed: true },
    ],
    estimatedMinutes: 75,
    actualMinutes: 40,
    order: 1,
    createdAt: '2026-08-23T06:00:00Z',
    updatedAt: '2026-08-23T09:25:00Z',
    synced: false,
  }
];

const DEFAULT_HABITS: Habit[] = [
  { id: 'hab-1', title: 'Morning Hydration & Sunlight (1L + 15m)', icon: '💧', color: 'sky', frequency: 'daily', targetDaysPerWeek: 7, category: 'health', streak: 14, bestStreak: 28, createdAt: '2026-08-01T00:00:00Z' },
  { id: 'hab-2', title: '90-min Deep Work Block (No Distractions)', icon: '🧠', color: 'indigo', frequency: 'weekdays', targetDaysPerWeek: 5, category: 'productivity', streak: 8, bestStreak: 19, createdAt: '2026-08-01T00:00:00Z' },
  { id: 'hab-3', title: 'Workout / 10,000 Daily Steps', icon: '🏋️', color: 'emerald', frequency: 'daily', targetDaysPerWeek: 6, category: 'fitness', streak: 5, bestStreak: 12, createdAt: '2026-08-05T00:00:00Z' },
  { id: 'hab-4', title: 'Read 20 Pages of Non-Fiction', icon: '📖', color: 'amber', frequency: 'daily', targetDaysPerWeek: 7, category: 'learning', streak: 21, bestStreak: 30, createdAt: '2026-08-01T00:00:00Z' },
  { id: 'hab-5', title: 'Evening Digital Sunset & Reflection', icon: '🌙', color: 'purple', frequency: 'daily', targetDaysPerWeek: 7, category: 'mindfulness', streak: 3, bestStreak: 15, createdAt: '2026-08-10T00:00:00Z' }
];

const DEFAULT_TIMEBLOCKS: TimeBlock[] = [
  { id: 'tb-1', timeSlot: '07:30 - 08:30', title: 'Morning Routine & Healthy Breakfast', category: 'personal', completed: true },
  { id: 'tb-2', timeSlot: '08:30 - 10:00', title: 'Deep Work: Tauri SQLite Engine Optimization', taskId: 'task-1', category: 'deep_work', completed: true },
  { id: 'tb-3', timeSlot: '10:00 - 10:15', title: 'Coffee & Movement Break', category: 'break', completed: true },
  { id: 'tb-4', timeSlot: '10:15 - 12:30', title: 'Deep Work: Drag-and-Drop Kanban Touch Handling', taskId: 'task-2', category: 'deep_work', completed: false },
  { id: 'tb-5', timeSlot: '12:30 - 13:30', title: 'Nutritious Lunch & Outdoor Walk', category: 'break', completed: false },
  { id: 'tb-6', timeSlot: '13:30 - 15:00', title: 'Block Editor & Slash Command Enhancements', taskId: 'task-3', category: 'deep_work', completed: false },
  { id: 'tb-7', timeSlot: '15:00 - 16:00', title: 'Admin, Email Triage & Offline Sync Verification', taskId: 'task-7', category: 'admin', completed: false },
  { id: 'tb-8', timeSlot: '16:00 - 17:30', title: 'Android ARM64 Build & Responsiveness Testing', taskId: 'task-6', category: 'deep_work', completed: false },
  { id: 'tb-9', timeSlot: '17:30 - 18:00', title: 'Daily Shutdown & Evening Habit Reflection', category: 'personal', completed: false }
];

export class SQLiteStorageEngine {
  private inMemoryCache: {
    tasks: Task[];
    projects: Project[];
    pages: Page[];
    blocks: Block[];
    habits: Habit[];
    habitLogs: HabitLog[];
    timeBlocks: TimeBlock[];
    syncQueue: SyncQueueItem[];
    backups: CloudBackupSnapshot[];
    settings: Record<string, string>;
    imageNotes: ImageNoteItem[];
    lectures: LectureItem[];
    activeWallpaper: string;
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    this.inMemoryCache = {
      tasks: this.load(STORAGE_KEYS.TASKS, DEFAULT_TASKS),
      projects: this.load(STORAGE_KEYS.PROJECTS, DEFAULT_PROJECTS),
      pages: this.load(STORAGE_KEYS.PAGES, DEFAULT_PAGES),
      blocks: this.load(STORAGE_KEYS.BLOCKS, DEFAULT_BLOCKS),
      habits: this.load(STORAGE_KEYS.HABITS, DEFAULT_HABITS),
      habitLogs: this.load(STORAGE_KEYS.HABIT_LOGS, this.generateSeedHabitLogs()),
      timeBlocks: this.load(STORAGE_KEYS.TIME_BLOCKS, DEFAULT_TIMEBLOCKS),
      syncQueue: this.load(STORAGE_KEYS.SYNC_QUEUE, []),
      backups: this.load(STORAGE_KEYS.BACKUPS, this.generateInitialBackup()),
      settings: this.load(STORAGE_KEYS.SETTINGS, { theme_palette: 'default' }),
      imageNotes: this.load(STORAGE_KEYS.IMAGE_NOTES, DEFAULT_IMAGE_NOTES),
      lectures: this.load(STORAGE_KEYS.LECTURES, DEFAULT_LECTURES),
      activeWallpaper: this.load(STORAGE_KEYS.WALLPAPER, DEFAULT_WALLPAPERS[0].url),
    };
  }

  private load<T>(key: string, fallback: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  }

  private save(key: string, data: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private queueSync(table: string, recordId: string, action: 'INSERT' | 'UPDATE' | 'DELETE', payload: unknown) {
    const queueItem: SyncQueueItem = {
      id: 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      table,
      recordId,
      action,
      payload: JSON.stringify(payload),
      timestamp: new Date().toISOString(),
      retryCount: 0,
      status: 'pending',
    };
    this.inMemoryCache.syncQueue.unshift(queueItem);
    this.save(STORAGE_KEYS.SYNC_QUEUE, this.inMemoryCache.syncQueue);
  }

  private generateSeedHabitLogs(): HabitLog[] {
    const logs: HabitLog[] = [];
    const today = new Date();
    // Populate last 7 days
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      DEFAULT_HABITS.forEach((h, idx) => {
        // Pseudo realistic completion
        const completed = (i + idx) % 5 !== 0;
        logs.push({
          id: `hl-${h.id}-${dateStr}`,
          habitId: h.id,
          date: dateStr,
          completed: completed,
        });
      });
    }
    return logs;
  }

  private generateInitialBackup(): CloudBackupSnapshot[] {
    return [
      {
        id: 'bkp-initial',
        name: 'Automated Snapshot (Initial Baseline)',
        timestamp: '2026-08-23T06:00:00Z',
        itemCount: {
          tasks: DEFAULT_TASKS.length,
          pages: DEFAULT_PAGES.length,
          blocks: DEFAULT_BLOCKS.length,
          habits: DEFAULT_HABITS.length,
        },
        dataPayload: JSON.stringify({ tasks: DEFAULT_TASKS, pages: DEFAULT_PAGES }),
        sizeKb: 14.8,
      }
    ];
  }

  // --- Task Methods ---
  public getTasks(): Task[] {
    return [...this.inMemoryCache.tasks].sort((a, b) => a.order - b.order);
  }

  public getTaskById(id: string): Task | undefined {
    return this.inMemoryCache.tasks.find((t) => t.id === id);
  }

  public addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Task {
    const newTask: Task = {
      ...task,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    this.inMemoryCache.tasks.unshift(newTask);
    this.save(STORAGE_KEYS.TASKS, this.inMemoryCache.tasks);
    this.queueSync('tasks', newTask.id, 'INSERT', newTask);
    this.notify();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.inMemoryCache.tasks.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = this.inMemoryCache.tasks[index];
    const updated: Task = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
    };

    if (updates.status === 'done' && existing.status !== 'done') {
      updated.completedAt = new Date().toISOString();
    } else if (updates.status && updates.status !== 'done') {
      updated.completedAt = undefined;
    }

    this.inMemoryCache.tasks[index] = updated;
    this.save(STORAGE_KEYS.TASKS, this.inMemoryCache.tasks);
    this.queueSync('tasks', id, 'UPDATE', updated);
    this.notify();
    return updated;
  }

  public deleteTask(id: string): boolean {
    const beforeCount = this.inMemoryCache.tasks.length;
    this.inMemoryCache.tasks = this.inMemoryCache.tasks.filter((t) => t.id !== id);
    if (this.inMemoryCache.tasks.length !== beforeCount) {
      this.save(STORAGE_KEYS.TASKS, this.inMemoryCache.tasks);
      this.queueSync('tasks', id, 'DELETE', { id });
      this.notify();
      return true;
    }
    return false;
  }

  public reorderTasks(tasks: Task[]) {
    this.inMemoryCache.tasks = tasks;
    this.save(STORAGE_KEYS.TASKS, this.inMemoryCache.tasks);
    this.notify();
  }

  // --- Project Methods ---
  public getProjects(): Project[] {
    return [...this.inMemoryCache.projects];
  }

  public addProject(proj: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      ...proj,
      id: 'proj-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.inMemoryCache.projects.push(newProject);
    this.save(STORAGE_KEYS.PROJECTS, this.inMemoryCache.projects);
    this.queueSync('projects', newProject.id, 'INSERT', newProject);
    this.notify();
    return newProject;
  }

  // --- Page Methods ---
  public getPages(): Page[] {
    return [...this.inMemoryCache.pages];
  }

  public getPageById(id: string): Page | undefined {
    return this.inMemoryCache.pages.find((p) => p.id === id);
  }

  public addPage(page: Omit<Page, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Page {
    const newPage: Page = {
      ...page,
      id: 'page-' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    this.inMemoryCache.pages.push(newPage);
    
    // Add default initial block
    const initialBlock: Block = {
      id: 'blk-' + Date.now(),
      pageId: newPage.id,
      type: 'text',
      content: '',
      order: 0,
      updatedAt: new Date().toISOString(),
    };
    this.inMemoryCache.blocks.push(initialBlock);

    this.save(STORAGE_KEYS.PAGES, this.inMemoryCache.pages);
    this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
    this.queueSync('pages', newPage.id, 'INSERT', newPage);
    this.notify();
    return newPage;
  }

  public updatePage(id: string, updates: Partial<Page>): Page | null {
    const index = this.inMemoryCache.pages.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: Page = {
      ...this.inMemoryCache.pages[index],
      ...updates,
      updatedAt: new Date().toISOString(),
      synced: false,
    };
    this.inMemoryCache.pages[index] = updated;
    this.save(STORAGE_KEYS.PAGES, this.inMemoryCache.pages);
    this.queueSync('pages', id, 'UPDATE', updated);
    this.notify();
    return updated;
  }

  public deletePage(id: string): boolean {
    this.inMemoryCache.pages = this.inMemoryCache.pages.filter((p) => p.id !== id);
    this.inMemoryCache.blocks = this.inMemoryCache.blocks.filter((b) => b.pageId !== id);
    this.save(STORAGE_KEYS.PAGES, this.inMemoryCache.pages);
    this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
    this.queueSync('pages', id, 'DELETE', { id });
    this.notify();
    return true;
  }

  // --- Block Methods ---
  public getBlocks(pageId: string): Block[] {
    return this.inMemoryCache.blocks
      .filter((b) => b.pageId === pageId)
      .sort((a, b) => a.order - b.order);
  }

  public addBlock(block: Omit<Block, 'id' | 'updatedAt'>): Block {
    const newBlock: Block = {
      ...block,
      id: 'blk-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      updatedAt: new Date().toISOString(),
    };
    this.inMemoryCache.blocks.push(newBlock);
    this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
    this.queueSync('blocks', newBlock.id, 'INSERT', newBlock);
    this.notify();
    return newBlock;
  }

  public updateBlock(id: string, updates: Partial<Block>): Block | null {
    const index = this.inMemoryCache.blocks.findIndex((b) => b.id === id);
    if (index === -1) return null;
    const updated: Block = {
      ...this.inMemoryCache.blocks[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.inMemoryCache.blocks[index] = updated;
    this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
    this.queueSync('blocks', id, 'UPDATE', updated);
    this.notify();
    return updated;
  }

  public deleteBlock(id: string): boolean {
    const prevLen = this.inMemoryCache.blocks.length;
    this.inMemoryCache.blocks = this.inMemoryCache.blocks.filter((b) => b.id !== id);
    if (this.inMemoryCache.blocks.length !== prevLen) {
      this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
      this.queueSync('blocks', id, 'DELETE', { id });
      this.notify();
      return true;
    }
    return false;
  }

  public reorderBlocks(pageId: string, orderedBlocks: Block[]) {
    // Replace blocks for this page with new order
    const otherBlocks = this.inMemoryCache.blocks.filter((b) => b.pageId !== pageId);
    const updatedBlocks = orderedBlocks.map((b, i) => ({ ...b, order: i, updatedAt: new Date().toISOString() }));
    this.inMemoryCache.blocks = [...otherBlocks, ...updatedBlocks];
    this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
    this.notify();
  }

  // --- Habit Methods ---
  public getHabits(): Habit[] {
    return [...this.inMemoryCache.habits];
  }

  public getHabitLogs(startDate?: string, endDate?: string): HabitLog[] {
    let logs = [...this.inMemoryCache.habitLogs];
    if (startDate) logs = logs.filter((l) => l.date >= startDate);
    if (endDate) logs = logs.filter((l) => l.date <= endDate);
    return logs;
  }

  public toggleHabitLog(habitId: string, date: string): HabitLog {
    const existingIndex = this.inMemoryCache.habitLogs.findIndex(
      (l) => l.habitId === habitId && l.date === date
    );

    let result: HabitLog;
    if (existingIndex >= 0) {
      const current = this.inMemoryCache.habitLogs[existingIndex];
      result = { ...current, completed: !current.completed };
      this.inMemoryCache.habitLogs[existingIndex] = result;
    } else {
      result = {
        id: `hl-${habitId}-${date}`,
        habitId,
        date,
        completed: true,
      };
      this.inMemoryCache.habitLogs.push(result);
    }

    // Update habit streak count
    const habit = this.inMemoryCache.habits.find((h) => h.id === habitId);
    if (habit) {
      const habitLogs = this.inMemoryCache.habitLogs.filter((l) => l.habitId === habitId && l.completed);
      const uniqueDays = new Set(habitLogs.map((l) => l.date)).size;
      habit.streak = uniqueDays;
      if (habit.streak > habit.bestStreak) habit.bestStreak = habit.streak;
      this.save(STORAGE_KEYS.HABITS, this.inMemoryCache.habits);
    }

    this.save(STORAGE_KEYS.HABIT_LOGS, this.inMemoryCache.habitLogs);
    this.queueSync('habit_logs', result.id, 'UPDATE', result);
    this.notify();
    return result;
  }

  public addHabit(habit: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'createdAt'>): Habit {
    const newHabit: Habit = {
      ...habit,
      id: 'hab-' + Date.now(),
      streak: 0,
      bestStreak: 0,
      createdAt: new Date().toISOString(),
    };
    this.inMemoryCache.habits.push(newHabit);
    this.save(STORAGE_KEYS.HABITS, this.inMemoryCache.habits);
    this.queueSync('habits', newHabit.id, 'INSERT', newHabit);
    this.notify();
    return newHabit;
  }

  public deleteHabit(id: string): boolean {
    this.inMemoryCache.habits = this.inMemoryCache.habits.filter((h) => h.id !== id);
    this.inMemoryCache.habitLogs = this.inMemoryCache.habitLogs.filter((l) => l.habitId !== id);
    this.save(STORAGE_KEYS.HABITS, this.inMemoryCache.habits);
    this.save(STORAGE_KEYS.HABIT_LOGS, this.inMemoryCache.habitLogs);
    this.queueSync('habits', id, 'DELETE', { id });
    this.notify();
    return true;
  }

  // --- TimeBlock Methods ---
  public getTimeBlocks(): TimeBlock[] {
    return [...this.inMemoryCache.timeBlocks];
  }

  public toggleTimeBlock(id: string): boolean {
    const item = this.inMemoryCache.timeBlocks.find((tb) => tb.id === id);
    if (item) {
      item.completed = !item.completed;
      this.save(STORAGE_KEYS.TIME_BLOCKS, this.inMemoryCache.timeBlocks);
      this.notify();
      return true;
    }
    return false;
  }

  public addTimeBlock(tb: Omit<TimeBlock, 'id'>): TimeBlock {
    const newTb: TimeBlock = {
      ...tb,
      id: 'tb-' + Date.now(),
    };
    this.inMemoryCache.timeBlocks.push(newTb);
    this.save(STORAGE_KEYS.TIME_BLOCKS, this.inMemoryCache.timeBlocks);
    this.notify();
    return newTb;
  }

  public deleteTimeBlock(id: string): boolean {
    this.inMemoryCache.timeBlocks = this.inMemoryCache.timeBlocks.filter((tb) => tb.id !== id);
    this.save(STORAGE_KEYS.TIME_BLOCKS, this.inMemoryCache.timeBlocks);
    this.notify();
    return true;
  }

  public setTimeBlocks(blocks: TimeBlock[]): void {
    this.inMemoryCache.timeBlocks = [...blocks];
    this.save(STORAGE_KEYS.TIME_BLOCKS, this.inMemoryCache.timeBlocks);
    this.notify();
  }

  // --- Settings Methods ---
  public getSetting(key: string, fallback: string = ''): string {
    return this.inMemoryCache.settings[key] ?? fallback;
  }

  public setSetting(key: string, value: string) {
    this.inMemoryCache.settings[key] = value;
    this.save(STORAGE_KEYS.SETTINGS, this.inMemoryCache.settings);
    this.queueSync('settings', key, 'UPDATE', { key, value });
    this.notify();
  }

  public getAllSettings(): Record<string, string> {
    return { ...this.inMemoryCache.settings };
  }

  // --- Wallpaper Methods ---
  public getWallpapers(): WallpaperOption[] {
    return DEFAULT_WALLPAPERS;
  }

  public getActiveWallpaper(): string {
    return this.inMemoryCache.activeWallpaper;
  }

  public setActiveWallpaper(url: string) {
    this.inMemoryCache.activeWallpaper = url;
    this.save(STORAGE_KEYS.WALLPAPER, url);
    this.notify();
  }

  // --- Image Notes Methods ---
  public getImageNotes(): ImageNoteItem[] {
    return [...this.inMemoryCache.imageNotes];
  }

  public addImageNote(note: Omit<ImageNoteItem, 'id' | 'updatedAt'>): ImageNoteItem {
    const newNote: ImageNoteItem = {
      ...note,
      id: 'img-' + Date.now(),
      updatedAt: 'Just now',
    };
    this.inMemoryCache.imageNotes.unshift(newNote);
    this.save(STORAGE_KEYS.IMAGE_NOTES, this.inMemoryCache.imageNotes);
    this.queueSync('image_notes', newNote.id, 'INSERT', newNote);
    this.notify();
    return newNote;
  }

  public updateImageNote(id: string, updates: Partial<ImageNoteItem>): ImageNoteItem | null {
    const idx = this.inMemoryCache.imageNotes.findIndex((n) => n.id === id);
    if (idx === -1) return null;
    const updated = {
      ...this.inMemoryCache.imageNotes[idx],
      ...updates,
      updatedAt: 'Just now',
    };
    this.inMemoryCache.imageNotes[idx] = updated;
    this.save(STORAGE_KEYS.IMAGE_NOTES, this.inMemoryCache.imageNotes);
    this.queueSync('image_notes', id, 'UPDATE', updated);
    this.notify();
    return updated;
  }

  public toggleImageNoteFavorite(id: string): boolean {
    const item = this.inMemoryCache.imageNotes.find((n) => n.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      this.save(STORAGE_KEYS.IMAGE_NOTES, this.inMemoryCache.imageNotes);
      this.notify();
      return item.isFavorite;
    }
    return false;
  }

  public deleteImageNote(id: string): boolean {
    const before = this.inMemoryCache.imageNotes.length;
    this.inMemoryCache.imageNotes = this.inMemoryCache.imageNotes.filter((n) => n.id !== id);
    if (this.inMemoryCache.imageNotes.length !== before) {
      this.save(STORAGE_KEYS.IMAGE_NOTES, this.inMemoryCache.imageNotes);
      this.queueSync('image_notes', id, 'DELETE', { id });
      this.notify();
      return true;
    }
    return false;
  }

  // --- Lectures Methods ---
  public getLectures(): LectureItem[] {
    return [...this.inMemoryCache.lectures];
  }

  public addLecture(lecture: Omit<LectureItem, 'id' | 'lastStudied'>): LectureItem {
    const newLec: LectureItem = {
      ...lecture,
      id: 'lec-' + Date.now(),
      lastStudied: 'Just now',
    };
    this.inMemoryCache.lectures.unshift(newLec);
    this.save(STORAGE_KEYS.LECTURES, this.inMemoryCache.lectures);
    this.queueSync('lectures', newLec.id, 'INSERT', newLec);
    this.notify();
    return newLec;
  }

  public updateLecture(id: string, updates: Partial<LectureItem>): LectureItem | null {
    const idx = this.inMemoryCache.lectures.findIndex((l) => l.id === id);
    if (idx === -1) return null;
    const updated = {
      ...this.inMemoryCache.lectures[idx],
      ...updates,
      lastStudied: 'Just now',
    };
    this.inMemoryCache.lectures[idx] = updated;
    this.save(STORAGE_KEYS.LECTURES, this.inMemoryCache.lectures);
    this.queueSync('lectures', id, 'UPDATE', updated);
    this.notify();
    return updated;
  }

  public toggleLectureFavorite(id: string): boolean {
    const item = this.inMemoryCache.lectures.find((l) => l.id === id);
    if (item) {
      item.isFavorite = !item.isFavorite;
      this.save(STORAGE_KEYS.LECTURES, this.inMemoryCache.lectures);
      this.notify();
      return item.isFavorite;
    }
    return false;
  }

  public deleteLecture(id: string): boolean {
    const before = this.inMemoryCache.lectures.length;
    this.inMemoryCache.lectures = this.inMemoryCache.lectures.filter((l) => l.id !== id);
    if (this.inMemoryCache.lectures.length !== before) {
      this.save(STORAGE_KEYS.LECTURES, this.inMemoryCache.lectures);
      this.queueSync('lectures', id, 'DELETE', { id });
      this.notify();
      return true;
    }
    return false;
  }

  // --- Sync Queue & Backup Methods ---
  public getSyncQueue(): SyncQueueItem[] {
    return [...this.inMemoryCache.syncQueue];
  }

  public clearSyncQueue() {
    this.inMemoryCache.syncQueue = [];
    this.save(STORAGE_KEYS.SYNC_QUEUE, []);
    // Mark all tasks & pages as synced
    this.inMemoryCache.tasks.forEach((t) => (t.synced = true));
    this.inMemoryCache.pages.forEach((p) => (p.synced = true));
    this.save(STORAGE_KEYS.TASKS, this.inMemoryCache.tasks);
    this.save(STORAGE_KEYS.PAGES, this.inMemoryCache.pages);
    this.notify();
  }

  public getBackups(): CloudBackupSnapshot[] {
    return [...this.inMemoryCache.backups];
  }

  public createBackup(name?: string): CloudBackupSnapshot {
    const fullState = {
      tasks: this.inMemoryCache.tasks,
      projects: this.inMemoryCache.projects,
      pages: this.inMemoryCache.pages,
      blocks: this.inMemoryCache.blocks,
      habits: this.inMemoryCache.habits,
      habitLogs: this.inMemoryCache.habitLogs,
      timeBlocks: this.inMemoryCache.timeBlocks,
      settings: this.inMemoryCache.settings,
    };
    const payloadStr = JSON.stringify(fullState, null, 2);
    const sizeKb = +(new Blob([payloadStr]).size / 1024).toFixed(2);

    const snapshot: CloudBackupSnapshot = {
      id: 'bkp-' + Date.now(),
      name: name || `Manual Cloud Snapshot (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`,
      timestamp: new Date().toISOString(),
      itemCount: {
        tasks: this.inMemoryCache.tasks.length,
        pages: this.inMemoryCache.pages.length,
        blocks: this.inMemoryCache.blocks.length,
        habits: this.inMemoryCache.habits.length,
      },
      dataPayload: payloadStr,
      sizeKb,
    };

    this.inMemoryCache.backups.unshift(snapshot);
    this.save(STORAGE_KEYS.BACKUPS, this.inMemoryCache.backups);
    this.notify();
    return snapshot;
  }

  public restoreBackup(snapshotId: string): boolean {
    const snap = this.inMemoryCache.backups.find((b) => b.id === snapshotId);
    if (!snap) return false;
    try {
      const state = JSON.parse(snap.dataPayload);
      if (state.tasks) this.inMemoryCache.tasks = state.tasks;
      if (state.projects) this.inMemoryCache.projects = state.projects;
      if (state.pages) this.inMemoryCache.pages = state.pages;
      if (state.blocks) this.inMemoryCache.blocks = state.blocks;
      if (state.habits) this.inMemoryCache.habits = state.habits;
      if (state.habitLogs) this.inMemoryCache.habitLogs = state.habitLogs;
      if (state.timeBlocks) this.inMemoryCache.timeBlocks = state.timeBlocks;
      if (state.settings) this.inMemoryCache.settings = state.settings;

      this.save(STORAGE_KEYS.TASKS, this.inMemoryCache.tasks);
      this.save(STORAGE_KEYS.PROJECTS, this.inMemoryCache.projects);
      this.save(STORAGE_KEYS.PAGES, this.inMemoryCache.pages);
      this.save(STORAGE_KEYS.BLOCKS, this.inMemoryCache.blocks);
      this.save(STORAGE_KEYS.HABITS, this.inMemoryCache.habits);
      this.save(STORAGE_KEYS.HABIT_LOGS, this.inMemoryCache.habitLogs);
      this.save(STORAGE_KEYS.TIME_BLOCKS, this.inMemoryCache.timeBlocks);
      this.save(STORAGE_KEYS.SETTINGS, this.inMemoryCache.settings);
      this.notify();
      return true;
    } catch (e) {
      console.error('Failed to restore backup:', e);
      return false;
    }
  }

  public deleteBackup(snapshotId: string): boolean {
    this.inMemoryCache.backups = this.inMemoryCache.backups.filter((b) => b.id !== snapshotId);
    this.save(STORAGE_KEYS.BACKUPS, this.inMemoryCache.backups);
    this.notify();
    return true;
  }

  // --- SQLite Query Simulator & SQL Dump ---
  public executeSql(query: string): { columns: string[]; rows: any[]; affectedRows?: number; executionTimeMs: number; error?: string } {
    const start = performance.now();
    const cleanQuery = query.trim();

    try {
      const lower = cleanQuery.toLowerCase();

      // SELECT queries
      if (lower.startsWith('select')) {
        let tableName = 'tasks';
        if (lower.includes('from projects')) tableName = 'projects';
        else if (lower.includes('from pages')) tableName = 'pages';
        else if (lower.includes('from blocks')) tableName = 'blocks';
        else if (lower.includes('from habits')) tableName = 'habits';
        else if (lower.includes('from habit_logs')) tableName = 'habit_logs';
        else if (lower.includes('from time_blocks')) tableName = 'time_blocks';
        else if (lower.includes('from sync_queue')) tableName = 'sync_queue';
        else if (lower.includes('from settings')) tableName = 'settings';

        let data: any[] = [];
        if (tableName === 'tasks') data = this.inMemoryCache.tasks;
        else if (tableName === 'projects') data = this.inMemoryCache.projects;
        else if (tableName === 'pages') data = this.inMemoryCache.pages;
        else if (tableName === 'blocks') data = this.inMemoryCache.blocks;
        else if (tableName === 'habits') data = this.inMemoryCache.habits;
        else if (tableName === 'habit_logs') data = this.inMemoryCache.habitLogs;
        else if (tableName === 'time_blocks') data = this.inMemoryCache.timeBlocks;
        else if (tableName === 'sync_queue') data = this.inMemoryCache.syncQueue;
        else if (tableName === 'settings') {
          data = Object.entries(this.inMemoryCache.settings).map(([key, value]) => ({ key, value }));
        }

        // Simple WHERE filter simulation
        if (lower.includes('where')) {
          if (lower.includes("status = 'todo'")) {
            data = data.filter((item) => item.status === 'todo');
          } else if (lower.includes("status = 'done'")) {
            data = data.filter((item) => item.status === 'done');
          } else if (lower.includes("status = 'in_progress'")) {
            data = data.filter((item) => item.status === 'in_progress');
          } else if (lower.includes("priority = 'high'")) {
            data = data.filter((item) => item.priority === 'high');
          } else if (lower.includes("priority = 'urgent'")) {
            data = data.filter((item) => item.priority === 'urgent');
          } else if (lower.includes("key = 'theme_palette'")) {
            data = data.filter((item) => item.key === 'theme_palette');
          }
        }

        // Limit simulation
        const limitMatch = lower.match(/limit\s+(\d+)/);
        if (limitMatch) {
          const limit = parseInt(limitMatch[1], 10);
          data = data.slice(0, limit);
        }

        const columns = data.length > 0 ? Object.keys(data[0]) : ['key', 'value'];
        const rows = data.map((item) => Object.values(item));

        return {
          columns,
          rows,
          executionTimeMs: +(performance.now() - start).toFixed(2),
        };
      }

      // INSERT query simulation
      if (lower.startsWith('insert')) {
        return {
          columns: ['status', 'message'],
          rows: [['SUCCESS', 'Row inserted into SQLite schema table successfully.']],
          affectedRows: 1,
          executionTimeMs: +(performance.now() - start).toFixed(2),
        };
      }

      // SHOW TABLES / PRAGMA
      if (lower.includes('tables') || lower.includes('pragma')) {
        return {
          columns: ['name', 'type', 'record_count', 'engine'],
          rows: [
            ['tasks', 'TABLE', this.inMemoryCache.tasks.length, 'SQLite v3 (Embedded/WASM)'],
            ['projects', 'TABLE', this.inMemoryCache.projects.length, 'SQLite v3 (Embedded/WASM)'],
            ['pages', 'TABLE', this.inMemoryCache.pages.length, 'SQLite v3 (Embedded/WASM)'],
            ['blocks', 'TABLE', this.inMemoryCache.blocks.length, 'SQLite v3 (Embedded/WASM)'],
            ['habits', 'TABLE', this.inMemoryCache.habits.length, 'SQLite v3 (Embedded/WASM)'],
            ['habit_logs', 'TABLE', this.inMemoryCache.habitLogs.length, 'SQLite v3 (Embedded/WASM)'],
            ['time_blocks', 'TABLE', this.inMemoryCache.timeBlocks.length, 'SQLite v3 (Embedded/WASM)'],
            ['sync_queue', 'TABLE', this.inMemoryCache.syncQueue.length, 'SQLite v3 (Offline WAL)'],
            ['settings', 'TABLE', Object.keys(this.inMemoryCache.settings).length, 'SQLite v3 (Embedded/KV)'],
          ],
          executionTimeMs: +(performance.now() - start).toFixed(2),
        };
      }

      return {
        columns: ['result'],
        rows: [['Query executed successfully.']],
        affectedRows: 0,
        executionTimeMs: +(performance.now() - start).toFixed(2),
      };
    } catch (err: any) {
      return {
        columns: ['error'],
        rows: [[err.message || 'SQLite Syntax Error']],
        executionTimeMs: +(performance.now() - start).toFixed(2),
        error: err.message,
      };
    }
  }

  public exportSqlDump(): string {
    let sql = `-- NotionLife SQLite Offline Database Dump\n-- Generated: ${new Date().toISOString()}\n-- Platform: Tauri v2 / Android arm64\n\n`;
    sql += `PRAGMA foreign_keys = ON;\nBEGIN TRANSACTION;\n\n`;

    // Tasks table
    sql += `-- Table: tasks\nCREATE TABLE IF NOT EXISTS tasks (\n  id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  description TEXT,\n  status TEXT NOT NULL DEFAULT 'todo',\n  priority TEXT NOT NULL DEFAULT 'medium',\n  due_date TEXT,\n  due_time TEXT,\n  project_id TEXT,\n  tags TEXT,\n  subtasks TEXT,\n  estimated_minutes INTEGER,\n  actual_minutes INTEGER,\n  item_order INTEGER DEFAULT 0,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL,\n  synced INTEGER DEFAULT 1\n);\n\n`;
    this.inMemoryCache.tasks.forEach((t) => {
      sql += `INSERT INTO tasks (id, title, description, status, priority, due_date, due_time, project_id, tags, subtasks, estimated_minutes, actual_minutes, item_order, created_at, updated_at, synced) VALUES ('${t.id}', '${t.title.replace(/'/g, "''")}', '${(t.description || '').replace(/'/g, "''")}', '${t.status}', '${t.priority}', ${t.dueDate ? `'${t.dueDate}'` : 'NULL'}, ${t.dueTime ? `'${t.dueTime}'` : 'NULL'}, ${t.projectId ? `'${t.projectId}'` : 'NULL'}, '${JSON.stringify(t.tags)}', '${JSON.stringify(t.subtasks).replace(/'/g, "''")}', ${t.estimatedMinutes || 'NULL'}, ${t.actualMinutes || 'NULL'}, ${t.order}, '${t.createdAt}', '${t.updatedAt}', ${t.synced ? 1 : 0});\n`;
    });

    // Pages table
    sql += `\n-- Table: pages\nCREATE TABLE IF NOT EXISTS pages (\n  id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  icon TEXT DEFAULT '📄',\n  cover_image TEXT,\n  parent_id TEXT,\n  is_favorite INTEGER DEFAULT 0,\n  created_at TEXT NOT NULL,\n  updated_at TEXT NOT NULL,\n  synced INTEGER DEFAULT 1\n);\n\n`;
    this.inMemoryCache.pages.forEach((p) => {
      sql += `INSERT INTO pages (id, title, icon, cover_image, parent_id, is_favorite, created_at, updated_at, synced) VALUES ('${p.id}', '${p.title.replace(/'/g, "''")}', '${p.icon}', ${p.coverImage ? `'${p.coverImage}'` : 'NULL'}, ${p.parentId ? `'${p.parentId}'` : 'NULL'}, ${p.isFavorite ? 1 : 0}, '${p.createdAt}', '${p.updatedAt}', ${p.synced ? 1 : 0});\n`;
    });

    // Blocks table
    sql += `\n-- Table: blocks\nCREATE TABLE IF NOT EXISTS blocks (\n  id TEXT PRIMARY KEY,\n  page_id TEXT NOT NULL,\n  type TEXT NOT NULL DEFAULT 'text',\n  content TEXT,\n  checked INTEGER DEFAULT 0,\n  callout_icon TEXT,\n  language TEXT,\n  item_order INTEGER DEFAULT 0,\n  updated_at TEXT NOT NULL,\n  FOREIGN KEY(page_id) REFERENCES pages(id) ON DELETE CASCADE\n);\n\n`;
    this.inMemoryCache.blocks.forEach((b) => {
      sql += `INSERT INTO blocks (id, page_id, type, content, checked, callout_icon, language, item_order, updated_at) VALUES ('${b.id}', '${b.pageId}', '${b.type}', '${(b.content || '').replace(/'/g, "''")}', ${b.checked ? 1 : 0}, ${b.calloutIcon ? `'${b.calloutIcon}'` : 'NULL'}, ${b.language ? `'${b.language}'` : 'NULL'}, ${b.order}, '${b.updatedAt}');\n`;
    });

    // Habits table
    sql += `\n-- Table: habits\nCREATE TABLE IF NOT EXISTS habits (\n  id TEXT PRIMARY KEY,\n  title TEXT NOT NULL,\n  icon TEXT DEFAULT '✨',\n  color TEXT DEFAULT 'indigo',\n  frequency TEXT DEFAULT 'daily',\n  target_days_per_week INTEGER DEFAULT 7,\n  category TEXT DEFAULT 'productivity',\n  streak INTEGER DEFAULT 0,\n  best_streak INTEGER DEFAULT 0,\n  created_at TEXT NOT NULL\n);\n\n`;
    this.inMemoryCache.habits.forEach((h) => {
      sql += `INSERT INTO habits (id, title, icon, color, frequency, target_days_per_week, category, streak, best_streak, created_at) VALUES ('${h.id}', '${h.title.replace(/'/g, "''")}', '${h.icon}', '${h.color}', '${h.frequency}', ${h.targetDaysPerWeek}, '${h.category}', ${h.streak}, ${h.bestStreak}, '${h.createdAt}');\n`;
    });

    // Settings table
    sql += `\n-- Table: settings\nCREATE TABLE IF NOT EXISTS settings (\n  key TEXT PRIMARY KEY,\n  value TEXT NOT NULL\n);\n\n`;
    Object.entries(this.inMemoryCache.settings).forEach(([key, val]) => {
      sql += `INSERT INTO settings (key, value) VALUES ('${key}', '${val.replace(/'/g, "''")}');\n`;
    });

    sql += `\nCOMMIT;\n`;
    return sql;
  }
}

// Global Singleton Instance
export const sqliteEngine = new SQLiteStorageEngine();
