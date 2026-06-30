import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../api/axios';
import { createSnapshot, startCompareJob, getCompareJob, type CompareJob as CompareJobType } from '../api/compareApi';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightLeft, GitCompare, CheckCircle2, AlertTriangle, XCircle,
  ChevronDown, ChevronUp, Loader2, Download, Database,
  Key, Link2, ListTree, Zap, Code2, Workflow, Hash, Table2, AlertCircle,
  Eye, Box, ShieldAlert, ShieldCheck, Copy, Plus, X, ArrowLeft, History,
  PlugZap, Camera, Columns3, Scale, Sparkles
} from 'lucide-react';
import clsx from 'clsx';
import PageHeader from '../components/PageHeader';
import { getProjects, type Project } from '../api/projectsApi';


// ─── Types ────────────────────────────────────────────────────────────────────

interface Connection {
  id: number;
  name: string;
  environmentId: number;
  environmentName: string;
  projectId: number;
}

interface ColumnInfo {
  name: string;
  type: string;
  isNullable: boolean;
  defaultValue: string | null;
  ordinalPosition: number;
  maxLength: number | null;
  numericPrecision: number | null;
  numericScale: number | null;
}

interface ColumnDiff {
  columnName: string;
  status: string;
  sourceColumn: ColumnInfo | null;
  targetColumn: ColumnInfo | null;
  mismatchDetails: string[];
}

interface PrimaryKeyDiff {
  status: string;
  sourceColumns: string[];
  targetColumns: string[];
}

interface ObjectDiff {
  name: string;
  status: string;
  sourceDefinition: string | null;
  targetDefinition: string | null;
  mismatchDetails: string[];
}

interface TableDiff {
  tableName: string;
  status: string;
  columnDiffs: ColumnDiff[];
  primaryKeyDiff: PrimaryKeyDiff | null;
  constraintDiffs: ObjectDiff[];
  foreignKeyDiffs: ObjectDiff[];
  indexDiffs: ObjectDiff[];
  triggerDiffs: ObjectDiff[];
}

interface CompareResult {
  sourceEnvironment: string;
  targetEnvironment: string;
  tableDiffs: TableDiff[];
  functionDiffs: ObjectDiff[];
  procedureDiffs: ObjectDiff[];
  sequenceDiffs: ObjectDiff[];
  typeDiffs: ObjectDiff[];
  viewDiffs: ObjectDiff[];
}

// ─── Status styling ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  IDENTICAL:           { icon: CheckCircle2,  color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Identical' },
  MISSING_IN_TARGET:   { icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-500/10',  label: 'Missing in Target' },
  MISSING_IN_SOURCE:   { icon: AlertTriangle, color: 'text-amber-500',   bg: 'bg-amber-500/10',  label: 'Missing in Source' },
  TYPE_MISMATCH:       { icon: AlertCircle,   color: 'text-violet-500',  bg: 'bg-violet-500/10', label: 'Type Mismatch' },
  DEFINITION_MISMATCH: { icon: XCircle,       color: 'text-rose-500',    bg: 'bg-rose-500/10',   label: 'Definition Mismatch' },
};

