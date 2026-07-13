import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import AddUserModal from './components/AddUserModal';

const UserManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get count of staff users (not regular citizens)
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['admin', 'officer', 'director']);
      setTotalCount(count || 0);

      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'officer', 'director'])
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setUsersData(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, itemsPerPage]);

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;

      await supabase.from('audit_logs').insert({
        category: 'User',
        action: `Staff user removed`,
        actor_name: 'Admin',
        reference_id: userId,
      });

      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user: ' + err.message);
    }
  };

  const handleModalSaved = () => {
    setModalOpen(false);
    fetchUsers();
  };

  const getRoleBadge = (role) => {
    const roleDisplay = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User';
    switch(roleDisplay) {
      case 'Admin':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#ffe4e6] text-[#e11d48]">Admin</span>;
      case 'Director':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f3e8ff] text-[#9333ea]">Director</span>;
      case 'Officer':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#e0e7ff] text-[#4f46e5]">Officer</span>;
      default:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{roleDisplay}</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#16a34a]">Active</span>;
      case 'Inactive':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#94a3b8]">Inactive</span>;
      case 'Pending':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#d97706]">Pending</span>;
      default:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{status || 'Active'}</span>;
    }
  };

  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'Never';
    const d = new Date(timestamp);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Today ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    }
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) + ' ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">User management</h1>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add user
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Name</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Email</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Role</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Department</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Status</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Last Login</th>
              <th className="py-4 px-6 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-400 mt-2">Loading users...</p>
                </td>
              </tr>
            ) : usersData.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-gray-400 text-sm">
                  No staff users found. Add users with the button above.
                </td>
              </tr>
            ) : (
              usersData.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-600">{row.full_name || 'Unnamed'}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.email || '-'}</td>
                  <td className="py-4 px-6">{getRoleBadge(row.role)}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.department || '-'}</td>
                  <td className="py-4 px-6">{getStatusBadge(row.status)}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{formatLastLogin(row.last_login)}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(row.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="border-t border-gray-100 p-4 px-6 flex justify-between items-center bg-white">
          <div className="text-[12px] font-medium text-gray-500">
            Showing {totalCount === 0 ? 0 : (page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, totalCount)} out of {totalCount}
          </div>
          
          <div className="flex items-center gap-1 text-[13px] font-medium text-gray-600">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 text-gray-300 hover:text-gray-500 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => i + 1).map(p => (
              <button 
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded ${page === p ? 'bg-[#e2e8f0] font-bold text-[#1e293b]' : 'hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
            <button 
              onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))}
              disabled={page >= totalPages}
              className="p-1 hover:text-gray-800 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-gray-500">Items per page:</span>
            <div className="relative">
              <select 
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-[12px] font-medium text-[#475569] focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <AddUserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleModalSaved} />
    </div>
  );
};

export default UserManagement;
