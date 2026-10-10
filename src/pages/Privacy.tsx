import { Link } from 'react-router-dom';
import { Database, ArrowLeft, ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

export default function Privacy() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* HEADER  */}
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
            <Link to="/privacy" className="text-base md:text-lg font-medium text-primary font-semibold transition-colors">Privacy</Link>
            <Link to="/terms" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Security & Privacy First
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Last Updated: August 13, 2026
          </p>
        </div>

        <div className="space-y-8 bg-card border border-border rounded-xl p-6 md:p-10 shadow-xs leading-relaxed text-sm md:text-base mb-12">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" /> 1. Commitment to Data Privacy
            </h2>
            <p className="text-muted-foreground">
              At SchemaVault, we understand the critical nature of your database structures. Our platform is strictly designed around zero-data inspection principles: we only read database metadata required for schema analysis and never touch, read, store, or transmit your actual business data rows.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" /> 2. Information We Collect
            </h2>
            <p className="text-muted-foreground">
              When you use SchemaVault, we collect the following limited information:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Account Details:</strong> Email address, hashed password, and role information necessary for user authentication and authorization.</li>
              <li><strong>Schema Metadata:</strong> Structure identifiers, table names, column data types, constraints, index definitions, and sequence properties obtained via PostgreSQL system catalogs (<code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">information_schema</code>).</li>
              <li><strong>Audit Logs:</strong> Operational activity timestamps, IP addresses, and user-agent information stored strictly for system security and audit compliance.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> 3. How We Protect Your Connection Credentials
            </h2>
            <p className="text-muted-foreground">
              Database connection details are encrypted at rest using AES-256 GCM encryption algorithms. Decryption keys are stored separately in secret vaults with strict role-based access constraints. Connection metadata is never shared with third parties.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> 4. Data Retention & Erasure
            </h2>
            <p className="text-muted-foreground">
              You retain full ownership of your project, connection, and comparison data. You can delete projects, connection strings, or your account at any time from your control dashboard. Upon deletion request, all associated configuration data is permanently purged from active databases.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-border">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> 5. Contact Us
            </h2>
            <p className="text-muted-foreground">
              If you have any questions or security inquiries regarding our privacy policy, please contact our security team at <a href="mailto:privacy@schemavault.io" className="text-primary underline hover:text-primary/80">privacy@schemavault.io</a>.
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
                <li><Link to="/privacy" className="hover:text-foreground transition-colors font-semibold text-foreground">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
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
