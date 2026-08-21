import React, { useState } from 'react';
import { X, BookOpen, Check } from 'lucide-react';
import { TEMPLATES } from '../utils/defaultTemplates.js';
import { usePaper } from '../context/PaperContext.jsx';

const SECTION_MAPS = {
  'ieee-conf': [
    { id: 'introduction', title: 'I. Introduction', content: '' },
    { id: 'related_work', title: 'II. Related Work', content: '' },
    { id: 'methodology', title: 'III. Proposed Methodology', content: '' },
    { id: 'results', title: 'IV. Experimental Results', content: '' },
    { id: 'conclusion', title: 'V. Conclusion', content: '' },
    { id: 'references', title: 'References', content: '' }
  ],
  'ieee-trans': [
    { id: 'introduction', title: 'I. Introduction', content: '' },
    { id: 'background', title: 'II. Background & Literature Review', content: '' },
    { id: 'system_model', title: 'III. Mathematical System Model', content: '' },
    { id: 'proposed', title: 'IV. Proposed Framework', content: '' },
    { id: 'results', title: 'V. Empirical Validation', content: '' },
    { id: 'discussion', title: 'VI. Discussion & Limitations', content: '' },
    { id: 'conclusion', title: 'VII. Conclusion', content: '' },
    { id: 'references', title: 'References', content: '' }
  ],
  'acm-sig': [
    { id: 'introduction', title: '1 Introduction', content: '' },
    { id: 'problem', title: '2 Problem Formulation', content: '' },
    { id: 'design', title: '3 System Design', content: '' },
    { id: 'evaluation', title: '4 Implementation & Evaluation', content: '' },
    { id: 'related_work', title: '5 Related Work', content: '' },
    { id: 'ethics', title: '6 Ethics & Limitations', content: '' },
    { id: 'conclusion', title: '7 Conclusion', content: '' },
    { id: 'references', title: 'References', content: '' }
  ],
  'arxiv-preprint': [
    { id: 'introduction', title: '1 Introduction', content: '' },
    { id: 'related_work', title: '2 Related Work', content: '' },
    { id: 'methodology', title: '3 Methodology', content: '' },
    { id: 'experiments', title: '4 Experiments', content: '' },
    { id: 'theoretical', title: '5 Theoretical Analysis', content: '' },
    { id: 'conclusion', title: '6 Broader Impacts & Conclusion', content: '' },
    { id: 'references', title: 'References', content: '' },
    { id: 'appendix', title: 'Appendix', content: '' }
  ]
};

export default function TemplatesModal({ onClose }) {
  const { loadPaper, paper } = usePaper();
  const [selected, setSelected] = useState(null);

  const applyTemplate = (templateId) => {
    const sections = SECTION_MAPS[templateId] || SECTION_MAPS['ieee-conf'];
    const template = TEMPLATES.find(t => t.id === templateId);
    loadPaper({
      ...paper,
      targetVenue: template?.venue || paper.targetVenue,
      sections,
      activeSectionId: 'introduction'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Academic Templates</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose a paper structure template</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => setSelected(t.id)}
              className={`relative p-5 rounded-2xl border cursor-pointer transition-all ${
                selected === t.id
                  ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30 shadow-sm'
                  : 'border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-800 bg-white dark:bg-slate-900/50'
              }`}
            >
              {selected === t.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <h3 className={`text-sm font-bold mb-1.5 ${selected === t.id ? 'text-teal-700 dark:text-teal-300' : 'text-slate-900 dark:text-slate-100'}`}>
                {t.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-snug">{t.description}</p>

              <div className="space-y-1">
                {(SECTION_MAPS[t.id] || []).map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                    {s.title}
                  </div>
                ))}
              </div>

              <div className="mt-3 text-[10px] font-semibold text-teal-600 dark:text-teal-400 truncate">
                {t.venue}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => selected && applyTemplate(selected)}
            disabled={!selected}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors disabled:opacity-50 shadow-sm"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
