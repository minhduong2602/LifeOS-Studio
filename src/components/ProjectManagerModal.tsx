import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  X, 
  Check, 
  Trash2, 
  Smile, 
  Sparkles, 
  Layers,
  Palette,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Project } from '../types';

const EMOJI_PRESETS = ['🌱', '⚡', '🏃', '📚', '🚀', '🎯', '💼', '🎨', '🧠', '🛠️', '💡', '🔥', '💎', '🌍', '🏠', '✨'];
const COLOR_PRESETS: Array<{ id: Project['color']; label: string; bg: string; border: string; text: string }> = [
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  { id: 'sky', label: 'Sky Blue', bg: 'bg-sky-500/15', border: 'border-sky-500/40', text: 'text-sky-400' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-500/15', border: 'border-rose-500/40', text: 'text-rose-400' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-500/15', border: 'border-amber-500/40', text: 'text-amber-400' },
  { id: 'purple', label: 'Purple', bg: 'bg-purple-500/15', border: 'border-purple-500/40', text: 'text-purple-400' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500/15', border: 'border-indigo-500/40', text: 'text-indigo-400' },
];

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { addProject, updateProject, deleteProject, triggerCelebration } = useApp();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🌱');
  const [color, setColor] = useState<Project['color']>('emerald');
  const [description, setDescription] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setIcon(projectToEdit.icon || '🌱');
      setColor(projectToEdit.color || 'emerald');
      setDescription(projectToEdit.description || '');
      setShowDeleteConfirm(false);
    } else {
      setName('');
      setIcon('🌱');
      setColor('emerald');
      setDescription('');
      setShowDeleteConfirm(false);
    }
  }, [projectToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        name: name.trim(),
        icon,
        color,
        description: description.trim(),
      });
    } else {
      addProject({
        name: name.trim(),
        icon,
        color,
        description: description.trim(),
      });
      triggerCelebration();
    }
    onClose();
  };

  const handleDelete = () => {
    if (projectToEdit) {
      deleteProject(projectToEdit.id);
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Folder className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold theme-text-main">
              {projectToEdit ? 'Chỉnh Sửa Dự Án' : 'Tạo Dự Án Mới'}
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
          {/* Project Name & Icon Preview */}
          <div>
            <label className="block text-xs font-semibold theme-text-muted mb-1.5">
              Tên Dự Án & Biểu Tượng
            </label>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl theme-inner-box border flex items-center justify-center text-xl shrink-0">
                {icon}
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Thiết Kế Ứng Dụng Di Động"
                className="w-full theme-inner-box border rounded-xl px-3 py-2 text-xs font-medium theme-text-main focus:outline-none focus:border-emerald-500"
                autoFocus
              />
            </div>
          </div>

          {/* Emoji Quick Picker */}
          <div>
            <label className="block text-[11px] font-semibold theme-text-muted mb-1">
              Chọn Biểu Tượng Emoji
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {EMOJI_PRESETS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setIcon(em)}
                  className={`w-8 h-8 rounded-lg border text-sm flex items-center justify-center transition-all cursor-pointer ${
                    icon === em
                      ? 'bg-emerald-500/20 border-emerald-500 scale-110'
                      : 'theme-inner-box border-transparent hover:border-white/20'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color Badge Palette */}
          <div>
            <label className="block text-[11px] font-semibold theme-text-muted mb-1">
              Màu Sắc Đại Diện
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${c.bg} ${c.text} ${
                    color === c.id ? `${c.border} ring-1 ring-white/30` : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <span>{c.label}</span>
                  {color === c.id && <Check className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold theme-text-muted mb-1">
              Mô Tả Dự Án (Tùy chọn)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mục tiêu chính của dự án này là gì?"
              className="w-full theme-inner-box border rounded-xl p-2.5 text-xs font-medium theme-text-main focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Delete Section for Edit Mode */}
          {projectToEdit && (
            <div className="pt-2 border-t border-white/10">
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Dự Án Này</span>
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-start space-x-2 text-rose-300 text-xs font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Bạn có chắc chắn muốn xóa? Các nhiệm vụ liên quan sẽ chuyển về Chưa gán dự án.</span>
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
              className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{projectToEdit ? 'Lưu Thay Đổi' : 'Tạo Dự Án'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
