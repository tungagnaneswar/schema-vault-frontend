import { motion } from 'framer-motion';
import { Database, GitCompare, Activity, Users } from 'lucide-react';
import PageHeader from '../components/PageHeader';

export default function Dashboard() {
  const stats = [
    { name: 'Active Connections', value: '12', icon: Database, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Schemas Compared', value: '143', icon: GitCompare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { name: 'System Alerts', value: '2', icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Active Users', value: '8', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader>
        <div className="w-full">
          <h2 className="text-xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-xs text-muted-foreground hidden lg:block">Overview of your database environments and comparison history.</p>
        </div>
      </PageHeader>

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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="bg-card border rounded-xl shadow-sm p-6 mt-8"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Comparisons</h3>
        <div className="text-sm text-muted-foreground">
          <p className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/20">
            No recent comparisons. Go to Compare tab to start!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
