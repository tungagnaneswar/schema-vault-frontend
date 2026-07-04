import api from './axios';

export interface DashboardStats {
  activeConnections: number;
  schemasCompared: number;
  systemAlerts: number;
  activeUsers: number;
  recentComparisons?: RecentComparison[];
}

export interface RecentComparison {
  id: number;
  status: string;
  projectName: string;
  sourceEnvironmentName: string;
  targetEnvironmentName: string;
  createdByEmail: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  summaryStatistics?: any;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
