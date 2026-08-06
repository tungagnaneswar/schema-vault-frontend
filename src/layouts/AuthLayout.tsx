import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SchemaDiff <span className="text-primary">Secure</span></h1>
          <p className="text-sm text-muted-foreground mt-2">Enterprise PostgreSQL & MySQL Schema Comparison</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
