import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2, UserPlus } from 'lucide-react';
import { supabase } from '../../../../supabaseClient';

const AddUserModal = ({ isOpen, onClose, onSaved }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('officer');
  const [department, setDepartment] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName('');
      setEmail('');
      setRole('officer');
      setDepartment('');
      setError(null);
      setSuccess(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!fullName || !email) {
      setError('Please fill in the name and email.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Check if profile already exists with this email
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (existing) {
        // Update existing profile with new role
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role, 
            full_name: fullName, 
            department,
            status: 'Active',
          })
          .eq('id', existing.id);

        if (updateError) throw updateError;
      } else {
        // Create a new profile record
        // Note: The user may need to sign up via auth separately;
        // this creates the profile entry so the admin can pre-assign roles
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            email,
            full_name: fullName,
            role,
            department,
            status: 'Pending',
          });

        if (insertError) throw insertError;
      }

      // Log audit
      await supabase.from('audit_logs').insert({
        category: 'User',
        action: `Staff user added: ${fullName} as ${role}`,
        actor_name: 'Admin',
      });

      setSuccess(`${fullName} has been added as ${role.charAt(0).toUpperCase() + role.slice(1)}.`);

      // Auto-close after a brief moment
      setTimeout(() => {
        onSaved?.();
      }, 1200);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message || 'Failed to add user');
    } finally {
      setIsSaving(false);
    }
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
          <div className="px-6 pb-6 flex flex-col gap-5">
            
            <p className="text-[12.5px] font-medium text-gray-500 leading-relaxed">
              Add a staff member to the attestation portal. They will be assigned the selected role and department.
            </p>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 font-medium">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#1e293b] uppercase mb-2 tracking-wider">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Ama Owusu"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 h-[44px] text-[13px] font-medium text-[#1e293b] focus:outline-none focus:border-blue-500 transition-shadow"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-[#1e293b] uppercase mb-2 tracking-wider">Work Email</label>
              <input 
                type="email" 
                placeholder="e.g. a.owusu@mfa.gov.gh"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-4 h-[44px] text-[13px] font-medium text-[#1e293b] focus:outline-none focus:border-blue-500 transition-shadow"
              />
            </div>

            {/* Role + Department Row */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-[#1e293b] uppercase mb-2 tracking-wider">Portal Role</label>
                <div className="relative">
                  <select 
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-8 h-[44px] text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
                  >
                    <option value="officer">Officer</option>
                    <option value="director">Director</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-[10px] font-bold text-[#1e293b] uppercase mb-2 tracking-wider">Department</label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg pl-4 pr-8 h-[44px] text-[13px] font-medium text-gray-600 focus:outline-none cursor-pointer"
                  >
                    <option value="">Select department</option>
                    <option value="Consular Bureau">Consular Bureau</option>
                    <option value="Legal Directorate">Legal Directorate</option>
                    <option value="IT Systems">IT Systems</option>
                    <option value="Administration">Administration</option>
                    <option value="Finance">Finance</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-6 pt-2 flex justify-end gap-3 border-t border-gray-50 mt-auto">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-[#475569] text-[13px] font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-[#0f172a] hover:bg-black text-white text-[13px] font-bold shadow-sm transition-colors flex items-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              Add user
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default AddUserModal;
