import axios from 'axios';
import type {
  Service,
  Category,
  Threat,
  Safeguard,
  SafeguardLevel,
  LegalGateCheck,
  Evaluation,
  EvaluationCreate,
  EntityType,
  RelationType,
} from '../types';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Services API
export const getServices = async (categoryId?: number, search?: string): Promise<Service[]> => {
  const params = new URLSearchParams();
  if (categoryId) params.append('category_id', categoryId.toString());
  if (search) params.append('search', search);
  const response = await api.get(`/services/?${params.toString()}`);
  return response.data;
};

export const getService = async (serviceId: number): Promise<Service> => {
  const response = await api.get(`/services/${serviceId}`);
  return response.data;
};

export const getCategories = async (): Promise<Category[]> => {
  const response = await api.get('/services/categories');
  return response.data;
};

export const getServiceThreats = async (serviceId: number): Promise<Threat[]> => {
  const response = await api.get(`/services/${serviceId}/threats`);
  return response.data;
};

export const checkServicePermission = async (
  serviceId: number,
  entityType: EntityType,
  relationType: RelationType
): Promise<{ permitted: boolean; permission_code: string | null; message: string; conclusion: string | null }> => {
  const response = await api.get(`/services/${serviceId}/permission`, {
    params: { entity_type: entityType, relation_type: relationType },
  });
  return response.data;
};

// Threats API
export const getThreats = async (): Promise<Threat[]> => {
  const response = await api.get('/threats/');
  return response.data;
};

export const getThreat = async (threatId: number): Promise<Threat & { safeguards: Safeguard[] }> => {
  const response = await api.get(`/threats/${threatId}`);
  return response.data;
};

export const getThreatSafeguards = async (threatId: number, levelId?: number): Promise<Safeguard[]> => {
  const params = levelId ? `?level_id=${levelId}` : '';
  const response = await api.get(`/threats/${threatId}/safeguards${params}`);
  return response.data;
};

export const getSafeguardLevels = async (): Promise<SafeguardLevel[]> => {
  const response = await api.get('/threats/safeguard-levels');
  return response.data;
};

export const getAllSafeguards = async (levelCode?: string): Promise<Safeguard[]> => {
  const params = levelCode ? `?level_code=${levelCode}` : '';
  const response = await api.get(`/threats/safeguards/all${params}`);
  return response.data;
};

// Legal Rules API
export const checkLegalGate = async (
  serviceId: number,
  entityType: EntityType,
  relationType: RelationType
): Promise<LegalGateCheck> => {
  const response = await api.get('/legal-rules/check', {
    params: { service_id: serviceId, entity_type: entityType, relation_type: relationType },
  });
  return response.data;
};

// Evaluations API
export const createEvaluation = async (data: EvaluationCreate): Promise<Evaluation> => {
  const response = await api.post('/evaluations/', data);
  return response.data;
};

export const getEvaluations = async (skip = 0, limit = 100): Promise<Evaluation[]> => {
  const response = await api.get(`/evaluations/?skip=${skip}&limit=${limit}`);
  return response.data;
};

export const getEvaluation = async (evaluationId: number): Promise<Evaluation> => {
  const response = await api.get(`/evaluations/${evaluationId}`);
  return response.data;
};

export const exportEvaluation = async (evaluationId: number): Promise<Blob> => {
  const response = await api.get(`/evaluations/${evaluationId}/export`, {
    responseType: 'blob',
  });
  return response.data;
};

export const deleteEvaluation = async (evaluationId: number): Promise<void> => {
  await api.delete(`/evaluations/${evaluationId}`);
};

export default api;
