import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, X } from 'lucide-react';

const RolesList = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'admin',
      name: 'Admin',
      permissions: ['Read', 'Write', 'Admin'],
      modified: 'Serwaa A.'
    },
    {
      id: 'director',
      name: 'Director',
      permissions: ['Read', 'Write'],
      modified: 'Serwaa A.'
    },
    {
      id: 'officer',
      name: 'Officer',
      permissions: ['Read', 'Write'],
      modified: 'Serwaa A.'
    }
  ];

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Roles & Permissions</h1>
        <button 
          onClick={() => navigate('/admin/users/roles/edit')}
          className="flex items-center gap-2 bg-[#1e293b] hover:bg-[#0f172a] text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit permissions
        </button>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-[250px_1fr_250px_100px] bg-[#273854] text-white text-[10px] font-bold uppercase tracking-wider px-6 py-4">
          <div>Role</div>
          <div>Permission</div>
          <div>Date Modified</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="flex flex-col">
          {roles.map((role) => (
            <div key={role.id} className="grid grid-cols-[250px_1fr_250px_100px] px-6 py-5 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors items-center">
              <div className="text-[13px] font-bold text-[#1e293b]">
                {role.name}
              </div>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((perm, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-[#f1f5f9] text-[#475569] text-[11px] font-medium px-3 py-1 rounded-full">
                    {perm} <X className="w-3 h-3 text-[#94a3b8] ml-1 cursor-pointer hover:text-[#64748b]" />
                  </span>
                ))}
              </div>
              <div className="text-[13px] font-medium text-[#475569]">
                {role.modified}
              </div>
              <div className="flex justify-end pr-4">
                <button 
                  onClick={() => navigate(`/admin/users/roles/edit/${role.id}`)}
                  className="text-gray-400 hover:text-[#1e293b] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RolesList;
