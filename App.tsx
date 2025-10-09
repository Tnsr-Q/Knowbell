import React, { useState, useCallback, useEffect } from 'react';
import { PaperSection, AnalysisResult, DiscussionTurn, PhysicistPersonaId } from './types';
import { SECTIONS, EXAMPLE_TEXTS, PUBLICATION_FORMATS } from './constants';
import Sidebar from './components/Sidebar';
import EditorPanel from './components/EditorPanel';
import AnalysisPanel from './components/AnalysisPanel';
import { memoryClient } from './services/langgraphService';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<PaperSection>(PaperSection.ABSTRACT);
  const [editorText, setEditorText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [discussion, setDiscussion] = useState<DiscussionTurn[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activePublication, setActivePublication] = useState<string>(PUBLICATION_FORMATS[0]);
  const [selectedPersonas, setSelectedPersonas] = useState<PhysicistPersonaId[]>([]);
  
  useEffect(() => {
    // When section changes, load the new example text and clear the memory for a fresh context.
    setEditorText(EXAMPLE_TEXTS[activeSection]);
    setAnalysisResult(null);
    setDiscussion([]);
    memoryClient.clear();
  }, [activeSection]);

  const handleAnalyze = useCallback(async () => {
    if (!editorText.trim()) {
      setError('Cannot analyze empty text.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setDiscussion([]);
    try {
      // Lazy import the service to potentially improve initial load time
      const { analyzeSection } = await import('./services/aiService');
      const result = await analyzeSection(editorText, activeSection, activePublication);
      setAnalysisResult(result);
    } catch (e) {
      setError('An error occurred during analysis. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [editorText, activeSection, activePublication]);

  const handleDiscuss = useCallback(async () => {
    if (!editorText.trim()) {
      setError('Cannot discuss empty text.');
      return;
    }
     if (selectedPersonas.length === 0) {
      setError('Please select at least one physicist for the discussion.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setDiscussion([]);
    try {
       const { generateDiscussion } = await import('./services/aiService');
       const result = await generateDiscussion(editorText, selectedPersonas);
       setDiscussion(result);
    } catch (e) {
       setError('An error occurred while generating the discussion. Please try again.');
       console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [editorText, selectedPersonas]);

  const handleLoadExample = useCallback(() => {
    setEditorText(EXAMPLE_TEXTS[activeSection]);
    setError(null);
    setAnalysisResult(null);
    setDiscussion([]);
    // Clear memory when loading a new example to start a fresh conversation.
    memoryClient.clear();
  }, [activeSection]);


  return (
    <div className="flex h-screen bg-gray-900 font-sans text-gray-300">
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        activePublication={activePublication}
        onPublicationChange={setActivePublication}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <h1 className="text-xl font-serif font-semibold text-white">Principia</h1>
          <p className="text-sm text-gray-400">The Nobel Writing Environment</p>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <EditorPanel
            editorText={editorText}
            onEditorTextChange={setEditorText}
            onAnalyze={handleAnalyze}
            onDiscuss={handleDiscuss}
            onLoadExample={handleLoadExample}
            isLoading={isLoading}
            activeSection={activeSection}
          />
          <AnalysisPanel
            isLoading={isLoading}
            error={error}
            analysisResult={analysisResult}
            discussion={discussion}
            selectedPersonas={selectedPersonas}
            onSelectedPersonasChange={setSelectedPersonas}
          />
        </div>
      </main>
    </div>
  );
};

export default App;