import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  ArrowUpRight,
  Loader2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { supabase } from '../../supabaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Total Applications', value: '0', icon: FileText, change: '0%', type: 'increase' },
    { name: 'Pending Review', value: '0', icon: Clock, change: '0%', type: 'neutral' },
    { name: 'Appointments Today', value: '0', icon: CalendarIcon, change: '0%', type: 'increase' },
    { name: 'Total Users', value: '0', icon: Users, change: '0%', type: 'increase' },
  ]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();

    const channel = supabase
      .channel('admin_dashboard_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // 1. Fetch Stats
      const { count: totalApps } = await supabase.from('applications').select('*', { count: 'exact', head: true });
      const { count: pendingApps } = await supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'Pending review');
      const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      // Fetch applications with appointments
      const { data: allAppsWithAppointments } = await supabase
        .from('applications')
        .select('document_type, appointment_details')
        .not('appointment_details', 'is', null);
      
      const appsToday = allAppsWithAppointments?.filter(app => app.appointment_details?.date === today).length || 0;

      setStats([
        { name: 'Total Applications', value: totalApps?.toString() || '0', icon: FileText, change: '+100%', type: 'increase' },
        { name: 'Pending Review', value: pendingApps?.toString() || '0', icon: Clock, change: '', type: 'neutral' },
        { name: 'Appointments Today', value: appsToday.toString(), icon: CalendarIcon, change: '', type: 'increase' },
        { name: 'Total Users', value: totalUsers?.toString() || '0', icon: Users, change: '+100%', type: 'increase' },
      ]);

      // 2. Fetch Recent Applications
      const { data: apps, error: appsError } = await supabase
        .from('applications')
        .select(`id, document_type, status, submitted_at`)
        .order('submitted_at', { ascending: false })
        .limit(5);

      if (appsError) throw appsError;
      setRecentApplications(apps || []);

      // 3. Fetch Upcoming Appointments
      const upcoming = allAppsWithAppointments
        ?.filter(app => app.appointment_details?.date >= today)
        .sort((a, b) => a.appointment_details.date.localeCompare(b.appointment_details.date))
        .slice(0, 5);
      
      setUpcomingAppointments(upcoming || []);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending review': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-neutral-50 text-neutral-600 border-neutral-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-gold-500 animate-spin" />
        <p className="mt-4 text-neutral-400 font-bold tracking-tight">Syncing live dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-brand-navy-800 tracking-tight">System Overview</h1>
          <p className="text-neutral-500 text-sm mt-1">Live updates from the Document Attestation Portal.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">Live Sync Active</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl hover:border-brand-gold-500/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-neutral-50 group-hover:bg-brand-gold-500/10 rounded-2xl transition-colors">
                <stat.icon className="w-6 h-6 text-brand-navy-600 group-hover:text-brand-gold-600" />
              </div>
              {stat.change && (
                <div className="flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-neutral-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.name}</span>
              <span className="text-2xl font-black text-brand-navy-800 tracking-tighter">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
              <h2 className="text-lg font-black text-brand-navy-800 tracking-tight">Recent Applications</h2>
              <button className="text-xs font-black text-brand-gold-600 hover:text-brand-gold-700 uppercase tracking-widest">View all</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-neutral-400 uppercase tracking-widest border-b border-neutral-50">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Document Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                  {recentApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-neutral-50/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 text-xs font-black text-neutral-600 group-hover:text-brand-navy-800">#{app.id.slice(0, 8)}</td>
                      <td className="px-6 py-4 text-sm text-neutral-500 font-bold">{app.document_type}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-400 font-bold">
                        {new Date(app.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-brand-navy-800">
              <h2 className="text-lg font-bold text-white tracking-tight">Upcoming Appointments</h2>
              <CalendarIcon className="w-5 h-5 text-brand-gold-500" />
            </div>
            <div className="p-2">
              <div className="space-y-1">
                {upcomingAppointments.map((app, i) => (
                  <div key={i} className="p-4 rounded-2xl hover:bg-neutral-50 transition-all flex items-center justify-between border border-transparent hover:border-neutral-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-brand-gold-50 rounded-xl flex flex-col items-center justify-center border border-brand-gold-100">
                        <span className="text-[10px] font-black text-brand-gold-600 uppercase">{new Date(app.appointment_details.date).toLocaleDateString('en-GB', { month: 'short' })}</span>
                        <span className="text-sm font-black text-brand-navy-800 leading-none">{new Date(app.appointment_details.date).getDate()}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-brand-navy-800">Arrival at {app.appointment_details.time}</span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{app.document_type || 'Unknown Doc'}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && (
                  <div className="p-8 text-center text-neutral-400 italic text-sm">
                    No upcoming appointments.
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-6 mt-2 border-t border-neutral-50">
               <div className="p-5 bg-brand-gold-500 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Users className="w-16 h-16 text-brand-navy-800" />
                  </div>
                  <h3 className="text-brand-navy-800 font-black text-[10px] uppercase tracking-widest opacity-60 mb-1">Queue Efficiency</h3>
                  <span className="text-2xl font-black text-brand-navy-800">High</span>
                  <div className="w-full h-1.5 bg-brand-navy-800/10 rounded-full mt-3">
                    <div className="h-full bg-brand-navy-800 w-[92%] rounded-full"></div>
                  </div>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
