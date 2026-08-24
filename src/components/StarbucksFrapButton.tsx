import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Plus, Palette, X, Bot, Brain, PenLine } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StarbucksFrapButton: React.FC = () => {
  const { 
    setIsPlanModalOpen, 
    setIsQuickCaptureOpen, 
    setIsThemeModalOpen,
    setIsAISettingsModalOpen,
    getActiveAIConfig,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const activeAI = getActiveAIConfig();

  const menuItems = [
    {
      label: 'Lập kế hoạch AI',
      sub: 'Trợ lý sắp xếp thông minh',
      icon: <Brain className="w-4 h-4" />,
      bubbleBg: 'linear-gradient(135deg, #E8D5F5, #C4B5FD)',
      onClick: () => { setIsPlanModalOpen(true); setIsOpen(false); },
    },
    {
      label: 'Ghi nhận nhanh',
      sub: 'Thêm việc, ghi chú, thói quen',
      icon: <PenLine className="w-4 h-4" />,
      bubbleBg: 'linear-gradient(135deg, #BDE0FE, #93C5FD)',
      onClick: () => { setIsQuickCaptureOpen(true); setIsOpen(false); },
    },
    {
      label: 'Cấu hình AI',
      sub: activeAI.provider.toUpperCase(),
      icon: <Bot className="w-4 h-4" />,
      bubbleBg: 'linear-gradient(135deg, #B8E8D0, #6EE7B7)',
      onClick: () => { setIsAISettingsModalOpen(true); setIsOpen(false); },
    },
    {
      label: 'Bảng màu giao diện',
      sub: 'Đổi theme & phong cách',
      icon: <Palette className="w-4 h-4" />,
      bubbleBg: 'linear-gradient(135deg, #FFD6A5, #FDBA74)',
      onClick: () => { setIsThemeModalOpen(true); setIsOpen(false); },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-auto">
      {/* Floating Action Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mb-3 p-2.5 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col gap-1 min-w-[230px]"
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: '1.5px solid var(--border-card)',
              boxShadow: '0 8px 32px rgba(255,143,171,0.15), 0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#FF8FAB' }}>
                Hành động nhanh
              </span>
            </div>

            {menuItems.map((item, i) => (
              <button
                key={i}
                onClick={item.onClick}
                className="w-full text-left px-3 py-2.5 rounded-2xl flex items-center gap-3 transition-all cursor-pointer active:scale-95"
                style={{ color: 'var(--text-main)' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-inner-box)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white"
                  style={{ background: item.bubbleBg }}>
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">{item.label}</div>
                  <div className="text-[10px] font-medium" style={{ color: 'var(--text-dim)' }}>{item.sub}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Signature Floating Button — Pink Gradient */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 cursor-pointer select-none active:scale-90 text-white kawaii-float"
        style={{
          background: isOpen
            ? 'linear-gradient(135deg, #A78BFA, #7C3AED)'
            : 'linear-gradient(135deg, #FFB5C2, #FF8FAB)',
          boxShadow: isOpen
            ? '0 6px 24px rgba(167,139,250,0.4)'
            : '0 6px 24px rgba(255,143,171,0.4)',
        }}
        title="Hành động nhanh"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[2.5]" />
        ) : (
          <Sparkles className="w-6 h-6 stroke-[2]" />
        )}
      </button>
    </div>
  );
};