const getStatus = (status: string) =>
  STATUS_CONFIG[status] ?? { icon: AlertTriangle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Unknown' };

// ─── Tabs ─────────────────────────────────────────────────────────────────────

type TabKey = 'tables' | 'indexes' | 'triggers' | 'functions' | 'procedures' | 'sequences' | 'types' | 'views' | 'constraints';

const TABS: { key: TabKey; label: string; icon: any }[] = [
  { key: 'tables',      label: 'Tables',      icon: Table2 },
  { key: 'indexes',     label: 'Indexes',     icon: ListTree },
  { key: 'triggers',    label: 'Triggers',    icon: Zap },
  { key: 'functions',   label: 'Functions',   icon: Code2 },
  { key: 'procedures',  label: 'Procedures',  icon: Workflow },
  { key: 'sequences',   label: 'Sequences',   icon: Hash },
  { key: 'types',       label: 'Types',       icon: Box },
  { key: 'views',       label: 'Views',       icon: Eye },
  { key: 'constraints', label: 'Constraints', icon: ShieldAlert },
];

// ─── Progress Stepper (imported component + types) ──────────────────────────

import CompareProgressStepper, { type StepStatus, type ProgressStep } from '../components/CompareProgressStepper';

const INITIAL_STEPS: ProgressStep[] = [
  { id: 'connect',   label: 'Verifying Connections',     description: 'Testing database connectivity...',               icon: PlugZap,      status: 'pending' },
  { id: 'snapshot',  label: 'Creating Snapshots',        description: 'Capturing current schema state...',              icon: Camera,       status: 'pending' },
  { id: 'retrieve',  label: 'Retrieving Schema Objects', description: 'Tables, columns, indexes, constraints...',       icon: Columns3,     status: 'pending' },
  { id: 'compare',   label: 'Comparing Schemas',         description: 'Analyzing differences between environments...',  icon: Scale,        status: 'pending' },
  { id: 'finalize',  label: 'Preparing Results',         description: 'Almost there! Generating comparison report...',  icon: Sparkles,     status: 'pending' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const conf = getStatus(status);
  const Icon = conf.icon;
  return (
    <div className={clsx('flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium w-max', conf.bg, conf.color)}>
      <Icon className="w-3.5 h-3.5" />
      {conf.label}
    </div>
  );
}

function ColBadge({ col }: { col: ColumnInfo | null }) {
  if (!col) return <span className="text-muted-foreground/50 italic text-xs">— not present</span>;
  return (
    <div className="flex flex-wrap gap-1">
      <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded">{col.type}</span>
      {col.maxLength && <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded">len:{col.maxLength}</span>}
      <span className={clsx('text-xs px-1.5 py-0.5 rounded font-medium', col.isNullable ? 'bg-sky-500/10 text-sky-500' : 'bg-orange-500/10 text-orange-500')}>
        {col.isNullable ? 'NULL' : 'NOT NULL'}
      </span>
      {col.defaultValue && <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded truncate max-w-[140px]" title={col.defaultValue}>def:{col.defaultValue}</span>}
    </div>
  );
}

function MismatchDetails({ details }: { details: string[] }) {
  if (!details || details.length === 0) return null;
  return (
    <div className="col-span-full pl-8 pr-4 pb-2">
      <div className="flex flex-wrap gap-1.5">
        {details.map((d, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}

function PresenceIndicator({ status, side }: { status: string; side: 'source' | 'target' }) {
  const missing = (side === 'source' && status === 'MISSING_IN_SOURCE') ||
                  (side === 'target' && status === 'MISSING_IN_TARGET');
  const hasMismatch = status === 'DEFINITION_MISMATCH' || status === 'TYPE_MISMATCH';
  return (
    <div className="text-xs">
      {missing
        ? <span className="text-rose-500 font-medium">✗ Not present</span>
        : hasMismatch
          ? <span className="text-amber-500 font-medium">✓ Present (differs)</span>
          : <span className="text-emerald-500 font-medium">✓ Present</span>}
    </div>
  );
}

// ─── Table sub-section component ──────────────────────────────────────────────

function SubSection({ title, icon: Icon, diffs }: { title: string; icon: any; diffs: ObjectDiff[] }) {
  const nonIdentical = diffs.filter(d => d.status !== 'IDENTICAL');
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (name: string) =>
    setExpanded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  if (diffs.length === 0) return null;

  return (
    <div className="border-t border-border/50">
      <div className="px-5 py-2.5 bg-muted/20 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">({diffs.length})</span>
        {nonIdentical.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-medium">
            {nonIdentical.length} diff{nonIdentical.length > 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div className="divide-y divide-border/30">
        {diffs.map((diff) => {
          const conf = getStatus(diff.status);
          const DIcon = conf.icon;
          const hasDefinition = diff.sourceDefinition || diff.targetDefinition;
          const isExpanded = expanded.includes(diff.name);
          return (
            <div key={diff.name}>
              <div
                onClick={() => hasDefinition && toggle(diff.name)}
                className={clsx(
                  'grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 text-sm items-center transition-colors',
                  diff.status !== 'IDENTICAL' && 'bg-muted/10',
                  hasDefinition && 'cursor-pointer hover:bg-muted/20'
                )}
              >
                <div className="flex items-center gap-2 pl-4">
                  {hasDefinition && (
                    isExpanded
                      ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
                  )}
                  {!hasDefinition && <span className="w-3 shrink-0" />}
                  <DIcon className={clsx('w-3.5 h-3.5 shrink-0', conf.color)} />
                  <span className="font-medium font-mono text-xs truncate" title={diff.name}>{diff.name}</span>
                </div>
                <span className={clsx('text-xs font-medium', conf.color)}>{conf.label}</span>
                <PresenceIndicator status={diff.status} side="source" />
                <PresenceIndicator status={diff.status} side="target" />
              </div>
              {diff.mismatchDetails && diff.mismatchDetails.length > 0 && (
                <MismatchDetails details={diff.mismatchDetails} />
              )}
              <AnimatePresence>
                {isExpanded && hasDefinition && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t bg-muted/5 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 divide-x divide-border/50">
                      <div className="p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Source Definition</p>
                        <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all max-h-48 overflow-auto bg-muted/30 rounded-lg p-3">
                          {diff.sourceDefinition || '— not present'}
                        </pre>
                      </div>
                      <div className="p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Definition</p>
                        <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all max-h-48 overflow-auto bg-muted/30 rounded-lg p-3">
                          {diff.targetDefinition || '— not present'}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrimaryKeySection({ pkDiff }: { pkDiff: PrimaryKeyDiff | null }) {
  if (!pkDiff) return null;
  const conf = getStatus(pkDiff.status);
  const Icon = conf.icon;

  return (
    <div className="border-t border-border/50">
      <div className="px-5 py-2.5 bg-muted/20 flex items-center gap-2">
        <Key className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Key</span>
      </div>
      <div className={clsx(
        'grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2.5 text-sm items-center',
        pkDiff.status !== 'IDENTICAL' && 'bg-muted/10'
      )}>
        <div className="flex items-center gap-2 pl-6">
          <Icon className={clsx('w-3.5 h-3.5 shrink-0', conf.color)} />
          <span className="font-medium font-mono text-xs">Primary Key</span>
        </div>
        <span className={clsx('text-xs font-medium', conf.color)}>{conf.label}</span>
        <div className="text-xs">
          {pkDiff.sourceColumns.length > 0
            ? <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded">{pkDiff.sourceColumns.join(', ')}</span>
            : <span className="text-rose-500 italic">— none</span>}
        </div>
        <div className="text-xs">
          {pkDiff.targetColumns.length > 0
            ? <span className="font-mono text-xs px-1.5 py-0.5 bg-muted rounded">{pkDiff.targetColumns.join(', ')}</span>
            : <span className="text-rose-500 italic">— none</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Generic ObjectDiff list (for functions, procedures, sequences tabs) ──────

function ObjectDiffList({ diffs, showDiffOnly, sourceLabel, targetLabel }: {
  diffs: ObjectDiff[];
  showDiffOnly: boolean;
  sourceLabel: string;
  targetLabel: string;
}) {
  const filtered = diffs.filter(d => showDiffOnly ? d.status !== 'IDENTICAL' : true);
  const [expanded, setExpanded] = useState<string[]>([]);

  const toggle = (name: string) =>
    setExpanded(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  if (filtered.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
        {showDiffOnly ? 'All objects are identical! 🎉' : 'No objects found.'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border rounded-lg bg-muted/30">
        <span>Object Name</span>
        <span>Status</span>
        <span className="truncate" title={sourceLabel}>⬤ {sourceLabel}</span>
        <span className="truncate" title={targetLabel}>⬤ {targetLabel}</span>
      </div>

      {filtered.map((diff) => {
        const isExpanded = expanded.includes(diff.name);
        const hasDefinition = diff.sourceDefinition || diff.targetDefinition;

        return (
          <div key={diff.name} className="border rounded-xl bg-card overflow-hidden shadow-sm">
            <div
              onClick={() => hasDefinition && toggle(diff.name)}
              className={clsx(
                'grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3.5 items-center transition-colors',
                hasDefinition && 'cursor-pointer hover:bg-muted/30'
              )}
            >
              <div className="flex items-center gap-2">
                {hasDefinition && (isExpanded
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="font-semibold font-mono text-sm truncate" title={diff.name}>{diff.name}</span>
              </div>
              <StatusBadge status={diff.status} />
              <PresenceIndicator status={diff.status} side="source" />
              <PresenceIndicator status={diff.status} side="target" />
            </div>

            {diff.mismatchDetails && diff.mismatchDetails.length > 0 && (
              <div className="px-5 pb-2">
                <MismatchDetails details={diff.mismatchDetails} />
              </div>
            )}

            <AnimatePresence>
              {isExpanded && hasDefinition && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t bg-muted/5 overflow-hidden"
                >
                  <div className="grid grid-cols-2 divide-x divide-border/50">
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Source Definition</p>
                      <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all max-h-60 overflow-auto bg-muted/30 rounded-lg p-3">
                        {diff.sourceDefinition || '— not present'}
                      </pre>
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Target Definition</p>
                      <pre className="text-xs font-mono text-foreground/80 whitespace-pre-wrap break-all max-h-60 overflow-auto bg-muted/30 rounded-lg p-3">
                        {diff.targetDefinition || '— not present'}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function Compare() {
  const { projectId: projectIdParam } = useParams();
  const navigate = useNavigate();
  const [sourceId, setSourceId] = useState('');
  const [targetId, setTargetId] = useState('');
  const [expandedTables, setExpandedTables] = useState<string[]>([]);
  const [showDiffOnly, setShowDiffOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('tables');

  // Redirect to projects if no projectId
  if (!projectIdParam) {
    return <Navigate to="/projects" replace />;
  }

  const { data: allConnections, isLoading: isLoadingConn } = useQuery<Connection[]>({
    queryKey: ['connections'],
    queryFn: async () => {
      const res = await api.get('/connections');
      return res.data.content ? res.data.content : res.data;
    }
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const currentProject = projects?.find(p => p.id === parseInt(projectIdParam));



  // Filter connections to only show those belonging to the current project
  const connections = allConnections?.filter(c => c.projectId === parseInt(projectIdParam));

  const [pollingJobId, setPollingJobId] = useState<number | null>(null);
  const [progressSteps, setProgressSteps] = useState<ProgressStep[]>(INITIAL_STEPS);
  const [showStepper, setShowStepper] = useState(false);

  // Helper to update a specific step's status
  const updateStep = (stepId: string, status: StepStatus) => {
    setProgressSteps(prev => prev.map(s => s.id === stepId ? { ...s, status } : s));
  };

  // Simulate a short delay for visual effect on fast steps
  const stepDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const { data: jobData } = useQuery<CompareJobType>({
    queryKey: ['compareJob', pollingJobId],
    queryFn: () => getCompareJob(pollingJobId!),
    enabled: !!pollingJobId,
    refetchInterval: (query) => {
        const state = query.state.data;
        if (state && (state.status === 'COMPLETED' || state.status === 'FAILED')) {
            return false;
        }
        return 2000;
    },
  });

  // Watch for job completion/failure to update final steps
  useEffect(() => {
    if (jobData?.status === 'COMPLETED') {
      updateStep('compare', 'completed');
      updateStep('finalize', 'active');
      // Brief delay then mark finalize as completed
      const timer = setTimeout(() => {
        updateStep('finalize', 'completed');
        // Hide stepper after showing completion
        setTimeout(() => setShowStepper(false), 1500);
      }, 600);
      return () => clearTimeout(timer);
    } else if (jobData?.status === 'FAILED') {
      // Mark current active step as failed
      setProgressSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'failed' } : s));
    }
  }, [jobData?.status]);

  const compareMutation = useMutation({
    mutationFn: async () => {
      // Step 1: Verify connections
      updateStep('connect', 'active');
      await stepDelay(800);
      updateStep('connect', 'completed');

      // Step 2: Create snapshots
      updateStep('snapshot', 'active');
      const sourceSnap = await createSnapshot(parseInt(sourceId));
      const targetSnap = await createSnapshot(parseInt(targetId));
      updateStep('snapshot', 'completed');

      // Step 3: Retrieve schema objects
      updateStep('retrieve', 'active');
      await stepDelay(600);
      updateStep('retrieve', 'completed');

      // Step 4: Start compare job
      updateStep('compare', 'active');
      const job = await startCompareJob(sourceSnap.id, targetSnap.id);
      return job.id;
    },
    onSuccess: (jobId) => {
      setPollingJobId(jobId);
    },
    onError: () => {
      setProgressSteps(prev => prev.map(s => s.status === 'active' ? { ...s, status: 'failed' } : s));
    }
  });

  const handleCompare = () => {
    if (!sourceId || !targetId) return;
    setExpandedTables([]);
    setActiveTab('tables');
    setPollingJobId(null);
    setProgressSteps(INITIAL_STEPS.map(s => ({ ...s, status: 'pending' as StepStatus })));
    setShowStepper(true);
    compareMutation.mutate();
  };

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev =>
      prev.includes(tableName) ? prev.filter(t => t !== tableName) : [...prev, tableName]
    );
  };

  const handleSwap = () => {
    const tId = targetId;
    const sId = sourceId;

    setSourceId(tId);
    setTargetId(sId);
  };

  // Auto-select connections to ensure a valid default state
  useEffect(() => {
    if (connections && connections.length > 1) {
      if (!sourceId && !targetId) {
        setSourceId(String(connections[0].id));
        setTargetId(String(connections[1].id));
      } else if (sourceId && (!targetId || targetId === sourceId)) {
        const nextTarget = connections.find(c => String(c.id) !== sourceId);
        if (nextTarget) {
          setTargetId(String(nextTarget.id));
        }
      } else if (targetId && (!sourceId || sourceId === targetId)) {
        const nextSource = connections.find(c => String(c.id) !== targetId);
        if (nextSource) {
          setSourceId(String(nextSource.id));
        }
      }
    }
  }, [sourceId, targetId, connections]);


  const sourceConn = connections?.find(c => String(c.id) === sourceId);
  const targetConn = connections?.find(c => String(c.id) === targetId);

  const result = (jobData?.status === 'COMPLETED' ? jobData.resultData : null) as CompareResult | null;

  // ─── Extract nested table diffs for top-level tabs ────────────────────────
  
  const extractedDiffs = useMemo(() => {
    if (!result) return { indexes: [], triggers: [], constraints: [] };
    const indexes: ObjectDiff[] = [];
    const triggers: ObjectDiff[] = [];
    const constraints: ObjectDiff[] = [];

    result.tableDiffs.forEach(t => {
      (t.indexDiffs || []).forEach(d => indexes.push({ ...d, name: `${t.tableName}.${d.name}` }));
      (t.triggerDiffs || []).forEach(d => triggers.push({ ...d, name: `${t.tableName}.${d.name}` }));
      (t.constraintDiffs || []).forEach(d => constraints.push({ ...d, name: `${t.tableName}.${d.name}` }));
    });

    return { indexes, triggers, constraints };
  }, [result]);

  // ─── Stats ────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (!result) return null;

    const countByStatus = (diffs: { status: string }[]) => ({
      total: diffs.length,
      identical: diffs.filter(d => d.status === 'IDENTICAL').length,
      missing: diffs.filter(d => d.status === 'MISSING_IN_TARGET' || d.status === 'MISSING_IN_SOURCE').length,
      typeMismatch: diffs.filter(d => d.status === 'TYPE_MISMATCH').length,
      defMismatch: diffs.filter(d => d.status === 'DEFINITION_MISMATCH').length,
    });

    return {
      tables: countByStatus(result.tableDiffs),
      indexes: countByStatus(extractedDiffs.indexes),
      triggers: countByStatus(extractedDiffs.triggers),
      functions: countByStatus(result.functionDiffs),
      procedures: countByStatus(result.procedureDiffs),
      sequences: countByStatus(result.sequenceDiffs),
      types: countByStatus(result.typeDiffs || []),
      views: countByStatus(result.viewDiffs || []),
      constraints: countByStatus(extractedDiffs.constraints),
    };
  }, [result, extractedDiffs]);

  const currentStats = stats ? stats[activeTab] : null;

  // ─── Filtered diffs ───────────────────────────────────────────────────────

  const filteredTableDiffs = result?.tableDiffs.filter(td =>
    showDiffOnly ? td.status !== 'IDENTICAL' : true
  ) ?? [];

  // ─── Tab badge counts ─────────────────────────────────────────────────────

  const tabBadgeCounts = useMemo(() => {
    if (!result) return {};
    return {
      tables: result.tableDiffs.filter(d => d.status !== 'IDENTICAL').length,
      indexes: extractedDiffs.indexes.filter(d => d.status !== 'IDENTICAL').length,
      triggers: extractedDiffs.triggers.filter(d => d.status !== 'IDENTICAL').length,
      functions: result.functionDiffs.filter(d => d.status !== 'IDENTICAL').length,
      procedures: result.procedureDiffs.filter(d => d.status !== 'IDENTICAL').length,
      sequences: result.sequenceDiffs.filter(d => d.status !== 'IDENTICAL').length,
      types: (result.typeDiffs || []).filter(d => d.status !== 'IDENTICAL').length,
      views: (result.viewDiffs || []).filter(d => d.status !== 'IDENTICAL').length,
      constraints: extractedDiffs.constraints.filter(d => d.status !== 'IDENTICAL').length,
    };
  }, [result, extractedDiffs]);

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/projects/${projectIdParam}/connections`)} className="p-1.5 hover:bg-muted rounded-md transition-colors -ml-2">
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
            <h2 className="text-xl font-bold tracking-tight">
              {currentProject ? `${currentProject.name} — Compare Schemas` : 'Compare Schemas'}
            </h2>
            <button
              onClick={() => navigate(`/projects/${projectIdParam}/compare-history`)}
              className="ml-4 flex items-center gap-1.5 text-xs bg-muted hover:bg-muted/80 text-muted-foreground px-3 py-1.5 rounded-full transition-colors"
            >
              <History className="w-3.5 h-3.5" /> History
            </button>
          </div>
          <p className="text-xs text-muted-foreground hidden lg:block mt-1 ml-10">
            {currentProject
              ? `Select two connections from ${currentProject.name} to run a detailed structural comparison.`
              : 'Select two environments to run a detailed structural comparison.'}
          </p>
        </div>
      </PageHeader>

      {/* ─── Selector card ──────────────────────────────────────────────── */}
      {!isLoadingConn && (connections?.length ?? 0) < 2 ? (
        /* ── Empty state: not enough connections ── */
        <div className="bg-card border-2 border-dashed rounded-xl p-12 text-center space-y-4">
          <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Database className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold">
              {(connections?.length ?? 0) === 0
                ? 'No database connections yet'
                : 'Only one database connection found'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              You need at least <span className="font-semibold text-foreground">two database connections</span> to run a schema comparison.
            </p>
          </div>
          <button
            onClick={() => navigate(`/projects/${projectIdParam}/connections`)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {(connections?.length ?? 0) === 0 ? 'Create Connections' : 'Add Second Connection'}
          </button>
        </div>
      ) : (
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium flex items-center gap-1.5 mb-2"><Database className="w-3.5 h-3.5" /> Source Database</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md h-[42px]"
                disabled={isLoadingConn}
              >
                <option value="">Select source database...</option>
                {connections?.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.environmentName})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleSwap}
              disabled={!sourceId || !targetId}
              title="Swap source and target"
              className="hidden md:flex pb-[11px] px-2 text-muted-foreground hover:text-primary disabled:opacity-30 transition-colors"
            >
              <ArrowRightLeft className="w-5 h-5" />
            </button>

            <div className="flex-1 w-full">
              <label className="text-sm font-medium flex items-center gap-1.5 mb-2"><Database className="w-3.5 h-3.5" /> Target Database</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full px-3 py-2 bg-background border rounded-md h-[42px]"
                disabled={isLoadingConn}
              >
                <option value="">Select target database...</option>
                {connections?.map(c => (
                  <option key={c.id} value={c.id} disabled={String(c.id) === sourceId}>
                    {c.name} ({c.environmentName}) {String(c.id) === sourceId ? '(Source)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="relative group w-full md:w-auto"
              title={!sourceId || !targetId ? 'Select both source and target databases to compare' : undefined}
            >
              <button
                onClick={handleCompare}
                disabled={!sourceId || !targetId || compareMutation.isPending || (!!pollingJobId && jobData?.status !== 'COMPLETED' && jobData?.status !== 'FAILED')}
                className="w-full md:w-auto px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {(compareMutation.isPending || (!!pollingJobId && jobData?.status !== 'COMPLETED' && jobData?.status !== 'FAILED')) 
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Comparing...</> 
                  : <><GitCompare className="w-4 h-4" /> Compare</>}
              </button>
              {(!sourceId || !targetId) && !compareMutation.isPending && !pollingJobId && (
                <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 text-xs rounded-md bg-popover border shadow-md text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  Select both source and target databases to compare
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── Progress Stepper ────────────────────────────────────────── */}
      <AnimatePresence>
        {showStepper && (
          <CompareProgressStepper steps={progressSteps} />
        )}
      </AnimatePresence>

      {/* ─── Results ────────────────────────────────────────────────────── */}
      {jobData?.status === 'FAILED' && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-rose-500">
          <AlertCircle className="w-10 h-10 mb-3" />
          <h3 className="font-semibold text-lg">Compare Job Failed</h3>
          <p className="text-sm opacity-80 mt-1">{jobData.errorMessage || 'An unknown error occurred.'}</p>
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* ─── Tab navigation ──────────────────────────────────────── */}
          <div className="flex gap-1 bg-card border rounded-xl p-1.5 shadow-sm">
            {TABS.map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.key;
              const badgeCount = tabBadgeCounts[tab.key] ?? 0;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                  {badgeCount > 0 && (
                    <span className={clsx(
                      'text-[10px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center',
                      isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-rose-500/10 text-rose-500'
                    )}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── Summary stats ───────────────────────────────────────── */}
          {currentStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Total',          value: currentStats.total,        color: 'text-foreground',     bg: 'bg-card' },
                { label: 'Identical',       value: currentStats.identical,    color: 'text-emerald-500',    bg: 'bg-emerald-500/10' },
                { label: 'Missing',         value: currentStats.missing,      color: 'text-amber-500',      bg: 'bg-amber-500/10' },
                { label: 'Type Mismatch',   value: currentStats.typeMismatch, color: 'text-violet-500',     bg: 'bg-violet-500/10' },
                { label: 'Def. Mismatch',   value: currentStats.defMismatch,  color: 'text-rose-500',       bg: 'bg-rose-500/10' },
              ].map(s => (
                <div key={s.label} className={clsx('border rounded-xl p-4 text-center shadow-sm', s.bg)}>
                  <p className={clsx('text-2xl font-bold', s.color)}>{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ─── Toolbar ─────────────────────────────────────────────── */}
          <div className="flex justify-between items-center bg-card border px-4 py-3 rounded-xl shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              Show differences only
            </label>
            <button className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Download className="w-4 h-4" /> Export Report
            </button>
          </div>

          {/* ─── Tab content ─────────────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'tables' && (
                <TablesView
                  tableDiffs={filteredTableDiffs}
                  expandedTables={expandedTables}
                  toggleTable={toggleTable}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'indexes' && (
                <ObjectDiffList
                  diffs={extractedDiffs.indexes}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'triggers' && (
                <ObjectDiffList
                  diffs={extractedDiffs.triggers}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'functions' && (
                <ObjectDiffList
                  diffs={result.functionDiffs}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'procedures' && (
                <ObjectDiffList
                  diffs={result.procedureDiffs}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'sequences' && (
                <ObjectDiffList
                  diffs={result.sequenceDiffs}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'types' && (
                <ObjectDiffList
                  diffs={result.typeDiffs || []}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'views' && (
                <ObjectDiffList
                  diffs={result.viewDiffs || []}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}

              {activeTab === 'constraints' && (
                <ObjectDiffList
                  diffs={extractedDiffs.constraints}
                  showDiffOnly={showDiffOnly}
                  sourceLabel={sourceConn?.name ?? 'Source'}
                  targetLabel={targetConn?.name ?? 'Target'}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}

      {compareMutation.isError && (
        <div className="border border-destructive/30 bg-destructive/10 text-destructive rounded-xl px-5 py-4 text-sm">
          Comparison failed. Please check that both databases are reachable and try again.
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Tables Tab View
// ═══════════════════════════════════════════════════════════════════════════════

function TablesView({ tableDiffs, expandedTables, toggleTable, showDiffOnly, sourceLabel, targetLabel }: {
  tableDiffs: TableDiff[];
  expandedTables: string[];
  toggleTable: (name: string) => void;
  showDiffOnly: boolean;
  sourceLabel: string;
  targetLabel: string;
}) {
  return (
    <div className="space-y-3">
      {/* Column header */}
      <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border rounded-lg bg-muted/30">
        <span>Table / Column</span>
        <span>Status</span>
        <span className="truncate" title={sourceLabel}>⬤ {sourceLabel}</span>
        <span className="truncate" title={targetLabel}>⬤ {targetLabel}</span>
      </div>

      {tableDiffs.map((tableDiff) => {
        const isExpanded = expandedTables.includes(tableDiff.tableName);

        const colDiffs = tableDiff.columnDiffs.filter(cd =>
          showDiffOnly ? cd.status !== 'IDENTICAL' : true
        );

        // Count all sub-diffs for the badge
        const subDiffCount = [
          ...tableDiff.columnDiffs,
          ...(tableDiff.foreignKeyDiffs ?? []),
        ].filter(d => d.status !== 'IDENTICAL').length
          + (tableDiff.primaryKeyDiff && tableDiff.primaryKeyDiff.status !== 'IDENTICAL' ? 1 : 0);

        return (
          <div key={tableDiff.tableName} className="border rounded-xl bg-card overflow-hidden shadow-sm">
            {/* Table row */}
            <div
              onClick={() => toggleTable(tableDiff.tableName)}
              className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-4 items-center cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                {isExpanded
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                <span className="font-semibold">{tableDiff.tableName}</span>
                {tableDiff.status === 'MISSING_IN_TARGET' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    Only in {sourceLabel}
                  </span>
                )}
                {tableDiff.status === 'MISSING_IN_SOURCE' && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    Only in {targetLabel} (Destructive)
                  </span>
                )}
                {tableDiff.columnDiffs.length > 0 && (
                  <span className="text-xs text-muted-foreground">({tableDiff.columnDiffs.length} cols)</span>
                )}
                {subDiffCount > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">
                    {subDiffCount} diff{subDiffCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <StatusBadge status={tableDiff.status} />
              <PresenceIndicator status={tableDiff.status} side="source" />
              <PresenceIndicator status={tableDiff.status} side="target" />
            </div>

            {/* Expanded content */}
            <AnimatePresence>
              {isExpanded && (tableDiff.status === 'MISSING_IN_SOURCE' || tableDiff.status === 'MISSING_IN_TARGET') && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t px-5 py-4 text-sm text-muted-foreground bg-muted/5"
                >
                  Table exists only in {tableDiff.status === 'MISSING_IN_TARGET' ? 'source' : 'target'} database.
                </motion.div>
              )}

              {isExpanded && tableDiff.status !== 'MISSING_IN_SOURCE' && tableDiff.status !== 'MISSING_IN_TARGET' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {/* ── Columns section ── */}
                  {colDiffs.length > 0 && (
                    <div className="border-t border-border/50 p-6 bg-muted/5">
                      {(() => {
                        const safeSqls: string[] = [];
                        const destructiveSqls: string[] = [];
                        const missingInTargetCols: ColumnDiff[] = [];
                        const missingInSourceCols: ColumnDiff[] = [];
                        const mismatchCols: ColumnDiff[] = [];

                        colDiffs.forEach(colDiff => {
                          if (colDiff.status === 'MISSING_IN_TARGET' || colDiff.status === 'MISSING_IN_SOURCE') {
                            const colName = colDiff.columnName;
                            const type = colDiff.sourceColumn?.type || colDiff.targetColumn?.type || 'varchar';
                            safeSqls.push(`ALTER TABLE ${tableDiff.tableName} ADD COLUMN IF NOT EXISTS ${colName} ${type};`);
                            destructiveSqls.push(`ALTER TABLE ${tableDiff.tableName} DROP COLUMN IF EXISTS ${colName};`);
                            
                            if (colDiff.status === 'MISSING_IN_TARGET') {
                              missingInTargetCols.push(colDiff);
                            } else {
                              missingInSourceCols.push(colDiff);
                            }
                          } else {
                            mismatchCols.push(colDiff);
                          }
                        });

                        const hasSql = safeSqls.length > 0;

                        return (
                          <div className="space-y-6">
                            {hasSql && (
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Side: SQL Boxes */}
                                <div className="space-y-4">
                                  {/* Safe SQL Box */}
                                  <div className="border border-blue-500/20 bg-card rounded-lg overflow-hidden shadow-sm">
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-blue-500/10 bg-blue-500/5">
                                      <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4 text-blue-500" />
                                        <span className="text-sm font-semibold text-blue-500">Sync Alter Table SQL (Safe)</span>
                                      </div>
                                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50 border border-transparent hover:border-border">
                                        <Copy className="w-3 h-3" /> Copy
                                      </button>
                                    </div>
                                    <div className="p-4">
                                      <p className="text-xs text-muted-foreground mb-3">This SQL contains safe alterations. Deletions are commented out.</p>
                                      <pre className="bg-muted/50 p-3.5 rounded-lg text-xs font-mono text-foreground/80 whitespace-pre-wrap border border-border/50 overflow-x-auto shadow-inner">
                                        {safeSqls.join('\n')}
                                      </pre>
                                    </div>
                                  </div>

                                  {/* Destructive SQL Box */}
                                  <div className="border border-rose-500/20 bg-card rounded-lg overflow-hidden shadow-sm">
                                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-rose-500/10 bg-rose-500/5">
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                                        <span className="text-sm font-semibold text-rose-500">Destructive Sync SQL (Deletions)</span>
                                      </div>
                                      <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted/50 border border-transparent hover:border-border">
                                        <Copy className="w-3 h-3" /> Copy
                                      </button>
                                    </div>
                                    <div className="p-4">
                                      <div className="flex items-start gap-2 mb-3 bg-rose-500/10 p-2.5 rounded-md border border-rose-500/20">
                                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Warning: Running this will drop columns and permanently delete data from prod ({targetLabel}).</p>
                                      </div>
                                      <pre className="bg-muted/50 p-3.5 rounded-lg text-xs font-mono text-rose-600 dark:text-rose-400 whitespace-pre-wrap border border-rose-500/10 overflow-x-auto shadow-inner">
                                        {destructiveSqls.join('\n')}
                                      </pre>
                                    </div>
                                  </div>
                                </div>

                                {/* Right Side: Diff Lists */}
                                <div className="space-y-4">
                                  {missingInTargetCols.length > 0 && (
                                    <div className="border-l-4 border-emerald-500 bg-card border-y border-r border-y-emerald-500/10 border-r-emerald-500/10 rounded-r-xl rounded-l-sm p-5 shadow-sm">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <Plus className="w-4 h-4 text-emerald-500 font-bold" />
                                        <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-500">Missing in {targetLabel.toUpperCase()} (Will be Added)</h4>
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-4">Exists in <span className="font-medium text-foreground">{sourceLabel.toLowerCase()}</span> | Missing in <span className="font-medium text-foreground">{targetLabel.toLowerCase()}</span></p>
                                      
                                      <div className="space-y-2">
                                        {missingInTargetCols.map(col => (
                                          <div key={col.columnName} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/50 shadow-inner">
                                            <span className="font-mono text-sm font-semibold text-foreground">{col.columnName}</span>
                                            <span className="font-mono text-xs px-2.5 py-1 bg-background text-muted-foreground rounded-md border border-border/50">{col.sourceColumn?.type}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {missingInSourceCols.length > 0 && (
                                    <div className="border-l-4 border-rose-500 bg-card border-y border-r border-y-rose-500/10 border-r-rose-500/10 rounded-r-xl rounded-l-sm p-5 shadow-sm">
                                      <div className="flex items-center gap-2 mb-1.5">
                                        <X className="w-4 h-4 text-rose-500 font-bold" />
                                        <h4 className="text-sm font-bold text-rose-600 dark:text-rose-500">Extra in {targetLabel.toUpperCase()} (Will be Deleted if synced)</h4>
                                      </div>
                                      <p className="text-xs text-muted-foreground mb-4">Exists in <span className="font-medium text-foreground">{targetLabel.toLowerCase()}</span> | Missing in <span className="font-medium text-foreground">{sourceLabel.toLowerCase()}</span></p>
                                      
                                      <div className="space-y-2">
                                        {missingInSourceCols.map(col => (
                                          <div key={col.columnName} className="flex items-center justify-between bg-muted/50 p-3 rounded-lg border border-border/50 shadow-inner">
                                            <span className="font-mono text-sm font-semibold text-foreground">{col.columnName}</span>
                                            <span className="font-mono text-xs px-2.5 py-1 bg-background text-muted-foreground rounded-md border border-border/50">{col.targetColumn?.type}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Other Column Mismatches (Type / Definition) */}
                            {mismatchCols.length > 0 && (
                              <div className="border border-border/50 rounded-xl overflow-hidden bg-card">
                                <div className="px-5 py-2.5 bg-muted/20 flex items-center gap-2 border-b border-border/50">
                                  <ListTree className="w-3.5 h-3.5 text-muted-foreground" />
                                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Other Column Differences</span>
                                  <span className="text-xs text-muted-foreground">({mismatchCols.length})</span>
                                </div>
                                <div className="divide-y divide-border/30">
                                  {mismatchCols.map((colDiff) => {
                                    const cStat = getStatus(colDiff.status);
                                    const CIcon = cStat.icon;
                                    const isMissingInTarget = colDiff.status === 'MISSING_IN_TARGET';
                                    const isMissingInSource = colDiff.status === 'MISSING_IN_SOURCE';

                                    return (
                                      <div key={colDiff.columnName}>
                                        <div className={clsx(
                                          'grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-5 py-3 text-sm items-center',
                                          colDiff.status !== 'IDENTICAL' && 'bg-muted/20'
                                        )}>
                                          <div className="flex items-center gap-2 pl-6">
                                            <CIcon className={clsx('w-3.5 h-3.5 shrink-0', cStat.color)} />
                                            <span className="font-medium font-mono text-xs">{colDiff.columnName}</span>
                                          </div>
                                          <span className={clsx('text-xs font-medium', cStat.color)}>{cStat.label}</span>
                                          <div>
                                            {isMissingInSource
                                              ? <span className="text-xs text-rose-500 italic">✗ Not present</span>
                                              : <ColBadge col={colDiff.sourceColumn} />}
                                          </div>
                                          <div>
                                            {isMissingInTarget
                                              ? <span className="text-xs text-rose-500 italic">✗ Not present</span>
                                              : <ColBadge col={colDiff.targetColumn} />}
                                          </div>
                                        </div>
                                        {colDiff.mismatchDetails && colDiff.mismatchDetails.length > 0 && (
                                          <MismatchDetails details={colDiff.mismatchDetails} />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {colDiffs.length === 0 && (
                    <div className="border-t px-5 py-3 text-sm text-muted-foreground bg-muted/5">
                      {showDiffOnly ? 'No column differences.' : 'No column data available.'}
                    </div>
                  )}

                  {/* ── Primary Key section ── */}
                  <PrimaryKeySection pkDiff={tableDiff.primaryKeyDiff} />

                  {/* ── Foreign Keys section ── */}
                  <SubSection title="Foreign Keys" icon={Link2} diffs={tableDiff.foreignKeyDiffs ?? []} />

                  <div className="px-5 py-3 text-xs text-muted-foreground border-t bg-muted/10 text-center">
                    Indexes, Triggers, and Constraints are now available in their respective tabs at the top.
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {tableDiffs.length === 0 && (
        <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
          {showDiffOnly ? 'All schemas are identical! 🎉' : 'No tables found in the comparison result.'}
        </div>
      )}
    </div>
  );
}
