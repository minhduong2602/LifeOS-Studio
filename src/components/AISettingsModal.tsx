import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Key, 
  Globe, 
  Cpu, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sliders, 
  ExternalLink, 
  ShieldCheck, 
  Database,
  Eye,
  EyeOff,
  Server,
  Zap,
  Bot,
  Check
} from 'lucide-react';
import { useApp, DEFAULT_AI_CONFIG } from '../context/AppContext';
import { AIProviderType, AIProviderConfig, ProviderSpecificConfig } from '../types';

interface ProviderMeta {
  id: AIProviderType;
  name: string;
  badge: string;
  description: string;
  defaultModel: string;
  defaultBaseUrl?: string;
  popularModels: string[];
  docsUrl: string;
  icon: string;
}

const PROVIDER_METAS: ProviderMeta[] = [
  {
    id: 'openrouter',
    name: 'OpenRouter (Kho Mô Hình Đa Năng)',
    badge: 'Khuyên Dùng',
    description: 'Một khóa duy nhất cho Claude 3.7 Sonnet, DeepSeek R1, GPT-4o, Llama 3.3 và hơn 200 mô hình AI.',
    defaultModel: 'google/gemini-2.5-flash',
    defaultBaseUrl: 'https://openrouter.ai/api/v1/chat/completions',
    popularModels: [
      'google/gemini-2.5-flash',
      'anthropic/claude-3.7-sonnet',
      'deepseek/deepseek-r1',
      'openai/gpt-4o',
      'meta-llama/llama-3.3-70b-instruct',
    ],
    docsUrl: 'https://openrouter.ai/keys',
    icon: '🌐',
  },
  {
    id: 'gemini',
    name: 'Google Gemini API',
    badge: 'Chính Thức Google',
    description: 'Tốc độ phản hồi cực nhanh, khả năng hiểu ngữ cảnh xuất sắc và chi phí tối ưu.',
    defaultModel: 'gemini-2.5-flash',
    popularModels: [
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
    ],
    docsUrl: 'https://aistudio.google.com/app/apikey',
    icon: '✨',
  },
  {
    id: 'openai',
    name: 'OpenAI API',
    badge: 'Chính Thức OpenAI',
    description: 'Tích hợp trực tiếp nền tảng OpenAI với các mô hình GPT-4o, o3-mini và lý luận nâng cao.',
    defaultModel: 'gpt-4o-mini',
    popularModels: [
      'gpt-4o-mini',
      'gpt-4o',
      'o3-mini',
      'gpt-4-turbo',
    ],
    docsUrl: 'https://platform.openai.com/api-keys',
    icon: '🤖',
  },
  {
    id: 'custom',
    name: 'Mô Hình Cục Bộ / Custom (Ollama, LMStudio, Groq, DeepSeek)',
    badge: 'Tương Thích OpenAI',
    description: 'Chạy mô hình AI riêng tư ngoại tuyến (Offline) hoặc kết nối máy chủ OpenAI tùy chỉnh.',
    defaultModel: 'llama3.3',
    defaultBaseUrl: 'http://localhost:11434/v1',
    popularModels: [
      'llama3.3',
      'deepseek-r1:latest',
      'qwen2.5-coder',
      'mistral',
    ],
    docsUrl: 'https://ollama.com',
    icon: '⚙️',
  },
];

