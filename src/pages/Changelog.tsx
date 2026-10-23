import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Database, ArrowLeft, Clock, Tag, ChevronDown, ChevronUp, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { type RootState } from '../store/store';
import { useChangelog, CATEGORY_CONFIG, type ChangeCategory, type Release } from '../hooks/useChangelog';

// ─── Helper: parse bold markdown **text** inline ─────────────────────────────

function parseInlineBold(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

// ─── Release Card ─────────────────────────────────────────────────────────────

function ReleaseCard({ release, isOpen, onToggle }: { release: Release; isOpen: boolean; onToggle: () => void }) {

  const formattedDate = new Date(release.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id={`v${release.version}`}
      className={`relative border rounded-xl overflow-hidden transition-all duration-200 ${
        release.isLatest
          ? 'border-primary/30 bg-primary/[0.03] shadow-md shadow-primary/5'
          : 'border-border bg-card'
      }`}
    >
      {/* Timeline dot */}
      <div className="absolute left-0 top-7 w-0.5 h-full bg-border -translate-x-full hidden lg:block" />

      {/* Card header */}
      <button
        onClick={() => onToggle()}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-muted/40 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-wrap">
          {/* Version badge */}
          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-mono font-bold text-lg tracking-tight">v{release.version}</span>
          </div>

          {release.isLatest && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              Latest
            </span>
          )}

          {/* Date */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>

          {/* Category pills preview */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {release.changes.map((c) => {
              const cfg = CATEGORY_CONFIG[c.category];
              return (
                <span
                  key={c.category}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.color} ${cfg.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                  {c.category}
                  <span className="opacity-60">({c.items.length})</span>
                </span>
              );
            })}
          </div>
        </div>

        <span className="text-muted-foreground flex-shrink-0">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {/* Card body */}
      {isOpen && (
        <div className="px-6 pb-6 space-y-5 border-t border-border/50">
          {release.changes.map((changeGroup) => {
            const cfg = CATEGORY_CONFIG[changeGroup.category];
            return (
              <div key={changeGroup.category} className="pt-5">
                {/* Category heading */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border mb-3 ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} inline-block`} />
                  {changeGroup.category}
                </div>

                {/* Items */}
                <ul className="space-y-2">
                  {changeGroup.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot} opacity-70`} />
                      <span className="leading-relaxed">{parseInlineBold(item)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Version Jump Nav ─────────────────────────────────────────────────────────

function VersionNav({ releases, onVersionClick }: { releases: Release[]; onVersionClick: (version: string) => void }) {
  const [activeVersion, setActiveVersion] = useState<string>(releases[0]?.version ?? '');

  // Highlight the nav item that's currently in view
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    releases.forEach((r) => {
      const el = document.getElementById(`v${r.version}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveVersion(r.version); },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [releases]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, version: string) => {
    e.preventDefault();
    onVersionClick(version);
    const el = document.getElementById(`v${version}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="hidden lg:block sticky top-24 w-48 flex-shrink-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Releases</p>
      <nav className="space-y-1">
        {releases.map((r) => (
          <a
            key={r.version}
            href={`#v${r.version}`}
            onClick={(e) => handleClick(e, r.version)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
              activeVersion === r.version
                ? 'text-primary font-semibold bg-primary/10'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <span className="font-mono">v{r.version}</span>
            {r.isLatest && <Sparkles className="w-3 h-3" />}
          </a>
        ))}
      </nav>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ChangelogSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border rounded-xl p-6 bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-5 w-20 bg-muted rounded" />
            <div className="h-5 w-16 bg-muted rounded-full" />
            <div className="h-5 w-28 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
            <div className="h-4 w-5/6 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Changelog() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { releases, loading, error } = useChangelog();

  // Track which release cards are open; default: only the latest
  const [openVersions, setOpenVersions] = useState<Set<string>>(new Set());

  // Once releases load, open the latest by default
  useEffect(() => {
    if (releases.length > 0) {
      setOpenVersions(new Set([releases[0].version]));
    }
  }, [releases]);

  const toggleVersion = (version: string) => {
    setOpenVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version);
      else next.add(version);
      return next;
    });
  };

  // Called by VersionNav: open the card AND scroll to it
  const handleVersionClick = (version: string) => {
    setOpenVersions((prev) => {
      const next = new Set(prev);
      next.add(version); // always open on jump
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col">
      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-18 md:h-20 flex items-center justify-between max-w-7xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-muted p-2 rounded-lg border border-border">
              <Database className="h-6 w-6 text-foreground" />
            </div>
            <span className="font-bold text-xl md:text-2xl tracking-tight">SchemaVault</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/#product" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Product</Link>
            <Link to="/changelog" className="text-base md:text-lg font-medium text-primary font-semibold transition-colors">Changelog</Link>
            <Link to="/security" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Security</Link>
            <Link to="/privacy" className="text-base md:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
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

      {/* ── CONTENT ── */}
      <main className="flex-1 container mx-auto px-4 py-10 md:py-14 max-w-7xl">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="w-4 h-4" />
            What's New
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Changelog</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
            Track every update, improvement, and fix shipped to SchemaVault. We ship continuously — here's the full record.
          </p>
        </div>

        {/* Body: nav + releases */}
        <div className="flex gap-10 items-start">
          {/* Sticky version nav (desktop only) */}
          {!loading && !error && releases.length > 0 && (
            <VersionNav releases={releases} onVersionClick={handleVersionClick} />
          )}

          {/* Release list */}
          <div className="flex-1 min-w-0">
            {loading && <ChangelogSkeleton />}

            {error && (
              <div className="flex items-center gap-3 p-5 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Failed to load changelog</p>
                  <p className="text-sm opacity-80 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && releases.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Loader2 className="w-8 h-8 mx-auto mb-3 animate-spin opacity-50" />
                <p>No releases found.</p>
              </div>
            )}

            {!loading && !error && releases.length > 0 && (
              <div className="space-y-4">
                {releases.map((release) => (
                  <ReleaseCard
                    key={release.version}
                    release={release}
                    isOpen={openVersions.has(release.version)}
                    onToggle={() => toggleVersion(release.version)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer note */}
        {!loading && !error && releases.length > 0 && (
          <p className="text-center text-xs text-muted-foreground mt-12">
            Older releases are available on{' '}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              GitHub Releases
            </a>
            .
          </p>
        )}
      </main>
    </div>
  );
}
