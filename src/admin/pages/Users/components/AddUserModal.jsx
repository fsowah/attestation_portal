import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [invites, setInvites] = useState([]);
  const [hoveredInviteIndex, setHoveredInviteIndex] = useState(null);
  
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset state when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setShowDropdown(false);
      setInvites([]);
      setHoveredInviteIndex(null);
    }
  }, [isOpen]);

  // Mock AD search results
  const mockResults = [
    { id: 'ad1', name: 'Ama Owusu', email: 'a.owusu@mfa.gov.gh', adRole: 'Administrative Officer', adDept: 'MFA-ADM-003' },
    { id: 'ad2', name: 'Ama Owusu', email: 'a.owusu@mfa.gov.gh', adRole: 'Administrative Officer', adDept: 'MFA-ADM-003' },
    { id: 'ad3', name: 'Ama Owusu', email: 'a.owusu@mfa.gov.gh', adRole: 'Administrative Officer', adDept: 'MFA-ADM-003' },
  ];

  const handleSelectUser = (user) => {
    setInvites([...invites, { ...user, portalRole: 'Officer' }]);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleRoleChange = (index, newRole) => {
    const updated = [...invites];
    updated[index].portalRole = newRole;
    setInvites(updated);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        
        <div className={`bg-white w-[550px] rounded-xl shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 pb-4">
            <h2 className="text-[18px] font-bold text-[#1e293b]">Add user</h2>
            <button 
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Form Content */}
          <div className="px-6 pb-6 flex flex-col gap-6">
            
            <p className="text-[12.5px] font-medium text-gray-500 leading-relaxed">
              Search the MOFA Azure AD directory by email. User details are pulled automatically you only assign their portal role and department.
            </p>

            {/* Search Input Area */}
            <div className="relative">
              <label className="block text-[10px] font-bold text-[#1e293b] uppercase mb-2 tracking-wider">Search by work email</label>
              
              <div className="relative" ref={dropdownRef}>
                <input 
                  type="text" 
                  placeholder="e.g. a.owusu@mfa.gov.gh" 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => {
                    if (searchTerm.length > 0) setShowDropdown(true);
                  }}
                  className="w-full bg-white border border-gray-200 rounded-lg px-4 h-[44px] text-[13px] font-medium text-[#1e293b] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
                />

                {/* Autocomplete Dropdown */}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 max-h-[200px] overflow-y-auto animate-in fade-in slide-in-from-top-2">
                    {mockResults.map((user, idx) => (
                      <div 
                        key={idx} 
                        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleSelectUser(user)}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center text-[13px] font-bold shrink-0">
                          {user.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#1e293b]">{user.name}</span>
                          <span className="text-[12px] font-medium text-gray-400">{user.email}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Invites Section */}
            {invites.length > 0 && (
              <div>
                <label className="block text-[10px] font-bold text-[#1e293b] uppercase mb-3 tracking-wider">Invites</label>
                
                <div className="flex flex-col gap-4">
                  {invites.map((invite, index) => (
                    <div key={index} className="flex items-center justify-between group">
                      
                      {/* Avatar and Info with Tooltip */}
                      <div 
                        className="flex items-center gap-4 relative"
                        onMouseEnter={() => setHoveredInviteIndex(index)}
                        onMouseLeave={() => setHoveredInviteIndex(null)}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                          invite.portalRole === 'Admin' ? 'bg-[#ffe4e6] text-[#e11d48]' :
                          invite.portalRole === 'Director' ? 'bg-[#f3e8ff] text-[#9333ea]' :
                          'bg-[#e0e7ff] text-[#4f46e5]'
                        }`}>
                          {invite.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-[#1e293b]">{invite.name}</span>
                          <span className="text-[12px] font-medium text-gray-400">{invite.email}</span>
                        </div>

                        {/* Hover Tooltip (Matching Figma "Users-send list on hover") */}
                        {hoveredInviteIndex === index && (
                          <div className="absolute top-full left-10 mt-1 z-30 bg-white border border-gray-100 rounded-xl shadow-xl p-4 w-[240px] animate-in fade-in slide-in-from-top-1 pointer-events-none">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0 ${
                                invite.portalRole === 'Admin' ? 'bg-[#ffe4e6] text-[#e11d48]' :
                                invite.portalRole === 'Director' ? 'bg-[#f3e8ff] text-[#9333ea]' :
                                'bg-[#e0e7ff] text-[#4f46e5]'
                              }`}>
                                {invite.name.charAt(0)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-bold text-[#1e293b]">{invite.name}</span>
                                <span className="text-[12px] font-medium text-gray-400 mb-1">{invite.email}</span>
                                <span className="text-[12px] font-medium text-gray-600">{invite.adRole}</span>
                                <span className="text-[12px] font-medium text-gray-400">{invite.adDept}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Role Dropdown */}
                      <div className="relative w-[130px]">
                        <select 
                          value={invite.portalRole}
                          onChange={(e) => handleRoleChange(index, e.target.value)}
                          className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-8 py-2 text-[13px] font-medium text-gray-600 focus:outline-none focus:border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <option value="Officer">Officer</option>
                          <option value="Admin">Admin</option>
                          <option value="Director">Director</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-6 pt-2 flex justify-end gap-3 border-t border-gray-50 mt-auto">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-[#475569] text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-[#0f172a] hover:bg-black text-white text-[13px] font-bold shadow-sm transition-colors">
              Send invite{invites.length > 1 ? 's' : ''}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddUserModal;
