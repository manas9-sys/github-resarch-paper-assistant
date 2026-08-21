import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

export async function exportPaperToDocx(paper) {
  const docChildren = [];

  // Title
  docChildren.push(
    new Paragraph({
      text: paper.title || 'Research Paper Title',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { before: 240, after: 120 }
    })
  );

  // Authors & Affiliation
  if (paper.authors || paper.affiliations) {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: paper.authors || 'Author Names',
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
            text: paper.affiliations || 'Affiliation & Department',
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
  if (paper.abstract) {
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Abstract—', bold: true, italics: true }),
          new TextRun({ text: paper.abstract, italics: true })
        ],
        spacing: { before: 120, after: 120 }
      })
    );
  }

  // Keywords
  if (paper.keywords && paper.keywords.length > 0) {
    const kwText = Array.isArray(paper.keywords) ? paper.keywords.join(', ') : paper.keywords;
    docChildren.push(
      new Paragraph({
        children: [
          new TextRun({ text: 'Index Terms—', bold: true, italics: true }),
          new TextRun({ text: kwText })
        ],
        spacing: { after: 240 }
      })
    );
  }

  // Sections
  if (paper.sections && Array.isArray(paper.sections)) {
    paper.sections.forEach(sec => {
      docChildren.push(
        new Paragraph({
          text: sec.title || 'Section',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 }
        })
      );

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

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(paper.title || 'paper').replace(/[^a-zA-Z0-9_-]/g, '_')}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}
