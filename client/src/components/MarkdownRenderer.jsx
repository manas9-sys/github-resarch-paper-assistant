import React, { useEffect, useRef } from 'react';
import katex from 'katex';

/**
 * High-performance Markdown & LaTeX renderer with KaTeX math support
 */
export default function MarkdownRenderer({ content, className = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // First process LaTeX block math $$...$$ and inline $...$
    let html = content;

    // Escape HTML tags to prevent XSS
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // LaTeX Display Math ($$...$$)
    html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match, tex) => {
      try {
        return `<div class="katex-display my-3 text-center overflow-x-auto py-1">${katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false })}</div>`;
      } catch (e) {
        return `<pre class="text-xs text-red-400">${tex}</pre>`;
      }
    });

    // LaTeX Inline Math ($...$)
    html = html.replace(/\$([^\$\n]+?)\$/g, (match, tex) => {
      try {
        return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
      } catch (e) {
        return `<code>${tex}</code>`;
      }
    });

    // Process Tables
    html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
      const rows = match.trim().split('\n').map(r => r.trim());
      if (rows.length < 2) return match;

      let tableHtml = '<div class="overflow-x-auto my-4"><table class="w-full text-left text-sm border-collapse border border-slate-300 dark:border-slate-700">';
      rows.forEach((row, idx) => {
        if (row.includes('---')) return; // separator line
        const cols = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
        if (idx === 0) {
          tableHtml += '<thead class="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold"><tr>';
          cols.forEach(c => {
            tableHtml += `<th class="border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs uppercase tracking-wider">${c.trim()}</th>`;
          });
          tableHtml += '</tr></thead><tbody>';
        } else {
          tableHtml += '<tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">';
          cols.forEach(c => {
            tableHtml += `<td class="border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300">${c.trim()}</td>`;
          });
          tableHtml += '</tr>';
        }
      });
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    });

    // Process Code Blocks (```...```)
    html = html.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre class="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs my-3 overflow-x-auto border border-slate-800 leading-relaxed">${code.trim()}</pre>`;
    });

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 dark:text-slate-100 mt-5 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-6 mb-3">$1</h1>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900 dark:text-slate-100">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Bullet Lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 my-1">$1</li>');

    // Numbered lists
    html = html.replace(/^\s*(\d+)\.\s+(.*$)/gim, '<li class="ml-4 list-decimal text-slate-700 dark:text-slate-300 my-1">$2</li>');

    // Citations highlight [1], [2], [3]-[6]
    html = html.replace(/(\[\d+(?:[-–]\d+)?(?:,\s*\d+)*\])/g, '<span class="text-sky-600 dark:text-sky-400 font-semibold cursor-pointer hover:underline" title="Citation">$1</span>');

    // Paragraphs
    const blocks = html.split(/\n\n+/);
    html = blocks.map(b => {
      if (b.startsWith('<h') || b.startsWith('<pre') || b.startsWith('<div') || b.startsWith('<li')) {
        return b;
      }
      return `<p class="mb-3 text-slate-700 dark:text-slate-300 leading-relaxed">${b.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    containerRef.current.innerHTML = html;
  }, [content]);

  return <div ref={containerRef} className={`academic-prose leading-relaxed ${className}`} />;
}
