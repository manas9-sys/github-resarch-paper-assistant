import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Lightbulb, GitFork, FlaskConical, BookOpenCheck, Cpu, Sigma } from 'lucide-react';
import { api } from '../services/api.js';
import { usePaper } from '../context/PaperContext.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';

const QUICK_PROMPTS = [
  { icon: Lightbulb, label: 'Find Research Gaps', prompt: 'Identify key research gaps in the current paper topic and suggest 3 concrete angles for novelty.' },
  { icon: BookOpenCheck, label: 'Peer Review Mode', prompt: 'Act as a strict IEEE Reviewer #2. Give a detailed critique of this paper: strengths, major weaknesses, and specific revision requests.' },
  { icon: Sigma, label: 'Math Formulation', prompt: 'Help me formulate the core methodology as rigorous IEEE-style mathematical equations using LaTeX notation.' },
  { icon: FlaskConical, label: 'Ablation Design', prompt: 'Design a comprehensive ablation study for the proposed methodology with clear experimental variants and evaluation metrics.' },
  { icon: GitFork, label: 'Baseline Comparison', prompt: 'Suggest 5 strong baseline methods to compare against, with IEEE citations and brief justification for each.' },
  { icon: Cpu, label: 'Complexity Analysis', prompt: 'Derive and explain the time and space complexity of the proposed algorithm using Big-O notation.' },
];

export default function AiChatPanel({ onClose }) {
  const { paper } = usePaper();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `# Welcome to Research Copilot ✦

I'm your advanced IEEE research advisor. I can help you:

- **Find research gaps** and novelty anchors
- **Formulate mathematical models** (LaTeX ready)
- **Simulate peer reviewer** critique
- **Design experiments** and ablation studies
- **Generate baseline comparisons** with citations

What aspect of **"${paper.title || 'your research paper'}"** shall we work on?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const paperContext = {
        title: paper.title,
        topic: paper.topic,
        domain: paper.domain,
        abstract: paper.abstract,
        keywords: paper.keywords,
        sections: paper.sections?.map(s => ({ id: s.id, title: s.title, wordCount: s.content?.split(/\s+/).length || 0 }))
      };

      const res = await api.chatCopilot(newMessages, paperContext);
      if (res.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I encountered an issue: ${err.message}. Please check your API settings or try again.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100">Research Copilot</p>
            <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              Active
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2.5 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-hide">
        {QUICK_PROMPTS.map((qp) => {
          const Icon = qp.icon;
          return (
            <button
              key={qp.label}
              onClick={() => sendMessage(qp.prompt)}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-700 dark:hover:text-sky-300 border border-transparent hover:border-sky-200 dark:hover:border-sky-800/60 transition-all disabled:opacity-50"
            >
              <Icon className="w-3 h-3 shrink-0" />
              {qp.label}
            </button>
          );
        })}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 shrink-0">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div
              className={`max-w-[90%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-sky-600 text-white rounded-tr-sm ml-4'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-sm'
              }`}
            >
              {msg.role === 'assistant' ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center mr-2 mt-1 shrink-0">
              <Bot className="w-3.5 h-3.5 text-white animate-pulse" />
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-3 py-2 border border-transparent focus-within:border-sky-500/50 transition-all"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask me anything about your paper..."
            rows={2}
            className="flex-1 text-xs bg-transparent text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-1.5">
          Shift+Enter for new line · Enter to send
        </p>
      </div>
    </div>
  );
}
