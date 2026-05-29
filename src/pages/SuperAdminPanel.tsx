import { useState, useEffect } from 'react';
import { Users, Activity, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import PageHeader from '../components/PageHeader';

interface UserData {
  id: number;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface AuditLog {
  id: number;
  userEmail: string;
  action: string;
  ipAddress: string;
  deviceInfo: string;
  timestamp: string;
  details: string;
}

export default function SuperAdminPanel() {
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/users?page=0&size=100');
      setUsers(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/logs?page=0&size=100');
      setLogs(res.data.content);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchLogs();
    }
  }, [activeTab]);

  const toggleUserStatus = async (id: number) => {
    try {
      await api.patch(`/admin/users/${id}/toggle-active`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Super Admin Panel</h2>
          <p className="text-xs text-muted-foreground hidden lg:block">System-wide user and audit log management.</p>
        </div>
      </PageHeader>

      <div className="flex gap-4 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" /> Users
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'logs' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-4 h-4" /> System Logs
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
          {activeTab === 'users' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Created</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 font-medium">{u.email}</td>
                      <td className="px-6 py-3"><span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">{u.role}</span></td>
                      <td className="px-6 py-3">
                        {u.isActive ? (
                          <span className="flex items-center gap-1 text-emerald-600"><CheckCircle className="w-4 h-4"/> Active</span>
                        ) : (
                          <span className="flex items-center gap-1 text-destructive"><XCircle className="w-4 h-4"/> Inactive</span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3">
                        <button 
                          onClick={() => toggleUserStatus(u.id)}
                          className="text-xs px-3 py-1.5 border rounded-md hover:bg-muted font-medium transition-colors"
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b">
                  <tr>
                    <th className="px-6 py-3 font-medium">Time</th>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium">Details</th>
                    <th className="px-6 py-3 font-medium">IP / Device</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map(log => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</td>
                      <td className="px-6 py-3 font-medium">{log.userEmail}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 bg-blue-500/10 text-blue-600 text-xs rounded-md font-medium">{log.action}</span>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground max-w-xs truncate" title={log.details}>{log.details}</td>
                      <td className="px-6 py-3 text-xs text-muted-foreground">
                        <div>{log.ipAddress}</div>
                        <div className="truncate max-w-[150px]" title={log.deviceInfo}>{log.deviceInfo}</div>
                      </td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No logs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
