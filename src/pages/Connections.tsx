import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Plus, Database, Trash2, ShieldCheck, Loader2, Pencil, X, Folder, ArrowLeft, GitCompare, Clock, CheckCircle2, AlertCircle, User as UserIcon, Timer, Tag } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getProjects, type Project } from '../api/projectsApi';
import { getEnvironmentsByProject, type Environment } from '../api/environmentsApi';
import { getCompareJobs } from '../api/compareApi';
import clsx from 'clsx';
import { toast } from 'sonner';
import { ConnectionCardSkeleton } from '../components/Skeletons';
interface DbConnection {
  id: number;
  name: string;
  projectId: number;
  projectName: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  environmentId: number;
  environmentName: string;
  engine: string;
  permissionLevel: string;
}

const emptyForm = {
  name: '', environmentId: 0, host: '', port: '' as unknown as number, databaseName: '', username: '', password: '', engine: ''
};

const ENV_COLORS: Record<string, string> = {
  PROD: 'bg-rose-500/10 text-rose-500',
  UAT:  'bg-amber-500/10 text-amber-500',
  QA:   'bg-blue-500/10 text-blue-500',
  DEV:  'bg-emerald-500/10 text-emerald-500',
};

const ENGINE_COLORS: Record<string, string> = {
  POSTGRES: 'bg-sky-500/10 text-sky-600',
  MYSQL:    'bg-orange-500/10 text-orange-600',
};

const ENGINE_LABELS: Record<string, string> = {
  POSTGRES: 'PostgreSQL',
  MYSQL:    'MySQL',
};

const ENGINE_PORTS: Record<string, number> = {
  POSTGRES: 5432,
  MYSQL: 3306,
};

import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

