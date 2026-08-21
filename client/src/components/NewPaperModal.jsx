import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { usePaper } from '../context/PaperContext.jsx';
import { TEMPLATES } from '../utils/defaultTemplates.js';

export default function NewPaperModal({ onClose }) {
  const { generateFullPaper, paper, updatePaperMeta } = usePaper();
  const [topic, setTopic] = useState('');
  const [domain, setDomain] = useState('Computer Science & Engineering');
  const [keywords, setKeywords] = useState('');
  const [targetVenue, setTargetVenue] = useState('IEEE Transactions');
  const [tone, setTone] = useState('formal');
  const [selectedTemplate, setSelectedTemplate] = useState('ieee-conf');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a research topic or title.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await generateFullPaper({ topic, domain, keywords, targetVenue, tone });
      onClose();
    } catch (err) {
      setError(err.message || 'Generation failed. Using academic fallback engine.');
      setTimeout(() => onClose(), 2000);
    } finally {
      setIsLoading(false);
    }
  };

  const VENUES = [
    'IEEE Transactions',
    'IEEE Conference Proceedings',
    'IEEE Access',
    'ACM SIG Conference',
    'Springer LNCS',
    'arXiv Preprint',
    'Elsevier Journal'
  ];

  const DOMAINS = [
    'Computer Science & Engineering',
    'Artificial Intelligence & Machine Learning',
    'Computer Networks & Distributed Systems',
    'Cybersecurity & Privacy',
    'Embedded Systems & IoT',
    'Biomedical Engineering',
    'Electrical Engineering',
    'Robotics & Control Systems',
    'Natural Language Processing',
    'Computer Vision'
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-600 to-indigo-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">New Research Paper</h2>
              <p className="text-xs text-sky-100">AI will generate a complete IEEE-structured manuscript</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {/* Research Topic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Research Topic / Paper Title *
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Federated Learning with Differential Privacy for Healthcare Data Aggregation in IoT Networks"
              rows={3}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Domain */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Research Domain
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
              >
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Venue */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Target Venue
              </label>
              <select
                value={targetVenue}
                onChange={(e) => setTargetVenue(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
              >
                {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Federated Learning, Differential Privacy, IoT, Healthcare..."
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
            />
          </div>

          {/* Tone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Writing Tone
            </label>
            <div className="flex gap-2">
              {['formal', 'quantitative', 'theoretical'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-all capitalize ${
                    tone === t
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
              Paper Template
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setTargetVenue(t.venue);
                  }}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    selectedTemplate === t.id
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <p className={`text-xs font-semibold mb-0.5 ${selectedTemplate === t.id ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'}`}>
                    {t.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{t.description.slice(0, 70)}...</p>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white shadow-lg shadow-sky-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating IEEE Paper...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Full Paper</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
