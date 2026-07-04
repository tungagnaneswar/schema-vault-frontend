import api from './axios';

export interface Snapshot {
    id: number;
    connectionId: number;
    createdAt: string;
}

export interface CompareJob {
    id: number;
    status: string;
    sourceSnapshotId: number;
    targetSnapshotId: number;
    startedAt: string;
    completedAt: string | null;
    errorMessage: string | null;
    resultData: any | null;
    projectId: number;
    createdById: number;
    createdByEmail: string;
    durationMs: number | null;
    reason: string | null;
    tags: string | null;
    summaryStatistics: any | null;
}

export const createSnapshot = async (connectionId: number): Promise<Snapshot> => {
    const response = await api.post(`/snapshots/connection/${connectionId}`);
    return response.data;
};

export const getSnapshots = async (connectionId: number, page = 0, size = 10) => {
    const response = await api.get(`/snapshots/connection/${connectionId}?page=${page}&size=${size}`);
    return response.data;
};

export const startCompareJob = async (sourceSnapshotId: number, targetSnapshotId: number, projectId: number, reason?: string, tags?: string[]): Promise<CompareJob> => {
    const response = await api.post('/compare/jobs', {
        sourceSnapshotId,
        targetSnapshotId,
        projectId,
        reason,
        tags
    });
    return response.data;
};

export const getCompareJob = async (jobId: number): Promise<CompareJob> => {
    const response = await api.get(`/compare/jobs/${jobId}`);
    return response.data;
};

export const getCompareJobs = async (projectId: number, page = 0, size = 10) => {
    const response = await api.get(`/compare/jobs?projectId=${projectId}&page=${page}&size=${size}`);
    return response.data;
};
