import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Download, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const OfficerAppointments = () => {
  const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri'];

  const [weekOffset, setWeekOffset] = useState(0);

  // Calculate the Monday of the current week + offset
  const getWeekDays = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun,1=Mon,...
    const diffToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMon + weekOffset * 7);

    return dayLabels.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      return { name: `${label} ${dayNum}`, date: dateStr, active: isToday };
    });
  };

  const days = getWeekDays();

  const formatRangeLabel = () => {
    if (days.length === 0) return '';
    const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${fmt(days[0].date)} - ${fmt(days[4].date)}`;
  };

  const [applications, setApplications] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null); // { time, date, dayName }

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  // Build a lookup: { "2026-05-20|9:00 AM": [app1, app2, ...] }
  const slotMap = {};
  applications.forEach(app => {
    const appt = app.appointment_details;
    if (appt?.date && appt?.time) {
      const key = `${appt.date}|${appt.time}`;
      if (!slotMap[key]) slotMap[key] = [];
      slotMap[key].push(app);
    }
  });

  const getSlotApps = (dayIdx, timeLabel) => {
    const dateStr = days[dayIdx]?.date;
    if (!dateStr) return [];
    return slotMap[`${dateStr}|${timeLabel}`] || [];
  };

  // Determine if a slot has data and what type to show
  const getSlotInfo = (dayIdx, timeIdx) => {
    const timeLabel = times[timeIdx];
    const apps = getSlotApps(dayIdx, timeLabel);
    if (apps.length === 0) return null;

    const allCompleted = apps.every(a => a.status === 'Approved' || a.status === 'Completed');
    const expressCount = apps.filter(a => a.service_tier === 'Express').length;

    return {
      type: allCompleted ? 'completed' : 'scheduled',
      timeLabel,
      count: apps.length,
      capacity: 5,
      expressCount,
    };
  };

  const handleCardClick = (dayIdx, timeIdx) => {
    const timeLabel = times[timeIdx];
    const day = days[dayIdx];
    setSelectedSlot({ time: timeLabel, date: day.date, dayName: day.name });
  };

  const drawerApps = selectedSlot
    ? (slotMap[`${selectedSlot.date}|${selectedSlot.time}`] || [])
    : [];

  const formatDrawerDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleExport = () => {
    const rows = [['Date', 'Time', 'Applicant', 'Application ID', 'Service Tier', 'Status', 'Documents']];
    applications.forEach(app => {
      const appt = app.appointment_details;
      if (appt?.date && appt?.time) {
        rows.push([
          appt.date,
          appt.time,
          app.full_name || app.personal_details?.fullName || '',
          app.id,
          app.service_tier || '',
          app.status || '',
          (app.documents || []).map(d => d.name || d.type).join('; '),
        ]);
      }
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_${days[0]?.date}_${days[4]?.date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-[22px] font-bold text-[#0a1628] mb-5">Appointments</h1>

      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 border border-gray-200 rounded-lg text-[13px] text-gray-700 font-medium bg-white">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span>{formatRangeLabel()}</span>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
            <button className="px-4 py-1.5 text-[13px] font-bold bg-white text-gray-900 rounded-md shadow-sm">Week</button>
            <button className="px-4 py-1.5 text-[13px] font-medium text-gray-400 hover:text-gray-600 transition-colors">Month</button>
          </div>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-[#0a1b35] text-white rounded-lg text-[13px] font-bold hover:bg-[#122b50] shadow-sm transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ minWidth: 900, tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: 90 }} />
              <col /><col /><col /><col /><col />
              <col style={{ width: 50 }} />
            </colgroup>

            <thead>
              <tr>
                <td className="py-4 text-center align-bottom" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <button onClick={() => setWeekOffset(w => w - 1)} className="w-7 h-7 inline-flex items-center justify-center border border-gray-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </td>
                {days.map((day, idx) => (
                  <td
                    key={idx}
                    className="text-center align-bottom"
                    style={{ borderBottom: '1px solid #f0f0f0', borderLeft: '1px solid #f0f0f0', padding: 0 }}
                  >
                    <div className="flex justify-center">
                      <span
                        className="inline-block text-[13px] font-bold pb-3 pt-4 px-2"
                        style={{
                          color: day.active ? '#d4a017' : '#94a3b8',
                          borderBottom: day.active ? '3px solid #FCD116' : '3px solid transparent',
                        }}
                      >
                        {day.name}
                      </span>
                    </div>
                  </td>
                ))}
                {/* Right arrow */}
                <td className="py-4 text-center align-bottom" style={{ borderBottom: '1px solid #f0f0f0', borderLeft: '1px solid #f0f0f0' }}>
                  <button onClick={() => setWeekOffset(w => w + 1)} className="w-7 h-7 inline-flex items-center justify-center border border-gray-200 rounded-md text-gray-400 bg-white hover:bg-gray-50 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </thead>

            <tbody>
              {times.map((time, timeIdx) => (
                <tr key={timeIdx}>
                  <td
                    className="align-bottom text-right pr-5 pb-3"
                    style={{ borderBottom: '1px solid #f0f0f0', height: 140 }}
                  >
                    <span className="text-[12px] font-medium text-gray-400">{time}</span>
                  </td>

                  {days.map((_, dayIdx) => {
                    const info = getSlotInfo(dayIdx, timeIdx);
                    return (
                      <td
                        key={dayIdx}
                        className="align-top p-2"
                        style={{ borderLeft: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', height: 140 }}
                      >
                        {info && (
                          <div
                            className="cursor-pointer hover:opacity-80 transition-opacity h-full"
                            onClick={() => handleCardClick(dayIdx, timeIdx)}
                          >
                            {info.type === 'completed' ? (
                              <CompletedCard timeLabel={info.timeLabel} />
                            ) : (
                              <ScheduledCard
                                timeLabel={info.timeLabel}
                                booked={`${info.count}/${info.capacity}`}
                                express={info.expressCount || null}
                              />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td style={{ borderLeft: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', height: 140 }} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Appointment Drawer ── */}
      {selectedSlot && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedSlot(null)} />
          <div className="fixed top-0 right-0 h-full w-[480px] bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
            {/* Drawer Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{selectedSlot.time} Appointment</h2>
                <p className="text-sm text-gray-500 mt-1">Date: {formatDrawerDate(selectedSlot.date)}</p>
              </div>
              <button onClick={() => setSelectedSlot(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-5">Applicants</h3>

              {drawerApps.length === 0 ? (
                <p className="text-sm text-gray-400">No applicants for this slot.</p>
              ) : (
                <div className="flex flex-col divide-y divide-gray-100">
                  {drawerApps.map((app, idx) => (
                    <div key={idx} className="flex items-start justify-between py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-bold text-gray-900">
                            {app.full_name || app.personal_details?.fullName || 'Unknown'}
                          </span>
                          {app.service_tier === 'Express' && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded" style={{ backgroundColor: '#f3e8ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}>
                              Express
                            </span>
                          )}
                        </div>
                        <span className="text-[13px] font-medium text-gray-500">{app.id}</span>
                        <span className="text-[12px] text-gray-400 truncate">
                          {(app.documents || []).map(d => d.type || d.name).filter(Boolean).join(', ') || app.document_type || 'No documents'}
                        </span>
                      </div>
                      <button className="shrink-0 ml-4 px-4 py-2 bg-[#0a1b35] text-white text-[12px] font-bold rounded-lg hover:bg-[#122b50] transition-colors">
                        Check-in
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* ───── Completed Appointment Card ───── */
const CompletedCard = ({ timeLabel }) => (
  <div
    className="rounded-2xl h-full flex flex-row"
    style={{ backgroundColor: '#f0faf4', border: '1px solid #c6e7d2', padding: '14px' }}
  >
    <div
      className="shrink-0"
      style={{ width: 5, borderRadius: 100, backgroundColor: '#0d9461', marginRight: 14 }}
    />
    <div className="flex flex-col gap-1.5">
      <span
        className="self-start px-3 py-1 rounded-md text-[11px] font-bold"
        style={{ backgroundColor: '#d1f0e0', color: '#059669' }}
      >
        Completed
      </span>
      <span className="text-[15px] font-bold text-gray-900 mt-0.5">{timeLabel}</span>
    </div>
  </div>
);

/* ───── Scheduled Appointment Card ───── */
const ScheduledCard = ({ timeLabel, booked, express }) => (
  <div
    className="rounded-2xl h-full flex flex-row bg-white"
    style={{ border: '1px solid #e5e7eb', padding: '14px' }}
  >
    <div
      className="shrink-0"
      style={{ width: 5, borderRadius: 100, backgroundColor: '#FCD116', marginRight: 14 }}
    />
    <div className="flex flex-col gap-1.5 flex-1 min-h-0">
      <span
        className="self-start px-3 py-1 rounded-md text-[11px] font-bold"
        style={{ backgroundColor: '#fef9c3', color: '#ca8a04' }}
      >
        Scheduled
      </span>
      <span className="text-[15px] font-bold text-gray-900 mt-0.5">{timeLabel}</span>
      <span className="text-[13px] font-medium text-gray-400">{booked} booked</span>
      {express && (
        <span
          className="self-start mt-auto px-3 py-1 rounded-md text-[11px] font-bold"
          style={{ backgroundColor: '#f3e8ff', color: '#7c3aed', border: '1px solid #e9d5ff' }}
        >
          {express} Express
        </span>
      )}
    </div>
  </div>
);

export default OfficerAppointments;
