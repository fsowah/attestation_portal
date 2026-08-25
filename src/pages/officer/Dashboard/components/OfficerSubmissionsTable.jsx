import React, { useState } from 'react';
import { Filter, Download, MoreHorizontal, Loader2 } from 'lucide-react';
import OfficerApplicationDrawer from './OfficerApplicationDrawer';

const OfficerSubmissionsTable = ({ applications = [], isLoading = false, onRefresh }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  
  const pendingCount = applications.filter(a => a.status === 'Pending review').length;
  const approvedCount = applications.filter(a => a.status === 'Approved').length;
  const rejectedCount = applications.filter(a => a.status === 'Rejected').length;

  const tabs = [
    { name: 'All', count: applications.length },
    { name: 'Pending', count: pendingCount },
    { name: 'Approved', count: approvedCount },
    { name: 'Rejected', count: rejectedCount },
  ];

  const filteredApplications = applications.filter(app => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Pending') return app.status === 'Pending review';
    return app.status === activeTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending review':
        return <span className="px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[11px] font-bold">Pending review</span>;
      case 'Approved':
        return <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-bold">Approved</span>;
      case 'Rejected':
        return <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-[11px] font-bold">Rejected</span>;
      default:
        return <span>{status}</span>;
    }
  };

  const getServiceBadge = (service) => {
    switch (service) {
      case 'Express':
        return <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">Express</span>;
      case 'Standard':
        return <span className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">Standard</span>;
      default:
        return <span>{service}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="flex flex-col">
      {/* Controls: Tabs, Filters, Export */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
          {tabs.map(tab => (
            <button 
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${activeTab === tab.name ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <span className={`text-[14px] font-bold ${activeTab === tab.name ? '' : 'font-semibold'}`}>{tab.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${activeTab === tab.name ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 md:gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[13px] font-bold text-gray-700 hover:bg-gray-50 bg-white shadow-sm">
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-[13px] font-bold hover:bg-[#122b50] shadow-sm">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="py-4 pl-6 pr-3 w-10">
                  <input type="checkbox" className="rounded border-gray-400 bg-transparent h-4 w-4" />
                </th>
                <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider">Application Number</th>
                <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider">Applicant</th>
                <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider">Documents</th>
                <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider">Service</th>
                <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider">Submitted Date</th>
                <th className="py-4 px-3 text-[11px] font-bold uppercase tracking-wider">Status</th>
                <th className="py-4 pl-3 pr-6 text-[11px] font-bold uppercase tracking-wider">Appointment</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-brand-navy-500 mx-auto" />
                    <p className="text-sm text-gray-500 mt-2">Loading applications...</p>
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-gray-500 text-sm">
                    No applications found in this category.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr 
                    key={app.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedApp(app)}
                  >
                    <td className="py-4 pl-6 pr-3" onClick={e => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-gray-300 text-brand-navy-600 focus:ring-brand-navy-600 h-4 w-4" />
                    </td>
                    <td className="py-4 px-3 text-[13px] font-bold text-gray-900">{app.id}</td>
                    <td className="py-4 px-3 text-[13px] font-medium text-gray-700">{app.full_name || app.personal_details?.fullName}</td>
                    <td className="py-4 px-3 text-[13px] text-gray-500">{(app.documents || []).length} docs</td>
                    <td className="py-4 px-3">{getServiceBadge(app.service_tier)}</td>
                    <td className="py-4 px-3 text-[13px] text-gray-500">{formatDate(app.submitted_at)}</td>
                    <td className="py-4 px-3">{getStatusBadge(app.status)}</td>
                    <td className="py-4 px-3 text-[13px] text-gray-700">
                      {app.appointment_details?.date ? `${formatDate(app.appointment_details.date)} ${app.appointment_details.time}` : 'Not scheduled'}
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right relative" onClick={e => e.stopPropagation()}>
                      <button className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <span className="text-[12px] font-medium text-gray-500 text-center sm:text-left">
            Showing {filteredApplications.length > 0 ? 1 : 0}-{Math.min(10, filteredApplications.length)} out of {filteredApplications.length}
          </span>
          
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-50">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-100 text-gray-900 font-bold text-[13px]">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded text-gray-400 hover:bg-gray-50">&gt;</button>
          </div>
          
          <div className="flex items-center gap-2 justify-center sm:justify-end">
            <span className="text-[12px] font-medium text-gray-500 hidden sm:inline">Items per page:</span>
            <select className="border border-gray-200 rounded px-2 py-1 text-[12px] font-bold text-gray-700 bg-white focus:outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>

      <OfficerApplicationDrawer application={selectedApp} onClose={() => setSelectedApp(null)} onRefresh={onRefresh} />
    </div>
  );
};

export default OfficerSubmissionsTable;
