import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  GripVertical, 
  Trash2, 
  Star, 
  Image as ImageIcon, 
  Smile, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Code, 
  Minus, 
  Lightbulb, 
  Copy, 
  Check,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Block, BlockType, Page } from '../types';

const COVER_PRESETS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
];

const ICON_PRESETS = ['🪐', '🎯', '📱', '💡', '⚡', '🧠', '📚', '🚀', '🌿', '✨', '📝', '🔥', '🛡️', '☕'];

export const NotionBlockEditor: React.FC = () => {
  const {
    selectedPageId,
    pages,
    addPage,
    updatePage,
    deletePage,
    duplicatePage,
    getPageBlocks,
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    triggerCelebration,
  } = useApp();

  const activePage = pages.find((p) => p.id === selectedPageId);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [slashMenuBlockId, setSlashMenuBlockId] = useState<string | null>(null);
  const [slashQuery, setSlashQuery] = useState('');
  const [draggedBlockIndex, setDraggedBlockIndex] = useState<number | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    if (selectedPageId) {
      setBlocks(getPageBlocks(selectedPageId));
    }
  }, [selectedPageId, getPageBlocks]);

  if (!activePage) {
    return (
      <div className="h-full flex flex-col items-center justify-center theme-text-muted text-sm space-y-3">
        <p>Select or create a page from the sidebar to start writing.</p>
        <button
          onClick={() => {
            addPage({
              title: 'Untitled Page',
              icon: '📄',
              parentId: null,
            });
            triggerCelebration();
          }}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
        >
          + Create New Page
        </button>
      </div>
    );
  }

  // Block Drag Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedBlockIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedBlockIndex === null || draggedBlockIndex === targetIndex) return;

    const newBlocks = [...blocks];
    const [movedBlock] = newBlocks.splice(draggedBlockIndex, 1);
    newBlocks.splice(targetIndex, 0, movedBlock);
    setDraggedBlockIndex(targetIndex);
    setBlocks(newBlocks);
  };

  const handleDragEnd = () => {
    if (selectedPageId) {
      reorderBlocks(selectedPageId, blocks);
    }
    setDraggedBlockIndex(null);
  };

  const handleContentChange = (blockId: string, content: string) => {
    // Check if user just typed slash command
    if (content.endsWith('/')) {
      setSlashMenuBlockId(blockId);
      setSlashQuery('');
    } else if (slashMenuBlockId === blockId && !content.includes('/')) {
      setSlashMenuBlockId(null);
    }

    updateBlock(blockId, { content });
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, content } : b)));
  };

  const handleSelectBlockType = (blockId: string, newType: BlockType) => {
    const currentBlock = blocks.find((b) => b.id === blockId);
    let cleanContent = currentBlock ? currentBlock.content.replace(/\/$/, '') : '';
    
    updateBlock(blockId, { type: newType, content: cleanContent });
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, type: newType, content: cleanContent } : b))
    );
    setSlashMenuBlockId(null);
  };

  const handleAddBlockBelow = (index: number) => {
    if (!selectedPageId) return;
    const newBlock = addBlock({
      pageId: selectedPageId,
      type: 'text',
      content: '',
      order: index + 1,
    });
    setBlocks(getPageBlocks(selectedPageId));
  };

  const handleDeleteBlock = (blockId: string) => {
    deleteBlock(blockId);
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto">
      {/* Cover Image Banner */}
      {activePage.coverImage && (
        <div className="relative h-48 w-full group overflow-hidden bg-black/20">
          <img
            src={activePage.coverImage}
            alt="Page cover"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4 space-x-2">
            <button
              onClick={() => setShowCoverPicker(true)}
              className="theme-inner-box border text-xs px-2.5 py-1 rounded-md theme-text-main hover:brightness-110 transition-all shadow-xs cursor-pointer"
            >
              Change Cover
            </button>
            <button
              onClick={() => updatePage(activePage.id, { coverImage: undefined })}
              className="bg-rose-600/80 hover:bg-rose-600 text-white text-xs px-2.5 py-1 rounded-md transition-all shadow-xs cursor-pointer"
            >
              Remove Cover
            </button>
          </div>
        </div>
      )}

      {/* Main Page Body Container */}
      <div className="max-w-4xl w-full mx-auto px-6 py-8 flex-1">
        {/* Page Top Controls (Add Icon / Cover / Duplicate / Favorite / Delete) */}
        <div className="flex items-center justify-between mb-4 text-xs theme-text-muted pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="hover:theme-text-main flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <Smile className="w-3.5 h-3.5" />
              <span>{activePage.icon ? 'Change icon' : 'Add icon'}</span>
            </button>

            {!activePage.coverImage && (
              <button
                onClick={() => setShowCoverPicker(true)}
                className="hover:theme-text-main flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Add cover</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Duplicate Button */}
            <button
              onClick={() => {
                duplicatePage(activePage.id);
                triggerCelebration();
              }}
              className="p-1.5 rounded-lg theme-inner-box border hover:brightness-110 theme-text-muted hover:theme-text-main transition-colors flex items-center space-x-1 cursor-pointer"
              title="Duplicate this page"
            >
              <Copy className="w-3 h-3" />
              <span className="text-[11px] hidden sm:inline">Duplicate</span>
            </button>

            {/* Favorite Pin Button */}
            <button
              onClick={() => updatePage(activePage.id, { isFavorite: !activePage.isFavorite })}
              className="p-1.5 rounded-lg theme-inner-box border hover:brightness-110 text-stone-400 hover:text-amber-400 cursor-pointer transition-colors"
              title="Pin to Favorites"
            >
              <Star className={`w-3.5 h-3.5 ${activePage.isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>

            {/* Delete Page Button */}
            <button
              onClick={() => {
                if (confirm(`Delete "${activePage.title}" and all its content?`)) {
                  deletePage(activePage.id);
                }
              }}
              className="p-1.5 rounded-lg theme-inner-box border hover:bg-rose-500/20 text-stone-400 hover:text-rose-400 cursor-pointer transition-colors"
              title="Delete Page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Icon & Cover Pickers */}
        {showIconPicker && (
          <div className="mb-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 flex flex-wrap gap-2">
            {ICON_PRESETS.map((ic) => (
              <button
                key={ic}
                onClick={() => {
                  updatePage(activePage.id, { icon: ic });
                  setShowIconPicker(false);
                }}
                className="w-8 h-8 rounded hover:bg-stone-200 dark:hover:bg-stone-700 text-lg flex items-center justify-center transition-colors"
              >
                {ic}
              </button>
            ))}
          </div>
        )}

        {showCoverPicker && (
          <div className="mb-4 p-3 bg-stone-50 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700">
            <div className="text-xs font-semibold mb-2 text-stone-700 dark:text-stone-300">Choose Cover Preset:</div>
            <div className="grid grid-cols-5 gap-2">
              {COVER_PRESETS.map((imgUrl, i) => (
                <div
                  key={i}
                  onClick={() => {
                    updatePage(activePage.id, { coverImage: imgUrl });
                    setShowCoverPicker(false);
                  }}
                  className="h-14 rounded-md overflow-hidden cursor-pointer border hover:border-indigo-500 transition-all"
                >
                  <img src={imgUrl} alt="Cover option" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => {
                  updatePage(activePage.id, { coverImage: undefined });
                  setShowCoverPicker(false);
                }}
                className="text-xs text-rose-500 hover:underline"
              >
                Remove Cover
              </button>
            </div>
          </div>
        )}

        {/* Page Icon Display */}
        {activePage.icon && (
          <div className="text-4xl mb-3 cursor-pointer" onClick={() => setShowIconPicker(!showIconPicker)}>
            {activePage.icon}
          </div>
        )}

        {/* Page Title Editable */}
        <input
          id="page-title-input"
          type="text"
          value={activePage.title}
          onChange={(e) => updatePage(activePage.id, { title: e.target.value })}
          placeholder="Untitled Page"
          className="w-full text-3xl font-extrabold text-stone-900 dark:text-stone-100 bg-transparent border-none focus:outline-hidden placeholder:text-stone-300 dark:placeholder:text-stone-600 mb-6"
        />

        {/* Block Editor List */}
        <div className="space-y-1">
          {blocks.map((block, index) => {
            return (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="group relative flex items-start -ml-8 pl-8 py-0.5 rounded transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/40"
              >
                {/* Block Drag & Action Handles */}
                <div className="absolute left-0 top-1.5 flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition-opacity select-none">
                  <button
                    onClick={() => handleAddBlockBelow(index)}
                    className="p-0.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded"
                    title="Add block below"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <div className="cursor-grab text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5">
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                  <button
                    onClick={() => handleDeleteBlock(block.id)}
                    className="p-0.5 text-stone-400 hover:text-rose-500 rounded"
                    title="Delete block"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Block Content Renderers by Type */}
                <div className="flex-1 w-full">
                  {block.type === 'h1' && (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleContentChange(block.id, e.target.value)}
                      placeholder="Heading 1"
                      className="w-full text-2xl font-bold text-stone-900 dark:text-stone-100 bg-transparent border-none focus:outline-hidden py-1"
                    />
                  )}

                  {block.type === 'h2' && (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleContentChange(block.id, e.target.value)}
                      placeholder="Heading 2"
                      className="w-full text-xl font-semibold text-stone-900 dark:text-stone-100 bg-transparent border-none focus:outline-hidden py-1"
                    />
                  )}

                  {block.type === 'h3' && (
                    <input
                      type="text"
                      value={block.content}
                      onChange={(e) => handleContentChange(block.id, e.target.value)}
                      placeholder="Heading 3"
                      className="w-full text-lg font-medium text-stone-800 dark:text-stone-200 bg-transparent border-none focus:outline-hidden py-0.5"
                    />
                  )}

                  {block.type === 'todo' && (
                    <div className="flex items-center space-x-2 py-0.5">
                      <input
                        type="checkbox"
                        checked={block.checked || false}
                        onChange={(e) => {
                          updateBlock(block.id, { checked: e.target.checked });
                          setBlocks((prev) =>
                            prev.map((b) => (b.id === block.id ? { ...b, checked: e.target.checked } : b))
                          );
                          if (e.target.checked) triggerCelebration();
                        }}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleContentChange(block.id, e.target.value)}
                        placeholder="To-do item"
                        className={`w-full text-sm bg-transparent border-none focus:outline-hidden ${
                          block.checked ? 'line-through text-stone-400 dark:text-stone-500' : 'text-stone-800 dark:text-stone-200'
                        }`}
                      />
                    </div>
                  )}

                  {block.type === 'bullet' && (
                    <div className="flex items-center space-x-2 py-0.5">
                      <span className="text-stone-400 font-bold text-base leading-none">•</span>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleContentChange(block.id, e.target.value)}
                        placeholder="List item"
                        className="w-full text-sm text-stone-800 dark:text-stone-200 bg-transparent border-none focus:outline-hidden"
                      />
                    </div>
                  )}

                  {block.type === 'numbered' && (
                    <div className="flex items-center space-x-2 py-0.5">
                      <span className="text-stone-400 text-xs font-semibold min-w-[16px]">{index + 1}.</span>
                      <input
                        type="text"
                        value={block.content}
                        onChange={(e) => handleContentChange(block.id, e.target.value)}
                        placeholder="Numbered item"
                        className="w-full text-sm text-stone-800 dark:text-stone-200 bg-transparent border-none focus:outline-hidden"
                      />
                    </div>
                  )}

                  {block.type === 'callout' && (
                    <div className="flex items-start space-x-3 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 my-1">
                      <span className="text-lg">{block.calloutIcon || '💡'}</span>
                      <textarea
                        rows={2}
                        value={block.content}
                        onChange={(e) => handleContentChange(block.id, e.target.value)}
                        placeholder="Callout note or highlight..."
                        className="w-full text-xs text-stone-800 dark:text-stone-200 bg-transparent border-none focus:outline-hidden resize-none"
                      />
                    </div>
                  )}

                  {block.type === 'quote' && (
                    <div className="border-l-3 border-stone-400 dark:border-stone-600 pl-3 py-1 my-1">
                      <textarea
                        rows={2}
                        value={block.content}
                        onChange={(e) => handleContentChange(block.id, e.target.value)}
                        placeholder="Quote block..."
                        className="w-full italic text-sm text-stone-700 dark:text-stone-300 bg-transparent border-none focus:outline-hidden resize-none"
                      />
                    </div>
                  )}

                  {block.type === 'code' && (
                    <div className="bg-stone-900 dark:bg-stone-950 text-stone-100 p-3 rounded-lg my-1 font-mono text-xs relative group/code border border-stone-800">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1 border-b border-stone-800 pb-1">
                        <span>{block.language || 'typescript'}</span>
                        <button
                          onClick={() => handleCopyCode(block.id, block.content)}
                          className="flex items-center space-x-1 hover:text-white"
                        >
                          {copiedCodeId === block.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCodeId === block.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={block.content}
                        onChange={(e) => handleContentChange(block.id, e.target.value)}
                        placeholder="// Type code snippet..."
                        className="w-full bg-transparent border-none focus:outline-hidden font-mono text-xs text-stone-200 resize-y"
                      />
                    </div>
                  )}

                  {block.type === 'divider' && (
                    <div className="py-2">
                      <hr className="border-stone-200 dark:border-stone-800" />
                    </div>
                  )}

                  {block.type === 'text' && (
                    <textarea
                      rows={1}
                      value={block.content}
                      onChange={(e) => {
                        handleContentChange(block.id, e.target.value);
                        // Auto-grow textarea
                        e.target.style.height = 'auto';
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddBlockBelow(index);
                        } else if (e.key === 'Backspace' && block.content === '' && blocks.length > 1) {
                          e.preventDefault();
                          handleDeleteBlock(block.id);
                        }
                      }}
                      placeholder="Type text or '/' for commands..."
                      className="w-full text-sm text-stone-800 dark:text-stone-200 bg-transparent border-none focus:outline-hidden resize-none py-0.5 placeholder:text-stone-400/80"
                    />
                  )}
                </div>

                {/* Floating Slash Menu Popup */}
                {slashMenuBlockId === block.id && (
                  <div className="absolute left-8 top-8 z-50 w-64 bg-white dark:bg-stone-800 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 py-1.5 text-xs select-none">
                    <div className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase">
                      Basic Blocks
                    </div>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'text')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <span className="font-bold text-stone-500">T</span>
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Text</div>
                        <div className="text-[10px] text-stone-400">Plain text block</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'h1')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <Heading1 className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Heading 1</div>
                        <div className="text-[10px] text-stone-400">Large section title</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'h2')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <Heading2 className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Heading 2</div>
                        <div className="text-[10px] text-stone-400">Medium section header</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'todo')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <CheckSquare className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">To-do list</div>
                        <div className="text-[10px] text-stone-400">Interactive checkbox</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'bullet')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <List className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Bulleted list</div>
                        <div className="text-[10px] text-stone-400">Simple bullet point</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'callout')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <Lightbulb className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Callout Box</div>
                        <div className="text-[10px] text-stone-400">Highlighted idea or tip</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'code')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <Code className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Code Snippet</div>
                        <div className="text-[10px] text-stone-400">Monospace code block</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleSelectBlockType(block.id, 'divider')}
                      className="w-full px-3 py-1.5 flex items-center space-x-2 hover:bg-stone-100 dark:hover:bg-stone-700 text-left"
                    >
                      <Minus className="w-4 h-4 text-stone-500" />
                      <div>
                        <div className="font-medium text-stone-900 dark:text-stone-100">Divider</div>
                        <div className="text-[10px] text-stone-400">Horizontal visual break</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Add Block Click Area */}
        <div
          onClick={() => handleAddBlockBelow(blocks.length - 1)}
          className="mt-6 py-4 text-stone-400 text-xs hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Click to add a new block or press '/'</span>
        </div>
      </div>
    </div>
  );
};
