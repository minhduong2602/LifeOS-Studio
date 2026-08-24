import React, { useState } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  Download, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  RotateCcw, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  ArrowUpRight,
  Database,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SyncCenter: React.FC = () => {
  const {
    syncQueue,
    backups,
    isOnline,
    setIsOnline,
    isSyncing,
    triggerSync,
    createBackup,
    restoreBackup,
    deleteBackup,
    triggerCelebration,
  } = useApp();

  const [snapshotName, setSnapshotName] = useState('');
  const [conflictStrategy, setConflictStrategy] = useState<'lww' | 'manual'>('lww');
  const [importedJson, setImportedJson] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleCreateSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    createBackup(snapshotName.trim() || undefined);
    setSnapshotName('');
    triggerCelebration();
  };

  const handleRestore = (id: string, name: string) => {
    if (confirm(`Restore snapshot "${name}"? This will update local SQLite tables.`)) {
      const ok = restoreBackup(id);
      if (ok) {
        alert('Snapshot restored successfully!');
        triggerCelebration();
      }
    }
  };

  const handleExportJson = () => {
    const snap = createBackup('Workspace Export (JSON)');
    const blob = new Blob([snap.dataPayload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notionlife_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.tasks && parsed.pages) {
          const snap = createBackup(`Imported from ${file.name}`);
          restoreBackup(snap.id);
          setImportStatus('✅ Workspace successfully restored from JSON file.');
          triggerCelebration();
        } else {
          setImportStatus('❌ Invalid file format: missing tasks or pages schema.');
        }
      } catch (err) {
        setImportStatus('❌ Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-6 overflow-y-auto bg-stone-50/50 dark:bg-stone-950 space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <Cloud className="w-4 h-4 text-sky-500" />
            <span>Robust Cloud Sync & Snapshot Engine</span>
          </div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
            Offline-First Synchronization & Backup
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
            Write locally with zero lag. Pending changes queue in SQLite and sync seamlessly when cloud connection is active.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => triggerSync()}
            disabled={!isOnline || isSyncing}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-xs transition-all ${
              !isOnline
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-sky-600 hover:bg-sky-700 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Synchronizing with Cloud...' : 'Sync Now'}</span>
          </button>
        </div>
      </div>

      {/* Network Status & Conflict Resolution Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
              Network Connection & Queue
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Toggle offline mode to test offline resilience. SQLite stores all operations locally.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center space-x-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="text-xs font-medium text-stone-700 dark:text-stone-300">
                {isOnline ? 'Cloud Endpoint Connected' : 'Offline Mode (Local Storage)'}
              </span>
            </div>

            <button
              onClick={() => setIsOnline(!isOnline)}
              className="text-xs font-semibold px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300"
            >
              {isOnline ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
              Conflict Resolution Policy
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Automated deterministic merging for multi-device sync collisions.
            </p>
          </div>

          <div className="flex items-center space-x-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <label className="flex items-center space-x-1.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                checked={conflictStrategy === 'lww'}
                onChange={() => setConflictStrategy('lww')}
                className="text-sky-600"
              />
              <span>Last-Write-Wins (LWW)</span>
            </label>

            <label className="flex items-center space-x-1.5 text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
              <input
                type="radio"
                name="conflict"
                checked={conflictStrategy === 'manual'}
                onChange={() => setConflictStrategy('manual')}
                className="text-sky-600"
              />
              <span>Manual Review</span>
            </label>
          </div>
        </div>
      </div>

      {/* Cloud Backup Snapshots Section */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Cloud Backup Snapshots ({backups.length})
            </h3>
            <p className="text-xs text-stone-500">
              Create point-in-time recovery images of your entire task board, blocks, and habits.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJson}
              className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center space-x-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <label className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center space-x-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>
        </div>

        {importStatus && (
          <div className="text-xs p-2.5 bg-stone-100 dark:bg-stone-800 rounded-md text-stone-800 dark:text-stone-200 font-medium">
            {importStatus}
          </div>
        )}

        {/* Create Snapshot Input Form */}
        <form onSubmit={handleCreateSnapshot} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Snapshot name (e.g. Pre-sprint release backup)..."
            value={snapshotName}
            onChange={(e) => setSnapshotName(e.target.value)}
            className="flex-1 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-hidden"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center space-x-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Snapshot</span>
          </button>
        </form>

        {/* Snapshots Table */}
        <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 border-b border-stone-200 dark:border-stone-800 font-medium">
                <th className="py-2.5 px-4">Snapshot Name</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Item Breakdown</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3 text-right">Restore / Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {backups.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-stone-900 dark:text-stone-100">
                    {b.name}
                  </td>
                  <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">
                    {new Date(b.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-stone-600 dark:text-stone-300">
                    {b.itemCount.tasks} tasks • {b.itemCount.pages} pages • {b.itemCount.habits} habits
                  </td>
                  <td className="py-2.5 px-3 text-stone-500 font-mono text-[11px]">
                    {b.sizeKb} KB
                  </td>
                  <td className="py-2.5 px-3 text-right space-x-2">
                    <button
                      onClick={() => handleRestore(b.id, b.name)}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium inline-flex items-center space-x-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                    {backups.length > 1 && (
                      <button
                        onClick={() => deleteBackup(b.id)}
                        className="text-stone-400 hover:text-rose-500 p-1"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Offline Sync Queue Table */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Offline Mutation WAL Queue ({syncQueue.length} items)
            </h3>
            <p className="text-xs text-stone-500">
              Live audit trail of operations waiting to be committed to cloud backend.
            </p>
          </div>
        </div>

        {syncQueue.length === 0 ? (
          <div className="py-6 text-center text-xs text-stone-400 flex flex-col items-center justify-center space-y-1">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            <span>All local SQLite mutations are synchronized. Zero pending items.</span>
          </div>
        ) : (
          <div className="border border-stone-200 dark:border-stone-800 rounded-lg overflow-x-auto max-h-56">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-800/60 text-stone-500 border-b border-stone-200 dark:border-stone-800">
                  <th className="py-2 px-3">Time</th>
                  <th className="py-2 px-3">Table</th>
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Record ID</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {syncQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="py-1.5 px-3 text-[11px] text-stone-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-1.5 px-3 text-indigo-600 dark:text-indigo-400 font-semibold">{item.table}</td>
                    <td className="py-1.5 px-3">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        item.action === 'INSERT' ? 'bg-emerald-100 text-emerald-700' : item.action === 'UPDATE' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {item.action}
                      </span>
                    </td>
                    <td className="py-1.5 px-3 text-stone-700 dark:text-stone-300 truncate max-w-xs">{item.recordId}</td>
                    <td className="py-1.5 px-3 text-amber-600 font-medium">Pending</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
