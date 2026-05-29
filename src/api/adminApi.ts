import api from './axios';

export interface UserResponse {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogResponse {
  id: number;
  userEmail: string;
  action: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
  details: string;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const adminApi = {
  getUsers: (page = 0, size = 10): Promise<{ data: PageResponse<UserResponse> }> =>
    api.get('/admin/users', { params: { page, size } }),

  toggleUserActive: (id: number): Promise<{ data: UserResponse }> =>
    api.patch(`/admin/users/${id}/toggle-active`),

  getLogs: (page = 0, size = 20): Promise<{ data: PageResponse<AuditLogResponse> }> =>
    api.get('/admin/logs', { params: { page, size } }),
};
