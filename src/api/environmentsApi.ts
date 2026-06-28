import api from './axios';

export interface Environment {
  id: number;
  name: string;
  projectId: number;
  sequence: number;
  createdAt: string;
  updatedAt: string;
}

export const getEnvironmentsByProject = async (projectId: number): Promise<Environment[]> => {
  const res = await api.get(`/environments/project/${projectId}`);
  return res.data;
};

export const createEnvironment = async (data: { name: string; projectId: number; sequence?: number }): Promise<Environment> => {
  const res = await api.post('/environments', data);
  return res.data;
};

export const deleteEnvironment = async (id: number): Promise<void> => {
  await api.delete(`/environments/${id}`);
};
