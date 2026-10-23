import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { 
  Database, ArrowRight, GitMerge, Search, FileCode, Layers, 
  CheckCircle2, AlertTriangle, AlertCircle, Plus, Minus, XCircle,
  ShieldCheck, Lock, RefreshCcw, Workflow, Server, Key,
  Table2, Code, GitBranch, ArrowUp
} from 'lucide-react';

export default function Landing() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-foreground">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-18 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-lg border border-border">
              <Database className="h-6 w-6 text-foreground" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight">SchemaVault</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Product</a>
            <a href="#features" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#use-cases" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Use Cases</a>
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-base font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors shadow-xs inline-flex items-center gap-2">
                Dashboard <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-base font-medium px-4 py-2.5 hover:bg-muted hover:text-foreground rounded-md transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-base font-medium bg-primary text-primary-foreground px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors shadow-xs">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 2. HERO SECTION */}
        <section className="py-20 md:py-32 overflow-hidden relative border-b border-border">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-40"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted border border-border text-xs font-semibold uppercase tracking-wider text-foreground mb-6 shadow-2xs">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  Database Schema Management
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground leading-[1.15]">
                  Compare database schemas.<br />
                  <span className="text-muted-foreground">Know exactly what changed.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  SchemaVault helps developers compare PostgreSQL database schemas, detect structural differences, and understand changes between environments before deployment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm text-sm gap-2">
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link to="/register" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors shadow-sm text-sm">
                      Get Started
                    </Link>
                  )}
                  <a href="#how-it-works" className="inline-flex items-center justify-center bg-background text-foreground px-6 py-3 rounded-md font-medium border border-border hover:bg-muted hover:text-foreground transition-colors shadow-2xs text-sm">
                    View How It Works
                  </a>
                </div>
                
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                  Built for developers working with PostgreSQL
                </p>
              </div>

              {/* Right Column - Product Preview Mockup */}
              <div className="relative mx-auto w-full lg:max-w-none">
                <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col h-full transform lg:-rotate-1 lg:hover:rotate-0 transition-transform duration-500">
                  {/* Mock Window Header */}
                  <div className="bg-muted/60 px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400/80"></div>
                    </div>
                    <div className="text-xs font-semibold text-foreground px-3 py-1 bg-background rounded border border-border shadow-2xs">
                      Compare Schemas
                    </div>
                    <div className="w-10"></div>
                  </div>
                  
                  {/* Mock App Content */}
                  <div className="p-5 flex flex-col gap-6 bg-card">
                    {/* Environments */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-muted/30">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Server className="w-4 h-4 text-sky-500" /> Development
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Target</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Server className="w-4 h-4 text-emerald-500" /> Production
                        </div>
                      </div>
                      <button className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-4 py-2 rounded-md shadow-2xs transition-colors">
                        Compare
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-emerald-500/20 rounded-lg p-3 bg-emerald-500/10 shadow-2xs">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">12</div>
                        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1"><Plus className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Added</div>
                      </div>
                      <div className="border border-purple-500/20 rounded-lg p-3 bg-purple-500/10 shadow-2xs">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">4</div>
                        <div className="text-xs font-semibold text-purple-700 dark:text-purple-300 flex items-center gap-1"><RefreshCcw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Modified</div>
                      </div>
                      <div className="border border-rose-500/20 rounded-lg p-3 bg-rose-500/10 shadow-2xs">
                        <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-1">2</div>
                        <div className="text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-center gap-1"><Minus className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Removed</div>
                      </div>
                    </div>

                    {/* Table List Snippet */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-muted/50 px-4 py-2 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Tables Analyzed
                      </div>
                      <div className="divide-y divide-border">
                        <div className="px-4 py-3 flex items-center justify-between bg-card text-sm">
                          <div className="flex items-center gap-2 font-mono font-medium text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> users
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">IDENTICAL</span>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between bg-card text-sm">
                          <div className="flex items-center gap-2 font-mono font-medium text-foreground">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> orders
                          </div>
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">IDENTICAL</span>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between bg-amber-500/10 text-sm">
                          <div className="flex items-center gap-2 font-mono font-medium text-foreground">
                            <AlertCircle className="w-4 h-4 text-amber-500" /> products
                          </div>
                          <span className="text-[10px] bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">MODIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative subtle glow behind the card */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent blur-3xl -z-10 rounded-[3rem]"></div>
              </div>

            </div>
          </div>
        </section>

        {/* 3. PRODUCT PROBLEM SECTION */}
        <section className="py-24 bg-card border-b border-border relative overflow-hidden">
          <div className="container mx-auto px-4 text-center max-w-4xl relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Database changes are easy to miss.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-16">
              Development, staging, and production databases can gradually drift apart. Manually checking schemas makes it difficult to know exactly what changed and whether those structural differences are intentional.
            </p>

            {/* Visual Flow Diagram */}
            <div className="relative max-w-3xl mx-auto my-8">
              {/* Horizontal connecting line behind compare pill on desktop */}
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 -translate-y-1/2 h-[2px] bg-gradient-to-r from-sky-500/30 via-primary/50 to-emerald-500/30 z-0"></div>

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                {/* Dev Card */}
                <div className="flex-1 bg-card border border-sky-500/20 p-6 rounded-xl shadow-xs w-full hover:border-sky-500/40 transition-all text-center">
                  <div className="bg-sky-500/10 p-3 rounded-lg border border-sky-500/20 w-fit mx-auto mb-3">
                    <Server className="w-6 h-6 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">Development Environment</h3>
                  <span className="text-xs font-mono text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-full font-semibold inline-block mt-1">v1.4.2 (Latest)</span>
                </div>

                {/* Compare Connector Badge */}
                <div className="flex flex-col items-center shrink-0 my-2 md:my-0 z-10">
                  <div className="bg-primary text-primary-foreground text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-md border border-primary/20">
                    <Search className="w-4 h-4 text-primary-foreground" />
                    <span>Auto Compare</span>
                  </div>
                </div>

                {/* Prod Card */}
                <div className="flex-1 bg-card border border-emerald-500/20 p-6 rounded-xl shadow-xs w-full hover:border-emerald-500/40 transition-all text-center">
                  <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20 w-fit mx-auto mb-3">
                    <Server className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 text-foreground">Production Environment</h3>
                  <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold inline-block mt-1">v1.4.1 (Lagging)</span>
                </div>
              </div>
            </div>
            
            {/* Diff Highlighting Indicator */}
            <div className="mt-10 max-w-lg mx-auto bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg p-3.5 text-sm font-medium flex items-center justify-center gap-2.5 shadow-2xs">
              <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0" />
              <span>3 hidden schema drifts detected between environments</span>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT SHOWCASE */}
        <section id="product" className="py-24 bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                See the difference, not just the schema.
              </h2>
              <p className="text-lg text-muted-foreground">
                Understand changes instantly with our structured, developer-friendly comparison interface.
              </p>
            </div>

            {/* Detailed UI Mockup */}
            <div className="max-w-5xl mx-auto border border-border rounded-xl bg-card shadow-lg overflow-hidden">
              <div className="border-b border-border px-4 py-3 bg-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Table2 className="w-4 h-4 text-foreground" /> Table: <span className="font-mono text-foreground font-bold">products</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-bold">DEFINITION_MISMATCH</span>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {/* Column Headers */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <div>Column Name</div>
                  <div>Status</div>
                  <div>Development</div>
                  <div>Production</div>
                </div>

                {/* Unchanged row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm">
                  <div className="font-mono font-medium flex items-center gap-2 text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> id
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded w-max">Identical</span>
                  <div className="font-mono text-xs text-muted-foreground bg-muted border border-border px-2 py-1 rounded w-max">uuid</div>
                  <div className="font-mono text-xs text-muted-foreground bg-muted border border-border px-2 py-1 rounded w-max">uuid</div>
                </div>

                {/* Added row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm bg-rose-500/5 border-l-2 border-l-rose-500">
                  <div className="font-mono font-medium flex items-center gap-2 text-foreground">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> internal_notes
                  </div>
                  <span className="text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded w-max">Missing in Target</span>
                  <div className="flex gap-1">
                    <span className="font-mono text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded font-medium">+ text</span>
                    <span className="text-[10px] bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded font-bold self-center">NULL</span>
                  </div>
                  <div className="text-rose-500 font-medium text-xs flex items-center gap-1">
                    <Minus className="w-3 h-3 text-rose-500" /> Not present
                  </div>
                </div>

                {/* Type changed row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm bg-purple-500/5 border-l-2 border-l-purple-500">
                  <div className="font-mono font-medium flex items-center gap-2 text-foreground">
                    <AlertCircle className="w-4 h-4 text-purple-500 shrink-0" /> sku_code
                  </div>
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded w-max">Type Mismatch</span>
                  <div className="flex gap-1">
                    <span className="font-mono text-xs bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-1 rounded font-semibold">text</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-mono text-xs bg-muted border border-border text-muted-foreground px-2 py-1 rounded line-through opacity-70">varchar(50)</span>
                  </div>
                </div>

                {/* Details snippet */}
                <div className="px-6 py-4 bg-muted/20">
                  <div className="bg-card border border-border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-muted/50 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                      <span>Property</span>
                      <span>Source</span>
                      <span>Target</span>
                      <span>Risk</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center text-xs">
                      <span className="font-mono font-medium text-foreground">data_type</span>
                      <span className="font-mono text-foreground bg-muted border border-border px-1.5 py-0.5 rounded w-max">text</span>
                      <span className="font-mono text-muted-foreground">character varying</span>
                      <span className="w-max px-2.5 py-0.5 rounded-full font-bold text-[10px] text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20">REVIEW</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 5. CORE FEATURES */}
        <section id="features" className="py-24 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Everything you need to understand schema changes.
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                {
                  title: 'Schema Comparison',
                  description: 'Compare two PostgreSQL schemas and quickly identify all structural differences.',
                  icon: <GitMerge className="h-5 w-5 text-primary" />,
                  style: 'bg-muted border-border'
                },
                {
                  title: 'Difference Detection',
                  description: 'Detect added, removed, and modified database objects including tables, views, and functions.',
                  icon: <Search className="h-5 w-5 text-primary" />,
                  style: 'bg-muted border-border'
                },
                {
                  title: 'Column Changes',
                  description: 'Identify exact column additions, removals, data type changes, and constraint modifications.',
                  icon: <Table2 className="h-5 w-5 text-purple-500" />,
                  style: 'bg-purple-500/10 border-purple-500/20'
                },
                {
                  title: 'Clear Comparison Results',
                  description: 'Review differences through an easy-to-understand, tabular comparison interface.',
                  icon: <FileCode className="h-5 w-5 text-emerald-500" />,
                  style: 'bg-emerald-500/10 border-emerald-500/20'
                },
                {
                  title: 'Environment Verification',
                  description: 'Check whether your development, staging, and production schemas are perfectly aligned.',
                  icon: <Layers className="h-5 w-5 text-primary" />,
                  style: 'bg-muted border-border'
                },
                {
                  title: 'Schema Snapshots',
                  description: 'Capture point-in-time states of your database structure for future comparison and auditing.',
                  icon: <Database className="h-5 w-5 text-primary" />,
                  style: 'bg-muted border-border'
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-border bg-background shadow-2xs hover:shadow-md hover:border-primary/40 transition-all">
                  <div className={`mb-4 h-10 w-10 rounded-lg border flex items-center justify-center ${feature.style}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HOW SCHEMAVAULT WORKS */}
        <section id="how-it-works" className="py-24 bg-muted/30 border-b border-border overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight">How SchemaVault works</h2>
            </div>

            <div className="max-w-4xl mx-auto relative">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-[2px] bg-gradient-to-r from-border via-border to-emerald-500/50 z-0"></div>

              <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {[
                  {
                    step: '01',
                    title: 'Connect databases',
                    description: 'Provide the required PostgreSQL connection information for your environments.',
                    stepStyle: 'bg-card border-border text-foreground'
                  },
                  {
                    step: '02',
                    title: 'Compare schemas',
                    description: 'Select the source and target schemas you wish to evaluate and run the comparison.',
                    stepStyle: 'bg-card border-border text-foreground'
                  },
                  {
                    step: '03',
                    title: 'Review differences',
                    description: 'Understand exactly what was added, removed, or modified in the results interface.',
                    stepStyle: 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center relative">
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold mb-6 shadow-2xs z-10 relative ${item.stepStyle}`}>
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. USE CASES */}
        <section id="use-cases" className="py-24 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Useful wherever database schemas change.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="border border-border p-6 rounded-xl bg-background hover:border-primary/40 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-muted border border-border p-2.5 rounded-lg text-foreground">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">Development → Staging</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-muted text-foreground border border-border px-2 py-0.5 rounded">DEV</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Verify that your staging environment exactly matches the expected development schema before broader testing.</p>
              </div>

              <div className="border border-border p-6 rounded-xl bg-background hover:border-primary/40 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-lg text-emerald-500">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">Staging → Production</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">PROD</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Review schema differences safely before pushing deployments to your live production databases.</p>
              </div>

              <div className="border border-border p-6 rounded-xl bg-background hover:border-primary/40 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-lg text-purple-500">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">Team Development</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">TEAM</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Understand the exact structural changes made by other developers sharing the same database instances.</p>
              </div>

              <div className="border border-border p-6 rounded-xl bg-background hover:border-primary/40 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg text-amber-500">
                      <RefreshCcw className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-foreground">Migration Validation</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">ORM</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Verify that running your ORM or SQL migrations produced the exact target schema you anticipated.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DEVELOPER-FIRST SECTION */}
        <section className="py-24 bg-slate-950 text-slate-100">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6 text-white">
                  Built around how developers actually work.
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  We focus exclusively on providing precise, actionable reporting for PostgreSQL environments, without unnecessary abstractions.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">Native PostgreSQL parsing for accurate object resolution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">Clear, granular difference reporting down to column attributes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-300">Environment-based comparison for realistic deployment checks</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-5 font-mono text-[13px] text-slate-300 shadow-2xl leading-relaxed">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-slate-400" /> <span>diff_output.json</span>
                  </div>
                  <span className="text-[10px] bg-slate-800/60 text-slate-400 px-2 py-0.5 rounded font-mono border border-slate-700">POSTGRESQL</span>
                </div>
                <div className="space-y-1">
                  <div>&#123;</div>
                  <div className="pl-4">
                    <span className="text-slate-400">"tableName"</span>: <span className="text-slate-200">"users"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">"status"</span>: <span className="text-amber-400">"MODIFIED"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-slate-400">"columnDiffs"</span>: [
                  </div>
                  <div className="pl-8 text-emerald-400/90 bg-emerald-500/10 -mx-4 px-4 py-0.5 rounded border-l-2 border-emerald-400">
                    + &#123; <span className="text-slate-400">"column"</span>: <span className="text-emerald-300">"last_login"</span>, <span className="text-slate-400">"type"</span>: <span className="text-emerald-300">"timestamptz"</span> &#125;
                  </div>
                  <div className="pl-8 text-purple-300/90 bg-purple-500/10 -mx-4 px-4 py-0.5 rounded border-l-2 border-purple-400">
                    ~ &#123; <span className="text-slate-400">"column"</span>: <span className="text-amber-300">"role"</span>, <span className="text-slate-400">"type"</span>: <span className="text-slate-500 line-through">"varchar"</span> &rarr; <span className="text-purple-300">"user_role"</span> &#125;
                  </div>
                  <div className="pl-8 text-rose-400/90 bg-rose-500/10 -mx-4 px-4 py-0.5 rounded border-l-2 border-rose-400">
                    - &#123; <span className="text-slate-400">"column"</span>: <span className="text-rose-300">"legacy_id"</span> &#125;
                  </div>
                  <div className="pl-4">]</div>
                  <div>&#125;</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. SECURITY / TRUST SECTION */}
        <section className="py-24 bg-card border-b border-border">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight mb-8">
              Your database structure, clearly understood.
            </h2>
            <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Authentication
              </div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" /> Role-based access
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Secure connections
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="py-24 relative overflow-hidden bg-muted/30">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl p-10 md:p-12 text-center shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
                Stop guessing what changed.
              </h2>
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                Compare your database schemas and understand the differences clearly before they become issues.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium transition-colors text-sm shadow-sm gap-2">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-md font-medium transition-colors text-sm shadow-sm">
                      Get Started
                    </Link>
                    <Link to="/login" className="inline-flex items-center justify-center bg-background text-foreground px-8 py-3 rounded-md font-medium border border-border hover:bg-muted transition-colors text-sm shadow-2xs">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 11. FOOTER */}
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
                <li><a href="#product" className="hover:text-foreground transition-colors">Interactive Demo</a></li>
                <li><a href="#features" className="hover:text-foreground transition-colors">Core Features</a></li>
                <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a></li>
                <li><a href="#use-cases" className="hover:text-foreground transition-colors">Use Cases</a></li>
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
                <li><Link to="/security" className="hover:text-foreground transition-colors">Security Architecture</Link></li>
                <li><Link to="/changelog" className="hover:text-foreground transition-colors">Changelog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground flex items-center justify-center">
            <div className="text-center">&copy; {new Date().getFullYear()} SchemaVault. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showTopBtn && (
        <button
          onClick={goToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