export default function Connections() {
  const queryClient = useQueryClient();
  const { projectId: projectIdParam } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConn, setEditingConn] = useState<DbConnection | null>(null);
  const [connToDelete, setConnToDelete] = useState<DbConnection | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [historyPage, setHistoryPage] = useState(0);

  // Redirect to projects if no projectId
  if (!projectIdParam) {
    return <Navigate to="/projects" replace />;
  }

  const { data: connections, isLoading } = useQuery<DbConnection[]>({
    queryKey: ['connections'],
    queryFn: async () => {
      const res = await api.get('/connections');
      return res.data.content ? res.data.content : res.data;
    }
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const { data: environments } = useQuery<Environment[]>({
    queryKey: ['environments', projectIdParam],
    queryFn: () => getEnvironmentsByProject(parseInt(projectIdParam!)),
    enabled: !!projectIdParam
  });

  const { data: jobsData, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['compareJobs', projectIdParam, historyPage],
    queryFn: () => getCompareJobs(Number(projectIdParam), historyPage, 10),
    enabled: !!projectIdParam
  });

  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const filteredConnections = connections?.filter(c => c.projectId === parseInt(projectIdParam));

  const currentProject = projects?.find(p => p.id === parseInt(projectIdParam));

  const createMutation = useMutation({
    mutationFn: async (newConn: typeof emptyForm) => {
      const res = await api.post('/connections', newConn);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      closeModal();
      toast.success('Connection added successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add connection');
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: typeof emptyForm }) => {
      const res = await api.put(`/connections/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      closeModal();
      toast.success('Connection updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update connection');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/connections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      setConnToDelete(null);
      toast.success('Connection deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete connection');
    }
  });

  const openCreate = () => {
    setEditingConn(null);
    setFormData({
      ...emptyForm,
      environmentId: environments && environments.length > 0 ? environments[0].id : 0
    });
    setIsModalOpen(true);
  };

  const openEdit = (conn: DbConnection) => {
    setEditingConn(conn);
    setFormData({
      name: conn.name,
      host: conn.host,
      port: conn.port,
      databaseName: conn.databaseName,
      username: conn.username,
      password: '', // never pre-fill password
      environmentId: conn.environmentId,
      engine: conn.engine || 'POSTGRES',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingConn(null);
    setFormData(emptyForm);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingConn) {
      updateMutation.mutate({ id: editingConn.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full">
          <h2 className="text-xl font-bold tracking-tight">
            {currentProject ? `${currentProject.name} > Connections` : 'Connections'}
          </h2>
          <p className="text-xs text-muted-foreground hidden lg:block mt-1">
            {currentProject ? `Manage database connections for ${currentProject.name}.` : 'Manage your secure database connection profiles.'}
          </p>
        </div>
      </PageHeader>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </button>
        <div className="flex items-center gap-3">
        {/* Compare Schemas — always visible; disabled with tooltip until 2 connections exist */}
        {(() => {
          const connCount = filteredConnections?.length ?? 0;
          const canCompare = connCount >= 2;
          return (
            <div
              className="relative group"
              title={!canCompare ? 'Create two database connections to compare' : undefined}
            >
              <button
                onClick={() => canCompare && navigate(`/projects/${projectIdParam}/compare`)}
                disabled={!canCompare}
                className={`border border-primary/30 text-primary px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
                  canCompare
                    ? 'hover:bg-primary/10 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <GitCompare className="w-4 h-4" /> Compare Schemas
              </button>
              {!canCompare && (
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs rounded-md bg-popover border shadow-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Create two database connections to compare
                </div>
              )}
            </div>
          );
        })()}

          {/* Add Connection */}
          {user?.role !== 'VIEWER' && (() => {
            const hasMaxConnections = (filteredConnections?.length ?? 0) >= 2;
            return (
              <div
                className="relative group"
                title={hasMaxConnections ? 'Maximum of 2 connections allowed' : undefined}
              >
                <button
                  onClick={openCreate}
                  disabled={hasMaxConnections}
                  className={`px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors ${
                    hasMaxConnections
                      ? 'bg-muted text-muted-foreground opacity-60 cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <Plus className="w-4 h-4" /> Add Connection
                </button>
                {hasMaxConnections && (
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs rounded-md bg-popover border shadow-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                    Maximum of 2 connections allowed
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <ConnectionCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredConnections?.map((conn, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={conn.id}
              className="bg-card border rounded-xl p-5 shadow-sm group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{conn.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-flex items-center ${ENV_COLORS[conn.environmentName?.toUpperCase()] ?? 'bg-muted text-muted-foreground'}`}>
                        {conn.environmentName}
                      </span>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-flex items-center ${ENGINE_COLORS[conn.engine] ?? 'bg-muted text-muted-foreground'}`}>
                        {ENGINE_LABELS[conn.engine] ?? conn.engine}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md">
                        <Folder className="w-3 h-3" /> {conn.projectName}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {(conn.permissionLevel === 'ADMIN' || conn.permissionLevel === 'WRITE') && (
                    <button
                      onClick={() => openEdit(conn)}
                      title="Edit connection"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  {conn.permissionLevel === 'ADMIN' && (
                    <button
                      onClick={() => setConnToDelete(conn)}
                      title="Delete connection"
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Host:</span> {conn.host}:{conn.port}</p>
                <p><span className="font-medium text-foreground">Database:</span> {conn.databaseName}</p>
                <p><span className="font-medium text-foreground">User:</span> {conn.username}</p>
                <p className="flex items-center gap-1 mt-3 text-emerald-600 bg-emerald-500/10 w-max px-2 py-1 rounded-md text-xs font-medium">
                  <ShieldCheck className="w-3 h-3" /> Encrypted Vault
                </p>
              </div>
            </motion.div>
          ))}
          {filteredConnections?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              No connections yet. Add two database connections to enable schema comparison.
            </div>
          )}
        </div>
      )}

      {/* --- COMPARE HISTORY SECTION --- */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Compare History</h3>
          <button
            onClick={() => navigate(`/projects/${projectIdParam}/compare-history`)}
            className="text-sm text-primary hover:underline"
          >
            View All
          </button>
        </div>

        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          {isLoadingJobs ? (
            <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : jobsData?.content?.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">No compare jobs history found.</div>
          ) : (
            <div className="divide-y">
              {jobsData?.content?.map((job: any) => {
                const tags = job.tags ? JSON.parse(job.tags) : [];
                return (
                  <div key={job.id} onClick={() => navigate(`/projects/${projectIdParam}/compare/${job.id}`)} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        {job.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : job.status === 'FAILED' ? (
                          <AlertCircle className="w-5 h-5 text-rose-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-base hover:text-primary transition-colors">Job #{job.id}</h4>
                          {tags.length > 0 && (
                            <div className="flex gap-1">
                              {tags.map((tag: string, i: number) => (
                                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                                  <Tag className="w-3 h-3" /> {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {job.reason && (
                          <p className="text-sm text-foreground mt-1 mb-2 italic">"{job.reason}"</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <UserIcon className="w-3.5 h-3.5" />
                            {job.createdByEmail || 'Unknown User'}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5" />
                            {formatDuration(job.durationMs)}
                          </div>
                          <div className="flex items-center gap-1.5 text-mono bg-muted/50 px-2 py-0.5 rounded">
                            <span className="opacity-70">SRC:</span> {job.sourceSnapshotId}
                            <span className="mx-1 opacity-50">&rarr;</span>
                            <span className="opacity-70">TGT:</span> {job.targetSnapshotId}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right text-sm">
                      <p className="font-medium">{new Date(job.startedAt).toLocaleString(undefined, {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}</p>
                      <p className={clsx(
                        "mt-1 text-xs font-semibold uppercase tracking-wider",
                        job.status === 'COMPLETED' ? 'text-emerald-500' :
                        job.status === 'FAILED' ? 'text-rose-500' : 'text-amber-500'
                      )}>{job.status}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {jobsData?.content?.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <button 
                disabled={historyPage === 0} 
                onClick={() => setHistoryPage(p => Math.max(0, p - 1))}
                className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm font-medium hover:bg-muted transition-colors"
            >
                Previous
            </button>
            <span className="text-sm text-muted-foreground">Page {historyPage + 1} of {jobsData?.totalPages || 1}</span>
            <button 
                disabled={jobsData?.last} 
                onClick={() => setHistoryPage(p => p + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm font-medium hover:bg-muted transition-colors"
            >
                Next
            </button>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border shadow-xl rounded-xl w-full max-w-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {editingConn ? `Edit — ${editingConn.name}` : 'New Secure Connection'}
              </h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} autoComplete="off" className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Project</label>
                <input
                  disabled
                  autoComplete="off"
                  value={currentProject?.name || 'Loading...'}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background opacity-50"
                />
              </div>
                <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Name <span className="text-red-500">*</span></label>
                  <input required autoComplete="do-not-autofill" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" placeholder="e.g. Prod DB" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Database Engine <span className="text-red-500">*</span></label>
                  <select
                    value={formData.engine}
                    onChange={e => {
                      const engine = e.target.value;
                      setFormData({ ...formData, engine, port: ENGINE_PORTS[engine] ?? formData.port });
                    }}
                    required
                    disabled={!!editingConn}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background disabled:opacity-50"
                  >
                    <option value="" disabled>Select an engine...</option>
                    <option value="POSTGRES">PostgreSQL</option>
                    <option value="MYSQL">MySQL</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Environment <span className="text-red-500">*</span></label>
                  <select 
                    autoComplete="do-not-autofill" 
                    value={formData.environmentId} 
                    onChange={e => setFormData({ ...formData, environmentId: parseInt(e.target.value) })} 
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    required
                  >
                    <option value={0} disabled>Select an environment...</option>
                    {environments?.map(env => (
                      <option key={env.id} value={env.id}>{env.name}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium">Host <span className="text-red-500">*</span></label>
                  <input required autoComplete="do-not-autofill" value={formData.host} onChange={e => setFormData({ ...formData, host: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" placeholder="db.example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Port <span className="text-red-500">*</span></label>
                  <input type="number" required autoComplete="do-not-autofill" value={formData.port} onChange={e => { const val = parseInt(e.target.value); setFormData({ ...formData, port: isNaN(val) ? ('' as unknown as number) : val }) }} className="w-full px-3 py-2 border rounded-md text-sm bg-background" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Database Name <span className="text-red-500">*</span></label>
                  <input required autoComplete="do-not-autofill" value={formData.databaseName} onChange={e => setFormData({ ...formData, databaseName: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Username <span className="text-red-500">*</span></label>
                  <input required autoComplete="do-not-autofill" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    Password
                    {!editingConn && <span className="text-red-500 ml-1">*</span>}
                    {editingConn && <span className="text-muted-foreground font-normal ml-1">(leave blank to keep existing)</span>}
                  </label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    required={!editingConn}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm bg-background"
                    placeholder={editingConn ? '••••••••' : ''}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-70 transition-colors">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingConn ? 'Save Changes' : 'Save & Test'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {connToDelete && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border shadow-xl rounded-xl w-full max-w-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-destructive">Delete Connection</h3>
              <button onClick={() => setConnToDelete(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the connection <strong>{connToDelete.name}</strong> {connToDelete.environmentName && <>({connToDelete.environmentName})</>}? This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setConnToDelete(null)} 
                  className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(connToDelete.id)}
                  disabled={deleteMutation.isPending} 
                  className="px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 flex items-center gap-2 disabled:opacity-70 transition-colors"
                >
                  {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>,
        document.body
      )}
    </div>
  );
}
