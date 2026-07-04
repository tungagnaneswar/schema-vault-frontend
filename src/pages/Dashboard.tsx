import { motion } from 'framer-motion';
import { Database, GitCompare, Activity, Users, Loader2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api/dashboardApi';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const stats = [
    { name: 'Active Connections', value: data?.activeConnections ?? 0, icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Schemas Compared', value: data?.schemasCompared ?? 0, icon: GitCompare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'System Alerts', value: data?.systemAlerts ?? 0, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Active Users', value: data?.activeUsers ?? 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full">
          <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-xs text-muted-foreground hidden lg:block">Overview of your database environments and comparison history.</p>
        </div>
      </PageHeader>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-6 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-card border rounded-xl shadow-sm p-6 mt-8"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Comparisons</h3>
        <div className="text-sm">
          {data?.recentComparisons && data.recentComparisons.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-3 font-medium px-4">Project</th>
                    <th className="pb-3 font-medium px-4">Source</th>
                    <th className="pb-3 font-medium px-4">Target</th>
                    <th className="pb-3 font-medium px-4">Status</th>
                    <th className="pb-3 font-medium px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentComparisons.map((comp) => (
                    <tr key={comp.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{comp.projectName || 'Default'}</td>
                      <td className="py-3 px-4">{comp.sourceEnvironmentName}</td>
                      <td className="py-3 px-4">{comp.targetEnvironmentName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          comp.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                          comp.status === 'FAILED' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400' :
                          'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        }`}>
                          {comp.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {new Date(comp.startedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/20 text-muted-foreground">
              No recent comparisons. Go to Compare tab to start!
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
