import React, { useState, useEffect } from 'react';
import { ChevronDown, Check, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

const permissionData = {
  Officer: {
    'SUBMISSIONS': [
      { name: 'Submissions', c: false, r: true, u: true, d: false },
      { name: 'Reject submissions', c: false, r: false, u: true, d: false },
      { name: 'Director sign-off', c: false, r: false, u: false, d: false }
    ],
    'APPOINTMENTS': [
      { name: 'Appointment calendar', c: false, r: true, u: true, d: false },
      { name: 'Check-in citizen', c: false, r: false, u: true, d: false }
    ],
    'REVENUE': [
      { name: 'Revenue report', c: false, r: false, u: false, d: false },
      { name: 'Settlement log', c: false, r: false, u: false, d: false }
    ],
    'CONFIGURATION': [
      { name: 'Slot configuration', c: false, r: false, u: false, d: false },
      { name: 'Blackout dates', c: false, r: false, u: false, d: false },
      { name: 'Fees & tiers', c: false, r: false, u: false, d: false },
      { name: 'SMS notifications', c: false, r: false, u: false, d: false }
    ],
    'USERS & ACCESS': [
      { name: 'User management', c: false, r: false, u: false, d: false },
      { name: 'Roles & permissions', c: false, r: false, u: false, d: false }
    ],
    'IT SUPPORT': [
      { name: 'Support tickets', c: true, r: true, u: true, d: false },
      { name: 'Audit logs', c: false, r: false, u: false, d: false }
    ]
  },
  Director: {
    'SUBMISSIONS': [
      { name: 'Submissions', c: false, r: true, u: true, d: false },
      { name: 'Reject submissions', c: false, r: false, u: true, d: false },
      { name: 'Director sign-off', c: false, r: false, u: true, d: false }
    ],
    'APPOINTMENTS': [
      { name: 'Appointment calendar', c: false, r: false, u: true, d: false },
      { name: 'Check-in citizen', c: false, r: false, u: false, d: false }
    ],
    'REVENUE': [
      { name: 'Revenue report', c: false, r: true, u: false, d: false },
      { name: 'Settlement log', c: false, r: true, u: false, d: false }
    ],
    'CONFIGURATION': [
      { name: 'Slot configuration', c: false, r: false, u: false, d: false },
      { name: 'Blackout dates', c: false, r: false, u: false, d: false },
      { name: 'Fees & tiers', c: false, r: false, u: false, d: false },
      { name: 'SMS notifications', c: false, r: false, u: false, d: false }
    ],
    'USERS & ACCESS': [
      { name: 'User management', c: false, r: false, u: false, d: false },
      { name: 'Roles & permissions', c: false, r: false, u: false, d: false }
    ],
    'IT SUPPORT': [
      { name: 'Support tickets', c: true, r: true, u: true, d: false },
      { name: 'Audit logs', c: false, r: false, u: false, d: false }
    ]
  },
  Admin: {
    'SUBMISSIONS': [
      { name: 'Submissions', c: false, r: true, u: true, d: false },
      { name: 'Reject submissions', c: false, r: false, u: true, d: false },
      { name: 'Director sign-off', c: false, r: false, u: false, d: false }
    ],
    'APPOINTMENTS': [
      { name: 'Appointment calendar', c: false, r: true, u: true, d: false },
      { name: 'Check-in citizen', c: false, r: false, u: true, d: false }
    ],
    'REVENUE': [
      { name: 'Revenue report', c: false, r: true, u: false, d: false },
      { name: 'Settlement log', c: false, r: true, u: false, d: false }
    ],
    'CONFIGURATION': [
      { name: 'Slot configuration', c: true, r: true, u: true, d: true },
      { name: 'Blackout dates', c: true, r: true, u: true, d: true },
      { name: 'Fees & tiers', c: true, r: true, u: true, d: false },
      { name: 'SMS notifications', c: true, r: true, u: true, d: false }
    ],
    'USERS & ACCESS': [
      { name: 'User management', c: true, r: true, u: true, d: true },
      { name: 'Roles & permissions', c: true, r: true, u: true, d: false }
    ],
    'IT SUPPORT': [
      { name: 'Support tickets', c: true, r: true, u: true, d: false },
      { name: 'Audit logs', c: false, r: true, u: false, d: false }
    ]
  }
};

const CustomCheckbox = ({ checked }) => {
  if (checked) {
    return (
      <div className="w-[18px] h-[18px] bg-[#1e293b] rounded-md flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
      </div>
    );
  }
  return (
    <div className="w-[18px] h-[18px] bg-white border border-gray-300 rounded-md shrink-0"></div>
  );
};

const RolesPermissions = () => {
  const { roleId } = useParams();
  const navigate = useNavigate();
  
  // Map url params (admin, director, officer) to the Tab names
  const roleMap = {
    officer: 'Officer',
    director: 'Director',
    admin: 'Admin'
  };

  const initialTab = roleId && roleMap[roleId] ? roleMap[roleId] : 'Officer';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Update active tab if URL changes
  useEffect(() => {
    if (roleId && roleMap[roleId]) {
      setActiveTab(roleMap[roleId]);
    }
  }, [roleId]);

  const tabs = ['Officer', 'Director', 'Admin'];

  const currentData = permissionData[activeTab];

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header Area */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/users/roles')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-[22px] font-bold text-[#1e293b]">Edit Permissions</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 mb-6 border-b border-gray-200">
        {tabs.map((tab) => {
          // If a specific role is being edited, disable the other tabs
          const isDisabled = roleId && roleMap[roleId] !== tab;
          
          return (
            <button
              key={tab}
              onClick={() => {
                if (!isDisabled) setActiveTab(tab);
              }}
              disabled={isDisabled}
              className={`pb-3 px-1 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab 
                  ? 'border-[#1e293b] text-[#1e293b]' 
                  : isDisabled 
                    ? 'border-transparent text-gray-300 cursor-not-allowed opacity-50'
                    : 'border-transparent text-[#94a3b8] hover:text-[#64748b]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Header */}
        <div className="grid grid-cols-[300px_1fr_1fr_1fr_1fr] bg-[#273854] text-white text-[10px] font-bold uppercase tracking-wider px-6 py-4">
          <div>Module</div>
          <div className="flex justify-center">Create</div>
          <div className="flex justify-center">Read</div>
          <div className="flex justify-center">Update</div>
          <div className="flex justify-center">Delete</div>
        </div>

        {/* Table Body (Modules) */}
        <div className="flex flex-col">
          {Object.entries(currentData).map(([moduleName, rows], idx) => (
            <div key={moduleName} className="flex flex-col">
              
              {/* Module Header Row */}
              <div className="flex items-center gap-2 px-6 py-3 bg-[#f8fafc] border-b border-gray-100">
                <ChevronDown className="w-4 h-4 text-gray-400" />
                <span className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">{moduleName}</span>
              </div>

              {/* Module Data Rows */}
              {rows.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-[300px_1fr_1fr_1fr_1fr] px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors items-center">
                  <div className="text-[13px] font-medium text-[#475569] pl-6">
                    {row.name}
                  </div>
                  <div className="flex justify-center">
                    <CustomCheckbox checked={row.c} />
                  </div>
                  <div className="flex justify-center">
                    <CustomCheckbox checked={row.r} />
                  </div>
                  <div className="flex justify-center">
                    <CustomCheckbox checked={row.u} />
                  </div>
                  <div className="flex justify-center">
                    <CustomCheckbox checked={row.d} />
                  </div>
                </div>
              ))}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default RolesPermissions;
