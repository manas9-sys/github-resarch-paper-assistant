import express from 'express';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

const router = express.Router();

/**
 * Generate Word (.docx) document
 * POST /api/export/docx
 */
router.post('/docx', async (req, res) => {
  try {
    const { title, authors, affiliations, abstract, keywords, sections } = req.body;

    const docChildren = [];

    // Title
    docChildren.push(
      new Paragraph({
        text: title || 'Research Paper',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 120 }
      })
    );

    // Authors & Affiliations
    if (authors || affiliations) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({
              text: authors || 'Author Name',
              bold: true,
              size: 22
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: affiliations || 'Department of Computer Science & Engineering',
              italics: true,
              size: 20
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 }
        })
      );
    }

    // Abstract
    if (abstract) {
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Abstract—', bold: true, italics: true }),
            new TextRun({ text: abstract, italics: true })
          ],
          spacing: { before: 120, after: 120 }
        })
      );
    }

    // Keywords
    if (keywords && keywords.length > 0) {
      const kwString = Array.isArray(keywords) ? keywords.join(', ') : keywords;
      docChildren.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Index Terms—', bold: true, italics: true }),
            new TextRun({ text: kwString })
          ],
          spacing: { after: 240 }
        })
      );
    }

    // Sections
    if (sections && Array.isArray(sections)) {
      sections.forEach(sec => {
        docChildren.push(
          new Paragraph({
            text: sec.title || 'Section',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 240, after: 120 }
          })
        );

        // Split paragraphs
        const paragraphs = (sec.content || '').split('\n\n');
        paragraphs.forEach(p => {
          if (p.trim()) {
            docChildren.push(
              new Paragraph({
                children: [new TextRun({ text: p.trim(), size: 20 })],
                spacing: { after: 120 }
              })
            );
          }
        });
      });
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: docChildren
        }
      ]
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(title || 'paper')}.docx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(buffer);
  } catch (err) {
    console.error('Error exporting DOCX:', err);
    res.status(500).json({ error: 'Failed to generate DOCX document' });
  }
});

/**
 * Generate LaTeX (.tex) format
 * POST /api/export/latex
 */
router.post('/latex', (req, res) => {
  try {
    const { title, authors, affiliations, abstract, keywords, sections } = req.body;

    const texContent = `\\documentclass[conference]{IEEEtran}
\\IEEEoverridecommandlockouts
\\usepackage{cite}
\\usepackage{amsmath,amssymb,amsfonts}
\\usepackage{algorithmic}
\\usepackage{graphicx}
\\usepackage{textcomp}
\\usepackage{xcolor}

\\begin{document}

\\title{${title || 'Research Paper Title'}}

\\author{\\IEEEauthorblockN{${authors || 'Author Name'}}
\\IEEEauthorblockA{\\textit{${affiliations || 'Department of Computer Science'}} \\\\
\\textit{Institution / University}\\\\
City, Country}}

\\maketitle

\\begin{abstract}
${abstract || ''}
\\end{abstract}

\\begin{IEEEkeywords}
${Array.isArray(keywords) ? keywords.join(', ') : (keywords || '')}
\\end{IEEEkeywords}

${(sections || []).map(sec => `\\section{${sec.title.replace(/^[IVXLCDM]+\.\s*/, '')}}
${sec.content}
`).join('\n')}

\\end{document}`;

    res.json({ success: true, latex: texContent });
  } catch (err) {
    console.error('Error generating LaTeX:', err);
    res.status(500).json({ error: 'Failed to generate LaTeX' });
  }
});

export default router;
