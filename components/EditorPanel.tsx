
import React from 'react';
import { PaperSection } from '../types';

interface EditorPanelProps {
  editorText: string;
  onEditorTextChange: (text: string) => void;
  onAnalyze: () => void;
  onDiscuss: () => void;
  onLoadExample: () => void;
  isLoading: boolean;
  activeSection: PaperSection;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  editorText,
  onEditorTextChange,
  onAnalyze,
  onDiscuss,
  onLoadExample,
  isLoading,
  activeSection,
}) => {
  return (
    <div className="flex-1 flex flex-col p-4 bg-gray-900/80 w-1/2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-serif font-semibold text-white">{activeSection}</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={onLoadExample}
            disabled={isLoading}
            className="px-3 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Load Example
          </button>
        </div>
      </div>
      <textarea
        value={editorText}
        onChange={(e) => onEditorTextChange(e.target.value)}
        className="flex-1 w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-gray-200 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={`Enter your ${activeSection.toLowerCase()} text here...`}
      />
      <div className="flex items-center space-x-4 mt-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Section'}
        </button>
        <button
          onClick={onDiscuss}
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Thinking...' : 'Start Round Table'}
        </button>
      </div>
    </div>
  );
};

export default EditorPanel;
