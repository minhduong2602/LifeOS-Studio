import React from 'react';
import { 
  Palette, 
  Check, 
  X, 
  Sparkles, 
  Database, 
  Sun, 
  Moon, 
  Trees, 
  Sunset, 
  Compass, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ThemePalette, ThemeOption } from '../types';

export const ThemeManagerModal: React.FC = () => {
  const { 
    theme, 
    setTheme, 
    availableThemes, 
    isThemeModalOpen, 
    setIsThemeModalOpen,
    setActiveView 
  } = useApp();

  if (!isThemeModalOpen) return null;

  const currentThemeObj = availableThemes.find((t) => t.id === theme) || availableThemes[0];

  const handleSelectTheme = (themeId: ThemePalette) => {
    setTheme(themeId);
  };

  const getThemeIcon = (id: ThemePalette) => {
    switch (id) {
      case 'forest':
        return <Trees className="w-4 h-4 text-emerald-500" />;
      case 'midnight':
        return <Moon className="w-4 h-4 text-sky-400" />;
      case 'sunset':
        return <Sunset className="w-4 h-4 text-amber-500" />;
      case 'nord':
        return <Compass className="w-4 h-4 text-cyan-400" />;
      case 'lavender':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      default:
        return <Sun className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div 
      id="theme-manager-backdrop"
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsThemeModalOpen(false)}
    >
      <div 
        id="theme-manager-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden transition-all my-8 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-2xs">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
                  Theme & Color Palette Manager
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <Database className="w-2.5 h-2.5" />
                  <span>SQLite Persisted</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Choose an aesthetic palette. Selections are stored locally in the embedded SQLite database.
              </p>
            </div>
          </div>

          <button
            id="close-theme-modal-btn"
            onClick={() => setIsThemeModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Theme Highlight Banner */}
        <div className="px-5 py-3 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-stone-700 dark:text-stone-300">
            <span className="text-stone-400 font-medium">Active Theme:</span>
            <span className="font-semibold text-stone-900 dark:text-stone-100 flex items-center space-x-1.5">
              <span>{currentThemeObj.icon}</span>
              <span>{currentThemeObj.name}</span>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1.5 px-2 py-1 rounded bg-stone-200/70 dark:bg-stone-700/60 text-[11px] font-mono text-stone-600 dark:text-stone-300">
              <span>PRAGMA:</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{theme}</span>
            </div>
          </div>
        </div>

        {/* Theme Options Grid */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {availableThemes.map((option: ThemeOption) => {
              const isSelected = theme === option.id;

              return (
                <div
                  key={option.id}
                  id={`theme-card-${option.id}`}
                  onClick={() => handleSelectTheme(option.id)}
                  className={`group relative p-4 rounded-xl border-2 text-left cursor-pointer transition-all duration-150 flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-md ring-2 ring-indigo-500/20'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700 bg-stone-50/50 dark:bg-stone-800/20 hover:bg-stone-100/60 dark:hover:bg-stone-800/50'
                  }`}
                >
                  {/* Top row: Icon, Name & Status check */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{option.icon}</span>
                        <h3 className="font-semibold text-sm text-stone-900 dark:text-stone-100">
                          {option.name}
                        </h3>
                      </div>

                      {isSelected ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-600 text-white flex items-center space-x-1 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="text-[11px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                          Click to apply
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed mb-3">
                      {option.tagline}
                    </p>
                  </div>

                  {/* Palette Preview Swatches */}
                  <div className="pt-3 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-stone-400 font-medium mr-0.5">Palette:</span>
                      <div 
                        className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700 shadow-2xs" 
                        style={{ backgroundColor: option.previewColors.bg }}
                        title="Canvas Background"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700 shadow-2xs" 
                        style={{ backgroundColor: option.previewColors.card }}
                        title="Card Surface"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700 shadow-2xs" 
                        style={{ backgroundColor: option.previewColors.primary }}
                        title="Primary Color"
                      />
                      <div 
                        className="w-4 h-4 rounded-full border border-stone-300 dark:border-stone-700 shadow-2xs" 
                        style={{ backgroundColor: option.previewColors.accent }}
                        title="Accent Glow"
                      />
                    </div>

                    <div className="flex items-center space-x-1 text-[11px] font-medium text-stone-500">
                      {getThemeIcon(option.id)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SQLite Integration Notice */}
          <div className="p-3.5 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-xs text-stone-600 dark:text-stone-300 flex items-start space-x-3">
            <Database className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1 space-y-1">
              <div className="font-semibold text-stone-900 dark:text-stone-100">
                Automatic SQLite Settings Sync
              </div>
              <p className="text-stone-500 dark:text-stone-400 text-[11px]">
                Your palette choice is written to <code className="px-1 py-0.5 rounded bg-stone-200 dark:bg-stone-700 font-mono text-[10px]">settings (key, value)</code> table. It persists across cold restarts and exports with your offline database dumps.
              </p>
            </div>
            <button
              onClick={() => {
                setIsThemeModalOpen(false);
                setActiveView('sqlite_console');
              }}
              className="px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded border border-indigo-200 dark:border-indigo-800 shrink-0 transition-colors"
            >
              View in SQL Console
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/50 flex items-center justify-between">
          <button
            id="reset-theme-btn"
            onClick={() => handleSelectTheme('default')}
            className="text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 px-3 py-1.5 rounded-md hover:bg-stone-200/60 dark:hover:bg-stone-800/60 transition-colors font-medium"
          >
            Reset to Notion Classic
          </button>

          <button
            id="done-theme-btn"
            onClick={() => setIsThemeModalOpen(false)}
            className="bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center space-x-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Apply & Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
