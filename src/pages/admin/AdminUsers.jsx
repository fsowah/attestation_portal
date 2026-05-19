import React, { useState, useEffect } from 'react';
import { Shield, ShieldOff, Loader2, RefreshCw, Search, UserCheck, Users } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err) {
      showToast('error', `Failed to load users: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (profileId, displayName, newRole) => {
    setUpdatingId(profileId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', profileId);

      if (error) throw error;

      setProfiles(prev =>
        prev.map(p => p.id === profileId ? { ...p, role: newRole } : p)
      );
      showToast('success', `${displayName} has been ${newRole === 'admin' ? 'promoted to Admin' : 'changed to User'}.`);
    } catch (err) {
      showToast('error', `Update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const filtered = profiles.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.full_name?.toLowerCase().includes(q) ||
      p.role?.toLowerCase().includes(q)
    );
  });

  const adminCount = profiles.filter(p => p.role === 'admin').length;
  const userCount  = profiles.filter(p => p.role !== 'admin').length;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-navy-800">User Management</h1>
        <p className="text-sm text-neutral-400 mt-1">Manage roles and access levels for portal users.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm">
          <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">Total Users</p>
          <p className="text-2xl font-black text-brand-navy-800 mt-1">{profiles.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm">
          <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">Admins</p>
          <p className="text-2xl font-black text-brand-gold-600 mt-1">{adminCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-[11px] text-neutral-400 font-semibold uppercase tracking-wider">Applicants</p>
          <p className="text-2xl font-black text-brand-navy-800 mt-1">{userCount}</p>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2 w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none text-sm w-full placeholder:text-neutral-400"
            />
          </div>
          <button
            onClick={fetchProfiles}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-neutral-100 text-neutral-500 hover:text-brand-navy-800 hover:bg-neutral-50 transition-all text-sm font-medium shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-brand-gold-500 animate-spin" />
            <p className="text-sm text-neutral-400">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center px-6">
            <Users className="w-10 h-10 text-neutral-200" />
            <p className="text-sm font-medium text-neutral-400">
              {searchQuery ? 'No users match your search.' : 'No user profiles found.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-neutral-400 text-[11px] font-bold uppercase tracking-wider">
                    <th className="text-left px-6 py-3">User</th>
                    <th className="text-left px-6 py-3">Joined</th>
                    <th className="text-left px-6 py-3">Role</th>
                    <th className="text-right px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {filtered.map(profile => {
                    const isAdmin = profile.role === 'admin';
                    const isSelf = profile.id === currentUser?.id;

                    return (
                      <tr key={profile.id} className="hover:bg-neutral-50/50 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isAdmin ? 'bg-brand-gold-100 text-brand-gold-700' : 'bg-neutral-100 text-neutral-500'}`}>
                              {(profile.full_name || '?')[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-neutral-800 truncate max-w-[200px]">
                              {profile.full_name || <span className="text-neutral-400 italic">No name</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-neutral-400 text-[13px]">
                          {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-6 py-3.5">
                          <RoleBadge isAdmin={isAdmin} />
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          {isSelf ? (
                            <span className="text-[11px] text-neutral-300 font-medium italic">Current session</span>
                          ) : (
                            <RoleToggleButton
                              isAdmin={isAdmin}
                              isUpdating={updatingId === profile.id}
                              onClick={() => updateRole(profile.id, profile.full_name || 'User', isAdmin ? 'user' : 'admin')}
                            />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col divide-y divide-neutral-100">
              {filtered.map(profile => {
                const isAdmin = profile.role === 'admin';
                const isSelf = profile.id === currentUser?.id;

                return (
                  <div key={profile.id} className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isAdmin ? 'bg-brand-gold-100 text-brand-gold-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {(profile.full_name || '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-semibold text-neutral-800 text-sm truncate">
                        {profile.full_name || <span className="text-neutral-400 italic text-xs">No name</span>}
                      </p>
                      <div className="mt-1.5">
                        <RoleBadge isAdmin={isAdmin} />
                      </div>
                    </div>
                    <div className="shrink-0">
                      {isSelf ? (
                        <span className="text-[10px] text-neutral-300 italic">You</span>
                      ) : (
                        <RoleToggleButton
                          isAdmin={isAdmin}
                          isUpdating={updatingId === profile.id}
                          onClick={() => updateRole(profile.id, profile.full_name || 'User', isAdmin ? 'user' : 'admin')}
                          compact
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer count */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-neutral-50 bg-neutral-50/50">
            <p className="text-[11px] text-neutral-400">
              Showing {filtered.length} of {profiles.length} users
            </p>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in-up max-w-sm ${
          toast.type === 'success'
            ? 'bg-[#e5f4ed] text-[#004728] border border-[#c3e6d5]'
            : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {toast.type === 'success' ? <UserCheck className="w-4 h-4 shrink-0" /> : <ShieldOff className="w-4 h-4 shrink-0" />}
          {toast.message}
        </div>
      )}
    </div>
  );
};

const RoleBadge = ({ isAdmin }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
    isAdmin
      ? 'bg-brand-gold-100 text-brand-gold-700 border border-brand-gold-200'
      : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
  }`}>
    {isAdmin ? <Shield className="w-3 h-3" /> : null}
    {isAdmin ? 'Admin' : 'User'}
  </span>
);

const RoleToggleButton = ({ isAdmin, isUpdating, onClick, compact }) => (
  <button
    onClick={onClick}
    disabled={isUpdating}
    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 ${
      isAdmin
        ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
        : 'bg-brand-navy-800 text-white hover:bg-black border border-transparent'
    } ${compact ? 'px-2.5 py-1' : ''}`}
  >
    {isUpdating ? (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    ) : isAdmin ? (
      <ShieldOff className="w-3.5 h-3.5" />
    ) : (
      <Shield className="w-3.5 h-3.5" />
    )}
    {!compact && (isAdmin ? 'Remove Admin' : 'Make Admin')}
  </button>
);

export default AdminUsers;
