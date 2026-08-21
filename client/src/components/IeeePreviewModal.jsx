import React from 'react';
import { X, Printer, BookOpen } from 'lucide-react';
import { usePaper } from '../context/PaperContext.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';

export default function IeeePreviewModal({ onClose }) {
  const { paper } = usePaper();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-6 px-4">
      {/* Toolbar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition-colors backdrop-blur-sm"
        >
          <Printer className="w-3.5 h-3.5" />
          Print / PDF
        </button>
        <button
          onClick={onClose}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* IEEE Paper Preview */}
      <div className="ieee-paper-preview w-full max-w-[210mm] mx-auto bg-white shadow-2xl rounded-lg overflow-hidden my-4" style={{ padding: '15mm 20mm' }}>
        {/* IEEE Paper Title */}
        <div className="ieee-title text-2xl mb-3 font-serif" style={{ fontFamily: 'Lora, Georgia, serif', textAlign: 'center' }}>
          {paper.title || 'Research Paper Title'}
        </div>

        {/* Authors */}
        <div className="ieee-authors text-center mb-2 font-serif" style={{ fontFamily: 'Lora, Georgia, serif' }}>
          <span className="font-semibold text-sm">{paper.authors || 'Author Names'}</span>
          <br />
          <span className="italic text-xs text-gray-600">{paper.affiliations || 'Department & Institution'}</span>
        </div>

        <hr className="border-gray-400 mb-4" />

        {/* Abstract & Keywords in single column */}
        {(paper.abstract || paper.keywords?.length > 0) && (
          <div className="mb-6">
            {paper.abstract && (
              <p className="text-xs leading-relaxed font-serif" style={{ fontFamily: 'Lora, Georgia, serif', textAlign: 'justify' }}>
                <strong className="italic">Abstract—</strong>
                <em>{paper.abstract}</em>
              </p>
            )}
            {paper.keywords && paper.keywords.length > 0 && (
              <p className="text-xs mt-2 font-serif" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                <strong className="italic">Index Terms—</strong>
                {Array.isArray(paper.keywords) ? paper.keywords.join(', ') : paper.keywords}
              </p>
            )}
          </div>
        )}

        {/* Two-Column Body */}
        <div className="ieee-columns text-xs font-serif" style={{ fontFamily: 'Lora, Georgia, serif', columnCount: 2, columnGap: '18px', textAlign: 'justify' }}>
          {paper.sections?.map((sec) => (
            <div key={sec.id} className="break-inside-avoid-column mb-4">
              {/* Section Header */}
              <div className="ieee-section-heading text-[10pt] font-bold uppercase border-b border-gray-800 pb-0.5 mb-2 tracking-wide" style={{ fontFamily: 'Lora, Georgia, serif' }}>
                {sec.title}
              </div>
              {/* Section Content - simplified for print */}
              <IeeeSection content={sec.content} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IeeeSection({ content }) {
  if (!content) return null;

  // Strip markdown but keep basic paragraphs and remove LaTeX for display
  const lines = content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italics
    .replace(/^#+\s+/gm, '') // Remove headings
    .replace(/\$\$([\s\S]*?)\$\$/g, '[Equation]') // Block math
    .replace(/\$([^\$]+?)\$/g, (_, tex) => tex) // Inline math — keep text
    .replace(/```[\s\S]*?```/g, '[Code Block]') // Code blocks
    .split('\n\n')
    .filter(p => p.trim());

  return (
    <>
      {lines.map((para, i) => {
        // Table
        if (para.includes('|') && para.includes('---')) {
          return (
            <table key={i} style={{ width: '100%', borderCollapse: 'collapse', fontSize: '7.5pt', margin: '4px 0' }}>
              {para.split('\n').filter(r => !r.includes('---')).map((row, ri) => (
                <tr key={ri}>
                  {row.split('|').filter((_, ci, arr) => ci > 0 && ci < arr.length - 1).map((cell, ci) => (
                    ri === 0
                      ? <th key={ci} style={{ border: '1px solid #ccc', padding: '2px 4px', fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>{cell.trim()}</th>
                      : <td key={ci} style={{ border: '1px solid #ccc', padding: '2px 4px' }}>{cell.trim()}</td>
                  ))}
                </tr>
              ))}
            </table>
          );
        }

        // Bullet item
        if (para.trim().startsWith('- ') || para.trim().startsWith('* ')) {
          const items = para.trim().split('\n').filter(l => l.trim());
          return (
            <ul key={i} style={{ paddingLeft: '12px', margin: '3px 0' }}>
              {items.map((item, ii) => (
                <li key={ii} style={{ listStyle: 'disc', fontSize: '7.5pt', marginBottom: '1px' }}>
                  {item.replace(/^[-*]\s+/, '').trim()}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} style={{
            fontFamily: 'Lora, Georgia, serif',
            fontSize: '9pt',
            lineHeight: '1.3',
            marginBottom: '4px',
            textAlign: 'justify',
            textIndent: i === 0 ? '0' : '10px'
          }}>
            {para.trim()}
          </p>
        );
      })}
    </>
  );
}
