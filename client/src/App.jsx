import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { PaperProvider, usePaper } from './context/PaperContext.jsx';

import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import SectionNav from './components/SectionNav.jsx';
import PaperEditor from './components/PaperEditor.jsx';
import AiChatPanel from './components/AiChatPanel.jsx';

import NewPaperModal from './components/NewPaperModal.jsx';
import IeeePreviewModal from './components/IeeePreviewModal.jsx';
import AnalysisModal from './components/AnalysisModal.jsx';
import CitationModal from './components/CitationModal.jsx';
import TemplatesModal from './components/TemplatesModal.jsx';
import SettingsModal from './components/SettingsModal.jsx';
import ExportModal from './components/ExportModal.jsx';
import SavedPapersView from './components/SavedPapersView.jsx';
import Toast from './components/Toast.jsx';

function AppInner() {
  const { toastMessage } = usePaper();

  const [activeView, setActiveView] = useState('editor');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Modal states
  const [modals, setModals] = useState({
    newPaper: false,
    preview: false,
    analysis: false,
    citations: false,
    templates: false,
    settings: false,
    export: false
  });

  const openModal = (name) => setModals(prev => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModals(prev => ({ ...prev, [name]: false }));

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenNewPaper={() => openModal('newPaper')}
        onOpenPreview={() => openModal('preview')}
        onOpenExport={() => openModal('export')}
        onOpenAnalysis={() => openModal('analysis')}
        onOpenCitations={() => openModal('citations')}
        onOpenTemplates={() => openModal('templates')}
        onOpenSettings={() => openModal('settings')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <Header
          onOpenPreview={() => openModal('preview')}
          onOpenExport={() => openModal('export')}
          onOpenAnalysis={() => openModal('analysis')}
          onToggleCopilot={() => setIsCopilotOpen(p => !p)}
          isCopilotOpen={isCopilotOpen}
        />

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {activeView === 'editor' ? (
            <>
              {/* Section Outline */}
              <SectionNav />

              {/* Paper Editor */}
              <PaperEditor />

              {/* AI Copilot Panel */}
              {isCopilotOpen && (
                <AiChatPanel onClose={() => setIsCopilotOpen(false)} />
              )}
            </>
          ) : (
            <SavedPapersView onOpenNewPaper={() => openModal('newPaper')} />
          )}
        </div>
      </div>

      {/* Modals */}
      {modals.newPaper && <NewPaperModal onClose={() => closeModal('newPaper')} />}
      {modals.preview && <IeeePreviewModal onClose={() => closeModal('preview')} />}
      {modals.analysis && <AnalysisModal onClose={() => closeModal('analysis')} />}
      {modals.citations && <CitationModal onClose={() => closeModal('citations')} />}
      {modals.templates && <TemplatesModal onClose={() => closeModal('templates')} />}
      {modals.settings && <SettingsModal onClose={() => closeModal('settings')} />}
      {modals.export && <ExportModal onClose={() => closeModal('export')} />}

      {/* Toast Notification */}
      <Toast toast={toastMessage} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PaperProvider>
        <AppInner />
      </PaperProvider>
    </ThemeProvider>
  );
}
