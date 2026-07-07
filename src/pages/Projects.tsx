import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProjects, createProject, deleteProject, type Project } from '../api/projectsApi';
import { motion } from 'framer-motion';
import { Plus, Folder, Trash2, Loader2, X, Database } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store/store';
import { toast } from 'sonner';
import { ProjectCardSkeleton } from '../components/Skeletons';

export default function Projects() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', createDefaultEnvironments: true });

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      closeModal();
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create project');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setProjectToDelete(null);
      toast.success('Project deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete project');
    }
  });

  const openCreate = () => {
    setFormData({ name: '', description: '', createDefaultEnvironments: true });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ name: '', description: '', createDefaultEnvironments: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const isPending = createMutation.isPending;

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Projects</h2>
            <p className="text-xs text-muted-foreground hidden lg:block">Organize your database connections into workspaces.</p>
          </div>
        </div>
      </PageHeader>

      <div className="flex justify-end">
        {user?.role !== 'VIEWER' && (
          <button
            onClick={openCreate}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Project
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects?.map((project, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={project.id}
              className="bg-card border rounded-xl p-5 shadow-sm group flex flex-col justify-between"
            >
              <div 
                className="cursor-pointer"
                onClick={() => navigate(`/projects/${project.id}/connections`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Folder className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold">{project.name}</h3>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {(user?.role === 'SUPER_ADMIN' || user?.email === project.createdByEmail) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(project);
                        }}
                        title="Delete project"
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-2">{project.description}</p>
                )}
              </div>
              <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                <span>Created by {project.createdByEmail}</span>
                <span className="flex items-center gap-1.5 bg-muted px-2.5 py-1 rounded-md font-medium">
                  <Database className="w-3 h-3" />
                  {project.connectionCount} {project.connectionCount === 1 ? 'connection' : 'connections'}
                </span>
              </div>
            </motion.div>
          ))}
          {projects?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed rounded-xl bg-muted/10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Folder className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to SchemaDiff!</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                Get started by creating your first project to organize and compare your database schemas.
              </p>
              {user?.role !== 'VIEWER' && (
                <button
                  onClick={openCreate}
                  className="bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Create First Project
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border shadow-xl rounded-xl w-full max-w-md overflow-hidden"
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold">New Project</h3>
              <button onClick={closeModal} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Project Name <span className="text-red-500">*</span></label>
                <input required autoComplete="do-not-autofill" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background" placeholder="e.g. Marketing Dashboard" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Description (Optional)</label>
                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm bg-background min-h-[80px]" placeholder="Brief description of the project" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <input 
                  type="checkbox" 
                  id="createEnv" 
                  checked={formData.createDefaultEnvironments} 
                  onChange={e => setFormData({ ...formData, createDefaultEnvironments: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="createEnv" className="text-sm font-medium">
                  Create default environments (Development, QA, Staging, Production)
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-70 transition-colors">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Create Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border shadow-xl rounded-xl w-full max-w-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-destructive">Delete Project</h3>
              <button onClick={() => setProjectToDelete(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete the project <strong>{projectToDelete.name}</strong>? This will also remove any database connections associated with this project. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  onClick={() => setProjectToDelete(null)} 
                  className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => deleteMutation.mutate(projectToDelete.id)}
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
