import React from 'react';
import { FileText, Calendar, Users, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const statCards = [
    {
      title: 'Total Submissions',
      value: '1284',
      subtitle: 'Documents received',
      icon: <FileText className="w-6 h-6 text-blue-500" />,
      iconBg: 'bg-blue-50'
    },
    {
      title: "Today's Appointments",
      value: '47',
      subtitle: 'Awaiting verification',
      icon: <Calendar className="w-6 h-6 text-yellow-500" />,
      iconBg: 'bg-yellow-50'
    },
    {
      title: 'Active Staff',
      value: '27',
      subtitle: 'Successfully attested',
      icon: <Users className="w-6 h-6 text-green-500" />,
      iconBg: 'bg-green-50'
    },
    {
      title: 'Open Support Tickets',
      value: '7',
      subtitle: 'Returned for correction',
      icon: <ClipboardList className="w-6 h-6 text-yellow-500" />,
      iconBg: 'bg-yellow-50'
    }
  ];

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

      {/* Two empty sections below */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[400px]">
        <div className="bg-[#fcfcfc] rounded-xl border border-gray-100 shadow-sm w-full h-full"></div>
        <div className="bg-[#fcfcfc] rounded-xl border border-gray-100 shadow-sm w-full h-full"></div>
      </div>
    </div>
  );
};

export default AdminDashboard;
