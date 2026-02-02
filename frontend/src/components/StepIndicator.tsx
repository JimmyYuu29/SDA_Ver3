import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = ['Gate Legal', 'Amenazas', 'Salvaguardas', 'Conclusión'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              step < currentStep
                ? 'bg-green-500 text-white'
                : step === currentStep
                ? 'bg-white text-mazars-blue'
                : 'bg-blue-800 text-blue-300'
            }`}
          >
            {step < currentStep ? <Check className="w-5 h-5" /> : step}
          </div>
          <span
            className={`ml-2 text-sm hidden sm:inline ${
              step === currentStep ? 'text-white font-medium' : 'text-blue-300'
            }`}
          >
            {STEP_LABELS[step - 1]}
          </span>
          {step < totalSteps && (
            <div
              className={`w-8 h-0.5 mx-2 ${
                step < currentStep ? 'bg-green-500' : 'bg-blue-800'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
