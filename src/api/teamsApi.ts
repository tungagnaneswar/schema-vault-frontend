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
  teamRole: string;
  joinedAt: string;
  addedBy: string;
}

export interface TeamDbConnection {
  connectionId: number;
  name: string;
  environment: string;
  permissionLevel: string;
  assignedAt: string;
}

export interface MemberProject {
  projectId: number;
  name: string;
  environment: string;
  permission: string;
  assignedAt: string;
}

export const teamsApi = {
  getTeams: () => api.get<Team[]>('/teams').then(res => res.data),
  
  getTeam: (id: number) => api.get<Team>(`/teams/${id}`).then(res => res.data),
  
  createTeam: (data: { name: string; description?: string }) => 
    api.post<Team>('/teams', data).then(res => res.data),
  updateTeam: (id: number, data: { name: string; description?: string }) => 
    api.put<Team>(`/teams/${id}`, data).then(res => res.data),
  deleteTeam: (id: number) => 
    api.delete(`/teams/${id}`).then(res => res.data),
    
  getTeamMembers: (teamId: number) => 
    api.get<TeamMember[]>(`/teams/${teamId}/members`).then(res => res.data),
    
  addTeamMember: (teamId: number, userId: number, teamRole: string) => 
    api.post(`/teams/${teamId}/members`, { userId, teamRole }).then(res => res.data),

  updateTeamMemberRole: (teamId: number, userId: number, teamRole: string) => 
    api.patch(`/teams/${teamId}/members/${userId}/role`, { teamRole }).then(res => res.data),
    
  removeTeamMember: (teamId: number, userId: number) => 
    api.delete(`/teams/${teamId}/members/${userId}`).then(res => res.data),
    
  getTeamConnections: (teamId: number) => 
    api.get<TeamDbConnection[]>(`/teams/${teamId}/connections`).then(res => res.data),
    
  addTeamConnection: (teamId: number, dbConnectionId: number, permissionLevel: string) => 
    api.post(`/teams/${teamId}/connections`, { dbConnectionId, permissionLevel }).then(res => res.data),
    
  removeTeamConnection: (teamId: number, connectionId: number) => 
    api.delete(`/teams/${teamId}/connections/${connectionId}`).then(res => res.data),

  getMemberProjects: (teamId: number, userId: number) => 
    api.get<MemberProject[]>(`/teams/${teamId}/members/${userId}/projects`).then(res => res.data),

  assignMemberProject: (teamId: number, userId: number, projectId: number, permission: string) => 
    api.post(`/teams/${teamId}/members/${userId}/projects`, { projectId, permission }).then(res => res.data),

  removeMemberProject: (teamId: number, userId: number, projectId: number) => 
    api.delete(`/teams/${teamId}/members/${userId}/projects/${projectId}`).then(res => res.data),

  getAvailableUsers: () => 
    api.get<{id: number, email: string, role: string}[]>('/teams/users/available').then(res => res.data),
};