export const AISettingsModal: React.FC = () => {
  const { 
    aiConfig, 
    updateAIConfig, 
    isAISettingsModalOpen, 
    setIsAISettingsModalOpen,
    triggerCelebration 
  } = useApp();

  const [activeProviderTab, setActiveProviderTab] = useState<AIProviderType>(aiConfig.activeProvider || 'gemini');
  
  // Independent per-provider configurations dictionary
  const [providerForms, setProviderForms] = useState<Record<AIProviderType, ProviderSpecificConfig>>(() => {
    return {
      gemini: { ...DEFAULT_AI_CONFIG.providers.gemini, ...(aiConfig.providers?.gemini || {}) },
      openrouter: { ...DEFAULT_AI_CONFIG.providers.openrouter, ...(aiConfig.providers?.openrouter || {}) },
      openai: { ...DEFAULT_AI_CONFIG.providers.openai, ...(aiConfig.providers?.openai || {}) },
      custom: { ...DEFAULT_AI_CONFIG.providers.custom, ...(aiConfig.providers?.custom || {}) },
    };
  });

  const [showKey, setShowKey] = useState(false);

  // Connection test state
  const [isTesting, setIsTesting] = useState(false);
  const [envKeys, setEnvKeys] = useState<Record<string, boolean>>({});
  const [testResult, setTestResult] = useState<{
    success: boolean;
    latencyMs?: number;
    error?: string;
    message?: string;
  } | null>(null);

  // Sync state if modal reopens and check .env status
  useEffect(() => {
    if (isAISettingsModalOpen) {
      setActiveProviderTab(aiConfig.activeProvider || 'gemini');
      setProviderForms({
        gemini: { ...DEFAULT_AI_CONFIG.providers.gemini, ...(aiConfig.providers?.gemini || {}) },
        openrouter: { ...DEFAULT_AI_CONFIG.providers.openrouter, ...(aiConfig.providers?.openrouter || {}) },
        openai: { ...DEFAULT_AI_CONFIG.providers.openai, ...(aiConfig.providers?.openai || {}) },
        custom: { ...DEFAULT_AI_CONFIG.providers.custom, ...(aiConfig.providers?.custom || {}) },
      });
      setTestResult(null);

      // Check server .env availability
      fetch('/api/ai-env-status')
        .then((res) => res.json())
        .then((data) => setEnvKeys(data))
        .catch(() => {});
    }
  }, [isAISettingsModalOpen, aiConfig]);

  if (!isAISettingsModalOpen) return null;

  const currentMeta = PROVIDER_METAS.find((p) => p.id === activeProviderTab) || PROVIDER_METAS[0];
  const currentForm = providerForms[activeProviderTab] || DEFAULT_AI_CONFIG.providers[activeProviderTab];

  const updateCurrentForm = (updates: Partial<ProviderSpecificConfig>) => {
    setProviderForms((prev) => ({
      ...prev,
      [activeProviderTab]: {
        ...prev[activeProviderTab],
        ...updates,
      },
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch('/api/ai-test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeProviderTab,
          apiKey: (currentForm.apiKey || '').trim(),
          model: (currentForm.model || currentMeta.defaultModel).trim(),
          baseUrl: (currentForm.baseUrl || currentMeta.defaultBaseUrl || '').trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        setTestResult({
          success: false,
          latencyMs: data.latencyMs,
          error: data.error || `HTTP ${response.status} Error`,
        });
      } else {
        setTestResult({
          success: true,
          latencyMs: data.latencyMs,
          message: 'Connection Verified & Online',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || 'Network request failed to reach backend',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveAndActivate = () => {
    updateAIConfig({
      activeProvider: activeProviderTab,
      providers: providerForms,
    });
    triggerCelebration();
    setIsAISettingsModalOpen(false);
  };

  return (
    <div 
      id="ai-settings-backdrop"
      className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={() => setIsAISettingsModalOpen(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden text-stone-900 dark:text-stone-100"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-800 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight">
                  Cài Đặt Dịch Vụ AI & Khóa API
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center space-x-1">
                  <Database className="w-2.5 h-2.5" />
                  <span>Khóa từng nhà cung cấp lưu an toàn trong SQLite</span>
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Mỗi nhà cung cấp lưu giữ Khóa API, mã mô hình và đường dẫn endpoint độc lập riêng biệt.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAISettingsModalOpen(false)}
            className="p-2 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2">
              Chọn Nhà Cung Cấp Để Cấu Hình Hoặc Kích Hoạt
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {PROVIDER_METAS.map((p) => {
                const isSelected = activeProviderTab === p.id;
                const isSystemActive = aiConfig.activeProvider === p.id;
                const hasKey = Boolean(providerForms[p.id]?.apiKey?.trim());

                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActiveProviderTab(p.id);
                      setTestResult(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 ring-2 ring-indigo-500/50 shadow-sm'
                        : 'bg-white dark:bg-stone-850/60 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{p.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                          {p.name.split('(')[0]}
                        </span>
                        <div className="flex items-center space-x-1">
                          {isSystemActive && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-indigo-600 text-white flex items-center gap-0.5">
                              <Check className="w-2.5 h-2.5" /> ĐANG DÙNG
                            </span>
                          )}
                          <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                            {p.badge}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-snug">
                        {p.description}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[10px]">
                        <span className="text-stone-400 font-mono truncate max-w-[140px]">
                          {providerForms[p.id]?.model || p.defaultModel}
                        </span>
                        {hasKey ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-0.5">
                            <Key className="w-2.5 h-2.5" /> Đã lưu khóa
                          </span>
                        ) : envKeys[p.id] ? (
                          <span className="text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-0.5">
                            <Database className="w-2.5 h-2.5" /> Trong file .env
                          </span>
                        ) : (
                          <span className="text-stone-400">
                            Chưa có khóa
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Configuration Card */}
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-850/70 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center space-x-2">
                <span className="text-base">{currentMeta.icon}</span>
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Cấu hình {currentMeta.name.split('(')[0]}
                </span>
                {aiConfig.activeProvider === activeProviderTab ? (
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    ● Đang kích hoạt làm Copilot chính
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-stone-400 bg-stone-200 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                    Cấu hình dự phòng
                  </span>
                )}
              </div>
              <a
                href={currentMeta.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>Lấy Khóa API</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* API Key Input (Specific to current tab) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Khóa API {currentMeta.name.split('(')[0]}
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showKey ? 'text' : 'password'}
                  value={currentForm.apiKey || ''}
                  onChange={(e) => updateCurrentForm({ apiKey: e.target.value })}
                  placeholder={
                    envKeys[activeProviderTab]
                      ? 'Đã cấu hình trong .env (để trống nếu muốn dùng .env)'
                      : activeProviderTab === 'openrouter' ? 'sk-or-v1-...' :
                    activeProviderTab === 'gemini' ? 'AIzaSy...' :
                    activeProviderTab === 'openai' ? 'sk-proj-...' :
                    'Nhập Khóa API (nếu có)'
                  }
                  className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg pl-9 pr-10 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {!currentForm.apiKey && envKeys[activeProviderTab] ? (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Tìm thấy trong file <code className="font-mono bg-emerald-500/10 px-1 py-0.2 rounded">.env</code> của máy chủ. Bạn có thể để trống hoặc điền khóa riêng để ghi đè.
                </p>
              ) : activeProviderTab === 'gemini' && !currentForm.apiKey ? (
                <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1">
                  💡 Để trống sẽ sử dụng khóa <code className="font-mono text-indigo-500">GEMINI_API_KEY</code> từ file .env.
                </p>
              ) : null}
            </div>

            {/* Model Name & Presets */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Tên / Mã Định Danh Mô Hình AI
              </label>
              <input
                type="text"
                value={currentForm.model || ''}
                onChange={(e) => updateCurrentForm({ model: e.target.value })}
                placeholder={currentMeta.defaultModel}
                className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {/* Model Preset Pills */}
              <div className="flex items-center gap-1.5 flex-wrap mt-2">
                <span className="text-[10px] text-stone-400 uppercase font-semibold">Gợi ý nhanh:</span>
                {currentMeta.popularModels.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => updateCurrentForm({ model: preset })}
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      currentForm.model === preset
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:border-indigo-400'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Base URL Input (for custom or openrouter proxy) */}
            {(activeProviderTab === 'custom' || activeProviderTab === 'openrouter') && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Đường Dẫn Endpoint Base URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={currentForm.baseUrl || ''}
                    onChange={(e) => updateCurrentForm({ baseUrl: e.target.value })}
                    placeholder={currentMeta.defaultBaseUrl || 'http://localhost:11434/v1'}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-stone-900 dark:text-stone-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Temperature Slider */}
            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Độ sáng tạo (Temperature): {currentForm.temperature ?? 0.2}
                </span>
                <span className="text-[10px] text-stone-400">
                  {(currentForm.temperature ?? 0.2) <= 0.3 ? 'Chính xác & Logic cao' : (currentForm.temperature ?? 0.2) >= 0.7 ? 'Sáng tạo & Đa dạng' : 'Cân bằng'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentForm.temperature ?? 0.2}
                onChange={(e) => updateCurrentForm({ temperature: parseFloat(e.target.value) })}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Test Connection Button & Result */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded-lg bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center space-x-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang kiểm tra kết nối...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>⚡ Kiểm Tra Ping Kết Nối</span>
                  </>
                )}
              </button>

              {/* Status Badge */}
              {testResult && (
                <div className={`text-xs font-medium px-3 py-1.5 rounded-lg flex items-center space-x-1.5 border ${
                  testResult.success 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' 
                    : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                }`}>
                  {testResult.success ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>{testResult.message} ({testResult.latencyMs}ms)</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="truncate max-w-[260px]">{testResult.error}</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/50 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Khóa API lưu cục bộ trong SQLite</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsAISettingsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleSaveAndActivate}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 flex items-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Lưu & Kích Hoạt {currentMeta.name.split('(')[0]}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
