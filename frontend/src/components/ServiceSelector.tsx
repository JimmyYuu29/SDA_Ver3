import { useState, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import type { Service, Category } from '../types';
import * as api from '../services/api';

interface ServiceSelectorProps {
  selectedService: Service | null;
  onSelect: (service: Service | null) => void;
}

export default function ServiceSelector({ selectedService, onSelect }: ServiceSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
    loadServices();
  }, []);

  useEffect(() => {
    loadServices();
  }, [selectedCategory, search]);

  const loadCategories = async () => {
    try {
      const cats = await api.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadServices = async () => {
    setLoading(true);
    try {
      const svcs = await api.getServices(selectedCategory || undefined, search || undefined);
      setServices(svcs);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupedServices = services.reduce((acc, service) => {
    const catName = service.category?.name || 'Otros';
    if (!acc[catName]) {
      acc[catName] = [];
    }
    acc[catName].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const handleSelect = (service: Service) => {
    onSelect(service);
    setIsOpen(false);
    setSearch('');
  };

  const handleClear = () => {
    onSelect(null);
    setSearch('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Servicio Solicitado
      </label>

      {/* Selected Service Display */}
      {selectedService ? (
        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-blue-50">
          <div>
            <span className="font-medium text-mazars-blue">{selectedService.code}</span>
            <span className="text-gray-600 ml-2">- {selectedService.name}</span>
          </div>
          <button
            onClick={handleClear}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white hover:border-mazars-blue transition-colors"
        >
          <span className="text-gray-500">Seleccione un servicio...</span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar servicio..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mazars-blue focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="p-3 border-b border-gray-200 flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 text-xs rounded-full ${
                selectedCategory === null
                  ? 'bg-mazars-blue text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs rounded-full ${
                  selectedCategory === cat.id
                    ? 'bg-mazars-blue text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.code}
              </button>
            ))}
          </div>

          {/* Services List */}
          <div className="overflow-y-auto max-h-64">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Cargando...</div>
            ) : Object.keys(groupedServices).length === 0 ? (
              <div className="p-4 text-center text-gray-500">No se encontraron servicios</div>
            ) : (
              Object.entries(groupedServices).map(([category, categoryServices]) => (
                <div key={category}>
                  <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    {category}
                  </div>
                  {categoryServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => handleSelect(service)}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                    >
                      <span className="font-medium text-mazars-blue">{service.code}</span>
                      <span className="text-gray-600 ml-2 text-sm">{service.name}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
