import { AlertTriangle, RefreshCcw } from 'lucide-react';

export function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="h-full w-full flex items-center justify-center p-6 min-h-[400px]">
      <div className="bg-card border rounded-xl p-8 max-w-md w-full shadow-lg text-center">
        <div className="mx-auto w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-6">
          We're sorry, an unexpected error occurred while loading this page.
        </p>
        
        {import.meta.env.NODE_ENV === 'development' && (
          <div className="bg-muted p-4 rounded-md text-left overflow-auto mb-6">
            <p className="text-xs font-mono text-rose-500 font-semibold mb-1">Error Details:</p>
            <pre className="text-[10px] font-mono text-muted-foreground break-all whitespace-pre-wrap">
              {error.message}
            </pre>
          </div>
        )}

        <button
          onClick={resetErrorBoundary}
          className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    </div>
  );
}
