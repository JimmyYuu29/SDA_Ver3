import { Building2, Building } from 'lucide-react';
import type { EntityType } from '../types';

interface EntityTypeToggleProps {
  value: EntityType;
  onChange: (value: EntityType) => void;
}

export default function EntityTypeToggle({ value, onChange }: EntityTypeToggleProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Tipo de Entidad
      </label>
      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          onClick={() => onChange('NO_EIP')}
          className={`flex-1 flex items-center justify-center px-4 py-3 transition-colors ${
            value === 'NO_EIP'
              ? 'bg-mazars-blue text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-medium">NO EIP</div>
            <div className={`text-xs ${value === 'NO_EIP' ? 'text-blue-200' : 'text-gray-400'}`}>
              Entidad No de Interés Público
            </div>
          </div>
        </button>
        <button
          onClick={() => onChange('EIP')}
          className={`flex-1 flex items-center justify-center px-4 py-3 transition-colors border-l ${
            value === 'EIP'
              ? 'bg-mazars-blue text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-medium">EIP</div>
            <div className={`text-xs ${value === 'EIP' ? 'text-blue-200' : 'text-gray-400'}`}>
              Entidad de Interés Público
            </div>
          </div>
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        {value === 'EIP'
          ? 'Las EIP incluyen: entidades cotizadas, entidades de crédito, aseguradoras y otras según art. 3.5 LAC.'
          : 'Entidades que no cumplen los criterios de EIP según art. 3.5 LAC.'}
      </p>
    </div>
  );
}
