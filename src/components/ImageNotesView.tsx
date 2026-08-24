import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Image as ImageIcon,
  Plus,
  Heart,
  Trash2,
  Tag,
  Sparkles,
  ArrowLeft,
  Search,
  ExternalLink,
  X,
  Maximize2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ImageNoteItem } from '../types';

export const ImageNotesView: React.FC = () => {
  const {
    imageNotes,
    addImageNote,
    deleteImageNote,
    toggleImageNoteFavorite,
    setActiveView,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeLightbox, setActiveLightbox] = useState<ImageNoteItem | null>(null);

  // New Note Form
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTags, setNewTags] = useState('Inspiration, Study');

  const allTags = Array.from(new Set(imageNotes.flatMap((n) => n.tags)));

  const filteredNotes = imageNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.caption.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    addImageNote({
      title: newTitle.trim(),
      caption: newCaption.trim(),
      imageUrl: newImageUrl.trim(),
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      isFavorite: false,
    });

    setNewTitle('');
    setNewCaption('');
    setNewImageUrl('');
    setNewTags('Inspiration');
    setIsAddModalOpen(false);
  };

  const samplePresets = [
    {
      title: 'Highland Alpine Ridge',
      caption: 'Misty green peaks in Scottish Highlands',
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      tags: 'Nature, Highland, Travel',
    },
    {
      title: 'Minimalist Architecture',
      caption: 'Modern concrete and geometric shadow lines',
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      tags: 'Design, Architecture',
    },
    {
      title: 'Obsidian Starfield',
      caption: 'Astrophotography deep space nebula',
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      tags: 'Astronomy, Inspiration',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full p-4 md:p-8 space-y-6" id="image-notes-view">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('glass_dashboard')}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors"
            id="back-to-dashboard-btn"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <ImageIcon className="h-3.5 w-3.5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                Image Notes Gallery
              </h1>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Visual note repository saved in local SQLite storage
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-sky-600/20 transition-all hover:bg-sky-500 active:scale-95"
          id="new-image-note-btn"
        >
          <Plus className="h-4 w-4" />
          <span>Add Image Note</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search image notes by title or caption..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 shadow-sm"
            id="search-image-notes-input"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTag('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedTag === 'all'
                ? 'bg-sky-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}
            id="filter-all-tags"
          >
            All ({imageNotes.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-sky-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
              }`}
              id={`filter-tag-${tag}`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-md transition-all duration-300 hover:shadow-xl hover:border-sky-500/50"
            id={`image-note-card-${note.id}`}
          >
            {/* Image Preview Container */}
            <div
              onClick={() => setActiveLightbox(note)}
              className="relative h-52 w-full cursor-pointer overflow-hidden bg-stone-950"
            >
              <img
                src={note.imageUrl}
                alt={note.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Top Action Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleImageNoteFavorite(note.id);
                  }}
                  className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                    note.isFavorite
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  id={`favorite-image-note-${note.id}`}
                >
                  <Heart className={`h-4 w-4 ${note.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="h-4 w-4" />
                </div>
              </div>
            </div>

            {/* Note Content */}
            <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
              <div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-semibold text-stone-600 dark:text-stone-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                  {note.title}
                </h3>
                <p className="mt-1 text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                  {note.caption}
                </p>
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3 text-[11px] text-stone-400">
                <span>{note.updatedAt}</span>
                <button
                  onClick={() => deleteImageNote(note.id)}
                  className="rounded-lg p-1 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                  id={`delete-image-note-${note.id}`}
                  title="Delete image note"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLightbox(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full overflow-hidden rounded-2xl bg-stone-900 border border-white/20 shadow-2xl"
              id="image-lightbox-modal"
            >
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center">
                <img
                  src={activeLightbox.imageUrl}
                  alt={activeLightbox.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[70vh] w-auto object-contain"
                />
                <button
                  onClick={() => setActiveLightbox(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                  id="close-lightbox-btn"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 bg-stone-900 text-white space-y-2">
                <div className="flex flex-wrap gap-2">
                  {activeLightbox.tags.map((t) => (
                    <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-xs text-sky-300 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-bold">{activeLightbox.title}</h2>
                <p className="text-sm text-stone-300">{activeLightbox.caption}</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Image Note Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-stone-900 p-6 shadow-2xl border border-stone-200 dark:border-stone-800"
              id="add-image-note-modal"
            >
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Add New Image Note
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-600 dark:hover:text-white"
                  id="close-add-image-note-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Sample Presets */}
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Quick Presets:
                </span>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {samplePresets.map((sp) => (
                    <button
                      key={sp.title}
                      type="button"
                      onClick={() => {
                        setNewTitle(sp.title);
                        setNewCaption(sp.caption);
                        setNewImageUrl(sp.url);
                        setNewTags(sp.tags);
                      }}
                      className="rounded-lg bg-stone-100 hover:bg-sky-50 hover:text-sky-600 dark:bg-stone-800 dark:hover:bg-stone-700 px-2.5 py-1 text-xs text-stone-700 dark:text-stone-300 transition-colors"
                    >
                      {sp.title}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Architectural Concept Sketch"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    id="new-image-note-title"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    id="new-image-note-url"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Caption / Key Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe key insights, visual patterns, or thoughts..."
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    id="new-image-note-caption"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Design, Travel, Study"
                    value={newTags}
                    onChange={(e) => setNewTags(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-sky-500 focus:outline-none"
                    id="new-image-note-tags"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                    id="cancel-add-image-note-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500"
                    id="save-image-note-btn"
                  >
                    Save to SQLite
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
