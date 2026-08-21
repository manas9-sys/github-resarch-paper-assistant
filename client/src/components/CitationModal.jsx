import React, { useState } from 'react';
import { X, Quote, Plus, Loader2, CheckCircle2, Copy, Trash2, Download } from 'lucide-react';
import { api } from '../services/api.js';
import { usePaper } from '../context/PaperContext.jsx';

export default function CitationModal({ onClose }) {
  const { paper, updatePaperMeta } = usePaper();
  const [references, setReferences] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(8);
  const [activeTab, setActiveTab] = useState('ieee');
  const [copiedId, setCopiedId] = useState(null);

  const generateRefs = async () => {
    setIsLoading(true);
    try {
      const res = await api.generateReferences({
        topic: paper.title || paper.topic,
        domain: paper.domain,
        count
      });
      if (res.success && res.references) {
        setReferences(res.references);
      }
    } catch (err) {
      console.error('Failed to generate references:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const exportBibtex = () => {
    const bibtex = references.map(r => r.bibtex).filter(Boolean).join('\n\n');
    const blob = new Blob([bibtex], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'references.bib';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
              <Quote className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">IEEE Citations & References</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Generate IEEE-format citations · BibTeX · DOI links</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Config */}
        <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 shrink-0 bg-slate-50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs text-slate-600 dark:text-slate-400">Generate</span>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min={3}
              max={20}
              className="w-14 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs text-center"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">references for: <span className="font-medium text-sky-600 dark:text-sky-400">{paper.domain || 'current domain'}</span></span>
          </div>
          <button
            onClick={generateRefs}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition-colors disabled:opacity-50 shadow-sm"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
            Generate
          </button>
          {references.length > 0 && (
            <button
              onClick={exportBibtex}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              .bib
            </button>
          )}
        </div>

        {/* Format Tabs */}
        {references.length > 0 && (
          <div className="px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex gap-4 shrink-0">
            {['ieee', 'bibtex'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-medium uppercase tracking-wider py-1 transition-colors ${
                  activeTab === tab
                    ? 'text-sky-600 dark:text-sky-400 border-b-2 border-sky-500'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab === 'ieee' ? 'IEEE Format' : 'BibTeX'}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {references.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-52 text-center space-y-3">
              <Quote className="w-10 h-10 text-slate-300 dark:text-slate-700" />
              <p className="text-sm text-slate-600 dark:text-slate-400">Click "Generate" to create IEEE-formatted citations for your paper topic.</p>
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 px-3 py-2 rounded-lg">
                ⚠ Generated references are representative literature. Always verify DOIs and publication details before submission.
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-52 space-y-3">
              <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
              <p className="text-sm text-slate-500 animate-pulse">Generating citations...</p>
            </div>
          )}

          {references.length > 0 && !isLoading && (
            <div className="space-y-3">
              {references.map((ref) => (
                <div key={ref.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-sky-300 dark:hover:border-sky-800 transition-all group">
                  {activeTab === 'ieee' ? (
                    <div>
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-mono">
                        {ref.ieeeFormatted}
                      </p>
                      {ref.isSimulated && (
                        <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900/50">
                          Representative reference — verify before submitting
                        </span>
                      )}
                    </div>
                  ) : (
                    <pre className="text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{ref.bibtex}</pre>
                  )}

                  <div className="flex items-center gap-2 mt-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyToClipboard(activeTab === 'ieee' ? ref.ieeeFormatted : ref.bibtex, ref.id)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors"
                    >
                      {copiedId === ref.id ? (
                        <><CheckCircle2 className="w-3 h-3 text-emerald-500" /> Copied!</>
                      ) : (
                        <><Copy className="w-3 h-3" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
