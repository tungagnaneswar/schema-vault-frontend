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
  if (Array.isArray(response.data)) return response.data;
  if (response.data?.content && Array.isArray(response.data.content)) return response.data.content;
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data;
  if (response.data?.data?.content && Array.isArray(response.data.data.content)) return response.data.data.content;
  return [];
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
