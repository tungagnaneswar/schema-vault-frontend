import { useState, useEffect } from 'react';
import { Users, Activity, CheckCircle, XCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { adminApi, type UserResponse, type AuditLogResponse } from '../api/adminApi';
import PageHeader from '../components/PageHeader';
import { SuperAdminTableSkeleton } from '../components/Skeletons';

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [usersPage, setUsersPage] = useState(0);
  const [usersSize, setUsersSize] = useState(10);
  const [usersTotalPages, setUsersTotalPages] = useState(0);
  const [usersTotalElements, setUsersTotalElements] = useState(0);

  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [logsPage, setLogsPage] = useState(0);
  const [logsSize, setLogsSize] = useState(20);
  const [logsTotalPages, setLogsTotalPages] = useState(0);
  const [logsTotalElements, setLogsTotalElements] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const res = await adminApi.getUsers(page, size);
      setUsers(res.data.content);
      setUsersTotalPages(res.data.totalPages);
      setUsersTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async (page: number, size: number) => {
    setIsLoading(true);
    try {
      const res = await adminApi.getLogs(page, size);
      setLogs(res.data.content);
      setLogsTotalPages(res.data.totalPages);
      setLogsTotalElements(res.data.totalElements);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(usersPage, usersSize);
    } else {
      fetchLogs(logsPage, logsSize);
    }
  }, [activeTab, usersPage, usersSize, logsPage, logsSize]);

  const toggleUserStatus = async (id: number) => {
    try {
      await adminApi.toggleUserActive(id);
      fetchUsers(usersPage, usersSize);
    } catch (err) {
      console.error(err);
    }
  };

  const renderPaginationFooter = () => {
    const isUsers = activeTab === 'users';
    const page = isUsers ? usersPage : logsPage;
    const size = isUsers ? usersSize : logsSize;
    const totalPages = isUsers ? usersTotalPages : logsTotalPages;
    const totalElements = isUsers ? usersTotalElements : logsTotalElements;

    const setPage = (newPage: number) => {
      if (isUsers) setUsersPage(newPage);
      else setLogsPage(newPage);
    };

    const setSize = (newSize: number) => {
      if (isUsers) {
        setUsersSize(newSize);
        setUsersPage(0);
      } else {
        setLogsSize(newSize);
        setLogsPage(0);
      }
    };

    const startItem = totalElements === 0 ? 0 : page * size + 1;
    const endItem = Math.min((page + 1) * size, totalElements);

    const getPageNumbers = () => {
      const pages: number[] = [];
      const maxButtons = 5;
      let start = Math.max(0, page - 2);
      let end = Math.min(totalPages - 1, start + maxButtons - 1);
      if (end - start + 1 < maxButtons) {
        start = Math.max(0, end - maxButtons + 1);
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    };

    return (
      <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/20">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Showing <strong className="font-semibold text-foreground">{startItem}</strong> to{' '}
            <strong className="font-semibold text-foreground">{endItem}</strong> of{' '}
            <strong className="font-semibold text-foreground">{totalElements}</strong> items
          </span>
          <div className="flex items-center gap-1.5 border-l border-border pl-4">
            <span>Per page:</span>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="bg-background border border-border rounded px-2 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            disabled={page === 0}
            onClick={() => setPage(0)}
            title="First page"
            className="p-1.5 border border-border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted text-foreground transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            title="Previous page"
            className="p-1.5 border border-border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {getPageNumbers().map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1 text-xs font-medium border rounded-md transition-colors ${
                p === page
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'hover:bg-muted text-foreground border-border'
              }`}
            >
              {p + 1}
            </button>
          ))}

          <button
            disabled={page >= totalPages - 1 || totalPages === 0}
            onClick={() => setPage(page + 1)}
            title="Next page"
            className="p-1.5 border border-border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted text-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            disabled={page >= totalPages - 1 || totalPages === 0}
            onClick={() => setPage(totalPages - 1)}
            title="Last page"
            className="p-1.5 border border-border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted text-foreground transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader>
        <div>
          <h2 className="text-xl font-bold tracking-tight">Super Admin Dashboard</h2>
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
        <SuperAdminTableSkeleton activeTab={activeTab} />
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden shadow-sm flex flex-col">
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

          {renderPaginationFooter()}
        </div>
      )}
    </div>
  );
}
