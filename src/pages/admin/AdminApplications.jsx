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
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';
import ApplicationDetailsModal from '../dashboard/components/ApplicationDetailsModal';

const AdminApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isProcessing, setIsProcessing] = useState(null); // Track ID of application being processed
  const [tableExists, setTableExists] = useState(true);

  const sqlCommand = `CREATE TABLE applications (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  status text DEFAULT 'Submitted',
  personal_details jsonb,
  service_tier text,
  appointment_details jsonb,
  documents jsonb DEFAULT '[]',
  submitted_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
alter table applications enable row level security;

-- Policies
CREATE POLICY "Users can view their own applications" 
ON applications FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" 
ON applications FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all applications" 
ON applications FOR SELECT 
USING (auth.jwt() ->> 'email' = 'fsowah001@gmail.com');

CREATE POLICY "Admins can update all applications" 
ON applications FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'fsowah001@gmail.com');

-- Enable Realtime
alter publication supabase_realtime add table applications;`;

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
    setTableExists(true);
    try {
      let query = supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (activeFilter !== 'All') {
        query = query.eq('status', activeFilter);
      }

      if (searchTerm) {
        query = query.or(`id.ilike.%${searchTerm}%,document_type.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          setTableExists(false);
          return;
        }
        throw error;
      }
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
      await supabase
        .from('application_status_history')
        .insert([{ application_id: id, status: newStatus, changed_by: user?.id }]);
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

  if (!tableExists) {
    return (
      <div className="max-w-4xl mx-auto py-12 animate-fade-in">
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
          <div className="p-10 text-center border-b border-neutral-50 bg-neutral-50/30">
            <div className="w-20 h-20 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Database className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black text-brand-navy-800 tracking-tight mb-4">Database Setup Required</h1>
            <p className="text-neutral-500 max-w-lg mx-auto">
              The <code className="bg-neutral-100 px-2 py-0.5 rounded font-bold text-brand-navy-700">applications</code> table is missing or needs configuration in your database.
            </p>
          </div>
          
          <div className="p-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold-500 to-brand-navy-800 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#1e1e1e] rounded-xl p-6 font-mono text-sm text-emerald-400 overflow-x-auto shadow-2xl">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <span className="text-xs font-bold text-white/40 uppercase tracking-widest">PostgreSQL Command</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(sqlCommand);
                      alert('SQL copied to clipboard!');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all active:scale-95"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Copy Code</span>
                  </button>
                </div>
                <pre>{sqlCommand}</pre>
              </div>
            </div>

            <div className="mt-10 flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-blue-900 mb-1 tracking-tight">How to fix the RLS Error?</h4>
                <p className="text-[13px] text-blue-800/70 mb-4 font-medium">
                  If the table exists but you get "Violates Row-Level Security Policy", run the <strong>Policies</strong> section of the code above in your Supabase SQL Editor.
                </p>
                <ol className="text-[13px] text-blue-800/70 space-y-2 list-decimal ml-4 font-medium">
                  <li>Go to your <strong>Supabase Dashboard</strong></li>
                  <li>Click on <strong>SQL Editor</strong></li>
                  <li>Paste the code above and click <strong>Run</strong></li>
                </ol>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full mt-8 py-4 bg-brand-navy-800 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
            >
              I've applied the SQL, Refresh Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-brand-navy-800 tracking-tight">Applications Management</h1>
          <p className="text-neutral-500 text-sm mt-0.5">Review and process document attestation requests in real-time.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-neutral-200 px-3 py-2 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-all shadow-sm">
            <FileText className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                activeFilter === filter
                  ? 'bg-brand-navy-800 text-white shadow-lg shadow-brand-navy-800/10'
                  : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative group shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-brand-navy-800 transition-colors" />
          <input
            type="text"
            placeholder="Search ID, Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-sm w-full md:w-60 outline-none focus:bg-white focus:border-brand-navy-200 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden min-h-[300px] relative">
        {isLoading && !applications.length ? (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-brand-gold-500 animate-spin" />
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-neutral-50/50 text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-100">
                <th className="px-4 lg:px-6 py-3">Application Info</th>
                <th className="px-4 lg:px-6 py-3 hidden md:table-cell">Applicant</th>
                <th className="px-4 lg:px-6 py-3 hidden sm:table-cell">Submitted</th>
                <th className="px-4 lg:px-6 py-3 text-center">Status</th>
                <th className="px-4 lg:px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-neutral-50/30 transition-colors group">
                  <td className="px-4 lg:px-6 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-black text-brand-navy-800 tracking-tight group-hover:text-black">{app.id}</span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{app.document_type}</span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3.5 hidden md:table-cell">
                    <span className="text-sm font-bold text-neutral-800">{app.personal_details?.fullName || 'N/A'}</span>
                  </td>
                  <td className="px-4 lg:px-6 py-3.5 text-xs font-bold text-neutral-500 hidden sm:table-cell">
                    {new Date(app.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 lg:px-6 py-3.5">
                    <div className="flex justify-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => navigate(`/admin/applications/${app.id}`)}
                        className="p-2 bg-neutral-50 text-neutral-400 hover:text-brand-navy-800 hover:bg-neutral-100 rounded-xl transition-all shadow-sm"
                        title="View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {isProcessing === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                      ) : (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'Approved')}
                            className="p-2 bg-emerald-50 text-emerald-500 hover:bg-emerald-100 rounded-xl transition-all shadow-sm"
                            title="Approve"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                            className="p-2 bg-red-50 text-red-400 hover:bg-red-100 rounded-xl transition-all shadow-sm"
                            title="Reject"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && !isLoading && (
                <tr>
                  <td colSpan="5" className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-400">
                      <AlertCircle className="w-8 h-8 mb-3 opacity-20" />
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
