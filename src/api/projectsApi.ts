import api from './axios';

export interface Project {
  id: number;
  name: string;
  description: string;
  createdById: number;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
  connectionCount: number;
}

export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export const createProject = async (data: { name: string; description?: string }): Promise<Project> => {
  const response = await api.post('/projects', data);
  return response.data;
};

export const getProjectById = async (id: number): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};
