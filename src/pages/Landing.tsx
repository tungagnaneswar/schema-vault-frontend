import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { 
  Database, ArrowRight, GitMerge, Search, FileCode, Layers, 
  CheckCircle2, AlertTriangle, AlertCircle, Plus, Minus, XCircle,
  ShieldCheck, Lock, RefreshCcw, Workflow, Server, Key,
  Table2, Code, GitBranch
} from 'lucide-react';

export default function Landing() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-orange-500/20 selection:text-orange-600">
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-100">
              <Database className="h-5 w-5 text-[#EA580C]" />
            </div>
            <span className="font-bold text-lg tracking-tight">SchemaVault</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#product" className="text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors">Product</a>
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors">How It Works</a>
            <a href="#use-cases" className="text-sm font-medium text-muted-foreground hover:text-orange-600 transition-colors">Use Cases</a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="text-sm font-medium bg-[#EA580C] text-white px-4 py-2 rounded-md hover:bg-[#C2410C] transition-colors shadow-xs inline-flex items-center gap-1.5">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium px-4 py-2 hover:bg-orange-50/50 hover:text-orange-600 rounded-md transition-colors">
                  Login
                </Link>
                <Link to="/register" className="text-sm font-medium bg-[#EA580C] text-white px-4 py-2 rounded-md hover:bg-[#C2410C] transition-colors shadow-xs">
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
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ea580c08_1px,transparent_1px),linear-gradient(to_bottom,#ea580c08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column */}
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-xs font-semibold uppercase tracking-wider text-orange-700 mb-6 shadow-2xs">
                  <Database className="w-3.5 h-3.5 text-orange-600" />
                  Database Schema Management
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground leading-[1.15]">
                  Compare database schemas.<br />
                  <span className="text-slate-500">Know exactly what changed.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-xl">
                  SchemaVault helps developers compare PostgreSQL database schemas, detect structural differences, and understand changes between environments before deployment.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="inline-flex items-center justify-center bg-[#EA580C] text-white px-6 py-3 rounded-md font-medium hover:bg-[#C2410C] transition-colors shadow-sm text-sm gap-2">
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link to="/register" className="inline-flex items-center justify-center bg-[#EA580C] text-white px-6 py-3 rounded-md font-medium hover:bg-[#C2410C] transition-colors shadow-sm text-sm">
                      Get Started
                    </Link>
                  )}
                  <a href="#how-it-works" className="inline-flex items-center justify-center bg-background text-foreground px-6 py-3 rounded-md font-medium border border-border hover:bg-orange-50/50 hover:text-orange-700 hover:border-orange-200 transition-colors shadow-2xs text-sm">
                    View How It Works
                  </a>
                </div>
                
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-600" />
                  Built for developers working with PostgreSQL
                </p>
              </div>

              {/* Right Column - Product Preview Mockup */}
              <div className="relative mx-auto w-full lg:max-w-none">
                <div className="rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col h-full transform lg:-rotate-1 lg:hover:rotate-0 transition-transform duration-500">
                  {/* Mock Window Header */}
                  <div className="bg-slate-50/80 px-4 py-3 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400/60"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400/60"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400/60"></div>
                    </div>
                    <div className="text-xs font-semibold text-orange-700 px-3 py-1 bg-orange-50/80 rounded border border-orange-100 shadow-2xs">
                      Compare Schemas
                    </div>
                    <div className="w-10"></div>
                  </div>
                  
                  {/* Mock App Content */}
                  <div className="p-5 flex flex-col gap-6 bg-background">
                    {/* Environments */}
                    <div className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border bg-slate-50/40">
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Source</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Server className="w-4 h-4 text-slate-700" /> Development
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-orange-400 shrink-0" />
                      <div className="flex-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Target</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                          <Server className="w-4 h-4 text-emerald-600" /> Production
                        </div>
                      </div>
                      <button className="bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-semibold px-4 py-2 rounded-md shadow-2xs transition-colors">
                        Compare
                      </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="border border-emerald-100 rounded-lg p-3 bg-emerald-50/40 shadow-2xs">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">12</div>
                        <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1"><Plus className="w-3.5 h-3.5 text-emerald-600" /> Added</div>
                      </div>
                      <div className="border border-purple-100 rounded-lg p-3 bg-purple-50/40 shadow-2xs">
                        <div className="text-2xl font-bold text-purple-600 mb-1">4</div>
                        <div className="text-xs font-semibold text-purple-700 flex items-center gap-1"><RefreshCcw className="w-3.5 h-3.5 text-purple-600" /> Modified</div>
                      </div>
                      <div className="border border-rose-100 rounded-lg p-3 bg-rose-50/40 shadow-2xs">
                        <div className="text-2xl font-bold text-rose-600 mb-1">2</div>
                        <div className="text-xs font-semibold text-rose-700 flex items-center gap-1"><Minus className="w-3.5 h-3.5 text-rose-600" /> Removed</div>
                      </div>
                    </div>

                    {/* Table List Snippet */}
                    <div className="border border-border rounded-lg overflow-hidden">
                      <div className="bg-slate-50/80 px-4 py-2 border-b border-border text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Tables Analyzed
                      </div>
                      <div className="divide-y divide-border">
                        <div className="px-4 py-3 flex items-center justify-between bg-card text-sm">
                          <div className="flex items-center gap-2 font-mono font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> users
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold">IDENTICAL</span>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between bg-card text-sm">
                          <div className="flex items-center gap-2 font-mono font-medium text-slate-800">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> orders
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2 py-0.5 rounded-full font-bold">IDENTICAL</span>
                        </div>
                        <div className="px-4 py-3 flex items-center justify-between bg-amber-50/30 text-sm">
                          <div className="flex items-center gap-2 font-mono font-medium text-slate-800">
                            <AlertCircle className="w-4 h-4 text-amber-500" /> products
                          </div>
                          <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/80 px-2 py-0.5 rounded-full font-bold">MODIFIED</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative subtle orange glow behind the card */}
                <div className="absolute -inset-6 bg-gradient-to-tr from-orange-500/8 via-orange-500/4 to-transparent blur-3xl -z-10 rounded-[3rem]"></div>
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 max-w-3xl mx-auto">
              <div className="flex-1 bg-slate-50/50 border border-slate-200 p-6 rounded-xl shadow-2xs w-full">
                <Database className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1 text-slate-900">Development Schema</h3>
                <p className="text-xs font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full inline-block font-semibold mt-1">v1.4.2 + migrations</p>
              </div>
              
              <div className="flex flex-col items-center shrink-0">
                <div className="w-px h-8 md:w-8 md:h-px bg-border md:hidden block"></div>
                <div className="bg-[#EA580C] text-white text-xs font-bold px-4.5 py-2 rounded-full flex items-center gap-2 shadow-md z-10 my-2 md:my-0 mx-2">
                  <Search className="w-3.5 h-3.5 text-white" />
                  Compare
                </div>
                <div className="w-px h-8 md:w-8 md:h-px bg-border md:hidden block"></div>
              </div>

              <div className="flex-1 bg-emerald-50/30 border border-emerald-200/80 p-6 rounded-xl shadow-2xs w-full">
                <Database className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                <h3 className="font-semibold text-sm mb-1 text-slate-900">Production Schema</h3>
                <p className="text-xs font-mono text-emerald-700 bg-emerald-100/60 px-2.5 py-1 rounded-full inline-block font-semibold mt-1">v1.4.1</p>
              </div>
            </div>
            
            {/* Diff highlighting indicator */}
            <div className="mt-8 max-w-lg mx-auto bg-rose-50 border border-rose-200 text-rose-700 rounded-lg p-3 text-sm font-medium flex items-center justify-center gap-2 shadow-2xs">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>3 hidden schema drifts detected</span>
            </div>
          </div>
        </section>

        {/* 4. PRODUCT SHOWCASE */}
        <section id="product" className="py-24 bg-slate-50/50 border-b border-border">
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
              <div className="border-b border-border px-4 py-3 bg-slate-50/80 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                  <Table2 className="w-4 h-4 text-orange-600" /> Table: <span className="font-mono text-slate-900 font-bold">products</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold">DEFINITION_MISMATCH</span>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {/* Column Headers */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground bg-slate-50/60">
                  <div>Column Name</div>
                  <div>Status</div>
                  <div>Development</div>
                  <div>Production</div>
                </div>

                {/* Unchanged row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm">
                  <div className="font-mono font-medium flex items-center gap-2 text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> id
                  </div>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded w-max">Identical</span>
                  <div className="font-mono text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded w-max">uuid</div>
                  <div className="font-mono text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded w-max">uuid</div>
                </div>

                {/* Added row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm bg-rose-50/40 border-l-2 border-l-rose-500">
                  <div className="font-mono font-medium flex items-center gap-2 text-slate-900">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" /> internal_notes
                  </div>
                  <span className="text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded w-max">Missing in Target</span>
                  <div className="flex gap-1">
                    <span className="font-mono text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded font-medium">+ text</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-bold self-center">NULL</span>
                  </div>
                  <div className="text-rose-600 font-medium text-xs flex items-center gap-1">
                    <Minus className="w-3 h-3 text-rose-500" /> Not present
                  </div>
                </div>

                {/* Type changed row */}
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center text-sm bg-purple-50/40 border-l-2 border-l-purple-500">
                  <div className="font-mono font-medium flex items-center gap-2 text-slate-900">
                    <AlertCircle className="w-4 h-4 text-purple-600 shrink-0" /> sku_code
                  </div>
                  <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded w-max">Type Mismatch</span>
                  <div className="flex gap-1">
                    <span className="font-mono text-xs bg-purple-50 border border-purple-200 text-purple-700 px-2 py-1 rounded font-semibold">text</span>
                  </div>
                  <div className="flex gap-1">
                    <span className="font-mono text-xs bg-slate-100 border border-slate-200 text-slate-500 px-2 py-1 rounded line-through opacity-70">varchar(50)</span>
                  </div>
                </div>

                {/* Details snippet */}
                <div className="px-6 py-4 bg-slate-50/30">
                  <div className="bg-background border border-border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border">
                      <span>Property</span>
                      <span>Source</span>
                      <span>Target</span>
                      <span>Risk</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 px-4 py-3 items-center text-xs">
                      <span className="font-mono font-medium text-slate-800">data_type</span>
                      <span className="font-mono text-orange-700 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded w-max">text</span>
                      <span className="font-mono text-slate-600">character varying</span>
                      <span className="w-max px-2.5 py-0.5 rounded-full font-bold text-[10px] text-amber-700 bg-amber-50 border border-amber-200">REVIEW</span>
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
                  icon: <GitMerge className="h-5 w-5 text-orange-600" />,
                  style: 'bg-orange-50 border-orange-100'
                },
                {
                  title: 'Difference Detection',
                  description: 'Detect added, removed, and modified database objects including tables, views, and functions.',
                  icon: <Search className="h-5 w-5 text-orange-600" />,
                  style: 'bg-orange-50 border-orange-100'
                },
                {
                  title: 'Column Changes',
                  description: 'Identify exact column additions, removals, data type changes, and constraint modifications.',
                  icon: <Table2 className="h-5 w-5 text-purple-600" />,
                  style: 'bg-purple-50 border-purple-100'
                },
                {
                  title: 'Clear Comparison Results',
                  description: 'Review differences through an easy-to-understand, tabular comparison interface.',
                  icon: <FileCode className="h-5 w-5 text-emerald-600" />,
                  style: 'bg-emerald-50 border-emerald-100'
                },
                {
                  title: 'Environment Verification',
                  description: 'Check whether your development, staging, and production schemas are perfectly aligned.',
                  icon: <Layers className="h-5 w-5 text-orange-600" />,
                  style: 'bg-orange-50 border-orange-100'
                },
                {
                  title: 'Schema Snapshots',
                  description: 'Capture point-in-time states of your database structure for future comparison and auditing.',
                  icon: <Database className="h-5 w-5 text-orange-600" />,
                  style: 'bg-orange-50 border-orange-100'
                }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 rounded-xl border border-border bg-background shadow-2xs hover:shadow-md hover:border-orange-200 transition-all">
                  <div className={`mb-4 h-10 w-10 rounded-lg border flex items-center justify-center ${feature.style}`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. HOW SCHEMAVAULT WORKS */}
        <section id="how-it-works" className="py-24 bg-slate-50/50 border-b border-border overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-20">
              <h2 className="text-3xl font-bold tracking-tight">How SchemaVault works</h2>
            </div>

            <div className="max-w-4xl mx-auto relative">
              {/* Desktop Connecting Line */}
              <div className="hidden md:block absolute top-6 left-20 right-20 h-[2px] bg-gradient-to-r from-orange-200 via-orange-200 to-emerald-200 opacity-60"></div>

              <div className="grid md:grid-cols-3 gap-12 relative z-10">
                {[
                  {
                    step: '01',
                    title: 'Connect databases',
                    description: 'Provide the required PostgreSQL connection information for your environments.',
                    stepStyle: 'bg-orange-50 border-orange-200 text-orange-700'
                  },
                  {
                    step: '02',
                    title: 'Compare schemas',
                    description: 'Select the source and target schemas you wish to evaluate and run the comparison.',
                    stepStyle: 'bg-orange-50 border-orange-200 text-orange-700'
                  },
                  {
                    step: '03',
                    title: 'Review differences',
                    description: 'Understand exactly what was added, removed, or modified in the results interface.',
                    stepStyle: 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left relative">
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center text-sm font-bold mb-6 shadow-2xs ${item.stepStyle}`}>
                      {item.step}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-slate-900">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
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
              <div className="border border-border p-6 rounded-xl bg-background hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 border border-orange-100 p-2.5 rounded-lg text-orange-600">
                      <GitBranch className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Development → Staging</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-orange-50 text-orange-700 border border-orange-100 px-2 py-0.5 rounded">DEV</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Verify that your staging environment exactly matches the expected development schema before broader testing.</p>
              </div>

              <div className="border border-border p-6 rounded-xl bg-background hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-emerald-600">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Staging → Production</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">PROD</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Review schema differences safely before pushing deployments to your live production databases.</p>
              </div>

              <div className="border border-border p-6 rounded-xl bg-background hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-50 border border-purple-100 p-2.5 rounded-lg text-purple-600">
                      <Workflow className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Team Development</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 rounded">TEAM</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Understand the exact structural changes made by other developers sharing the same database instances.</p>
              </div>

              <div className="border border-border p-6 rounded-xl bg-background hover:border-slate-300 transition-all shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-lg text-amber-600">
                      <RefreshCcw className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Migration Validation</h3>
                  </div>
                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">ORM</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">Verify that running your ORM or SQL migrations produced the exact target schema you anticipated.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. DEVELOPER-FIRST SECTION */}
        <section className="py-24 bg-slate-950 text-background">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-6">
                  Built around how developers actually work.
                </h2>
                <p className="text-background/70 mb-8 leading-relaxed">
                  We focus exclusively on providing precise, actionable reporting for PostgreSQL environments, without unnecessary abstractions.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-background/90">Native PostgreSQL parsing for accurate object resolution</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-background/90">Clear, granular difference reporting down to column attributes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-background/90">Environment-based comparison for realistic deployment checks</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#0D1117] border border-slate-800 rounded-xl p-5 font-mono text-[13px] text-slate-300 shadow-2xl leading-relaxed">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-orange-400" /> <span>diff_output.json</span>
                  </div>
                  <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-mono border border-orange-500/20">POSTGRESQL</span>
                </div>
                <div className="space-y-1">
                  <div>&#123;</div>
                  <div className="pl-4">
                    <span className="text-orange-400">"tableName"</span>: <span className="text-slate-200">"users"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-orange-400">"status"</span>: <span className="text-amber-400">"MODIFIED"</span>,
                  </div>
                  <div className="pl-4">
                    <span className="text-orange-400">"columnDiffs"</span>: [
                  </div>
                  <div className="pl-8 text-emerald-400/90 bg-emerald-500/10 -mx-4 px-4 py-0.5 rounded border-l-2 border-emerald-400">
                    + &#123; <span className="text-orange-300">"column"</span>: <span className="text-emerald-300">"last_login"</span>, <span className="text-orange-300">"type"</span>: <span className="text-emerald-300">"timestamptz"</span> &#125;
                  </div>
                  <div className="pl-8 text-purple-300/90 bg-purple-500/10 -mx-4 px-4 py-0.5 rounded border-l-2 border-purple-400">
                    ~ &#123; <span className="text-orange-300">"column"</span>: <span className="text-amber-300">"role"</span>, <span className="text-orange-300">"type"</span>: <span className="text-slate-400 line-through">"varchar"</span> &rarr; <span className="text-purple-300">"user_role"</span> &#125;
                  </div>
                  <div className="pl-8 text-rose-400/90 bg-rose-500/10 -mx-4 px-4 py-0.5 rounded border-l-2 border-rose-400">
                    - &#123; <span className="text-orange-300">"column"</span>: <span className="text-rose-300">"legacy_id"</span> &#125;
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
                <Lock className="w-4 h-4 text-orange-600" /> Authentication
              </div>
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-orange-600" /> Role-based access
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-600" /> Secure connections
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="py-24 relative overflow-hidden bg-slate-50/60">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto bg-[#FFF7ED] border border-orange-100 rounded-2xl p-12 text-center shadow-md">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">
                Stop guessing what changed.
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Compare your database schemas and understand the differences clearly before they become issues.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="inline-flex items-center justify-center bg-[#EA580C] hover:bg-[#C2410C] text-white px-8 py-3 rounded-md font-medium transition-colors text-sm shadow-sm gap-2">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="inline-flex items-center justify-center bg-[#EA580C] hover:bg-[#C2410C] text-white px-8 py-3 rounded-md font-medium transition-colors text-sm shadow-sm">
                      Get Started
                    </Link>
                    <Link to="/login" className="inline-flex items-center justify-center bg-white text-foreground px-8 py-3 rounded-md font-medium border border-border hover:bg-slate-50 transition-colors text-sm shadow-2xs">
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
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-orange-50 p-1.5 rounded-lg border border-orange-100">
                  <Database className="h-4 w-4 text-[#EA580C]" />
                </div>
                <span className="font-bold text-lg tracking-tight">SchemaVault</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Database schema comparison for developers. Understand exact structural changes between PostgreSQL environments.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-orange-600 transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-orange-600 transition-colors">How It Works</a></li>
                <li><a href="#use-cases" className="hover:text-orange-600 transition-colors">Use Cases</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Account</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                {isAuthenticated ? (
                  <>
                    <li><Link to="/dashboard" className="hover:text-orange-600 transition-colors">Dashboard</Link></li>
                    <li><Link to="/projects" className="hover:text-orange-600 transition-colors">Projects</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/login" className="hover:text-orange-600 transition-colors">Login</Link></li>
                    <li><Link to="/register" className="hover:text-orange-600 transition-colors">Register</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-orange-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border/50 text-sm text-muted-foreground flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="text-center">&copy; {new Date().getFullYear()} SchemaVault. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
