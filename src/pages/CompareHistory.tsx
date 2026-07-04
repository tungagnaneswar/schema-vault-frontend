import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCompareJobs } from '../api/compareApi';
import PageHeader from '../components/PageHeader';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Loader2, User as UserIcon, Timer, Tag } from 'lucide-react';
import { getProjects } from '../api/projectsApi';
import clsx from 'clsx';

export default function CompareHistory() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['compareJobs', projectId, page],
    queryFn: () => getCompareJobs(Number(projectId), page, 10),
    enabled: !!projectId
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const currentProject = projects?.find(p => p.id === Number(projectId));
  
  const formatDuration = (ms: number | null) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/projects/${projectId}/compare`)} className="p-1.5 hover:bg-muted rounded-md transition-colors -ml-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-bold tracking-tight">
              {currentProject ? `${currentProject.name} > Compare History` : 'Compare History'}
            </h2>
          </div>
        </div>
      </PageHeader>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : jobsData?.content?.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No compare jobs history found.</div>
        ) : (
          <div className="divide-y">
            {jobsData?.content?.map((job: any) => {
              const tags = job.tags ? JSON.parse(job.tags) : [];
              return (
                <div key={job.id} onClick={() => navigate(`/projects/${projectId}/compare/${job.id}`)} className="p-5 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
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
      
      <div className="flex justify-between items-center">
        <button 
            disabled={page === 0} 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm font-medium hover:bg-muted transition-colors"
        >
            Previous
        </button>
        <span className="text-sm text-muted-foreground">Page {page + 1} of {jobsData?.totalPages || 1}</span>
        <button 
            disabled={jobsData?.last} 
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-50 text-sm font-medium hover:bg-muted transition-colors"
        >
            Next
        </button>
      </div>
    </div>
  );
}
