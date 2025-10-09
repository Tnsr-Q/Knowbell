import React from 'react';
import { AnalysisResult, DiscussionTurn, PhysicistPersonaId } from '../types';
import PersonaSelector from './PersonaSelector';

interface AnalysisPanelProps {
  isLoading: boolean;
  error: string | null;
  analysisResult: AnalysisResult | null;
  discussion: DiscussionTurn[];
  selectedPersonas: PhysicistPersonaId[];
  onSelectedPersonasChange: (personas: PhysicistPersonaId[]) => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
    <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 font-serif text-lg">Synthesizing with Memory...</p>
    <p className="text-sm">Leveraging LangGraph, Mem0.ai & Cerebras Models</p>
  </div>
);

const AnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => (
  <div className="space-y-6">
    <div>
        <h3 className="font-serif text-lg font-semibold text-white mb-2">{result.guidelinesTitle}</h3>
        <p className="text-sm text-gray-400">Overall Score: <span className="font-bold text-blue-400">{result.qualityScore}/5</span></p>
    </div>
    
    <div className="border-t border-gray-700 pt-4">
      <h4 className="font-semibold text-red-400 mb-2">Critical Violations</h4>
      <ul className="list-disc list-inside space-y-2 text-sm">
        {result.violations.map((v, i) => (
          <li key={i}><span className="font-semibold text-gray-300">({v.severity})</span> {v.description}</li>
        ))}
      </ul>
    </div>
    
    <div className="border-t border-gray-700 pt-4">
      <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
      <ul className="list-disc list-inside space-y-2 text-sm">
        {result.strengths.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>

    <div className="border-t border-gray-700 pt-4">
      <h4 className="font-semibold text-yellow-400 mb-2">Recommendations</h4>
       <ul className="list-disc list-inside space-y-2 text-sm">
        {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>

    <div className="border-t border-gray-700 pt-4">
        <h4 className="font-semibold text-purple-400 mb-2">Suggested Revision</h4>
        <div className="text-sm p-3 bg-gray-800 rounded-md border border-gray-700 whitespace-pre-wrap font-mono">{result.revisedText}</div>
    </div>
  </div>
);

const DiscussionDisplay: React.FC<{ discussion: DiscussionTurn[] }> = ({ discussion }) => (
  <div className="space-y-4">
    <h3 className="font-serif text-lg font-semibold text-white">Physicist Round Table</h3>
    {discussion.map((turn, i) => (
      <div key={i} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-sm font-semibold text-blue-300">{turn.personaName}</p>
        <p className="mt-1 text-sm text-gray-300">{turn.text}</p>
      </div>
    ))}
  </div>
);


const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  isLoading,
  error,
  analysisResult,
  discussion,
  selectedPersonas,
  onSelectedPersonasChange
}) => {
  const renderContent = () => {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">{error}</div>;
    
    if (analysisResult) {
      return <AnalysisDisplay result={analysisResult} />;
    }
    
    if (discussion.length > 0) {
      return <DiscussionDisplay discussion={discussion} />;
    }

    return (
      <div className="text-center text-gray-500 h-full flex flex-col justify-center">
        <h3 className="font-serif text-lg text-gray-400">Analysis Panel</h3>
        <p className="text-sm mt-1">Your analysis and discussion results will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-800 border-l border-gray-700 w-1/2">
       <PersonaSelector selectedPersonas={selectedPersonas} onSelectedPersonasChange={onSelectedPersonasChange} />
       <div className="flex-grow overflow-y-auto mt-4 pr-2">
        {renderContent()}
       </div>
    </div>
  );
};

export default AnalysisPanel;
