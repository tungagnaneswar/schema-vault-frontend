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
  // Handle both unpaginated and paginated responses for backward compatibility during transition
  return response.data.content ? response.data.content : response.data;
};

export const createProject = async (data: { name: string; description?: string; createDefaultEnvironments?: boolean }): Promise<Project> => {
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
