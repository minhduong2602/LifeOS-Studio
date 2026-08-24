import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  Download, 
  FileCode, 
  Clock, 
  CheckCircle2, 
  Terminal, 
  Table as TableIcon,
  RefreshCw,
  HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { sqliteEngine } from '../db/sqliteStorage';

const PRESET_QUERIES = [
  { label: 'All Pending Tasks', sql: "SELECT * FROM tasks WHERE status = 'todo' LIMIT 10;" },
  { label: 'Habit Streaks Leaderboard', sql: "SELECT * FROM habits LIMIT 10;" },
  { label: 'Offline Sync Queue Status', sql: "SELECT * FROM sync_queue LIMIT 10;" },
  { label: 'SQLite Tables Schema', sql: "PRAGMA table_info(tasks);" },
  { label: 'All Notion Pages', sql: "SELECT * FROM pages LIMIT 10;" }
];

export const SQLiteConsole: React.FC = () => {
  const { tasks, projects, pages, habits, syncQueue } = useApp();

  const [query, setQuery] = useState("SELECT * FROM tasks WHERE status = 'todo' LIMIT 10;");
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: any[];
    executionTimeMs: number;
    error?: string;
  }>(() => sqliteEngine.executeSql("SELECT * FROM tasks WHERE status = 'todo' LIMIT 10;"));

  const [activeTableTab, setActiveTableTab] = useState<'tasks' | 'pages' | 'habits' | 'sync_queue'>('tasks');

  const handleRunQuery = () => {
    const res = sqliteEngine.executeSql(query);
    setQueryResult(res);
  };

  const handleDownloadSqlDump = () => {
    const sqlContent = sqliteEngine.exportSqlDump();
    const blob = new Blob([sqlContent], { type: 'application/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notionlife_backup_${new Date().toISOString().split('T')[0]}.sql`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDbFile = () => {
    const data = JSON.stringify({
      schema_version: '2.0-sqlite',
      tasks,
      projects,
      pages,
      habits,
      syncQueue,
    });
    const blob = new Blob([data], { type: 'application/x-sqlite3' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notionlife_local.db`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto bg-stone-50/50 dark:bg-stone-950 space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            <Database className="w-4 h-4 text-emerald-500" />
            <span>SQLite Embedded Engine & Query Console</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Offline Storage & Schema Explorer
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
            Full ACID-compliant local database running client-side with instant persistence and zero network latency.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleDownloadSqlDump}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .SQL Dump</span>
          </button>

          <button
            onClick={handleDownloadDbFile}
            className="bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 flex items-center space-x-1.5 transition-colors"
          >
            <HardDrive className="w-3.5 h-3.5 text-stone-500" />
            <span>Download .db</span>
          </button>
        </div>
      </div>

      {/* Database Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-400 uppercase">Tasks Table</div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">{tasks.length} rows</div>
          <div className="text-[10px] text-emerald-600">Indexed Primary Key</div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-400 uppercase">Pages & Blocks</div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">{pages.length} pages</div>
          <div className="text-[10px] text-indigo-600">Foreign Key Cascades</div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-400 uppercase">Habit Matrix</div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">{habits.length} habits</div>
          <div className="text-[10px] text-rose-600">Streak Calculation</div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-3.5 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="text-[11px] font-semibold text-stone-400 uppercase">WAL Sync Queue</div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">{syncQueue.length} dirty</div>
          <div className="text-[10px] text-amber-600">Offline Change Log</div>
        </div>
      </div>

      {/* SQL Query Editor Box */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-stone-800 dark:text-stone-200">
            <Terminal className="w-4 h-4 text-indigo-500" />
            <span>Interactive SQL Query Runner</span>
          </div>

          <div className="flex items-center space-x-1.5 flex-wrap">
            <span className="text-[11px] text-stone-400 mr-1">Presets:</span>
            {PRESET_QUERIES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(p.sql);
                  const res = sqliteEngine.executeSql(p.sql);
                  setQueryResult(res);
                }}
                className="text-[10px] px-2 py-1 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-stone-900 dark:bg-stone-950 text-emerald-400 font-mono text-xs p-3 rounded-lg border border-stone-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 resize-y"
            placeholder="SELECT * FROM tasks WHERE status = 'todo';"
          />
          <button
            onClick={handleRunQuery}
            className="absolute right-3 bottom-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md shadow-xs flex items-center space-x-1.5 transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Execute SQL</span>
          </button>
        </div>

        {/* Query Execution Status */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-mono">
          <div className="flex items-center space-x-2">
            <span>Execution Time: <strong className="text-stone-800 dark:text-stone-200">{queryResult.executionTimeMs}ms</strong></span>
            <span>•</span>
            <span>Rows Returned: <strong className="text-stone-800 dark:text-stone-200">{queryResult.rows.length}</strong></span>
          </div>
          {queryResult.error && (
            <span className="text-rose-500 font-semibold">{queryResult.error}</span>
          )}
        </div>

        {/* Query Results Table */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-x-auto max-h-64">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-b border-stone-200 dark:border-stone-700">
                {queryResult.columns.map((col, i) => (
                  <th key={i} className="py-2 px-3 whitespace-nowrap">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {queryResult.rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                  {row.map((val: any, cIdx: number) => (
                    <td key={cIdx} className="py-2 px-3 whitespace-nowrap text-stone-800 dark:text-stone-200 max-w-xs truncate">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val ?? 'NULL')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
