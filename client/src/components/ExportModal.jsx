import React, { useState } from 'react';
import { X, Download, FileText, Printer, Code2, FileCode2, Loader2, CheckCircle2 } from 'lucide-react';
import { usePaper } from '../context/PaperContext.jsx';
import { exportPaperToDocx } from '../utils/exportDocx.js';
import { api } from '../services/api.js';

const EXPORT_OPTIONS = [
  {
    id: 'pdf',
    label: 'PDF Document',
    description: 'Print-ready IEEE format. Uses browser print dialog.',
    icon: Printer,
    badge: 'IEEE',
    color: 'red'
  },
  {
    id: 'docx',
    label: 'Word Document (.docx)',
    description: 'Editable Word file with structured headings, abstract, and sections.',
    icon: FileText,
    badge: 'Word',
    color: 'blue'
  },
  {
    id: 'latex',
    label: 'LaTeX Source (.tex)',
    description: 'Complete IEEEtran LaTeX file ready for Overleaf or TeX compilers.',
    icon: Code2,
    badge: 'LaTeX',
    color: 'green'
  },
  {
    id: 'markdown',
    label: 'Markdown (.md)',
    description: 'Clean Markdown file with all sections and content.',
    icon: FileCode2,
    badge: 'MD',
    color: 'purple'
  },
  {
    id: 'bibtex',
    label: 'BibTeX (.bib)',
    description: 'Export a BibTeX file from the References section content.',
    icon: FileCode2,
    badge: 'BIB',
    color: 'amber'
  }
];

export default function ExportModal({ onClose }) {
  const { paper } = usePaper();
  const [exporting, setExporting] = useState(null);
  const [exported, setExported] = useState([]);

  const handleExport = async (type) => {
    setExporting(type);
    try {
      switch (type) {
        case 'pdf': {
          // Open IEEE preview then trigger print
          window.print();
          break;
        }
        case 'docx': {
          await exportPaperToDocx(paper);
          break;
        }
        case 'latex': {
          const res = await api.exportLatex({
            title: paper.title,
            authors: paper.authors,
            affiliations: paper.affiliations,
            abstract: paper.abstract,
            keywords: paper.keywords,
            sections: paper.sections
          });
          if (res.success) {
            const blob = new Blob([res.latex], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${sanitizeFilename(paper.title)}.tex`;
            a.click();
            URL.revokeObjectURL(url);
          }
          break;
        }
        case 'markdown': {
          let md = `# ${paper.title || 'Research Paper'}\n\n`;
          md += `**Authors:** ${paper.authors || 'N/A'}\n\n`;
          md += `**Affiliations:** ${paper.affiliations || 'N/A'}\n\n`;
          md += `**Target Venue:** ${paper.targetVenue || 'N/A'}\n\n`;
          if (paper.abstract) {
            md += `## Abstract\n\n${paper.abstract}\n\n`;
          }
          if (paper.keywords?.length) {
            md += `**Keywords:** ${Array.isArray(paper.keywords) ? paper.keywords.join(', ') : paper.keywords}\n\n`;
          }
          paper.sections?.forEach(s => {
            md += `## ${s.title}\n\n${s.content || ''}\n\n`;
          });
          downloadText(md, `${sanitizeFilename(paper.title)}.md`);
          break;
        }
        case 'bibtex': {
          // Extract references from references section
          const refSec = paper.sections?.find(s => s.id === 'references' || s.title?.toLowerCase().includes('reference'));
          const bibtex = refSec?.content || '% No references found in paper.';
          downloadText(bibtex, `${sanitizeFilename(paper.title)}.bib`);
          break;
        }
      }
      setExported(prev => [...prev, type]);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(null);
    }
  };

  const sanitizeFilename = (name) => {
    return (name || 'paper').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 60);
  };

  const downloadText = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const colorMap = {
    red: 'from-red-500/10 to-red-600/10 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400',
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400',
    green: 'from-emerald-500/10 to-emerald-600/10 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400',
    purple: 'from-violet-500/10 to-violet-600/10 border-violet-200 dark:border-violet-900/50 text-violet-700 dark:text-violet-400',
    amber: 'from-amber-500/10 to-amber-600/10 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400',
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Export Paper</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred format</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Paper Info */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{paper.title || 'Untitled Paper'}</span>
            {' '}· {paper.sections?.reduce((acc, s) => acc + (s.content?.split(/\s+/).length || 0), 0) || 0} words
          </p>
        </div>

        {/* Export Options */}
        <div className="p-5 space-y-3">
          {EXPORT_OPTIONS.map(opt => {
            const Icon = opt.icon;
            const isExporting = exporting === opt.id;
            const isDone = exported.includes(opt.id);

            return (
              <div
                key={opt.id}
                className={`flex items-center justify-between p-4 rounded-xl border bg-gradient-to-r ${colorMap[opt.color]} transition-all`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{opt.label}</p>
                    <p className="text-xs opacity-70 mt-0.5">{opt.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleExport(opt.id)}
                  disabled={isExporting}
                  className="ml-3 shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/80 dark:bg-slate-900/60 border border-current/20 text-xs font-semibold hover:bg-white dark:hover:bg-slate-900/80 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isExporting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  {isExporting ? 'Exporting...' : isDone ? 'Done' : 'Export'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="px-6 pb-5 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
