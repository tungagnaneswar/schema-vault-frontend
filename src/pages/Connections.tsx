import { useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Plus, Database, Trash2, ShieldCheck, Loader2, Pencil, X, Folder, ArrowLeft, GitCompare } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { getProjects, type Project } from '../api/projectsApi';
interface DbConnection {
  id: number;
  name: string;
  projectId: number;
  projectName: string;
  host: string;
  port: number;
  databaseName: string;
  username: string;
  environment: string;
  permissionLevel: string;
}

const emptyForm = {
  name: '', projectId: 0, host: '', port: 5432, databaseName: '', username: '', password: '', environment: 'DEV'
};

const ENV_COLORS: Record<string, string> = {
  PROD: 'bg-rose-500/10 text-rose-500',
  UAT:  'bg-amber-500/10 text-amber-500',
  QA:   'bg-blue-500/10 text-blue-500',
  DEV:  'bg-emerald-500/10 text-emerald-500',
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

  // Redirect to projects if no projectId
  if (!projectIdParam) {
    return <Navigate to="/projects" replace />;
  }

  const { data: connections, isLoading } = useQuery<DbConnection[]>({
    queryKey: ['connections'],
    queryFn: async () => {
      const res = await api.get('/connections');
      return res.data;
    }
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects
  });

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
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/connections/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      setConnToDelete(null);
    }
  });

  const openCreate = () => {
    setEditingConn(null);
    setFormData({
      ...emptyForm,
      projectId: projectIdParam ? parseInt(projectIdParam) : 0
    });
    setIsModalOpen(true);
  };

  const openEdit = (conn: DbConnection) => {
    setEditingConn(conn);
    setFormData({
      name: conn.name,
      projectId: conn.projectId,
      host: conn.host,
      port: conn.port,
      databaseName: conn.databaseName,
      username: conn.username,
      password: '', // never pre-fill password
      environment: conn.environment,
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
        <div className="w-full flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button onClick={() => navigate('/projects')} className="p-1.5 hover:bg-muted rounded-md transition-colors -ml-2">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-xl font-bold tracking-tight">
                {currentProject ? `${currentProject.name} — Connections` : 'Connections'}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground hidden lg:block mt-1 ml-10">
              {currentProject ? `Manage database connections for ${currentProject.name}.` : 'Manage your secure PostgreSQL connection profiles.'}
            </p>
          </div>
        </div>
      </PageHeader>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(`/projects/${projectIdParam}/compare`)}
          className="border border-primary/30 text-primary px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-primary/10 transition-colors"
        >
          <GitCompare className="w-4 h-4" /> Compare Schemas
        </button>
        {user?.role !== 'VIEWER' && (
          <button
            onClick={openCreate}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Connection
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-flex items-center ${ENV_COLORS[conn.environment] ?? 'bg-muted text-muted-foreground'}`}>
                        {conn.environment}
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
              No connections found. Click "Add Connection" to get started.
            </div>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
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
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Project</label>
                <input
                  disabled
                  value={currentProject?.name || 'Loading...'}
                  className="w-full px-3 py-2 border rounded-md text-sm bg-background opacity-50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Name</label>
                  <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" placeholder="e.g. Prod DB" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Environment</label>
                  <select value={formData.environment} onChange={e => setFormData({ ...formData, environment: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background">
                    <option>DEV</option><option>QA</option><option>UAT</option><option>PROD</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium">Host</label>
                  <input required value={formData.host} onChange={e => setFormData({ ...formData, host: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" placeholder="db.example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Port</label>
                  <input type="number" required value={formData.port} onChange={e => setFormData({ ...formData, port: parseInt(e.target.value) })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Database Name</label>
                  <input required value={formData.databaseName} onChange={e => setFormData({ ...formData, databaseName: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Username</label>
                  <input required value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">
                    Password
                    {editingConn && <span className="text-muted-foreground font-normal ml-1">(leave blank to keep existing)</span>}
                  </label>
                  <input
                    type="password"
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {connToDelete && (
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
                Are you sure you want to delete the connection <strong>{connToDelete.name}</strong>? This action cannot be undone.
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
        </div>
      )}
    </div>
  );
}
