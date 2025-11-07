
import React from 'react';
import { PhysicistPersonaId } from '../types';
import { PHYSICIST_PERSONAS } from '../constants';

interface PersonaSelectorProps {
  selectedPersonas: PhysicistPersonaId[];
  onSelectedPersonasChange: (personas: PhysicistPersonaId[]) => void;
}

const PersonaSelector: React.FC<PersonaSelectorProps> = ({ selectedPersonas, onSelectedPersonasChange }) => {
  const handleTogglePersona = (personaId: PhysicistPersonaId) => {
    const newSelection = selectedPersonas.includes(personaId)
      ? selectedPersonas.filter(id => id !== personaId)
      : [...selectedPersonas, personaId];
    onSelectedPersonasChange(newSelection);
  };

  return (
    <div>
      <h3 className="font-serif text-md font-semibold text-white mb-2">Assemble Round Table</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PHYSICIST_PERSONAS.map(persona => (
          <button
            key={persona.id}
            onClick={() => handleTogglePersona(persona.id)}
            className={`p-2 rounded-lg text-center transition-all duration-200 ${
              selectedPersonas.includes(persona.id)
                ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <p className="text-xs font-bold">{persona.name}</p>
            <p className="text-[10px] text-gray-300">{persona.expertise}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonaSelector;