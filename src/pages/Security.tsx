import { Link } from 'react-router-dom';
import { Database, ArrowLeft, ShieldCheck, Lock, Server, Key, CheckCircle2, Cpu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';

export default function Security() {
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
            <Link to="/terms" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link to="/security" className="text-base md:text-lg font-medium text-primary font-semibold transition-colors">Security</Link>
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
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Enterprise Security
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Security Architecture</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            How SchemaVault protects your database connections, ensures zero-data inspection, and maintains enterprise compliance.
          </p>
        </div>

        {/* Security Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg w-fit mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Read-Only Metadata Isolation</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              SchemaVault requires read privileges strictly on system catalogs (<code className="text-xs bg-muted px-1.5 py-0.5 rounded">information_schema</code> and <code className="text-xs bg-muted px-1.5 py-0.5 rounded">pg_catalog</code>). It never inspects, transfers, or stores your business table row data.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
            <div className="p-3 bg-sky-500/10 text-sky-600 dark:text-sky-400 rounded-lg w-fit mb-4">
              <Key className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">AES-256 GCM Credential Encryption</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              All database connection strings and passwords are encrypted using AES-256 GCM algorithms. Secrets are decrypted in-memory only during comparison execution and never logged.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
            <div className="p-3 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg w-fit mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">TLS 1.3 Transport Security</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every database metadata connection and API communication is enforced with TLS 1.3 encryption, ensuring protection against eavesdropping and man-in-the-middle attacks.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-xs">
            <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg w-fit mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2">Comprehensive Audit Logging</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Every schema comparison, team invitation, and administrative operation is immutably logged with timestamps, IP addresses, and user identifiers for complete governance.
            </p>
          </div>
        </div>

        {/* Security Best Practices Section */}
        <div className="bg-card border border-border rounded-xl p-6 md:p-10 shadow-xs mb-12">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" /> Recommended Connection Setup
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              We recommend creating a restricted, read-only PostgreSQL user specifically for SchemaVault:
            </p>
            <pre className="bg-muted p-4 rounded-lg font-mono text-xs text-foreground overflow-x-auto border border-border">
{`-- Create a restricted read-only metadata user
CREATE USER schemavault_reader WITH PASSWORD 'your_secure_password';

-- Grant access to database metadata
GRANT CONNECT ON DATABASE target_db TO schemavault_reader;
GRANT USAGE ON SCHEMA public TO schemavault_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA information_schema TO schemavault_reader;`}
            </pre>
          </div>
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
                <li><Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link to="/security" className="hover:text-foreground transition-colors font-semibold text-foreground">Security Architecture</Link></li>
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
