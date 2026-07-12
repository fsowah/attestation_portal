import React, { useState } from 'react';
import { Plus, Trash2, Edit2, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import AddUserModal from './components/AddUserModal';

const UserManagement = () => {
  const [modalOpen, setModalOpen] = useState(false);

  // Mock data based on Figma design
  const usersData = [
    { id: 1, name: 'Serwaa Acheampong', email: 's.acheampong@mfa.gov.gh', role: 'Admin', department: 'IT Systems', status: 'Active', lastLogin: 'Today 7:55:34' },
    { id: 2, name: 'Akosua Kyei', email: 'a.kyei@mfa.gov.gh', role: 'Director', department: 'Consular Bureau', status: 'Inactive', lastLogin: '14 Apr 26 8:30:09' },
    { id: 3, name: 'Kwame Boateng', email: 'k.boateng@mfa.gov.gh', role: 'Officer', department: 'Consular Bureau', status: 'Pending', lastLogin: 'Never' },
  ];

  const getRoleBadge = (role) => {
    switch(role) {
      case 'Admin':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#ffe4e6] text-[#e11d48]">Admin</span>;
      case 'Director':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f3e8ff] text-[#9333ea]">Director</span>;
      case 'Officer':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#e0e7ff] text-[#4f46e5]">Officer</span>;
      default:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{role}</span>;
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
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

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
            {usersData.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-6 text-[13px] font-medium text-gray-600">{row.name}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.email}</td>
                <td className="py-4 px-6">{getRoleBadge(row.role)}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.department}</td>
                <td className="py-4 px-6">{getStatusBadge(row.status)}</td>
                <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.lastLogin}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                    {row.id === 3 ? <Trash2 className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="border-t border-gray-100 p-4 px-6 flex justify-between items-center bg-white">
          <div className="text-[12px] font-medium text-gray-500">
            Showing 1-10 out of 100
          </div>
          
          <div className="flex items-center gap-1 text-[13px] font-medium text-gray-600">
            <button className="p-1 text-gray-300 hover:text-gray-500"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-[#e2e8f0] font-bold text-[#1e293b]">1</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">2</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">3</button>
            <span className="px-1 text-gray-400">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">7</button>
            <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50">8</button>
            <button className="p-1 hover:text-gray-800"><ChevronRight className="w-4 h-4" /></button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-gray-500">Items per page:</span>
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-[12px] font-medium text-[#475569] focus:outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <AddUserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default UserManagement;
