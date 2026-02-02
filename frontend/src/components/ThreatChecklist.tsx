import { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, X } from 'lucide-react';
import type { Threat, SignificanceLevel } from '../types';

interface ThreatSelection {
  threat: Threat;
  significance: SignificanceLevel;
  notes?: string;
}

interface ThreatChecklistProps {
  threats: Threat[];
  selectedThreats: Map<number, ThreatSelection>;
  onSelect: (threat: Threat, significance: SignificanceLevel, notes?: string) => void;
  onRemove: (threatId: number) => void;
}

const THREAT_DESCRIPTIONS: Record<string, string> = {
  'ADVOCACY': 'Amenaza cuando el auditor promueve la posición de un cliente hasta el punto de comprometer su objetividad.',
  'SELF_REVIEW': 'Amenaza de no evaluar adecuadamente los resultados de un servicio previo prestado por el auditor.',
  'FAMILIARITY': 'Amenaza de ser demasiado tolerante con los intereses del cliente debido a una relación cercana.',
  'SELF_INTEREST': 'Amenaza de que un interés financiero u otro interés influya indebidamente en el juicio del auditor.',
  'INTIMIDATION': 'Amenaza de ser disuadido de actuar objetivamente debido a presiones reales o percibidas.',
  'MANAGEMENT': 'Amenaza de asumir funciones de la dirección del cliente.',
};

const SIGNIFICANCE_OPTIONS: { value: SignificanceLevel; label: string; color: string }[] = [
  { value: 'LOW', label: 'Baja', color: 'bg-green-100 text-green-800' },
  { value: 'MEDIUM', label: 'Media', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'HIGH', label: 'Alta', color: 'bg-red-100 text-red-800' },
];

export default function ThreatChecklist({
  threats,
  selectedThreats,
  onSelect,
  onRemove,
}: ThreatChecklistProps) {
  const [expandedThreat, setExpandedThreat] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<number, string>>({});

  const handleToggleThreat = (threat: Threat) => {
    if (selectedThreats.has(threat.id)) {
      onRemove(threat.id);
    } else {
      onSelect(threat, 'MEDIUM', notes[threat.id]);
    }
  };

  const handleSignificanceChange = (threat: Threat, significance: SignificanceLevel) => {
    onSelect(threat, significance, notes[threat.id]);
  };

  const handleNotesChange = (threatId: number, value: string) => {
    setNotes({ ...notes, [threatId]: value });
    const selection = selectedThreats.get(threatId);
    if (selection) {
      onSelect(selection.threat, selection.significance, value);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <span>Seleccione las amenazas aplicables y su significatividad</span>
        </div>
        <span className="text-sm text-gray-500">
          {selectedThreats.size} amenaza(s) seleccionada(s)
        </span>
      </div>

      <div className="space-y-3">
        {threats.map((threat) => {
          const isSelected = selectedThreats.has(threat.id);
          const selection = selectedThreats.get(threat.id);
          const isExpanded = expandedThreat === threat.id;

          return (
            <div
              key={threat.id}
              className={`border rounded-lg transition-all ${
                isSelected ? 'border-mazars-blue bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              {/* Header */}
              <div className="flex items-center p-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleThreat(threat)}
                  className="w-5 h-5 text-mazars-blue rounded border-gray-300 focus:ring-mazars-blue"
                />
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-800">{threat.name_es}</span>
                      <span className="text-sm text-gray-500 ml-2">({threat.name})</span>
                    </div>
                    {isSelected && (
                      <div className="flex items-center space-x-2">
                        {SIGNIFICANCE_OPTIONS.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSignificanceChange(threat, option.value)}
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              selection?.significance === option.value
                                ? option.color + ' font-medium'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {THREAT_DESCRIPTIONS[threat.code] || threat.description}
                  </p>
                </div>
                <button
                  onClick={() => setExpandedThreat(isExpanded ? null : threat.id)}
                  className="ml-4 p-1 text-gray-400 hover:text-gray-600"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Expanded Notes */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas sobre esta amenaza
                  </label>
                  <textarea
                    value={notes[threat.id] || ''}
                    onChange={(e) => handleNotesChange(threat.id, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
                    placeholder="Agregue observaciones específicas..."
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {threats.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay amenazas disponibles para mostrar
        </div>
      )}
    </div>
  );
}
