import React, { useState, useRef } from 'react';
import { 
  Wand2, 
  Expand, 
  Minimize2, 
  BookOpen, 
  Pencil, 
  Code2,
  Sparkles, 
  RotateCcw,
  Type,
  EyeIcon,
  FileText
} from 'lucide-react';
import { usePaper } from '../context/PaperContext.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';

const IMPROVE_ACTIONS = [
  { id: 'academic_tone', label: 'Academic Tone', icon: BookOpen, color: 'blue' },
  { id: 'expand', label: 'Expand', icon: Expand, color: 'violet' },
  { id: 'condense', label: 'Condense', icon: Minimize2, color: 'amber' },
  { id: 'grammar', label: 'Fix Grammar', icon: Pencil, color: 'emerald' },
  { id: 'equations', label: 'Add Equations', icon: Code2, color: 'rose' },
  { id: 'research_gap', label: 'Research Gap', icon: Sparkles, color: 'indigo' },
];

export default function PaperEditor() {
  const {
    paper,
    activeSectionId,
    activeSection,
    updatePaperMeta,
    updateSectionContent,
    generateSectionWithAi,
    improveTextWithAi,
    isGenerating,
    isImproving,
  } = usePaper();

  const [editorMode, setEditorMode] = useState('edit'); // 'edit' | 'preview'
  const [isImproveMenuOpen, setIsImproveMenuOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [originalContent, setOriginalContent] = useState(null);
  const textareaRef = useRef(null);

  // Meta/Abstract Section
  if (activeSectionId === 'meta_abstract') {
    return <AbstractEditor paper={paper} updatePaperMeta={updatePaperMeta} />;
  }

  if (!activeSection) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 dark:text-slate-600">
        <div className="text-center space-y-2">
          <FileText className="w-12 h-12 mx-auto opacity-30" />
          <p className="text-sm">Select a section to begin editing</p>
        </div>
      </div>
    );
  }

  const wordCount = activeSection.content
    ? activeSection.content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleImprove = async (action) => {
    const content = selectedText || activeSection.content || '';
    if (!content.trim()) return;
    setIsImproveMenuOpen(false);
    try {
      if (!originalContent) setOriginalContent(activeSection.content);
      const improved = await improveTextWithAi({ text: content, action });
      if (improved) {
        if (selectedText) {
          const newContent = activeSection.content.replace(selectedText, improved);
          updateSectionContent(activeSection.id, newContent);
        } else {
          updateSectionContent(activeSection.id, improved);
        }
      }
    } catch (_) {}
  };

  const handleRevert = () => {
    if (originalContent !== null) {
      updateSectionContent(activeSection.id, originalContent);
      setOriginalContent(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-950">
      {/* Editor Toolbar */}
      <div className="px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-1">
          {/* Mode Toggle */}
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setEditorMode('edit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                editorMode === 'edit'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              Edit
            </button>
            <button
              onClick={() => setEditorMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                editorMode === 'preview'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              <EyeIcon className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-xs">
            {activeSection.title}
          </h3>
          <span className="text-xs text-slate-400">({wordCount} words)</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* AI Generate Section */}
          <button
            onClick={() => generateSectionWithAi(activeSection.id)}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800/60 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Drafting...' : 'AI Draft'}
          </button>

          {/* Improve Menu */}
          <div className="relative">
            <button
              onClick={() => setIsImproveMenuOpen(p => !p)}
              disabled={isImproving}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200 dark:border-violet-800/60 transition-colors disabled:opacity-50"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isImproving ? 'animate-spin' : ''}`} />
              {isImproving ? 'Improving...' : 'Improve'}
            </button>

            {isImproveMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-52 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-30 py-1.5 overflow-hidden">
                {IMPROVE_ACTIONS.map(a => {
                  const Icon = a.icon;
                  return (
                    <button
                      key={a.id}
                      onClick={() => handleImprove(a.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                      {a.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Revert */}
          {originalContent !== null && (
            <button
              onClick={handleRevert}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Revert
            </button>
          )}
        </div>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 overflow-hidden">
        {editorMode === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={activeSection.content || ''}
            onChange={(e) => updateSectionContent(activeSection.id, e.target.value)}
            onMouseUp={() => {
              const sel = window.getSelection()?.toString() || '';
              setSelectedText(sel);
            }}
            placeholder={`Write your ${activeSection.title} here...\n\nSupports Markdown, LaTeX math ($E = mc^2$), and IEEE citations like [1], [2].`}
            className="w-full h-full resize-none px-8 py-6 font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-600"
            spellCheck
          />
        ) : (
          <div className="h-full overflow-y-auto px-8 py-6">
            {activeSection.content ? (
              <MarkdownRenderer content={activeSection.content} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <FileText className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No content to preview. Switch to Edit mode.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating overlay click away */}
      {isImproveMenuOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setIsImproveMenuOpen(false)} />
      )}
    </div>
  );
}

function AbstractEditor({ paper, updatePaperMeta }) {
  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 bg-white dark:bg-slate-950 space-y-6">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Paper Title
        </label>
        <input
          type="text"
          value={paper.title || ''}
          onChange={(e) => updatePaperMeta('title', e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold text-base focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all"
          placeholder="Enter your full publication-ready paper title..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Author(s)
          </label>
          <input
            type="text"
            value={paper.authors || ''}
            onChange={(e) => updatePaperMeta('authors', e.target.value)}
            placeholder="J. Doe, A. Smith, R. Kumar"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Target Venue
          </label>
          <input
            type="text"
            value={paper.targetVenue || ''}
            onChange={(e) => updatePaperMeta('targetVenue', e.target.value)}
            placeholder="IEEE Transactions / ICSE 2025..."
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Affiliations
        </label>
        <input
          type="text"
          value={paper.affiliations || ''}
          onChange={(e) => updatePaperMeta('affiliations', e.target.value)}
          placeholder="Dept. of Computer Science & Engineering, University Name, City, Country"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Abstract
          <span className="ml-2 text-slate-400 normal-case font-normal tracking-normal">
            ({paper.abstract ? paper.abstract.trim().split(/\s+/).filter(Boolean).length : 0} / 250 words)
          </span>
        </label>
        <textarea
          value={paper.abstract || ''}
          onChange={(e) => updatePaperMeta('abstract', e.target.value)}
          rows={7}
          placeholder="Dense 150–250 word abstract summarizing background, problem statement, proposed methodology, key quantitative findings, and primary significance..."
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm leading-relaxed resize-none focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition-all font-serif"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
          Index Terms / Keywords
        </label>
        <input
          type="text"
          value={Array.isArray(paper.keywords) ? paper.keywords.join(', ') : (paper.keywords || '')}
          onChange={(e) => updatePaperMeta('keywords', e.target.value.split(',').map(k => k.trim()))}
          placeholder="Graph Neural Networks, Anomaly Detection, Edge Computing, Deep Learning..."
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
        />
        {/* Keywords chips */}
        {paper.keywords && paper.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(Array.isArray(paper.keywords) ? paper.keywords : paper.keywords.split(',')).filter(k => k.trim()).map((kw, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 text-xs font-medium border border-sky-200 dark:border-sky-800/60">
                {kw.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Research Domain
          </label>
          <input
            type="text"
            value={paper.domain || ''}
            onChange={(e) => updatePaperMeta('domain', e.target.value)}
            placeholder="Computer Science & Machine Learning"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Research Topic
          </label>
          <input
            type="text"
            value={paper.topic || ''}
            onChange={(e) => updatePaperMeta('topic', e.target.value)}
            placeholder="AI for Anomaly Detection in Distributed Systems"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-sky-500 transition-all"
          />
        </div>
      </div>
    </div>
  );
}
