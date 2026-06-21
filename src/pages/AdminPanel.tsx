import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Database, Shield } from 'lucide-react';
import { teamsApi, type Team, type TeamMember, type TeamDbConnection } from '../api/teamsApi';
import api from '../api/axios'; // for users and connections
import { createPortal } from 'react-dom';

export default function AdminPanel() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [connections, setConnections] = useState<TeamDbConnection[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  
  const [activeTab, setActiveTab] = useState<'members' | 'connections'>('members');

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('DEVELOPER');

  const [availableConnections, setAvailableConnections] = useState<any[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [permissionLevels, setPermissionLevels] = useState<string[]>(['READ']);

  const togglePermission = (perm: string) => {
    setPermissionLevels(prev => 
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  useEffect(() => {
    fetchTeams();
    fetchDropdownData();
  }, []);

  useEffect(() => {
    if (selectedTeam) {
      fetchTeamDetails(selectedTeam.id);
    }
  }, [selectedTeam]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const data = await teamsApi.getTeams();
      setTeams(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const connsRes = await api.get('/connections');
      setAvailableConnections(connsRes.data);
    } catch (err) {
      console.error("Failed to fetch dropdown data", err);
    }
  };

  const fetchTeamDetails = async (teamId: number) => {
    try {
      const [memData, connData] = await Promise.all([
        teamsApi.getTeamMembers(teamId),
        teamsApi.getTeamConnections(teamId)
      ]);
      setMembers(memData);
      setConnections(connData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch team details');
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await teamsApi.createTeam({ name: newTeamName, description: newTeamDesc });
      setShowCreateModal(false);
      setNewTeamName('');
      setNewTeamDesc('');
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create team');
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam) return;
    try {
      await teamsApi.createTeamMember(selectedTeam.id, {
        email: newMemberEmail,
        password: newMemberPassword,
        roleName: newMemberRole
      });
      setNewMemberEmail('');
      setNewMemberPassword('');
      setNewMemberRole('DEVELOPER');
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create and add member');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedTeam) return;
    try {
      await teamsApi.removeTeamMember(selectedTeam.id, userId);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !selectedConnection || permissionLevels.length === 0) {
      setError('Please select a connection and at least one permission.');
      return;
    }
    try {
      await teamsApi.addTeamConnection(selectedTeam.id, Number(selectedConnection), permissionLevels.join(','));
      setSelectedConnection('');
      setPermissionLevels(['READ']);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign connection');
    }
  };

  const handleRemoveConnection = async (connId: number) => {
    if (!selectedTeam) return;
    try {
      await teamsApi.removeTeamConnection(selectedTeam.id, connId);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove connection');
    }
  };

  // Header Portal
  const headerPortalTarget = document.getElementById('header-portal-target');

  return (
    <div className="flex h-full gap-6">
      {headerPortalTarget && createPortal(
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Team Management</h2>
        </div>,
        headerPortalTarget
      )}

      {/* Left Sidebar: Teams List */}
      <div className="w-1/3 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-muted/50">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Teams
          </h3>
          <button
            onClick={() => setShowCreateModal(true)}
            className="p-1.5 hover:bg-primary/20 rounded-md text-primary transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Loading teams...</div>
          ) : teams.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">No teams found. Create one to get started.</div>
          ) : (
            <div className="space-y-1">
              {teams.map(team => (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full text-left px-3 py-3 rounded-md transition-colors ${
                    selectedTeam?.id === team.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'
                  }`}
                >
                  <div className="font-medium">{team.name}</div>
                  {team.description && <div className="text-xs text-muted-foreground truncate mt-1">{team.description}</div>}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Team Details */}
      <div className="flex-1 flex flex-col bg-card rounded-lg border shadow-sm overflow-hidden">
        {selectedTeam ? (
          <>
            <div className="p-6 border-b bg-muted/30">
              <h2 className="text-2xl font-bold text-foreground">{selectedTeam.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{selectedTeam.description || 'No description provided'}</p>
            </div>
            
            <div className="border-b px-4 flex gap-4">
              <button
                className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'members' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('members')}
              >
                Members ({members.length})
              </button>
              <button
                className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'connections' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('connections')}
              >
                Connections ({connections.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20">
                  {error}
                  <button className="float-right font-bold" onClick={() => setError(null)}>&times;</button>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="space-y-6">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Create New Member
                    </h4>
                    <form onSubmit={handleCreateMember} className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <input
                          type="email"
                          placeholder="Email Address"
                          autoComplete="new-password"
                          className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password"
                          autoComplete="new-password"
                          className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={newMemberPassword}
                          onChange={(e) => setNewMemberPassword(e.target.value)}
                          required
                        />
                        <select
                          className="w-40 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          required
                        >
                          <option value="DEVELOPER">Developer</option>
                          <option value="VIEWER">Viewer</option>
                          <option value="DEVOPS_ADMIN">DevOps Admin</option>
                        </select>
                        <button type="submit" className="h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors shadow">
                          Create & Add
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Role</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.length === 0 ? (
                          <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No members found in this team.</td></tr>
                        ) : (
                          members.map(member => (
                            <tr key={member.userId} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3">{member.email}</td>
                              <td className="px-4 py-3"><span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{member.role}</span></td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleRemoveMember(member.userId)}
                                  className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
                                  title="Remove member"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'connections' && (
                <div className="space-y-6">
                  <div className="bg-muted/30 p-4 rounded-lg border">
                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                      <Database className="w-4 h-4" /> Assign Connection
                    </h4>
                    <form onSubmit={handleAddConnection} className="flex gap-3">
                      <select
                        className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={selectedConnection}
                        onChange={(e) => setSelectedConnection(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select a connection...</option>
                        {availableConnections
                          .filter(c => !connections.some(conn => conn.connectionId === c.id))
                          .map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.environment})</option>
                        ))}
                      </select>
                      <div className="flex items-center gap-4 px-2 border rounded-md bg-background shadow-sm h-9">
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" checked={permissionLevels.includes('READ')} onChange={() => togglePermission('READ')} />
                          Read
                        </label>
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" checked={permissionLevels.includes('WRITE')} onChange={() => togglePermission('WRITE')} />
                          Write
                        </label>
                        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
                          <input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" checked={permissionLevels.includes('ADMIN')} onChange={() => togglePermission('ADMIN')} />
                          Admin
                        </label>
                      </div>
                      <button type="submit" className="h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors shadow">
                        Assign
                      </button>
                    </form>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-3 font-medium">Connection</th>
                          <th className="px-4 py-3 font-medium">Environment</th>
                          <th className="px-4 py-3 font-medium">Permission</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {connections.length === 0 ? (
                          <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No database connections assigned to this team.</td></tr>
                        ) : (
                          connections.map(conn => (
                            <tr key={conn.connectionId} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3 font-medium">{conn.name}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
                                  {conn.environment}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex flex-wrap gap-1">
                                  {conn.permissionLevel.split(',').map(p => (
                                    <span key={p} className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                      <Shield className="w-3 h-3" />
                                      {p.trim()}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleRemoveConnection(conn.connectionId)}
                                  className="text-destructive hover:bg-destructive/10 p-1.5 rounded transition-colors"
                                  title="Remove connection"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <Users className="w-16 h-16 mb-4 text-muted/50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Team Selected</h3>
            <p className="text-center max-w-sm">Select a team from the list on the left to view its members and manage connections, or create a new one.</p>
          </div>
        )}
      </div>

      {/* Create Team Modal */}
      {showCreateModal && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg border p-6 m-4 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Team Name</label>
                  <input
                    type="text"
                    required
                    autoComplete="do-not-autofill"
                    value={newTeamName}
                    onChange={e => setNewTeamName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Engineering Team"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Description (Optional)</label>
                  <textarea
                    value={newTeamDesc}
                    onChange={e => setNewTeamDesc(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Handles backend services..."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium shadow transition-colors"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
