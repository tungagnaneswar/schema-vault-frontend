import { Skeleton } from './ui/Skeleton';

export function ProjectCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm flex flex-col justify-between h-40">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-lg" />
            <Skeleton className="w-32 h-5" />
          </div>
        </div>
        <Skeleton className="w-full h-4 mt-2" />
        <Skeleton className="w-2/3 h-4 mt-2" />
      </div>
      <div className="mt-4 pt-4 border-t flex items-center justify-between">
        <Skeleton className="w-24 h-3" />
        <Skeleton className="w-20 h-5 rounded-md" />
      </div>
    </div>
  );
}

export function ConnectionCardSkeleton() {
  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm h-48">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-9 h-9 rounded-lg" />
          <div>
            <Skeleton className="w-24 h-5 mb-2" />
            <div className="flex gap-2">
              <Skeleton className="w-12 h-4 rounded-md" />
              <Skeleton className="w-16 h-4 rounded-md" />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 mt-6">
        <Skeleton className="w-3/4 h-3" />
        <Skeleton className="w-1/2 h-3" />
        <Skeleton className="w-2/3 h-3" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 bg-card border rounded-xl shadow-sm flex items-center justify-between h-28">
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-4" />
              <Skeleton className="w-16 h-8 mt-1" />
            </div>
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
          </div>
        ))}
      </div>
      
      <div className="bg-card border rounded-xl shadow-sm p-6 mt-8">
        <Skeleton className="w-48 h-6 mb-6" />
        <div className="space-y-4">
          <Skeleton className="w-full h-10 rounded-md" />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="w-full h-12 rounded-md" />
          ))}
        </div>
      </div>
    </>
  );
}

export function SuperAdminTableSkeleton({ activeTab = 'users' }: { activeTab?: 'users' | 'logs' }) {
  return (
    <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground border-b">
            {activeTab === 'users' ? (
              <tr>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Created</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            ) : (
              <tr>
                <th className="px-6 py-3 font-medium">Time</th>
                <th className="px-6 py-3 font-medium">User</th>
                <th className="px-6 py-3 font-medium">Action</th>
                <th className="px-6 py-3 font-medium">Details</th>
                <th className="px-6 py-3 font-medium">IP / Device</th>
              </tr>
            )}
          </thead>
          <tbody className="divide-y">
            {[...Array(6)].map((_, i) => (
              <tr key={i}>
                {activeTab === 'users' ? (
                  <>
                    <td className="px-6 py-3.5"><Skeleton className="w-44 h-4" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-16 h-5 rounded-md" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-20 h-4" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-24 h-4" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-20 h-7 rounded-md" /></td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-3.5"><Skeleton className="w-32 h-4" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-40 h-4" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-20 h-5 rounded-md" /></td>
                    <td className="px-6 py-3.5"><Skeleton className="w-48 h-4" /></td>
                    <td className="px-6 py-3.5 space-y-1">
                      <Skeleton className="w-28 h-3" />
                      <Skeleton className="w-36 h-3" />
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

