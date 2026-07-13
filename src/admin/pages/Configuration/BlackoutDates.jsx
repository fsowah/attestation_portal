import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ChevronLeft, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import AddBlackoutModal from './components/AddBlackoutModal';

const BlackoutDates = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [blackoutData, setBlackoutData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchBlackoutDates = async () => {
    setIsLoading(true);
    try {
      // Get total count
      const { count } = await supabase
        .from('blackout_dates')
        .select('*', { count: 'exact', head: true });
      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      const { data, error } = await supabase
        .from('blackout_dates')
        .select('*, profiles:created_by(full_name)')
        .order('date', { ascending: false })
        .range(from, to);

      if (error) {
        // If the join fails (profiles might not have data), fetch without join
        const { data: plainData, error: plainError } = await supabase
          .from('blackout_dates')
          .select('*')
          .order('date', { ascending: false })
          .range(from, to);
        
        if (plainError) throw plainError;
        setBlackoutData(plainData || []);
      } else {
        setBlackoutData(data || []);
      }
    } catch (err) {
      console.error('Error fetching blackout dates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlackoutDates();
  }, [page, itemsPerPage]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this blackout date?')) return;
    try {
      const { error } = await supabase
        .from('blackout_dates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await supabase.from('audit_logs').insert({
        category: 'Config',
        action: 'Blackout date removed',
        actor_name: 'Admin',
      });

      fetchBlackoutDates();
    } catch (err) {
      console.error('Error deleting blackout date:', err);
      alert('Failed to delete blackout date: ' + err.message);
    }
  };

  const handleModalSaved = () => {
    setModalOpen(false);
    fetchBlackoutDates();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getDayName = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Blackout dates</h1>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add blackout date
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Day</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Reason</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Type</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Added By</th>
              <th className="py-4 px-6 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-400 mt-2">Loading blackout dates...</p>
                </td>
              </tr>
            ) : blackoutData.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                  No blackout dates configured yet.
                </td>
              </tr>
            ) : (
              blackoutData.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{formatDate(row.date)}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{getDayName(row.date)}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">{row.reason}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                      row.type === 'Public holiday' 
                        ? 'bg-[#fef3c7] text-[#b45309]' 
                        : row.type === 'Maintenance'
                          ? 'bg-[#e0e7ff] text-[#4338ca]'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-[13px] font-medium text-[#475569]">
                    {row.profiles?.full_name || 'Admin'}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleDelete(row.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="border-t border-gray-100 p-4 px-6 flex justify-between items-center bg-white">
          <div className="text-[12px] font-medium text-gray-500">
            Showing {totalCount === 0 ? 0 : (page - 1) * itemsPerPage + 1}-{Math.min(page * itemsPerPage, totalCount)} out of {totalCount}
          </div>
          
          <div className="flex items-center gap-1 text-[13px] font-medium text-gray-600">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              className="p-1 text-gray-300 hover:text-gray-500 disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button 
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded ${page === p ? 'bg-[#e2e8f0] font-bold text-[#1e293b]' : 'hover:bg-gray-50'}`}
              >
                {p}
              </button>
            ))}
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1 hover:text-gray-800 disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-gray-500">Items per page:</span>
            <div className="relative">
              <select 
                value={itemsPerPage}
                onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-[12px] font-medium text-[#475569] focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      <AddBlackoutModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSaved={handleModalSaved} />
    </div>
  );
};

export default BlackoutDates;
