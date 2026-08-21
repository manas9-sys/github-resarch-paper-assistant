import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Layers,
  Sparkles
} from 'lucide-react';
import { usePaper } from '../context/PaperContext.jsx';

export default function SectionNav() {
  const { 
    paper, 
    activeSectionId, 
    setActiveSectionId, 
    addSection, 
    deleteSection, 
    reorderSections,
    generateSectionWithAi,
    isGenerating
  } = usePaper();

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [isAddingSection, setIsAddingSection] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newSectionTitle.trim()) {
      addSection(newSectionTitle.trim());
      setNewSectionTitle('');
      setIsAddingSection(false);
    }
  };

  return (
    <div className="w-72 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between shrink-0 select-none">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            Document Outline
          </span>
        </div>
        <button
          onClick={() => setIsAddingSection(true)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors"
          title="Add Custom Section"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {/* Abstract & Meta Special Navigation Item */}
        <button
          onClick={() => setActiveSectionId('meta_abstract')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-all ${
            activeSectionId === 'meta_abstract'
              ? 'bg-sky-500 text-white font-semibold shadow-sm'
              : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            {paper.abstract ? (
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${activeSectionId === 'meta_abstract' ? 'text-white' : 'text-emerald-500'}`} />
            ) : (
              <Circle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            )}
            <span className="truncate">Abstract & Keywords</span>
          </div>
          <span className={`text-[10px] shrink-0 ${activeSectionId === 'meta_abstract' ? 'text-sky-100' : 'text-slate-400'}`}>
            {paper.abstract ? paper.abstract.trim().split(/\s+/).length : 0} w
          </span>
        </button>

        <div className="py-1">
          <div className="border-t border-slate-200 dark:border-slate-800/60 my-1"></div>
        </div>

        {/* Paper Sections */}
        {paper.sections?.map((sec, index) => {
          const isActive = activeSectionId === sec.id;
          const wordCount = sec.content ? sec.content.trim().split(/\s+/).filter(Boolean).length : 0;
          const hasContent = wordCount > 0;

          return (
            <div
              key={sec.id}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800/80'
              }`}
              onClick={() => setActiveSectionId(sec.id)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {hasContent ? (
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                ) : (
                  <Circle className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                )}
                <span className="truncate">{sec.title}</span>
              </div>

              {/* Word count or quick actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className={`text-[10px] ${isActive ? 'text-sky-100' : 'text-slate-400'}`}>
                  {wordCount} w
                </span>

                {/* Quick actions on hover */}
                <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
                  {index > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderSections(index, index - 1);
                      }}
                      className="p-0.5 rounded hover:bg-black/10 text-inherit"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                  )}
                  {index < paper.sections.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reorderSections(index, index + 1);
                      }}
                      className="p-0.5 rounded hover:bg-black/10 text-inherit"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  )}
                  {paper.sections.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSection(sec.id);
                      }}
                      className="p-0.5 rounded hover:bg-red-500 hover:text-white text-inherit"
                      title="Delete Section"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Add section inline form */}
        {isAddingSection && (
          <form onSubmit={handleAdd} className="mt-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
            <input
              type="text"
              placeholder="e.g. VII. Security Analysis"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              autoFocus
              className="w-full text-xs px-2 py-1 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-500"
            />
            <div className="flex items-center justify-end gap-1.5 mt-2">
              <button
                type="button"
                onClick={() => setIsAddingSection(false)}
                className="px-2 py-1 text-[11px] rounded text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] rounded bg-sky-600 text-white font-medium hover:bg-sky-500"
              >
                Add
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>{paper.sections?.length || 0} Sections</span>
        <span className="text-emerald-500 font-medium">IEEE Compliant</span>
      </div>
    </div>
  );
}
