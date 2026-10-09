import React, { useState } from 'react';
import {
  X,
  Settings,
  Globe,
  RotateCcw,
  AlertTriangle,
  Database,
  Check,
  Sparkles,
} from 'lucide-react';
import { Language, translations, supportedLanguages } from '../utils/i18n';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onResetData: (emptyAll?: boolean) => void;
  reportCount: number;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  setLang,
  onResetData,
  reportCount,
}) => {
  if (!isOpen) return null;

  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleExecuteReset = (emptyAll = false) => {
    onResetData(emptyAll);
    setResetDone(true);
    setConfirmReset(false);
    setTimeout(() => {
      setResetDone(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0A1422] border border-[rgba(148,163,184,0.25)] shadow-2xl p-5 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(148,163,184,0.15)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#3B82F6]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">System Settings & Language</h3>
              <p className="text-xs text-[#AAB3C2]">Configure UI locale and evaluation data storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#AAB3C2] hover:text-white hover:bg-[#071426] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 12+ Multi-Language Selection Grid */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#21E6A8]" />
              <span>Supported System Languages (12)</span>
            </span>
            <span className="text-[10px] text-[#21E6A8] font-mono">10+ Regional & Global</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {supportedLanguages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLang(item.code)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                  lang === item.code
                    ? 'bg-blue-600/20 border-[#3B82F6] text-white shadow-md'
                    : 'bg-[#080B12] border-[rgba(148,163,184,0.15)] text-[#AAB3C2] hover:border-white/40'
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span>{item.flag}</span>
                    <span>{item.nativeName}</span>
                  </div>
                  <span className="text-[10px] text-[#AAB3C2] block mt-0.5">{item.name}</span>
                </div>
                {lang === item.code && (
                  <Check className="w-4 h-4 text-[#21E6A8] shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Storage Inspector */}
        <div className="p-4 rounded-2xl bg-[#080B12] border border-[rgba(148,163,184,0.15)] space-y-2 text-xs">
          <div className="flex items-center justify-between text-white font-semibold">
            <span className="flex items-center gap-1.5">
              <Database className="w-4 h-4 text-[#3B82F6]" />
              <span>Browser Storage Status</span>
            </span>
            <span className="font-mono text-[#21E6A8]">{reportCount} Reports Cached</span>
          </div>
          <p className="text-[#AAB3C2] text-[11px] leading-relaxed">
            Data is persisted in your current browser session using HTML5 localStorage with AES mock integrity hashing.
          </p>
        </div>

        {/* Demo Data Reset Section */}
        <div className="space-y-3 pt-2 border-t border-[rgba(148,163,184,0.15)]">
          <label className="block text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#F5D547]" />
            <span>Demonstration State Reset</span>
          </label>

          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#080B12] hover:bg-red-950/30 border border-red-500/30 text-xs font-bold text-red-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Demo Data to Initial Seed</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/40 space-y-3">
              <div className="flex items-start gap-2 text-red-400 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Are you sure you want to reset demo records?</span>
              </div>
              <p className="text-[11px] text-[#AAB3C2]">
                Choose whether to restore the default sample test cases or completely wipe all records.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleExecuteReset(false)}
                  className="flex-1 py-2 px-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-bold transition-colors cursor-pointer"
                >
                  Restore Sample Data
                </button>
                <button
                  onClick={() => handleExecuteReset(true)}
                  className="flex-1 py-2 px-3 rounded-lg bg-[#080B12] hover:bg-black text-[#AAB3C2] border border-[rgba(148,163,184,0.2)] text-xs font-bold transition-colors cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="py-2 px-3 text-xs text-[#AAB3C2] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {resetDone && (
            <div className="p-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-xs text-[#21E6A8] flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Data reset successfully completed!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
