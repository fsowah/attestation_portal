import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  MoreVertical, 
  Check, 
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import ApplicationDetailsModal from '../dashboard/components/ApplicationDetailsModal';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null); // Track ID of application being processed

  const filters = ['All', 'Submitted', 'Pending review', 'Approved', 'Rejected', 'Completed'];

  useEffect(() => {
    fetchApplications();

    // Realtime subscription
    const channel = supabase
      .channel('admin_applications_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchApplications();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeFilter, searchTerm]);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (activeFilter !== 'All') {
        query = query.eq('status', activeFilter);
      }

      if (searchTerm) {
        query = query.or(`id.ilike.%${searchTerm}%,document_type.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    setIsProcessing(id);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      // Realtime will trigger the refresh
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setIsProcessing(null);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      case 'Completed': return 'bg-brand-navy-50 text-brand-navy-600 border-brand-navy-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy-800 tracking-tight">Applications Management</h1>
          <p className="text-neutral-500 text-sm mt-1">Review and process document attestation requests in real-time.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-neutral-200 px-4 py-2.5 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm">
            <FileText className="w-4 h-4" />
            <span>Export Registry</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? 'bg-brand-navy-800 text-white shadow-lg shadow-brand-navy-800/10' 
                  : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-brand-navy-800 transition-colors" />
          <input 
            type="text" 
            placeholder="Search ID, Type..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl text-sm w-full md:w-72 outline-none focus:bg-white focus:border-brand-navy-200 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden min-h-[400px] relative">
        {isLoading && !applications.length ? (
           <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
             <Loader2 className="w-8 h-8 text-brand-gold-500 animate-spin" />
           </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                <th className="px-8 py-5">Application Info</th>
                <th className="px-8 py-5">Applicant Details</th>
                <th className="px-8 py-5">Submitted</th>
                <th className="px-8 py-5 text-center">Status</th>
                <th className="px-8 py-5 text-right pr-12">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-black text-brand-navy-800 tracking-tight group-hover:text-black">{app.id}</span>
                      <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest">{app.document_type}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-neutral-800">{app.personal_details?.fullName || 'N/A'}</span>
                      <span className="text-[11px] text-neutral-400 font-medium">{app.personal_details?.email || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-neutral-500">
                    {new Date(app.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 pr-12 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setSelectedApplication(app)}
                        className="p-2.5 bg-neutral-50 text-neutral-400 hover:text-brand-navy-800 hover:bg-neutral-100 rounded-xl transition-all shadow-sm"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      
                      {isProcessing === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400 mx-2" />
                      ) : (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'Approved')}
                            className="p-2.5 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-xl transition-all shadow-sm" 
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                            className="p-2.5 bg-red-50 text-red-400 hover:bg-red-100 rounded-xl transition-all shadow-sm" 
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-sm font-medium italic">No applications found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedApplication && (
        <ApplicationDetailsModal 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
      )}
    </div>
  );
};

export default AdminApplications;
