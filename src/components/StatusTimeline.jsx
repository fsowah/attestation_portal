import React from 'react';
import { Clock } from 'lucide-react';

const STATUS_STYLES = {
  'Submitted':     { dot: 'bg-blue-500',    label: 'bg-blue-50 text-blue-700' },
  'Pending review':{ dot: 'bg-amber-500',   label: 'bg-amber-50 text-amber-700' },
  'Approved':      { dot: 'bg-emerald-500', label: 'bg-emerald-50 text-emerald-700' },
  'Completed':     { dot: 'bg-emerald-500', label: 'bg-emerald-50 text-emerald-700' },
  'Rejected':      { dot: 'bg-red-500',     label: 'bg-red-50 text-red-700' },
};

const StatusTimeline = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8">
        <Clock className="w-8 h-8 text-neutral-200" />
        <p className="text-sm font-medium text-neutral-400">No history available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {history.map((event, idx) => {
        const style = STATUS_STYLES[event.status] ?? { dot: 'bg-neutral-400', label: 'bg-neutral-100 text-neutral-600' };
        const isLast = idx === history.length - 1;
        return (
          <div key={event.id ?? idx} className="flex items-start gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-3 h-3 rounded-full mt-0.5 ${style.dot} ring-4 ring-white`} />
              {!isLast && <div className="w-px bg-neutral-200 my-1 min-h-[28px]" />}
            </div>
            <div className={`flex-grow ${!isLast ? 'pb-5' : ''}`}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${style.label}`}>
                  {event.status}
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">
                  {new Date(event.changed_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  {' · '}
                  {new Date(event.changed_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              {event.notes && (
                <p className="mt-2 text-[12px] text-neutral-500 font-medium leading-relaxed bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-100">
                  {event.notes}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
