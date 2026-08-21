import React, { useState } from 'react';
import { X, Settings, Key, Eye, EyeOff, CheckCircle2, Save } from 'lucide-react';

export default function SettingsModal({ onClose }) {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('research_paper_api_key') || '');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('research_paper_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('research_paper_api_key');
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleClear = () => {
    localStorage.removeItem('research_paper_api_key');
    setApiKey('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Settings</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">API Configuration & Preferences</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key Section */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Key className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Gemini API Key</h3>
            </div>

            <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 mb-3">
              <p className="text-xs text-sky-700 dark:text-sky-400 leading-relaxed">
                <strong>Optional:</strong> Without an API key, the app uses a high-fidelity academic fallback engine that generates realistic IEEE papers locally — no key required.
                <br /><br />
                To unlock full AI generation via Gemini Flash, enter your free API key from <strong>Google AI Studio (aistudio.google.com)</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all"
                />
                <button
                  onClick={() => setShowKey(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {apiKey && (
                <button
                  onClick={handleClear}
                  className="px-3 py-3 rounded-xl border border-red-200 dark:border-red-900/50 text-red-500 text-xs hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
              🔒 Key is stored in browser localStorage only. Never sent elsewhere.
            </p>
          </div>

          {/* Academic Status Badges */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Active Features</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Paper Generation', status: true },
                { label: 'Section AI Drafting', status: true },
                { label: 'Grammar Analysis', status: true },
                { label: 'AI Risk Detector', status: true },
                { label: 'IEEE 2-Col Preview', status: true },
                { label: 'Multi-format Export', status: true },
                { label: 'BibTeX Citations', status: true },
                { label: 'Paper Persistence', status: true },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-5 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm"
          >
            {saved ? (
              <><CheckCircle2 className="w-3.5 h-3.5 text-white" /> Saved!</>
            ) : (
              <><Save className="w-3.5 h-3.5" /> Save Settings</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
