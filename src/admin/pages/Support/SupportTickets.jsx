import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '../../../supabaseClient';

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReply = async (ticketId) => {
    if (!replyText.trim()) return;

    try {
      const { error } = await supabase
        .from('support_tickets')
        .update({ 
          status: 'Resolved', 
          resolution_notes: replyText,
          updated_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: `Support ticket resolved`,
        actor_name: 'Admin',
        reference_id: ticketId
      });

      setReplyingTo(null);
      setReplyText('');
      fetchTickets();
    } catch (err) {
      console.error('Error resolving ticket:', err);
      alert('Failed to resolve ticket: ' + err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Open':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-full text-[11px] font-bold"><Clock className="w-3 h-3" /> Open</span>;
      case 'Resolved':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-[11px] font-bold"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-bold">{status}</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Support Tickets</h1>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No support tickets found.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-gray-900">{ticket.subject}</h3>
                      <div className="flex items-center gap-2 mt-1 text-[12px] text-gray-500">
                        <span className="font-medium">{ticket.user_email}</span>
                        <span>•</span>
                        <span>{formatDate(ticket.created_at)}</span>
                        <span>•</span>
                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{ticket.id.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>

                <div className="pl-14">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-[13px] text-gray-700 leading-relaxed mb-4">
                    {ticket.message}
                  </div>

                  {ticket.status === 'Resolved' && ticket.resolution_notes && (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-[13px] text-green-800 leading-relaxed">
                      <div className="font-bold mb-1 flex items-center gap-1.5"><CheckCircle className="w-4 h-4" /> Resolution Notes</div>
                      {ticket.resolution_notes}
                    </div>
                  )}

                  {ticket.status === 'Open' && (
                    <div className="mt-4">
                      {replyingTo === ticket.id ? (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                          <textarea 
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type resolution notes here..."
                            rows={3}
                            className="w-full bg-white border border-gray-300 rounded-lg p-3 text-[13px] text-gray-700 focus:outline-none focus:border-blue-500 resize-none mb-3"
                          />
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleReply(ticket.id)}
                              disabled={!replyText.trim()}
                              className="px-4 py-2 bg-[#0f172a] hover:bg-black text-white text-[12px] font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                              Mark as Resolved
                            </button>
                            <button 
                              onClick={() => { setReplyingTo(null); setReplyText(''); }}
                              className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[12px] font-bold rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setReplyingTo(ticket.id)}
                          className="text-[13px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          Resolve Ticket
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportTickets;
