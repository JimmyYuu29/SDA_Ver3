import { useState, useEffect } from 'react';
import { Shield, Check, ChevronDown, ChevronUp, Building, Users, FileText } from 'lucide-react';
import type { Safeguard, SafeguardLevel } from '../types';
import * as api from '../services/api';

interface SafeguardSelection {
  safeguard: Safeguard;
  notes?: string;
}

interface SafeguardSelectorProps {
  safeguards: Safeguard[];
  selectedSafeguards: Map<number, SafeguardSelection>;
  onSelect: (safeguard: Safeguard, notes?: string) => void;
  onRemove: (safeguardId: number) => void;
}

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  'FIRM': <Building className="w-5 h-5" />,
  'SITUATION': <FileText className="w-5 h-5" />,
  'ENTITY': <Users className="w-5 h-5" />,
};

const LEVEL_COLORS: Record<string, string> = {
  'FIRM': 'border-l-blue-500 bg-blue-50',
  'SITUATION': 'border-l-purple-500 bg-purple-50',
  'ENTITY': 'border-l-green-500 bg-green-50',
};

export default function SafeguardSelector({
  safeguards,
  selectedSafeguards,
  onSelect,
  onRemove,
}: SafeguardSelectorProps) {
  const [levels, setLevels] = useState<SafeguardLevel[]>([]);
  const [expandedLevel, setExpandedLevel] = useState<string | null>('FIRM');
  const [notes, setNotes] = useState<Record<number, string>>({});

  useEffect(() => {
    loadLevels();
  }, []);

  const loadLevels = async () => {
    try {
      const lvls = await api.getSafeguardLevels();
      setLevels(lvls);
    } catch (err) {
      console.error('Error loading safeguard levels:', err);
    }
  };

  const groupedSafeguards = safeguards.reduce((acc, safeguard) => {
    const level = levels.find(l => l.id === safeguard.level_id);
    const levelCode = level?.code || 'OTHER';
    if (!acc[levelCode]) {
      acc[levelCode] = [];
    }
    acc[levelCode].push(safeguard);
    return acc;
  }, {} as Record<string, Safeguard[]>);

  const handleToggleSafeguard = (safeguard: Safeguard) => {
    if (selectedSafeguards.has(safeguard.id)) {
      onRemove(safeguard.id);
    } else {
      onSelect(safeguard, notes[safeguard.id]);
    }
  };

  const handleNotesChange = (safeguardId: number, value: string) => {
    setNotes({ ...notes, [safeguardId]: value });
    const selection = selectedSafeguards.get(safeguardId);
    if (selection) {
      onSelect(selection.safeguard, value);
    }
  };

  const getLevelInfo = (code: string) => {
    const level = levels.find(l => l.code === code);
    return level || { code, name: code, name_es: code };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-600">
          <Shield className="w-5 h-5 mr-2" />
          <span>Seleccione las medidas de salvaguarda a implementar</span>
        </div>
        <span className="text-sm text-gray-500">
          {selectedSafeguards.size} salvaguarda(s) seleccionada(s)
        </span>
      </div>

      {/* Level Legend */}
      <div className="flex flex-wrap gap-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 bg-blue-500 rounded mr-2" />
          Nivel de Firma
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 bg-purple-500 rounded mr-2" />
          Nivel de Situación
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="w-3 h-3 bg-green-500 rounded mr-2" />
          Nivel de Entidad
        </div>
      </div>

      {/* Safeguards by Level */}
      <div className="space-y-4">
        {['FIRM', 'SITUATION', 'ENTITY'].map((levelCode) => {
          const levelSafeguards = groupedSafeguards[levelCode] || [];
          const levelInfo = getLevelInfo(levelCode);
          const isExpanded = expandedLevel === levelCode;
          const selectedCount = levelSafeguards.filter(s => selectedSafeguards.has(s.id)).length;

          return (
            <div key={levelCode} className="border rounded-lg overflow-hidden">
              {/* Level Header */}
              <button
                onClick={() => setExpandedLevel(isExpanded ? null : levelCode)}
                className={`w-full flex items-center justify-between p-4 transition-colors ${
                  isExpanded ? 'bg-gray-100' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg mr-3 ${
                    levelCode === 'FIRM' ? 'bg-blue-100 text-blue-600' :
                    levelCode === 'SITUATION' ? 'bg-purple-100 text-purple-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {LEVEL_ICONS[levelCode]}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-800">{levelInfo.name_es}</div>
                    <div className="text-sm text-gray-500">
                      {levelSafeguards.length} salvaguardas disponibles
                      {selectedCount > 0 && (
                        <span className="text-mazars-blue ml-2">
                          ({selectedCount} seleccionadas)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {/* Safeguards List */}
              {isExpanded && (
                <div className="border-t">
                  {levelSafeguards.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No hay salvaguardas disponibles para este nivel
                    </div>
                  ) : (
                    <div className="divide-y">
                      {levelSafeguards.map((safeguard) => {
                        const isSelected = selectedSafeguards.has(safeguard.id);

                        return (
                          <div
                            key={safeguard.id}
                            className={`p-4 transition-colors border-l-4 ${
                              isSelected ? LEVEL_COLORS[levelCode] : 'border-l-transparent hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSafeguard(safeguard)}
                                className="mt-1 w-5 h-5 text-mazars-blue rounded border-gray-300 focus:ring-mazars-blue"
                              />
                              <div className="ml-4 flex-grow">
                                <p className="text-gray-700 text-sm">
                                  {safeguard.description_es || safeguard.description}
                                </p>
                                {isSelected && (
                                  <div className="mt-3">
                                    <input
                                      type="text"
                                      value={notes[safeguard.id] || ''}
                                      onChange={(e) => handleNotesChange(safeguard.id, e.target.value)}
                                      placeholder="Agregar nota (opcional)"
                                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
                                    />
                                  </div>
                                )}
                              </div>
                              {isSelected && (
                                <Check className="w-5 h-5 text-green-500 ml-2" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
