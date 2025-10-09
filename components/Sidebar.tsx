
import React from 'react';
import { PaperSection } from '../types';
import { SECTIONS, PUBLICATION_FORMATS } from '../constants';

interface SidebarProps {
  activeSection: PaperSection;
  onSectionChange: (section: PaperSection) => void;
  activePublication: string;
  onPublicationChange: (format: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  onSectionChange, 
  activePublication, 
  onPublicationChange 
}) => {
  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col p-4">
      <div className="mb-8">
        <h2 className="font-serif text-lg font-semibold text-white mb-1">Paper Sections</h2>
        <p className="text-xs text-gray-400">Navigate your manuscript</p>
      </div>
      <nav className="flex-1 space-y-2">
        {SECTIONS.map(({ id, icon }) => (
          <button
            key={id}
            onClick={() => onSectionChange(id)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeSection === id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {icon}
            <span>{id}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <label htmlFor="publication-format" className="block text-sm font-medium text-gray-300 mb-2">
          Target Publication
        </label>
        <select
          id="publication-format"
          value={activePublication}
          onChange={(e) => onPublicationChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          {PUBLICATION_FORMATS.map((format) => (
            <option key={format} value={format}>
              {format}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default Sidebar;
