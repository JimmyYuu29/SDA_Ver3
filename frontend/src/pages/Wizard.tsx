import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, Download, Check, X, AlertTriangle } from 'lucide-react';
import type {
  Service,
  Threat,
  Safeguard,
  LegalGateCheck,
  EntityType,
  RelationType,
  SignificanceLevel,
  ConclusionType,
  EvaluationCreate,
  Evaluation
} from '../types';
import { CONCLUSION_INFO } from '../types';
import * as api from '../services/api';
import StepIndicator from '../components/StepIndicator';
import ServiceSelector from '../components/ServiceSelector';
import EntityTypeToggle from '../components/EntityTypeToggle';
import ThreatChecklist from '../components/ThreatChecklist';
import SafeguardSelector from '../components/SafeguardSelector';
import ConclusionDisplay from '../components/ConclusionDisplay';

interface ThreatSelection {
  threat: Threat;
  significance: SignificanceLevel;
  notes?: string;
}

interface SafeguardSelection {
  safeguard: Safeguard;
  notes?: string;
}

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Legal Gate
  const [entityName, setEntityName] = useState('');
  const [entityType, setEntityType] = useState<EntityType>('NO_EIP');
  const [relationType, setRelationType] = useState<RelationType>('AUDITADA');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [legalGateResult, setLegalGateResult] = useState<LegalGateCheck | null>(null);

  // Step 2: Threats
  const [availableThreats, setAvailableThreats] = useState<Threat[]>([]);
  const [selectedThreats, setSelectedThreats] = useState<Map<number, ThreatSelection>>(new Map());

  // Step 3: Safeguards
  const [availableSafeguards, setAvailableSafeguards] = useState<Safeguard[]>([]);
  const [selectedSafeguards, setSelectedSafeguards] = useState<Map<number, SafeguardSelection>>(new Map());

  // Step 4: Conclusion
  const [conclusion, setConclusion] = useState<ConclusionType | null>(null);
  const [auditorName, setAuditorName] = useState('');
  const [notes, setNotes] = useState('');
  const [createdEvaluation, setCreatedEvaluation] = useState<Evaluation | null>(null);

  // Load threats on step 2
  useEffect(() => {
    if (step === 2 && availableThreats.length === 0) {
      loadThreats();
    }
  }, [step]);

  // Load safeguards on step 3
  useEffect(() => {
    if (step === 3) {
      loadSafeguards();
    }
  }, [step, selectedThreats]);

  const loadThreats = async () => {
    try {
      const threats = await api.getThreats();
      setAvailableThreats(threats);
    } catch (err) {
      setError('Error cargando amenazas');
    }
  };

  const loadSafeguards = async () => {
    try {
      const safeguards = await api.getAllSafeguards();
      // Filter safeguards related to selected threats
      const threatIds = Array.from(selectedThreats.keys());
      const filtered = safeguards.filter(s => threatIds.includes(s.threat_id));
      setAvailableSafeguards(filtered.length > 0 ? filtered : safeguards);
    } catch (err) {
      setError('Error cargando salvaguardas');
    }
  };

  const handleCheckLegalGate = async () => {
    if (!selectedService) {
      setError('Por favor seleccione un servicio');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.checkLegalGate(selectedService.id, entityType, relationType);
      setLegalGateResult(result);

      if (result.conclusion === 'C5') {
        setConclusion('C5');
      }
    } catch (err) {
      setError('Error verificando gate legal');
    } finally {
      setLoading(false);
    }
  };

  const handleThreatSelect = (threat: Threat, significance: SignificanceLevel, notes?: string) => {
    const newSelection = new Map(selectedThreats);
    newSelection.set(threat.id, { threat, significance, notes });
    setSelectedThreats(newSelection);
  };

  const handleThreatRemove = (threatId: number) => {
    const newSelection = new Map(selectedThreats);
    newSelection.delete(threatId);
    setSelectedThreats(newSelection);
  };

  const handleSafeguardSelect = (safeguard: Safeguard, notes?: string) => {
    const newSelection = new Map(selectedSafeguards);
    newSelection.set(safeguard.id, { safeguard, notes });
    setSelectedSafeguards(newSelection);
  };

  const handleSafeguardRemove = (safeguardId: number) => {
    const newSelection = new Map(selectedSafeguards);
    newSelection.delete(safeguardId);
    setSelectedSafeguards(newSelection);
  };

  const determineConclusion = (): ConclusionType => {
    // If legally prohibited
    if (legalGateResult?.conclusion === 'C5') {
      return 'C5';
    }

    const threats = Array.from(selectedThreats.values());
    const safeguards = Array.from(selectedSafeguards.values());
    const permissionCode = legalGateResult?.permission_code;

    // No threats
    if (threats.length === 0) {
      return permissionCode === '2' ? 'C4' : 'C1';
    }

    const highThreats = threats.filter(t => t.significance === 'HIGH');

    // High threats without safeguards
    if (highThreats.length > 0 && safeguards.length === 0) {
      return 'C6';
    }

    // High threats with safeguards need Ethics Partner
    if (highThreats.length > 0 && safeguards.length > 0) {
      return 'C3';
    }

    // Threats with safeguards
    if (threats.length > 0 && safeguards.length > 0) {
      return permissionCode === '2' ? 'C4' : 'C2';
    }

    // Conditional permission
    if (permissionCode === '2') {
      return 'C4';
    }

    return 'C7';
  };

  const handleNext = () => {
    if (step === 1 && !legalGateResult) {
      handleCheckLegalGate();
      return;
    }

    if (step === 1 && legalGateResult?.conclusion === 'C5') {
      setStep(4);
      setConclusion('C5');
      return;
    }

    if (step === 3) {
      const finalConclusion = determineConclusion();
      setConclusion(finalConclusion);
    }

    setStep(Math.min(step + 1, 4));
  };

  const handleBack = () => {
    setStep(Math.max(step - 1, 1));
  };

  const handleSubmit = async () => {
    if (!selectedService) return;

    setLoading(true);
    setError(null);

    try {
      const evaluationData: EvaluationCreate = {
        entity_name: entityName,
        entity_type: entityType,
        relation_type: relationType,
        service_id: selectedService.id,
        threats: Array.from(selectedThreats.values()).map(t => ({
          threat_id: t.threat.id,
          significance: t.significance,
          notes: t.notes,
        })),
        safeguards: Array.from(selectedSafeguards.values()).map(s => ({
          safeguard_id: s.safeguard.id,
          notes: s.notes,
        })),
        auditor_name: auditorName,
        notes: notes,
      };

      const evaluation = await api.createEvaluation(evaluationData);
      setCreatedEvaluation(evaluation);
    } catch (err) {
      setError('Error guardando la evaluación');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!createdEvaluation) return;

    try {
      const blob = await api.exportEvaluation(createdEvaluation.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SDA_Evaluation_${createdEvaluation.reference_number}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Error exportando documento');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService !== null && entityName.trim() !== '';
      case 2:
        return true; // Can proceed without selecting threats
      case 3:
        return true; // Can proceed without selecting safeguards
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-mazars-blue text-white py-4 px-8 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-bold">Evaluación SDA</h1>
              <p className="text-sm text-blue-200">Servicios Distintos de Auditoría</p>
            </div>
          </div>
          <StepIndicator currentStep={step} totalSteps={4} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            {error}
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Legal Gate */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Paso 1: Gate Legal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Entidad Auditada
                  </label>
                  <input
                    type="text"
                    value={entityName}
                    onChange={(e) => setEntityName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
                    placeholder="Ingrese el nombre de la entidad"
                  />
                </div>

                <EntityTypeToggle
                  value={entityType}
                  onChange={setEntityType}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Relación
                  </label>
                  <select
                    value={relationType}
                    onChange={(e) => setRelationType(e.target.value as RelationType)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
                  >
                    <option value="AUDITADA">Entidad Auditada</option>
                    <option value="CADENA">Cadena de Control</option>
                    <option value="VINCULADA">Entidad Vinculada Significativa</option>
                  </select>
                </div>

                <ServiceSelector
                  selectedService={selectedService}
                  onSelect={setSelectedService}
                />
              </div>

              {legalGateResult && (
                <div className={`mt-6 p-4 rounded-lg ${legalGateResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="flex items-center mb-2">
                    {legalGateResult.passed ? (
                      <Check className="w-6 h-6 text-green-600 mr-2" />
                    ) : (
                      <X className="w-6 h-6 text-red-600 mr-2" />
                    )}
                    <span className={`font-semibold ${legalGateResult.passed ? 'text-green-700' : 'text-red-700'}`}>
                      {legalGateResult.passed ? 'Gate Legal Aprobado' : 'Gate Legal No Aprobado'}
                    </span>
                  </div>
                  <p className={legalGateResult.passed ? 'text-green-600' : 'text-red-600'}>
                    {legalGateResult.reason}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Threats */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Paso 2: Análisis de Amenazas
              </h2>
              <p className="text-gray-600 mb-4">
                Identifique las amenazas a la independencia que aplican a este servicio y valore su significatividad.
              </p>
              <ThreatChecklist
                threats={availableThreats}
                selectedThreats={selectedThreats}
                onSelect={handleThreatSelect}
                onRemove={handleThreatRemove}
              />
            </div>
          )}

          {/* Step 3: Safeguards */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Paso 3: Medidas de Salvaguarda
              </h2>
              <p className="text-gray-600 mb-4">
                Seleccione las medidas de salvaguarda para mitigar las amenazas identificadas.
              </p>
              <SafeguardSelector
                safeguards={availableSafeguards}
                selectedSafeguards={selectedSafeguards}
                onSelect={handleSafeguardSelect}
                onRemove={handleSafeguardRemove}
              />
            </div>
          )}

          {/* Step 4: Conclusion */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Paso 4: Conclusión
              </h2>

              {conclusion && (
                <ConclusionDisplay
                  conclusion={conclusion}
                  info={CONCLUSION_INFO[conclusion]}
                />
              )}

              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auditor Responsable
                  </label>
                  <input
                    type="text"
                    value={auditorName}
                    onChange={(e) => setAuditorName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
                    placeholder="Nombre del auditor responsable"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones Adicionales
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
                    placeholder="Notas adicionales..."
                  />
                </div>
              </div>

              {createdEvaluation && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-700">Evaluación guardada</p>
                      <p className="text-sm text-green-600">
                        Referencia: {createdEvaluation.reference_number}
                      </p>
                    </div>
                    <button
                      onClick={handleExport}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Exportar Word
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                step === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed() || loading}
                className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                  !canProceed() || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-mazars-blue text-white hover:bg-blue-800'
                }`}
              >
                {loading ? 'Procesando...' : step === 1 && !legalGateResult ? 'Verificar Gate Legal' : 'Siguiente'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              !createdEvaluation && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {loading ? 'Guardando...' : 'Guardar Evaluación'}
                  <Check className="w-5 h-5 ml-2" />
                </button>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
