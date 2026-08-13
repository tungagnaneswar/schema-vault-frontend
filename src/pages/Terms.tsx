import { Link } from 'react-router-dom';
import { Database, ArrowLeft, FileCheck, Scale, AlertCircle, ShieldCheck } from 'lucide-react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

export default function Terms() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-18 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-lg border border-border">
              <Database className="h-6 w-6 text-foreground" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight">SchemaVault</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/#product" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Product</Link>
            <Link to="/privacy" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="text-base md:text-lg font-medium text-primary font-semibold transition-colors">Terms</Link>
            <Link to="/security" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Security</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Home
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-base font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors shadow-xs">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-base font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors shadow-xs">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-12 md:py-16 max-w-4xl">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Scale className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Last Updated: August 13, 2026
          </p>
        </div>

        <div className="space-y-8 bg-card border border-border rounded-xl p-6 md:p-10 shadow-xs leading-relaxed text-sm md:text-base mb-12">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" /> 1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground">
              By accessing or using SchemaVault, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use our services.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> 2. Account Registration & Security
            </h2>
            <p className="text-muted-foreground">
              To utilize SchemaVault services, you must register for an account with valid credentials. You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your user account.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Scale className="w-5 h-5 text-primary" /> 3. Permitted Use & Restrictions
            </h2>
            <p className="text-muted-foreground">
              SchemaVault grants you a limited, non-exclusive, non-transferable license to analyze database schema structures. You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Reverse engineer, decompile, or disassemble any component of the SchemaVault comparison engine.</li>
              <li>Attempt unauthorized access to other users&apos; projects, database connection credentials, or audit logs.</li>
              <li>Use the service for illegal activities or in violation of applicable data privacy laws.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" /> 4. Disclaimers & Remediation Scripts
            </h2>
            <p className="text-muted-foreground">
              SchemaVault auto-generates PostgreSQL DDL remediation scripts based on system metadata comparisons. While our engine strives for maximum safety, you are solely responsible for reviewing and testing all generated DDL statements in staging environments before executing them on production databases.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-primary" /> 5. Modifications to Service
            </h2>
            <p className="text-muted-foreground">
              SchemaVault reserves the right to modify, suspend, or discontinue any feature or service at any time with prior notice. Continued use of the platform constitutes acceptance of updated terms.
            </p>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="pt-16 pb-8 border-t border-border bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            {/* Brand Column */}
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-muted p-2 rounded-lg border border-border">
                  <Database className="h-5 w-5 text-foreground" />
                </div>
                <span className="font-bold text-xl tracking-tight">SchemaVault</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-4">
                PostgreSQL database schema comparison engine. Detect structural drift, verify environments, and deploy migrations safely.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                All Systems Operational
              </div>
            </div>
            
            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/#product" className="hover:text-foreground transition-colors">Interactive Demo</Link></li>
                <li><Link to="/#features" className="hover:text-foreground transition-colors">Core Features</Link></li>
                <li><Link to="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
                <li><Link to="/#use-cases" className="hover:text-foreground transition-colors">Use Cases</Link></li>
              </ul>
            </div>
            
            {/* Account & Platform */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Account</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {isAuthenticated ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
                    <li><Link to="/projects" className="hover:text-foreground transition-colors">Projects</Link></li>
                    <li><Link to="/profile" className="hover:text-foreground transition-colors">Profile Settings</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-foreground transition-colors">Sign In</Link></li>
                    <li><Link to="/register" className="hover:text-foreground transition-colors">Create Account</Link></li>
                    <li><Link to="/auth/forgot-password" className="hover:text-foreground transition-colors">Reset Password</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Legal & Security */}
            <div>
              <h4 className="font-semibold text-sm mb-4 text-foreground">Trust &amp; Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors font-semibold text-foreground">Terms of Service</Link></li>
                <li><Link to="/security" className="hover:text-foreground transition-colors">Security Architecture</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground flex items-center justify-center">
            <div className="text-center">&copy; {new Date().getFullYear()} SchemaVault. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
