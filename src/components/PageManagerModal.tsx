import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  X, 
  Check, 
  Trash2, 
  Image as ImageIcon, 
  Star,
  Copy,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Page } from '../types';

const PAGE_EMOJI_PRESETS = ['📄', '🪐', '🎯', '📱', '💡', '📝', '📊', '🚀', '🧠', '📚', '🛠️', '✨', '🏆', '💎', '📑', '🔬'];
const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
];

interface PageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageToEdit?: Page | null;
}

export const PageManagerModal: React.FC<PageManagerModalProps> = ({
  isOpen,
  onClose,
  pageToEdit,
}) => {
  const { addPage, updatePage, deletePage, duplicatePage, triggerCelebration } = useApp();

  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📄');
  const [coverImage, setCoverImage] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (pageToEdit) {
      setTitle(pageToEdit.title);
      setIcon(pageToEdit.icon || '📄');
      setCoverImage(pageToEdit.coverImage || '');
      setIsFavorite(Boolean(pageToEdit.isFavorite));
      setShowDeleteConfirm(false);
    } else {
      setTitle('');
      setIcon('📄');
      setCoverImage(COVER_PRESETS[0]);
      setIsFavorite(false);
      setShowDeleteConfirm(false);
    }
  }, [pageToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (pageToEdit) {
      updatePage(pageToEdit.id, {
        title: title.trim(),
        icon,
        coverImage: coverImage.trim() || undefined,
        isFavorite,
      });
    } else {
      addPage({
        title: title.trim(),
        icon,
        coverImage: coverImage.trim() || undefined,
        parentId: null,
        isFavorite,
      });
      triggerCelebration();
    }
    onClose();
  };

  const handleDelete = () => {
    if (pageToEdit) {
      deletePage(pageToEdit.id);
      onClose();
    }
  };

  const handleDuplicate = () => {
    if (pageToEdit) {
      duplicatePage(pageToEdit.id);
      triggerCelebration();
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl theme-card border shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <FileText className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold theme-text-main">
              {pageToEdit ? 'Chỉnh Sửa Tài Liệu & Ghi Chú' : 'Tạo Tài Liệu / Ghi Chú Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg theme-inner-box hover:brightness-110 theme-text-muted hover:theme-text-main transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title & Icon Preview */}
          <div>
            <label className="block text-xs font-semibold theme-text-muted mb-1.5">
              Tiêu Đề Tài Liệu & Emoji
            </label>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl theme-inner-box border flex items-center justify-center text-xl shrink-0">
                {icon}
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Kế Hoạch Tuần & Kiến Trúc Hệ Thống"
                className="w-full theme-inner-box border rounded-xl px-3 py-2 text-xs font-medium theme-text-main focus:outline-none focus:border-indigo-500"
                autoFocus
              />
            </div>
          </div>

          {/* Emoji Presets */}
          <div>
            <label className="block text-[11px] font-semibold theme-text-muted mb-1">
              Chọn Biểu Tượng Emoji
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {PAGE_EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all cursor-pointer ${
                    icon === em
                      ? 'bg-indigo-500/20 border-indigo-500 scale-110'
                      : 'theme-inner-box border-transparent hover:border-white/20'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Cover Image Preset Selector */}
          <div>
            <label className="block text-[11px] font-semibold theme-text-muted mb-1 flex items-center justify-between">
              <span>Ảnh Bìa Tài Liệu (Tùy chọn)</span>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                >
                  Xóa ảnh bìa
                </button>
              )}
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {COVER_PRESETS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCoverImage(imgUrl)}
                  className={`h-12 rounded-lg border overflow-hidden transition-all relative cursor-pointer ${
                    coverImage === imgUrl ? 'ring-2 ring-indigo-500 border-indigo-500 scale-105' : 'opacity-70 hover:opacity-100 border-transparent'
                  }`}
                >
                  <img src={imgUrl} alt="Cover option" className="w-full h-full object-cover" />
                  {coverImage === imgUrl && (
                    <div className="absolute inset-0 bg-indigo-600/30 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl theme-inner-box border">
            <div className="flex items-center space-x-2">
              <Star className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : 'text-stone-400'}`} />
              <span className="text-xs font-semibold theme-text-main">Ghim vào danh sách Yêu thích</span>
            </div>
            <input
              type="checkbox"
              checked={isFavorite}
              onChange={(e) => setIsFavorite(e.target.checked)}
              className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          {/* Extra Actions for Edit Mode: Duplicate / Delete */}
          {pageToEdit && (
            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Nhân Bản Tài Liệu</span>
                </button>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa Tài Liệu</span>
                  </button>
                ) : null}
              </div>

              {showDeleteConfirm && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-start space-x-2 text-rose-300 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Xác nhận xóa tài liệu "{pageToEdit.title}" và toàn bộ khối nội dung?</span>
                  </div>
                  <div className="flex items-center space-x-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-2.5 py-1 rounded-md text-xs font-medium theme-inner-box text-stone-300"
                    >
                      Hủy bỏ
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1 rounded-md text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
                    >
                      Xác Nhận Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold theme-inner-box theme-text-muted hover:theme-text-main transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{pageToEdit ? 'Lưu Thay Đổi' : 'Tạo Tài Liệu'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
