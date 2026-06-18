import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getCompareJobs } from '../api/compareApi';
import PageHeader from '../components/PageHeader';
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getProjects } from '../api/projectsApi';

export default function CompareHistory() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);

  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['compareJobs', page],
    queryFn: () => getCompareJobs(page, 10)
  });

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const currentProject = projects?.find(p => p.id === Number(projectId));

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/projects/${projectId}/compare`)} className="p-1.5 hover:bg-muted rounded-md transition-colors -ml-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-bold tracking-tight">
              {currentProject ? `${currentProject.name} — Compare History` : 'Compare History'}
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
            {jobsData?.content?.map((job: any) => (
              <div key={job.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  {job.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : job.status === 'FAILED' ? (
                    <AlertCircle className="w-5 h-5 text-rose-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-amber-500 animate-pulse" />
                  )}
                  <div>
                    <h4 className="font-semibold text-sm">Job #{job.id}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Source Snapshot ID: {job.sourceSnapshotId} &rarr; Target Snapshot ID: {job.targetSnapshotId}
                    </p>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <p>{new Date(job.startedAt).toLocaleString()}</p>
                  <p className="mt-0.5 capitalize">{job.status.toLowerCase()}</p>
                </div>
              </div>
            ))}
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
