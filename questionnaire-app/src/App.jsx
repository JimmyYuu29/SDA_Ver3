import { useState, useCallback } from 'react'
import HeaderSection from './components/HeaderSection'
import ServiceSelector from './components/ServiceSelector'
import Step1Section from './components/Step1Section'
import Step2Section from './components/Step2Section'
import Step3Section from './components/Step3Section'
import Step4Section from './components/Step4Section'
import SignatureSection from './components/SignatureSection'
import DocumentationSection from './components/DocumentationSection'
import ProgressBar from './components/ProgressBar'
import { generateWord } from './utils/generateWord'
import './App.css'

const INITIAL_STATE = {
  // Header fields
  entityName: '',
  auditorName: '',
  eip: '',
  groupName: '',
  parentEIP: '',
  parentInEU: '',
  parentAuditedByMazars: '',
  partnerName: '',
  servicesAuthorized: '',
  linkedEntityName: '',
  linkedInControlChain: '',
  linkedJointControl: '',
  linkedSignificantInfluence: '',
  mazarsEntity: '',
  sdaPartnerName: '',
  sdaFees: '',

  // Service selection
  selectedServiceCode: '',
  selectedCategoryId: '',
  selectedServiceDescription: '',
  selectedServiceTipo: '',
  selectedServiceSubcat: '',
  selectedServiceLimitaciones: '',
  selectedServiceCategoryName: '',

  // Step 1.1
  step1_1_description: '',

  // Step 1.2
  step1_2_answer: '',

  // Step 1.3
  step1_3_detail: '',
  step1_3_answer: '',

  // Step 1.4
  step1_4_detail: '',
  step1_4_answer: '',

  // Step 1.5
  step1_5_detail: '',
  step1_5_answer: '',

  // Step 1.6
  step1_6_detail: '',
  step1_6_answer: '',

  // Step 2.1
  step2_1_description: '',
  threat_selfInterest: '',
  threat_selfReview: '',
  threat_decisionMaking: '',
  threat_advocacy: '',
  threat_familiarity: '',
  threat_intimidation: '',

  // Step 2.2
  step2_2_evaluation: '',

  // Step 3
  step3_measures: '',

  // Step 4
  step4_conclusion: '',

  // Signatures
  analysisDate: '',
  auditPartnerSignature: '',
  sdaPartnerDate: '',
  sdaPartnerSignature: '',
  sdaResponsibleSignature: '',

  // Documentation
  doc_ethics: '',
  doc_riskManager: '',
  doc_dominantPartner: '',
  doc_auditCommission: '',
  doc_engagementLetter: '',
  doc_wecheck: '',
  doc_deliverables: '',
}

function App() {
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [currentStep, setCurrentStep] = useState(0)
  const [exporting, setExporting] = useState(false)

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const getVisibleSteps = () => {
    // 0=Header, 1=ServiceSelector, 2=Step1, 3=Step2, 4=Step3, 5=Step4, 6=Signatures, 7=Documentation
    const steps = [0, 1, 2] // Header + Service + Step 1 always visible

    const { step1_3_answer, step1_4_answer, step1_5_answer, step1_6_answer } = formData

    // If any of 1.3, 1.4, 1.5 answers SI -> skip to Step 4
    if (step1_3_answer === 'SI') {
      return [...steps, 5, 6, 7]
    }
    if (step1_4_answer === 'SI') {
      return [...steps, 5, 6, 7]
    }
    if (step1_5_answer === 'SI') {
      return [...steps, 5, 6, 7]
    }
    // If 1.6 answer is SI -> skip to Step 4
    if (step1_6_answer === 'SI') {
      return [...steps, 5, 6, 7]
    }

    // If 1.6 is NO -> go to step 2
    if (step1_6_answer === 'NO') {
      steps.push(3)

      const hasThreats = ['threat_selfInterest', 'threat_selfReview', 'threat_decisionMaking', 'threat_advocacy', 'threat_familiarity', 'threat_intimidation'].some(k => formData[k] === 'SI')

      if (hasThreats) {
        steps.push(4) // Step 3 if significant threats
      }

      steps.push(5, 6, 7)
      return steps
    }

    // Default: show all steps
    return [0, 1, 2, 3, 4, 5, 6, 7]
  }

  const visibleSteps = getVisibleSteps()

  const handleExport = async () => {
    setExporting(true)
    try {
      await generateWord(formData)
    } catch (e) {
      console.error('Export error:', e)
      alert('Error al exportar el documento.')
    }
    setExporting(false)
  }

  const stepLabels = [
    'Informacion General',
    'Seleccion Servicio',
    'Paso 1: Identificacion',
    'Paso 2: Amenazas',
    'Paso 3: Salvaguardas',
    'Paso 4: Conclusion',
    'Firmas',
    'Documentacion',
  ]

  const goToStep = (step) => {
    if (visibleSteps.includes(step)) {
      setCurrentStep(step)
    }
  }

  const nextStep = () => {
    const idx = visibleSteps.indexOf(currentStep)
    if (idx < visibleSteps.length - 1) {
      setCurrentStep(visibleSteps[idx + 1])
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    const idx = visibleSteps.indexOf(currentStep)
    if (idx > 0) {
      setCurrentStep(visibleSteps[idx - 1])
      window.scrollTo(0, 0)
    }
  }

  const isFirstStep = visibleSteps.indexOf(currentStep) === 0
  const isLastStep = visibleSteps.indexOf(currentStep) === visibleSteps.length - 1

  return (
    <div className="app">
      <header className="app-header">
        <h1>Analisis de Amenazas - Medidas de Salvaguarda</h1>
        <p className="subtitle">Plantilla para su Documentacion - Esquema del Procedimiento en MAZARS</p>
      </header>

      <ProgressBar
        steps={stepLabels}
        visibleSteps={visibleSteps}
        currentStep={currentStep}
        onStepClick={goToStep}
      />

      <main className="app-main">
        {currentStep === 0 && (
          <HeaderSection formData={formData} updateField={updateField} />
        )}
        {currentStep === 1 && (
          <ServiceSelector formData={formData} updateField={updateField} />
        )}
        {currentStep === 2 && (
          <Step1Section formData={formData} updateField={updateField} />
        )}
        {currentStep === 3 && (
          <Step2Section formData={formData} updateField={updateField} />
        )}
        {currentStep === 4 && (
          <Step3Section formData={formData} updateField={updateField} />
        )}
        {currentStep === 5 && (
          <Step4Section formData={formData} updateField={updateField} />
        )}
        {currentStep === 6 && (
          <SignatureSection formData={formData} updateField={updateField} />
        )}
        {currentStep === 7 && (
          <DocumentationSection formData={formData} updateField={updateField} />
        )}

        <div className="navigation-buttons">
          {!isFirstStep && (
            <button className="btn btn-secondary" onClick={prevStep}>
              &larr; Anterior
            </button>
          )}
          <div style={{ flex: 1 }} />
          {!isLastStep && (
            <button className="btn btn-primary" onClick={nextStep}>
              Siguiente &rarr;
            </button>
          )}
          {isLastStep && (
            <button
              className="btn btn-export"
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? 'Generando...' : 'Generar Documento Word'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
