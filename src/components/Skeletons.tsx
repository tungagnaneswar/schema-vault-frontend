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
