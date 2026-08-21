import React, { useState } from 'react';
import { 
  Save, 
  Eye, 
  Download, 
  Bot, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  FileEdit,
  ExternalLink
} from 'lucide-react';
import { usePaper } from '../context/PaperContext.jsx';

export default function Header({ 
  onOpenPreview, 
  onOpenExport, 
  onOpenAnalysis, 
  onToggleCopilot, 
  isCopilotOpen 
}) {
  const { 
    paper, 
    updatePaperMeta, 
    saveToBackend, 
    isSaving, 
    lastSaved, 
    totalWordCount 
  } = usePaper();
  
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between gap-4 sticky top-0 z-20 select-none">
      {/* Title & Metadata */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {isEditingTitle ? (
          <input
            type="text"
            value={paper.title || ''}
            onChange={(e) => updatePaperMeta('title', e.target.value)}
            onBlur={() => setIsEditingTitle(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
            autoFocus
            className="flex-1 max-w-xl text-sm font-semibold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-sky-500 text-slate-900 dark:text-slate-100 focus:outline-none"
          />
        ) : (
          <div 
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-2 cursor-pointer group min-w-0"
            title="Click to edit paper title"
          >
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate group-hover:text-sky-500 transition-colors">
              {paper.title || 'Untitled Research Paper'}
            </h2>
            <FileEdit className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        )}

        <span className="hidden lg:inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60 shrink-0">
          {paper.targetVenue || 'IEEE Format'}
        </span>
      </div>

      {/* Center Metadata Badge */}
      <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5" title="Total Word Count">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{totalWordCount} words (~{Math.ceil(totalWordCount / 220)} min read)</span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]" title="Autosave status">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-slate-400">
            {lastSaved ? `Autosaved at ${lastSaved}` : 'Autosaved'}
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Save to Cloud DB */}
        <button
          onClick={saveToBackend}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors disabled:opacity-50"
        >
          <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
        </button>

        {/* Academic Audit */}
        <button
          onClick={onOpenAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/40 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Audit</span>
        </button>

        {/* IEEE Preview */}
        <button
          onClick={onOpenPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Preview</span>
        </button>

        {/* Export */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>

        {/* AI Copilot Toggle */}
        <button
          onClick={onToggleCopilot}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCopilotOpen
              ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
              : 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/40 border border-sky-200 dark:border-sky-800/60'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Copilot</span>
        </button>
      </div>
    </header>
  );
}
