import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Heart,
  Trash2,
  Sparkles,
  ArrowLeft,
  Search,
  GraduationCap,
  FileText,
  Clock,
  CheckCircle,
  X,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LectureItem } from '../types';

export const LecturesView: React.FC = () => {
  const {
    lectures,
    addLecture,
    deleteLecture,
    toggleLectureFavorite,
    setActiveView,
    triggerCelebration,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [studyingLecture, setStudyingLecture] = useState<LectureItem | null>(null);

  // New lecture form state
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newNotesCount, setNewNotesCount] = useState<number>(10);
  const [newCoverImage, setNewCoverImage] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const allSubjects = Array.from(new Set(lectures.map((l) => l.subject)));

  const filteredLectures = lectures.filter((l) => {
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || l.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubject.trim()) return;

    addLecture({
      title: newTitle.trim(),
      subject: newSubject.trim(),
      notesCount: newNotesCount || 1,
      coverImage:
        newCoverImage.trim() ||
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      summary: newSummary.trim() || 'Comprehensive study notes and core cognitive takeaways.',
      isFavorite: false,
    });

    setNewTitle('');
    setNewSubject('');
    setNewNotesCount(10);
    setNewCoverImage('');
    setNewSummary('');
    setIsAddModalOpen(false);
  };

  const samplePresets = [
    {
      title: 'Neural Networks & Deep Learning',
      subject: 'Artificial Intelligence',
      notesCount: 32,
      cover: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200&q=80',
      summary: 'Backpropagation, transformers, self-attention, and weight optimization foundations.',
    },
    {
      title: 'Macroeconomics & Global Markets',
      subject: 'Economics & Finance',
      notesCount: 19,
      cover: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
      summary: 'Interest rate cycles, liquidity traps, fiscal policy, and currency dynamics.',
    },
    {
      title: 'Human Physiology & Biomechanics',
      subject: 'Health Sciences',
      notesCount: 27,
      cover: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
      summary: 'Hypertrophy mechanisms, mitochondrial density, sleep stage architecture.',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full p-4 md:p-8 space-y-6" id="lectures-view">
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
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <GraduationCap className="h-3.5 w-3.5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
                Lectures & Course Stacks
              </h1>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Structured study modules and notes tracked in SQLite
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-95"
          id="new-lecture-btn"
        >
          <Plus className="h-4 w-4" />
          <span>New Lecture</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search lectures by title or topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 pl-9 pr-4 py-2 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
            id="search-lectures-input"
          />
        </div>

        {/* Subject Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubject('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              selectedSubject === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
            }`}
            id="filter-all-subjects"
          >
            All Courses ({lectures.length})
          </button>
          {allSubjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                selectedSubject === sub
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300'
              }`}
              id={`filter-subject-${sub}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLectures.map((lec) => (
          <motion.div
            key={lec.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900 shadow-md transition-all duration-300 hover:shadow-xl hover:border-emerald-500/50"
            id={`lecture-card-${lec.id}`}
          >
            {/* Cover Image */}
            <div className="relative h-44 w-full overflow-hidden bg-stone-950">
              <img
                src={lec.coverImage}
                alt={lec.title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Subject Pill & Favorite button */}
              <div className="absolute top-3 left-3">
                <span className="rounded-lg bg-black/60 px-2.5 py-1 text-[11px] font-bold text-emerald-300 backdrop-blur-md border border-white/10">
                  {lec.subject}
                </span>
              </div>

              <div className="absolute top-3 right-3">
                <button
                  onClick={() => toggleLectureFavorite(lec.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-transform active:scale-90 ${
                    lec.isFavorite
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'bg-black/40 text-white hover:bg-black/60'
                  }`}
                  id={`favorite-lecture-${lec.id}`}
                >
                  <Heart className={`h-4 w-4 ${lec.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Notes count badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-stone-200 font-medium">
                <FileText className="h-3.5 w-3.5 text-emerald-400" />
                <span>{lec.notesCount} study notes attached</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
                  {lec.title}
                </h3>
                <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                  {lec.summary}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between border-t border-stone-100 dark:border-stone-800 pt-3">
                <span className="flex items-center gap-1 text-[11px] text-stone-400">
                  <Clock className="h-3 w-3" />
                  Studied: {lec.lastStudied}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setStudyingLecture(lec)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60 px-3 py-1.5 text-xs font-semibold transition-colors"
                    id={`study-lecture-${lec.id}`}
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Study</span>
                  </button>

                  <button
                    onClick={() => deleteLecture(lec.id)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors"
                    id={`delete-lecture-${lec.id}`}
                    title="Delete lecture"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Study Mode Modal */}
      <AnimatePresence>
        {studyingLecture && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setStudyingLecture(null)}
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800"
              id="study-lecture-modal"
            >
              {/* Modal Cover Image */}
              <div className="relative h-44 bg-stone-950">
                <img
                  src={studyingLecture.coverImage}
                  alt={studyingLecture.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <button
                  onClick={() => setStudyingLecture(null)}
                  className="absolute top-4 right-4 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
                  id="close-study-modal-btn"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-6 text-white">
                  <span className="rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-bold uppercase">
                    {studyingLecture.subject}
                  </span>
                  <h2 className="text-xl font-bold mt-1">{studyingLecture.title}</h2>
                </div>
              </div>

              {/* Modal Study Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="rounded-xl bg-stone-50 dark:bg-stone-800/60 p-4 border border-stone-200 dark:border-stone-700">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Core Summary & High-Yield Concept
                  </h4>
                  <p className="mt-2 text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
                    {studyingLecture.summary}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Flash Takeaways & Recall Prompts
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2.5 rounded-xl border border-stone-200 dark:border-stone-800 p-3 bg-white dark:bg-stone-800/40">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-stone-700 dark:text-stone-300">
                        Spaced intervals of 1d, 3d, 7d, and 14d increase long-term memory retrieval strength by 3.2x.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5 rounded-xl border border-stone-200 dark:border-stone-800 p-3 bg-white dark:bg-stone-800/40">
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-stone-700 dark:text-stone-300">
                        Active recall and Feynman explanations prevent the illusion of explanatory depth.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 px-6 py-3">
                <span className="text-xs text-stone-500">
                  Progress marked in SQLite offline engine
                </span>
                <button
                  onClick={() => {
                    triggerCelebration();
                    setStudyingLecture(null);
                  }}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                  id="complete-study-session-btn"
                >
                  Mark Session Done (+10 XP)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Lecture Modal */}
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
              id="add-lecture-modal"
            >
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-4">
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Add New Lecture or Course
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-lg p-1 text-stone-400 hover:text-stone-600 dark:hover:text-white"
                  id="close-add-lecture-btn"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Quick Presets */}
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
                        setNewSubject(sp.subject);
                        setNewNotesCount(sp.notesCount);
                        setNewCoverImage(sp.cover);
                        setNewSummary(sp.summary);
                      }}
                      className="rounded-lg bg-stone-100 hover:bg-emerald-50 hover:text-emerald-600 dark:bg-stone-800 dark:hover:bg-stone-700 px-2.5 py-1 text-xs text-stone-700 dark:text-stone-300 transition-colors"
                    >
                      {sp.title}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Course / Lecture Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Database Engineering"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    id="new-lecture-title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Computer Science"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                      id="new-lecture-subject"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                      Notes Count
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={newNotesCount}
                      onChange={(e) => setNewNotesCount(Number(e.target.value))}
                      className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                      id="new-lecture-notes-count"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Cover Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={newCoverImage}
                    onChange={(e) => setNewCoverImage(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    id="new-lecture-cover-url"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Syllabus / Concept Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Write key syllabus takeaways and study objectives..."
                    value={newSummary}
                    onChange={(e) => setNewSummary(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-800 px-3 py-2 text-xs text-stone-900 dark:text-white focus:border-emerald-500 focus:outline-none"
                    id="new-lecture-summary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
                    id="cancel-add-lecture-btn"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
                    id="save-lecture-btn"
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
