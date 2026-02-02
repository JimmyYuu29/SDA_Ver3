import {
  CheckCircle,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  XCircle,
  AlertOctagon,
  HelpCircle,
} from 'lucide-react';
import type { ConclusionType, ConclusionInfo } from '../types';

interface ConclusionDisplayProps {
  conclusion: ConclusionType;
  info: ConclusionInfo;
}

const ICONS: Record<string, React.ReactNode> = {
  'check-circle': <CheckCircle className="w-12 h-12" />,
  'shield-check': <ShieldCheck className="w-12 h-12" />,
  'user-check': <UserCheck className="w-12 h-12" />,
  'alert-triangle': <AlertTriangle className="w-12 h-12" />,
  'x-circle': <XCircle className="w-12 h-12" />,
  'alert-octagon': <AlertOctagon className="w-12 h-12" />,
  'help-circle': <HelpCircle className="w-12 h-12" />,
};

const COLOR_CLASSES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-800',
    icon: 'text-green-500',
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: 'text-blue-500',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-800',
    icon: 'text-yellow-500',
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-800',
    icon: 'text-orange-500',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-800',
    icon: 'text-red-500',
  },
  gray: {
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    text: 'text-gray-800',
    icon: 'text-gray-500',
  },
};

export default function ConclusionDisplay({ conclusion, info }: ConclusionDisplayProps) {
  const colors = COLOR_CLASSES[info.color] || COLOR_CLASSES.gray;

  return (
    <div className={`p-6 rounded-xl border-2 ${colors.bg} ${colors.border}`}>
      <div className="flex items-start space-x-4">
        <div className={colors.icon}>
          {ICONS[info.icon] || <HelpCircle className="w-12 h-12" />}
        </div>
        <div className="flex-grow">
          <div className="flex items-center space-x-3 mb-2">
            <span className={`text-2xl font-bold ${colors.text}`}>
              {conclusion}
            </span>
            <span className={`text-xl font-semibold ${colors.text}`}>
              {info.title}
            </span>
          </div>
          <p className={`${colors.text} text-opacity-80`}>
            {info.description}
          </p>

          {/* Additional guidance based on conclusion */}
          <div className="mt-4 pt-4 border-t border-opacity-20" style={{ borderColor: 'currentColor' }}>
            {conclusion === 'C1' && (
              <p className="text-sm text-gray-600">
                El servicio puede prestarse directamente sin requisitos adicionales de independencia.
              </p>
            )}
            {conclusion === 'C2' && (
              <p className="text-sm text-gray-600">
                Implemente las salvaguardas seleccionadas y documente su aplicación en el archivo del encargo.
              </p>
            )}
            {conclusion === 'C3' && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Acciones requeridas:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Presentar la evaluación al Socio de Ética</li>
                  <li>Obtener aprobación formal antes de iniciar el servicio</li>
                  <li>Documentar la decisión y las condiciones aprobadas</li>
                </ul>
              </div>
            )}
            {conclusion === 'C4' && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Condiciones del artículo 16.1.b 3º LAC:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>El servicio no tendrá efecto en los estados financieros auditados</li>
                  <li>La entidad auditada asumirá la responsabilidad del resultado</li>
                  <li>Se documentarán las salvaguardas aplicadas</li>
                </ul>
              </div>
            )}
            {conclusion === 'C5' && (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-red-700 mb-1">El servicio NO puede prestarse.</p>
                <p>
                  La normativa vigente prohíbe expresamente la prestación de este servicio
                  a esta entidad. Considere alternativas o derive el servicio a otra firma.
                </p>
              </div>
            )}
            {conclusion === 'C6' && (
              <div className="text-sm text-gray-600">
                <p className="font-medium text-red-700 mb-1">El servicio NO puede prestarse.</p>
                <p>
                  Las amenazas identificadas son demasiado significativas y no pueden ser
                  adecuadamente mitigadas con salvaguardas. Rechace el encargo.
                </p>
              </div>
            )}
            {conclusion === 'C7' && (
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Se requiere análisis adicional:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Consulte con el Departamento de Calidad</li>
                  <li>Revise la documentación del servicio en detalle</li>
                  <li>Considere obtener asesoramiento externo si es necesario</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
