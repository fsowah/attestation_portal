import React from 'react';
import { FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

const OfficerDashboardMetrics = ({ applications = [], isLoading = false }) => {
  const metrics = [
    {
      title: 'Total Submissions',
      value: isLoading ? '-' : applications.length.toString(),
      subtitle: 'Documents received today',
      icon: <FileText className="w-6 h-6 text-brand-navy-600" />,
      iconBg: 'bg-blue-50',
      iconBorder: 'border-blue-100'
    },
    {
      title: 'Pending Review',
      value: isLoading ? '-' : applications.filter(a => a.status === 'Pending review').length.toString(),
      subtitle: 'Awaiting verification',
      icon: <Clock className="w-6 h-6 text-yellow-600" />,
      iconBg: 'bg-yellow-50',
      iconBorder: 'border-yellow-100'
    },
    {
      title: 'Approved',
      value: isLoading ? '-' : applications.filter(a => a.status === 'Approved').length.toString(),
      subtitle: 'Successfully attested',
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      iconBg: 'bg-green-50',
      iconBorder: 'border-green-100'
    },
    {
      title: 'Rejected',
      value: isLoading ? '-' : applications.filter(a => a.status === 'Rejected').length.toString(),
      subtitle: 'Returned for correction',
      icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
      iconBg: 'bg-red-50',
      iconBorder: 'border-red-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-5 hover:shadow-md transition-shadow">
          <div className={`w-14 h-14 rounded-full ${metric.iconBg} border ${metric.iconBorder} flex items-center justify-center shrink-0`}>
            {metric.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-gray-500 mb-1">{metric.title}</span>
            <span className="text-3xl font-black text-gray-900 leading-none mb-2">{metric.value}</span>
            <span className="text-[11px] text-gray-400 font-medium">{metric.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OfficerDashboardMetrics;
