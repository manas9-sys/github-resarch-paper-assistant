import React, { useEffect, useState } from 'react';
import { FolderGit2, Clock, FileText, Trash2, Download, ArrowRight, Loader2, Plus } from 'lucide-react';
import { api } from '../services/api.js';
import { usePaper } from '../context/PaperContext.jsx';

export default function SavedPapersView({ onOpenNewPaper }) {
  const { loadPaper } = usePaper();
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setIsLoading(true);
    try {
      const res = await api.listPapers();
      if (res.success) setPapers(res.papers);
    } catch (err) {
      console.error('Failed to load papers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoad = async (id) => {
    try {
      const res = await api.getPaper(id);
      if (res.success && res.paper) {
        loadPaper(res.paper);
      }
    } catch (err) {
      console.error('Failed to load paper:', err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Delete this paper? This action cannot be undone.')) return;
    try {
      await api.deletePaper(id);
      setPapers(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to delete:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Unknown';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-950">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 flex items-center justify-center">
              <FolderGit2 className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Research Papers</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{papers.length} saved papers</p>
            </div>
          </div>
          <button
            onClick={onOpenNewPaper}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Paper
          </button>
        </div>

        {/* Papers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        ) : papers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No papers saved yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Create a new paper and click "Save" to store it here.
              </p>
            </div>
            <button
              onClick={onOpenNewPaper}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors"
            >
              Create First Paper
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {papers.map((p) => (
              <div
                key={p.id}
                onClick={() => handleLoad(p.id)}
                className="group relative p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-800 bg-white dark:bg-slate-900 cursor-pointer transition-all hover:shadow-lg dark:hover:shadow-slate-900/50"
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 dark:from-sky-950/60 dark:to-indigo-950/60 flex items-center justify-center mb-4 border border-sky-200 dark:border-sky-900/50">
                  <FileText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 mb-2 pr-6 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {p.title || 'Untitled Research Paper'}
                </h3>

                {/* Domain / Venue */}
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 truncate">{p.targetVenue || p.domain || 'Research Paper'}</p>

                {/* Meta Footer */}
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(p.updatedAt || p.createdAt)}
                  </div>
                  <span>{p.wordCount || 0} words · {p.sectionCount || 0} sec.</span>
                </div>

                {/* Hover Action */}
                <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleDelete(p.id, e)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title="Delete paper"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Open arrow */}
                <ArrowRight className="absolute bottom-5 right-4 w-4 h-4 text-sky-500 opacity-0 group-hover:opacity-100 transition-all translate-x-0 group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
