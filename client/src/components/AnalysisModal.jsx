import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, CheckCircle2, AlertCircle, BarChart2, Loader2 } from 'lucide-react';
import { api } from '../services/api.js';
import { usePaper } from '../context/PaperContext.jsx';

function ScoreRing({ score, label, color }) {
  const radius = 30;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;

  const colorMap = {
    good: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
    blue: '#0ea5e9'
  };

  const strokeColor = colorMap[color] || colorMap.blue;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-700" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="6"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-800 dark:text-slate-200">
          {score}%
        </span>
      </div>
      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">{label}</span>
    </div>
  );
}

export default function AnalysisModal({ onClose }) {
  const { paper } = usePaper();
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const getAllText = () => {
    const parts = [];
    if (paper.abstract) parts.push(paper.abstract);
    paper.sections?.forEach(s => { if (s.content) parts.push(s.content); });
    return parts.join('\n\n');
  };

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const text = getAllText();
      const res = await api.analyzePaper(text);
      if (res.success) setAnalysis(res.analysis);
    } catch (err) {
      console.error('Analysis failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const TABS = ['overview', 'grammar', 'ai_detection', 'plagiarism'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Academic Integrity Audit</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Grammar · AI Risk · Plagiarism Risk</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!analysis && !isLoading && (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/50 dark:to-violet-950/50 flex items-center justify-center">
                <BarChart2 className="w-8 h-8 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Run a comprehensive academic quality audit
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Scans for grammar issues, AI-generated clichés, citation density, and plagiarism-risk wording patterns.
                </p>
              </div>
              <button
                onClick={runAnalysis}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all"
              >
                Run Full Analysis
              </button>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">Scanning academic content...</p>
            </div>
          )}

          {analysis && !isLoading && (
            <div className="space-y-6">
              {/* Score Ring Dashboard */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <ScoreRing
                  score={analysis.academicScore}
                  label="Academic Quality"
                  color={analysis.academicScore >= 75 ? 'good' : analysis.academicScore >= 50 ? 'warning' : 'danger'}
                />
                <ScoreRing
                  score={100 - analysis.aiRiskScore}
                  label="Human Authenticity"
                  color={(100 - analysis.aiRiskScore) >= 70 ? 'good' : 'warning'}
                />
                <ScoreRing
                  score={100 - analysis.plagiarismRiskScore}
                  label="Originality Index"
                  color={(100 - analysis.plagiarismRiskScore) >= 70 ? 'good' : 'warning'}
                />
              </div>

              {/* Metrics Row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Word Count', value: analysis.wordCount },
                  { label: 'Sentences', value: analysis.metrics?.sentences },
                  { label: 'Citations', value: analysis.citationCount },
                  { label: 'Reading Time', value: `${analysis.readingTimeMinutes} min` },
                ].map(m => (
                  <div key={m.label} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{m.value}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-slate-200 dark:border-slate-800">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${
                      activeTab === tab
                        ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.replace('_', ' ')}
                    {tab === 'grammar' && analysis.grammarIssues?.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px]">
                        {analysis.grammarIssues.length}
                      </span>
                    )}
                    {tab === 'ai_detection' && analysis.aiFlags?.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 text-[10px]">
                        {analysis.aiFlags.length}
                      </span>
                    )}
                    {tab === 'plagiarism' && analysis.plagiarismFlags?.length > 0 && (
                      <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-[10px]">
                        {analysis.plagiarismFlags.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="space-y-3">
                {activeTab === 'overview' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">Overall Assessment</span>
                      </div>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        Academic Quality Score: {analysis.academicScore}/100 · 
                        AI Risk: {analysis.aiRiskScore}% · 
                        Plagiarism Risk: {analysis.plagiarismRiskScore}% · 
                        {analysis.grammarIssues?.length || 0} grammar issues found
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 text-xs text-sky-700 dark:text-sky-400">
                      Avg. Sentence Length: {analysis.metrics?.avgWordsPerSentence} words · 
                      Flesch-Kincaid Grade: {analysis.metrics?.fleschKincaidEstimate} · 
                      Citation Density: {((analysis.citationCount / Math.max(1, analysis.wordCount)) * 100).toFixed(2)}/100 words
                    </div>
                  </div>
                )}

                {activeTab === 'grammar' && (
                  <IssueList
                    issues={analysis.grammarIssues}
                    emptyMessage="No significant grammar or vocabulary issues detected."
                    icon={AlertCircle}
                    color="amber"
                  />
                )}

                {activeTab === 'ai_detection' && (
                  <IssueList
                    issues={analysis.aiFlags}
                    emptyMessage="No AI-generated cliché phrases or low-burstiness patterns detected."
                    icon={AlertTriangle}
                    color="orange"
                  />
                )}

                {activeTab === 'plagiarism' && (
                  <IssueList
                    issues={analysis.plagiarismFlags}
                    emptyMessage="No unsubstantiated claims or plagiarism-risk patterns detected."
                    icon={ShieldCheck}
                    color="red"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 shrink-0">
          {analysis && (
            <button
              onClick={runAnalysis}
              className="px-4 py-2 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              Re-scan
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function IssueList({ issues, emptyMessage, icon: Icon, color }) {
  const colorStyles = {
    amber: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300',
    orange: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/40 text-orange-800 dark:text-orange-300',
    red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300',
  };

  if (!issues || issues.length === 0) {
    return (
      <div className="flex items-center gap-2.5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50">
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <p className="text-xs text-emerald-700 dark:text-emerald-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {issues.map((issue, i) => (
        <div key={i} className={`p-3.5 rounded-xl border text-xs ${colorStyles[color]}`}>
          <div className="flex items-start gap-2">
            <Icon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div className="flex-1 space-y-1">
              {issue.original && (
                <p><strong>Found:</strong> <code className="px-1 py-0.5 rounded bg-black/10 font-mono text-[10px]">{issue.original}</code></p>
              )}
              {issue.phrase && !issue.original && (
                <p><strong>Issue:</strong> <em>{issue.phrase}</em></p>
              )}
              <p>{issue.message || issue.suggestion}</p>
              {issue.replacement && (
                <p className="text-emerald-700 dark:text-emerald-400"><strong>Suggestion:</strong> {issue.replacement}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
