import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Database, Shield, Settings, Edit } from 'lucide-react';
import { teamsApi, type Team, type TeamMember, type TeamDbConnection, type MemberProject } from '../api/teamsApi';
import api from '../api/axios';
import { createPortal } from 'react-dom';
import { TEAM_ROLES, CONNECTION_ROLES } from '../constants/roles';

export default function Teams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [connections, setConnections] = useState<TeamDbConnection[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamDesc, setEditTeamDesc] = useState('');
  const [teamToEdit, setTeamToEdit] = useState<Team | null>(null);

  const [teamToDelete, setTeamToDelete] = useState<Team | null>(null);
  
  const [showManageProjectsModal, setShowManageProjectsModal] = useState(false);
  const [managingMember, setManagingMember] = useState<TeamMember | null>(null);
  const [memberProjects, setMemberProjects] = useState<MemberProject[]>([]);
  const [managingLoading, setManagingLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'members' | 'connections'>('members');

  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<string>(TEAM_ROLES.MEMBER);

  const [availableConnections, setAvailableConnections] = useState<any[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>('');
  const [selectedPermission, setSelectedPermission] = useState<string>(CONNECTION_ROLES.READ);

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
    const [connectionsResult, usersResult] = await Promise.allSettled([
      api.get('/connections'),
      teamsApi.getAvailableUsers(),
    ]);

    if (connectionsResult.status === 'fulfilled') {
      const responseData = connectionsResult.value.data;
      const connectionsData = responseData.content ?? responseData;
      setAvailableConnections(Array.isArray(connectionsData) ? connectionsData : []);
    } else {
      console.error('Failed to fetch available connections', connectionsResult.reason);
    }

    if (usersResult.status === 'fulfilled') {
      setAvailableUsers(Array.isArray(usersResult.value) ? usersResult.value : []);
    } else {
      console.error('Failed to fetch available users', usersResult.reason);
      setError('Failed to load users. Please refresh the page and try again.');
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

  const handleUpdateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamToEdit) return;
    try {
      await teamsApi.updateTeam(teamToEdit.id, { name: editTeamName, description: editTeamDesc });
      setShowEditModal(false);
      if (selectedTeam?.id === teamToEdit.id) {
        setSelectedTeam({ ...selectedTeam, name: editTeamName, description: editTeamDesc });
      }
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update team');
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamToDelete) return;
    try {
      await teamsApi.deleteTeam(teamToDelete.id);
      setTeamToDelete(null);
      if (selectedTeam?.id === teamToDelete.id) {
        setSelectedTeam(null);
      }
      fetchTeams();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete team');
      setTeamToDelete(null);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !selectedUserId) return;
    
    // Duplicate check client side
    if (members.some(m => m.userId === Number(selectedUserId))) {
      setError('This user is already a member of the team.');
      return;
    }

    try {
      await teamsApi.addTeamMember(selectedTeam.id, Number(selectedUserId), newMemberRole);
      setSelectedUserId('');
      setNewMemberRole(TEAM_ROLES.MEMBER);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: string) => {
    if (!selectedTeam) return;
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }
    try {
      await teamsApi.updateTeamMemberRole(selectedTeam.id, userId, newRole);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!selectedTeam) return;
    if (!window.confirm('Are you sure you want to remove this member from the team?')) {
      return;
    }
    try {
      await teamsApi.removeTeamMember(selectedTeam.id, userId);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !selectedConnection || !selectedPermission) {
      setError('Please select a connection and a permission level.');
      return;
    }
    try {
      await teamsApi.addTeamConnection(selectedTeam.id, Number(selectedConnection), selectedPermission);
      setSelectedConnection('');
      setSelectedPermission('READ');
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to assign connection');
    }
  };

  const handleRemoveConnection = async (connId: number) => {
    if (!selectedTeam) return;
    if (!window.confirm('Are you sure you want to remove this connection from the team?')) {
      return;
    }
    try {
      await teamsApi.removeTeamConnection(selectedTeam.id, connId);
      fetchTeamDetails(selectedTeam.id);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove connection');
    }
  };

  const handleManageProjects = async (member: TeamMember) => {
    setManagingMember(member);
    setShowManageProjectsModal(true);
    setManagingLoading(true);
    try {
      const data = await teamsApi.getMemberProjects(selectedTeam!.id, member.userId);
      setMemberProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch member projects');
    } finally {
      setManagingLoading(false);
    }
  };

  const handleToggleMemberProject = async (projectId: number, assign: boolean, permission: string) => {
    if (!selectedTeam || !managingMember) return;
    try {
      if (assign) {
        await teamsApi.assignMemberProject(selectedTeam.id, managingMember.userId, projectId, permission);
      } else {
        await teamsApi.removeMemberProject(selectedTeam.id, managingMember.userId, projectId);
      }
      // Refresh
      const data = await teamsApi.getMemberProjects(selectedTeam.id, managingMember.userId);
      setMemberProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project assignment');
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
                <div key={team.id} className="relative group">
                  <button
                    onClick={() => setSelectedTeam(team)}
                    className={`w-full text-left px-3 py-3 rounded-md transition-colors pr-16 ${
                      selectedTeam?.id === team.id ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted border border-transparent'
                    }`}
                  >
                    <div className="font-medium">{team.name}</div>
                    {team.description && <div className="text-xs text-muted-foreground truncate mt-1">{team.description}</div>}
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTeamToEdit(team);
                        setEditTeamName(team.name);
                        setEditTeamDesc(team.description || '');
                        setShowEditModal(true);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setTeamToDelete(team);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
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
                      <Plus className="w-4 h-4" /> Assign Existing Member
                    </h4>
                    <form onSubmit={handleAddMember} className="flex flex-col gap-3">
                      <div className="flex gap-3">
                        <select
                          className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={selectedUserId}
                          onChange={(e) => setSelectedUserId(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select user to add...</option>
                          {availableUsers
                            .filter(u => !members.some(m => m.userId === u.id))
                            .map(u => (
                            <option key={u.id} value={u.id}>{u.email}</option>
                          ))}
                        </select>
                        <select
                          className="w-40 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value)}
                          required
                        >
                          <option value={TEAM_ROLES.MEMBER}>Member</option>
                          <option value={TEAM_ROLES.ADMIN}>Admin</option>
                        </select>
                        <button type="submit" className="h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors shadow">
                          Add Member
                        </button>
                      </div>
                    </form>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-4 py-3 font-medium">Email</th>
                          <th className="px-4 py-3 font-medium">Global Role</th>
                          <th className="px-4 py-3 font-medium">Team Role</th>
                          <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.length === 0 ? (
                          <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No members found in this team.</td></tr>
                        ) : (
                          members.map(member => (
                            <tr key={member.userId} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                              <td className="px-4 py-3">
                                <div>{member.email}</div>
                                {member.addedBy && (
                                  <div className="text-xs text-muted-foreground mt-0.5">Added by {member.addedBy}</div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                                  {member.role}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <select 
                                  className="h-8 rounded border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                  value={member.teamRole || TEAM_ROLES.MEMBER}
                                  onChange={(e) => handleUpdateRole(member.userId, e.target.value)}
                                >
                                  <option value={TEAM_ROLES.MEMBER}>Member</option>
                                  <option value={TEAM_ROLES.ADMIN}>Admin</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() => handleManageProjects(member)}
                                  className="text-primary hover:bg-primary/10 p-1.5 rounded transition-colors mr-2"
                                  title="Manage Projects"
                                >
                                  <Settings className="w-4 h-4" />
                                </button>
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
                          .filter(c => c.permissionLevel === CONNECTION_ROLES.ADMIN && !connections.some(conn => conn.connectionId === c.id))
                          .map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.environment})</option>
                        ))}
                      </select>
                      <select
                        className="w-32 h-9 rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={selectedPermission}
                        onChange={(e) => setSelectedPermission(e.target.value)}
                        required
                      >
                        <option value={CONNECTION_ROLES.READ}>Read</option>
                        <option value={CONNECTION_ROLES.WRITE}>Write</option>
                        <option value={CONNECTION_ROLES.ADMIN}>Admin</option>
                      </select>
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
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                  <Shield className="w-3 h-3" />
                                  {conn.permissionLevel}
                                </span>
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
                  <label className="text-sm font-medium block mb-1.5">Team Name <span className="text-red-500">*</span></label>
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

      {/* Edit Team Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card w-full max-w-md rounded-lg shadow-lg border p-6 m-4 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4">Edit Team</h2>
            <form onSubmit={handleUpdateTeam}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Team Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editTeamName}
                    onChange={e => setEditTeamName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1.5">Description (Optional)</label>
                  <textarea
                    value={editTeamDesc}
                    onChange={e => setEditTeamDesc(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium shadow transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Team Confirmation Modal */}
      {teamToDelete && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card w-full max-w-sm rounded-lg shadow-lg border p-6 m-4 animate-in fade-in zoom-in-95">
            <h2 className="text-xl font-bold mb-4 text-destructive">Delete Team</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete the team <strong>{teamToDelete.name}</strong>? 
              This will remove all members and connections from the team. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setTeamToDelete(null)}
                className="px-4 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium border"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTeam}
                className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md text-sm font-medium shadow transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Team
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Manage Member Projects Modal */}
      {showManageProjectsModal && managingMember && createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-card w-full max-w-2xl rounded-lg shadow-lg border p-6 m-4 animate-in fade-in zoom-in-95 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Projects for {managingMember.email}</h2>
              <button onClick={() => setShowManageProjectsModal(false)} className="text-muted-foreground hover:text-foreground text-xl font-bold">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {managingLoading ? (
                <div className="py-8 text-center text-muted-foreground">Loading projects...</div>
              ) : connections.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">No projects assigned to this team yet.</div>
              ) : (
                <div className="space-y-3">
                  {connections.map(conn => {
                    const assigned = memberProjects.find(mp => mp.projectId === conn.connectionId);
                    const isAssigned = !!assigned;
                    
                    return (
                      <div key={conn.connectionId} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-input"
                            checked={isAssigned}
                            onChange={(e) => handleToggleMemberProject(conn.connectionId, e.target.checked, assigned ? assigned.permission : 'READ')}
                          />
                          <div>
                            <div className="font-medium text-sm">{conn.name}</div>
                            <div className="text-xs text-muted-foreground">{conn.environment}</div>
                          </div>
                        </div>
                        {isAssigned && (
                          <select
                            className="h-8 rounded border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={assigned.permission}
                            onChange={(e) => handleToggleMemberProject(conn.connectionId, true, e.target.value)}
                          >
                            <option value={CONNECTION_ROLES.READ}>Read</option>
                            <option value={CONNECTION_ROLES.WRITE}>Write</option>
                            <option value={CONNECTION_ROLES.ADMIN}>Admin</option>
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowManageProjectsModal(false)}
                className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md text-sm font-medium shadow transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
