import React from 'react';
import { 
  FileText, 
  FolderGit2, 
  Sparkles, 
  BookOpen, 
  Quote, 
  ShieldCheck, 
  Settings, 
  Sun, 
  Moon, 
  PlusCircle, 
  Eye, 
  Download,
  GraduationCap
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { usePaper } from '../context/PaperContext.jsx';

export default function Sidebar({ 
  activeView, 
  setActiveView, 
  onOpenNewPaper, 
  onOpenPreview, 
  onOpenExport, 
  onOpenAnalysis,
  onOpenCitations,
  onOpenTemplates,
  onOpenSettings
}) {
  const { theme, toggleTheme } = useTheme();
  const { totalWordCount, isSaving } = usePaper();

  const navItems = [
    {
      id: 'editor',
      label: 'Paper Studio',
      icon: FileText,
      action: () => setActiveView('editor')
    },
    {
      id: 'saved_papers',
      label: 'My Papers',
      icon: FolderGit2,
      action: () => setActiveView('saved_papers')
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: BookOpen,
      action: onOpenTemplates
    },
    {
      id: 'citations',
      label: 'Citations & DOI',
      icon: Quote,
      action: onOpenCitations
    },
    {
      id: 'analysis',
      label: 'Academic Audit',
      icon: ShieldCheck,
      action: onOpenAnalysis,
      badge: 'Pro'
    }
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight leading-none">
              Scholar<span className="text-sky-500">Forge</span>
            </h1>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">IEEE AI Paper Studio</p>
          </div>
        </div>

        {/* New Paper CTA */}
        <button
          onClick={onOpenNewPaper}
          className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-sm transition-all duration-150 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-sky-200 animate-pulse" />
          <span>New Research Paper</span>
        </button>
      </div>

      {/* Main Navigation */}
      <div className="px-3 py-4 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Workspace
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-semibold uppercase">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-5 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Publish & Review
        </div>

        <button
          onClick={onOpenPreview}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Eye className="w-4 h-4 text-slate-400" />
          <span>IEEE 2-Col Preview</span>
        </button>

        <button
          onClick={onOpenExport}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <Download className="w-4 h-4 text-slate-400" />
          <span>Export (PDF / Word)</span>
        </button>
      </div>

      {/* Footer Controls */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* Status widget */}
        <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{totalWordCount} words</span>
          </div>
          <span className="text-[10px] text-slate-400">IEEE Ready</span>
        </div>

        {/* Settings & Theme */}
        <div className="flex items-center justify-between gap-1 pt-1">
          <button
            onClick={onOpenSettings}
            className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </aside>
  );
}
