import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Users, ClipboardList, Loader2, TrendingUp, TrendingDown } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    todaysAppointments: 0,
    activeStaff: 0,
    openTickets: 0,
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Total submissions count
      const { count: submissionCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true });

      // 2. Today's appointments
      const today = new Date().toISOString().split('T')[0];
      const { data: todayApps } = await supabase
        .from('applications')
        .select('id')
        .eq('appointment_details->>date', today);

      // 3. Active staff count
      const { count: staffCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .in('role', ['officer', 'director', 'admin'])
        .eq('status', 'Active');

      // 4. Open support tickets
      const { count: ticketCount } = await supabase
        .from('support_tickets')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Open');

      setStats({
        totalSubmissions: submissionCount || 0,
        todaysAppointments: todayApps?.length || 0,
        activeStaff: staffCount || 0,
        openTickets: ticketCount || 0,
      });

      // 5. Recent applications for the activity feed
      const { data: recent } = await supabase
        .from('applications')
        .select('id, full_name, document_type, status, submitted_at, service_tier')
        .order('submitted_at', { ascending: false })
        .limit(5);

      setRecentApplications(recent || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Submissions',
      value: stats.totalSubmissions,
      subtitle: 'Documents received',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      iconBg: 'bg-blue-50'
    },
    {
      title: "Today's Appointments",
      value: stats.todaysAppointments,
      subtitle: 'Scheduled for today',
      icon: <Calendar className="w-6 h-6 text-yellow-500" />,
      iconBg: 'bg-yellow-50'
    },
    {
      title: 'Active Staff',
      value: stats.activeStaff,
      subtitle: 'Officers & Directors',
      icon: <Users className="w-6 h-6 text-green-500" />,
      iconBg: 'bg-green-50'
    },
    {
      title: 'Open Support Tickets',
      value: stats.openTickets,
      subtitle: 'Awaiting resolution',
      icon: <ClipboardList className="w-6 h-6 text-yellow-500" />,
      iconBg: 'bg-yellow-50'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending review':
        return <span className="px-2.5 py-0.5 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[10px] font-bold">Pending</span>;
      case 'Approved':
        return <span className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-[10px] font-bold">Approved</span>;
      case 'Rejected':
        return <span className="px-2.5 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-full text-[10px] font-bold">Rejected</span>;
      case 'Forwarded to Director':
        return <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-[10px] font-bold">With Director</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-[10px] font-bold">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-gray-400 mb-1">{card.title}</span>
              <span className="text-[32px] font-bold text-gray-800 leading-none mb-1">{card.value}</span>
              <span className="text-[11px] font-medium text-gray-400">{card.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two sections below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        
        {/* Recent Submissions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-[14px] font-bold text-[#1e293b]">Recent Submissions</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {recentApplications.length === 0 ? (
              <div className="flex items-center justify-center h-full text-sm text-gray-400">
                No submissions yet
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentApplications.map((app, idx) => (
                  <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-900 truncate">{app.full_name || 'Unknown'}</span>
                        {app.service_tier === 'Express' && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-[9px] font-bold rounded">Express</span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-400">{app.id} · {app.document_type}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {getStatusBadge(app.status)}
                      <span className="text-[11px] text-gray-400 w-12 text-right">{formatDate(app.submitted_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats / Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm w-full h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-[14px] font-bold text-[#1e293b]">System Overview</h3>
          </div>
          <div className="flex-1 p-6 flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-[13px] font-medium text-gray-700">Pending Review</span>
              </div>
              <span className="text-[15px] font-bold text-gray-900">—</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-[13px] font-medium text-gray-700">With Director</span>
              </div>
              <span className="text-[15px] font-bold text-gray-900">—</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-[13px] font-medium text-gray-700">Approved</span>
              </div>
              <span className="text-[15px] font-bold text-gray-900">—</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-[13px] font-medium text-gray-700">Rejected</span>
              </div>
              <span className="text-[15px] font-bold text-gray-900">—</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
