import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DEFAULT_PAPER } from '../utils/defaultTemplates.js';
import { api } from '../services/api.js';

const PaperContext = createContext();

export function PaperProvider({ children }) {
  const [paper, setPaper] = useState(() => {
    try {
      const saved = localStorage.getItem('active_research_paper');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved paper:', e);
    }
    return DEFAULT_PAPER;
  });

  const [activeSectionId, setActiveSectionId] = useState(() => {
    return paper.activeSectionId || 'introduction';
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Show temporary toast notification
  const showToast = (message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Autosave to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('active_research_paper', JSON.stringify({ ...paper, activeSectionId }));
      setLastSaved(new Date().toLocaleTimeString());
    } catch (e) {
      console.error('Autosave error:', e);
    }
  }, [paper, activeSectionId]);

  // Update paper field (title, topic, domain, authors, abstract, etc.)
  const updatePaperMeta = (field, value) => {
    setPaper(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update specific section content or title
  const updateSectionContent = (sectionId, newContent) => {
    setPaper(prev => ({
      ...prev,
      sections: prev.sections.map(sec =>
        sec.id === sectionId ? { ...sec, content: newContent } : sec
      )
    }));
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    setPaper(prev => ({
      ...prev,
      sections: prev.sections.map(sec =>
        sec.id === sectionId ? { ...sec, title: newTitle } : sec
      )
    }));
  };

  // Add new section
  const addSection = (title, defaultContent = '') => {
    const id = `sec_${Date.now()}`;
    const newSec = { id, title, content: defaultContent };
    setPaper(prev => ({
      ...prev,
      sections: [...prev.sections, newSec]
    }));
    setActiveSectionId(id);
    showToast(`Added section: ${title}`, 'success');
  };

  // Delete section
  const deleteSection = (sectionId) => {
    setPaper(prev => {
      const filtered = prev.sections.filter(s => s.id !== sectionId);
      return { ...prev, sections: filtered };
    });
    if (activeSectionId === sectionId) {
      const remaining = paper.sections.filter(s => s.id !== sectionId);
      if (remaining.length > 0) {
        setActiveSectionId(remaining[0].id);
      }
    }
    showToast('Section removed', 'info');
  };

  // Reorder sections
  const reorderSections = (startIndex, endIndex) => {
    setPaper(prev => {
      const result = Array.from(prev.sections);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { ...prev, sections: result };
    });
  };

  // Load a completely new or saved paper
  const loadPaper = (newPaperData) => {
    setPaper(newPaperData);
    if (newPaperData.sections && newPaperData.sections.length > 0) {
      setActiveSectionId(newPaperData.sections[0].id);
    }
    showToast(`Loaded: ${newPaperData.title || 'Paper'}`, 'success');
  };

  // Save paper to backend persistence
  const saveToBackend = async () => {
    try {
      setIsSaving(true);
      const res = await api.savePaper(paper);
      if (res.success) {
        showToast('Paper saved to database', 'success');
        setLastSaved(new Date().toLocaleTimeString());
      }
    } catch (err) {
      showToast(err.message || 'Failed to save to server', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Generate full paper via AI
  const generateFullPaper = async (params) => {
    try {
      setIsGenerating(true);
      showToast('Synthesizing IEEE research paper with AI...', 'info');
      const res = await api.generatePaper(params);
      if (res.success && res.paper) {
        const fullPaper = {
          ...paper,
          title: res.paper.title || params.topic,
          topic: params.topic,
          domain: params.domain || paper.domain,
          targetVenue: params.targetVenue || paper.targetVenue,
          abstract: res.paper.abstract || '',
          keywords: res.paper.keywords || [],
          sections: res.paper.sections || []
        };
        setPaper(fullPaper);
        if (res.paper.sections && res.paper.sections.length > 0) {
          setActiveSectionId(res.paper.sections[0].id);
        }
        showToast('Paper generated successfully!', 'success');
        return fullPaper;
      }
    } catch (err) {
      showToast(err.message || 'Generation failed', 'error');
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate single section via AI
  const generateSectionWithAi = async (sectionId, instructions = '') => {
    try {
      setIsGenerating(true);
      const sec = paper.sections.find(s => s.id === sectionId);
      if (!sec) return;

      showToast(`Drafting ${sec.title}...`, 'info');
      const res = await api.generateSection({
        sectionId,
        sectionTitle: sec.title,
        topic: paper.title || paper.topic,
        domain: paper.domain,
        context: `Abstract: ${paper.abstract}`,
        instructions
      });

      if (res.success && res.content) {
        updateSectionContent(sectionId, res.content);
        showToast(`${sec.title} generated!`, 'success');
      }
    } catch (err) {
      showToast(err.message || 'Section generation failed', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Improve text via AI
  const improveTextWithAi = async ({ text, action, instructions }) => {
    try {
      setIsImproving(true);
      const res = await api.improveSection({
        text,
        action,
        instructions,
        topic: paper.title
      });
      if (res.success && res.improvedText) {
        return res.improvedText;
      }
    } catch (err) {
      showToast(err.message || 'Improvement failed', 'error');
      throw err;
    } finally {
      setIsImproving(false);
    }
  };

  // Total word counts
  const totalWordCount = paper.sections?.reduce((acc, s) => {
    const words = s.content ? s.content.trim().split(/\s+/).filter(Boolean).length : 0;
    return acc + words;
  }, (paper.abstract ? paper.abstract.trim().split(/\s+/).filter(Boolean).length : 0)) || 0;

  // Active section object
  const activeSection = paper.sections?.find(s => s.id === activeSectionId) || paper.sections?.[0];

  return (
    <PaperContext.Provider
      value={{
        paper,
        activeSectionId,
        setActiveSectionId,
        activeSection,
        updatePaperMeta,
        updateSectionContent,
        updateSectionTitle,
        addSection,
        deleteSection,
        reorderSections,
        loadPaper,
        saveToBackend,
        generateFullPaper,
        generateSectionWithAi,
        improveTextWithAi,
        isGenerating,
        isImproving,
        isSaving,
        lastSaved,
        totalWordCount,
        toastMessage,
        showToast
      }}
    >
      {children}
    </PaperContext.Provider>
  );
}

export function usePaper() {
  return useContext(PaperContext);
}
