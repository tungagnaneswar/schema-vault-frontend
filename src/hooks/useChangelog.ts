import { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChangeCategory = 'Added' | 'Improved' | 'Fixed' | 'Security' | 'Breaking' | 'Deprecated' | 'Removed';

export interface ChangeEntry {
  category: ChangeCategory;
  items: string[];
}

export interface Release {
  version: string;
  date: string;
  isLatest: boolean;
  changes: ChangeEntry[];
}

// ─── Category Config ─────────────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<ChangeCategory, { color: string; bg: string; border: string; dot: string }> = {
  Added:      { color: 'text-emerald-600 dark:text-emerald-400',  bg: 'bg-emerald-500/10',  border: 'border-emerald-500/20',  dot: 'bg-emerald-500' },
  Improved:   { color: 'text-blue-600 dark:text-blue-400',        bg: 'bg-blue-500/10',     border: 'border-blue-500/20',     dot: 'bg-blue-500' },
  Fixed:      { color: 'text-amber-600 dark:text-amber-400',      bg: 'bg-amber-500/10',    border: 'border-amber-500/20',    dot: 'bg-amber-500' },
  Security:   { color: 'text-red-600 dark:text-red-400',          bg: 'bg-red-500/10',      border: 'border-red-500/20',      dot: 'bg-red-500' },
  Breaking:   { color: 'text-orange-600 dark:text-orange-400',    bg: 'bg-orange-500/10',   border: 'border-orange-500/20',   dot: 'bg-orange-500' },
  Deprecated: { color: 'text-slate-600 dark:text-slate-400',      bg: 'bg-slate-500/10',    border: 'border-slate-500/20',    dot: 'bg-slate-500' },
  Removed:    { color: 'text-rose-600 dark:text-rose-400',        bg: 'bg-rose-500/10',     border: 'border-rose-500/20',     dot: 'bg-rose-500' },
};

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = [];
  const lines = markdown.split('\n');

  let currentRelease: Release | null = null;
  let currentCategory: ChangeCategory | null = null;

  const releaseRegex = /^##\s+\[(.+?)\]\s*-\s*(\d{4}-\d{2}-\d{2})/;
  const categoryRegex = /^###\s+(.+)/;
  const itemRegex = /^[-*]\s+(.+)/;

  for (const line of lines) {
    const releaseMatch = line.match(releaseRegex);
    if (releaseMatch) {
      if (currentRelease) releases.push(currentRelease);
      currentRelease = {
        version: releaseMatch[1],
        date: releaseMatch[2],
        isLatest: releases.length === 0,
        changes: [],
      };
      currentCategory = null;
      continue;
    }

    if (!currentRelease) continue;

    const categoryMatch = line.match(categoryRegex);
    if (categoryMatch) {
      const cat = categoryMatch[1].trim() as ChangeCategory;
      if (cat in CATEGORY_CONFIG) {
        currentCategory = cat;
        currentRelease.changes.push({ category: currentCategory, items: [] });
      }
      continue;
    }

    const itemMatch = line.match(itemRegex);
    if (itemMatch && currentCategory) {
      const lastChange = currentRelease.changes[currentRelease.changes.length - 1];
      if (lastChange) {
        lastChange.items.push(itemMatch[1].trim());
      }
    }
  }

  if (currentRelease) releases.push(currentRelease);
  return releases;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

interface UseChangelogReturn {
  releases: Release[];
  loading: boolean;
  error: string | null;
}

export function useChangelog(): UseChangelogReturn {
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadChangelog() {
      try {
        const res = await fetch('/CHANGELOG.md');
        if (!res.ok) throw new Error(`Failed to load changelog (${res.status})`);
        const text = await res.text();
        if (!cancelled) {
          setReleases(parseChangelog(text));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load changelog');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadChangelog();
    return () => { cancelled = true; };
  }, []);

  return { releases, loading, error };
}
