import api from './axios';

export interface Team {
  id: number;
  name: string;
  description: string;
  createdById: number;
  createdByEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  userId: number;
  email: string;
  role: string;
  joinedAt: string;
}

export interface TeamDbConnection {
  connectionId: number;
  name: string;
  environment: string;
  permissionLevel: string;
  assignedAt: string;
}

export const teamsApi = {
  getTeams: () => api.get<Team[]>('/teams').then(res => res.data),
  
  getTeam: (id: number) => api.get<Team>(`/teams/${id}`).then(res => res.data),
  
  createTeam: (data: { name: string; description?: string }) => 
    api.post<Team>('/teams', data).then(res => res.data),
    
  getTeamMembers: (teamId: number) => 
    api.get<TeamMember[]>(`/teams/${teamId}/members`).then(res => res.data),
    
  addTeamMember: (teamId: number, userId: number) => 
    api.post(`/teams/${teamId}/members`, { userId }).then(res => res.data),

  createTeamMember: (teamId: number, data: { email: string; password: string; roleName: string }) => 
    api.post(`/teams/${teamId}/members/create`, data).then(res => res.data),
    
  removeTeamMember: (teamId: number, userId: number) => 
    api.delete(`/teams/${teamId}/members/${userId}`).then(res => res.data),
    
  getTeamConnections: (teamId: number) => 
    api.get<TeamDbConnection[]>(`/teams/${teamId}/connections`).then(res => res.data),
    
  addTeamConnection: (teamId: number, dbConnectionId: number, permissionLevel: string) => 
    api.post(`/teams/${teamId}/connections`, { dbConnectionId, permissionLevel }).then(res => res.data),
    
  removeTeamConnection: (teamId: number, connectionId: number) => 
    api.delete(`/teams/${teamId}/connections/${connectionId}`).then(res => res.data),

  getAvailableUsers: () => 
    api.get<{id: number, email: string, role: string}[]>('/teams/users/available').then(res => res.data),
};
