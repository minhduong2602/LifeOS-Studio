import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Check, Sparkles, Link as LinkIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WallpaperSelectorModal: React.FC = () => {
  const {
    wallpapers,
    activeWallpaper,
    setActiveWallpaper,
    isWallpaperModalOpen,
    setIsWallpaperModalOpen,
  } = useApp();

  const [customUrl, setCustomUrl] = useState('');
  const [customError, setCustomError] = useState('');

  if (!isWallpaperModalOpen) return null;

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    try {
      new URL(customUrl);
      setActiveWallpaper(customUrl.trim());
      setCustomUrl('');
      setCustomError('');
      setIsWallpaperModalOpen(false);
    } catch {
      setCustomError('Please enter a valid image URL');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsWallpaperModalOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-stone-900/90 text-stone-100 border border-white/15 shadow-2xl backdrop-blur-2xl"
          id="wallpaper-selector-modal"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-400">
                <ImageIcon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold tracking-tight text-white">Hình Nền Không Gian</h3>
                <p className="text-xs text-stone-400">Chọn hình nền truyền cảm hứng hoặc dùng liên kết ảnh tùy chỉnh</p>
              </div>
            </div>
            <button
              onClick={() => setIsWallpaperModalOpen(false)}
              className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              id="close-wallpaper-modal-btn"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
            {/* Wallpaper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wallpapers.map((wp) => {
                const isSelected = activeWallpaper === wp.url;
                return (
                  <button
                    key={wp.id}
                    onClick={() => {
                      setActiveWallpaper(wp.url);
                    }}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-400 shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/40'
                        : 'border-white/10 hover:border-white/30 hover:shadow-md'
                    }`}
                    id={`wallpaper-card-${wp.id}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-32 w-full overflow-hidden bg-stone-800">
                      <img
                        src={wp.thumbnail || wp.url}
                        alt={wp.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      {isSelected && (
                        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="p-3 bg-stone-900/80">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{wp.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-stone-400 line-clamp-1">{wp.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom URL Input */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-300">
                <LinkIcon className="h-3.5 w-3.5 text-emerald-400" />
                <span>Nhập Liên Kết Ảnh Tùy Chỉnh (URL)</span>
              </div>
              <form onSubmit={handleApplyCustom} className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customUrl}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    if (customError) setCustomError('');
                  }}
                  className="flex-1 rounded-lg border border-white/15 bg-black/40 px-3 py-2 text-xs text-white placeholder-stone-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  id="custom-wallpaper-url-input"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-500 cursor-pointer"
                  id="apply-custom-wallpaper-btn"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Áp dụng
                </button>
              </form>
              {customError && <p className="text-xs text-rose-400">{customError}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 bg-stone-950/60 px-6 py-3 text-xs text-stone-400">
            <span>Hình nền được lưu an toàn trong SQLite</span>
            <button
              onClick={() => setIsWallpaperModalOpen(false)}
              className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20 cursor-pointer"
              id="done-wallpaper-btn"
            >
              Hoàn tất
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
