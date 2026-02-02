import { Link } from 'react-router-dom';
import { FileCheck, Shield, ClipboardList, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-mazars-blue to-blue-900">
      {/* Header */}
      <header className="py-6 px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="text-white">
            <h1 className="text-2xl font-bold">FORVIS MAZARS</h1>
            <p className="text-sm text-blue-200">Auditoría y Consultoría</p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Evaluación de Servicios Distintos de Auditoría
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-8">
            Sistema de evaluación de independencia para servicios no relacionados con auditoría (SDA)
            según la normativa española LAC y RUE.
          </p>
          <Link
            to="/evaluate"
            className="inline-flex items-center px-8 py-4 bg-white text-mazars-blue rounded-lg font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            <FileCheck className="w-6 h-6 mr-3" />
            Iniciar Nueva Evaluación
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<ClipboardList className="w-8 h-8" />}
            title="Gate Legal"
            description="Verificación automática de prohibiciones legales según tipo de entidad (EIP/NO EIP)"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Análisis de Amenazas"
            description="Identificación de los 6 tipos de amenazas a la independencia del auditor"
          />
          <FeatureCard
            icon={<FileCheck className="w-8 h-8" />}
            title="Salvaguardas"
            description="Selección de medidas de salvaguarda a nivel de firma, situación y entidad"
          />
          <FeatureCard
            icon={<Download className="w-8 h-8" />}
            title="Documentación"
            description="Generación automática del documento de evaluación en formato Word"
          />
        </div>

        {/* Workflow Steps */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-white text-center mb-10">
            Proceso de Evaluación en 4 Pasos
          </h3>
          <div className="grid md:grid-cols-4 gap-4">
            <WorkflowStep
              number={1}
              title="Gate Legal"
              description="Selección de servicio y verificación de permisos legales"
            />
            <WorkflowStep
              number={2}
              title="Amenazas"
              description="Identificación y valoración de amenazas a la independencia"
            />
            <WorkflowStep
              number={3}
              title="Salvaguardas"
              description="Selección de medidas para mitigar las amenazas identificadas"
            />
            <WorkflowStep
              number={4}
              title="Conclusión"
              description="Determinación final (C1-C7) y exportación del documento"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-blue-300 text-sm">
        <p>© 2024 Forvis Mazars España. Sistema de Evaluación SDA v1.0</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white hover:bg-white/20 transition-colors">
      <div className="text-blue-300 mb-4">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-blue-200 text-sm">{description}</p>
    </div>
  );
}

function WorkflowStep({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="relative">
      <div className="bg-white rounded-xl p-6 text-center">
        <div className="w-10 h-10 bg-mazars-blue text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
          {number}
        </div>
        <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      {number < 4 && (
        <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-4 border-t-2 border-r-2 border-white transform rotate-45" />
      )}
    </div>
  );
}
