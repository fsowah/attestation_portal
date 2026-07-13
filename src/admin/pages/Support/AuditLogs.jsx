import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, Settings2, Calendar as CalendarIcon, Eye, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import AuditLogDetailsDrawer from './components/AuditLogDetailsDrawer';

const AuditLogs = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [categoryFilters, setCategoryFilters] = useState([]);
  const filterRef = useRef(null);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFiltersOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('audit_logs').select('*', { count: 'exact' });

      // Apply category filters
      if (categoryFilters.length > 0) {
        query = query.in('category', categoryFilters);
      }

      // Get count
      const { count } = await query;
      setTotalCount(count || 0);

      // Get paginated data
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let dataQuery = supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .range(from, to);

      if (categoryFilters.length > 0) {
        dataQuery = dataQuery.in('category', categoryFilters);
      }

      const { data, error } = await dataQuery;
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, itemsPerPage, categoryFilters]);

  const toggleCategory = (cat) => {
    setCategoryFilters(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setPage(1);
  };

  const getCategoryBadge = (category) => {
    switch(category) {
      case 'Payment':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f3e8ff] text-[#9333ea]">Payment</span>;
      case 'Submission':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#dcfce7] text-[#166534]">Submission</span>;
      case 'User':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#e0f2fe] text-[#0369a1]">User</span>;
      case 'Config':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#fef3c7] text-[#b45309]">Config</span>;
      case 'Auth':
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-[#f1f5f9] text-[#475569]">Auth</span>;
      default:
        return <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{category}</span>;
    }
  };

  const handleView = (log) => {
    setSelectedLog(log);
    setDrawerOpen(true);
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
           d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const handleExport = () => {
    const rows = [['Date', 'Category', 'Action', 'Actor', 'Reference']];
    logs.forEach(log => {
      rows.push([
        formatTimestamp(log.timestamp),
        log.category,
        log.action,
        log.actor_name || '',
        log.reference_id || '',
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const categories = ['Submission', 'User', 'Config', 'Payment', 'Auth'];

  return (
    <div className="max-w-[1200px] w-full animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[22px] font-bold text-[#1e293b]">Audit Logs</h1>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-[#0f172a] hover:bg-black text-white px-4 py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex justify-end items-center gap-3 mb-4">
        {/* Filters Dropdown */}
        <div className="relative" ref={filterRef}>
          <button 
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 bg-white border rounded-md px-4 py-2 text-[13px] font-bold text-[#475569] hover:bg-gray-50 transition-colors shadow-sm ${
              categoryFilters.length > 0 ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'
            }`}
          >
            <Settings2 className="w-4 h-4 text-gray-500" />
            Filters
            {categoryFilters.length > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {categoryFilters.length}
              </span>
            )}
          </button>
          
          {filtersOpen && (
            <div className="absolute top-full right-0 mt-2 w-[220px] bg-white border border-gray-100 rounded-lg shadow-xl z-10 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              {categories.map(cat => (
                <label 
                  key={cat}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleCategory(cat)}
                >
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                    categoryFilters.includes(cat) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                  }`}>
                    {categoryFilters.includes(cat) && (
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[13px] font-medium text-[#475569]">{cat}</span>
                </label>
              ))}
              {categoryFilters.length > 0 && (
                <div className="border-t border-gray-100 mt-1 pt-1 px-4 py-2">
                  <button 
                    onClick={() => { setCategoryFilters([]); setPage(1); }}
                    className="text-[12px] text-blue-600 font-bold hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b] text-white">
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Date</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Category</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Action</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Actor</th>
              <th className="py-4 px-6 text-[11px] font-bold uppercase tracking-wider">Reference</th>
              <th className="py-4 px-6 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                  <p className="text-sm text-gray-400 mt-2">Loading audit logs...</p>
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                  No audit logs found.
                </td>
              </tr>
            ) : (
              logs.map((row) => (
                <tr key={row.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{formatTimestamp(row.timestamp)}</td>
                  <td className="py-4 px-6">{getCategoryBadge(row.category)}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-600 max-w-[300px] truncate">{row.action}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.actor_name || 'System'}</td>
                  <td className="py-4 px-6 text-[13px] font-medium text-gray-500">{row.reference_id || '-'}</td>
                  <td className="py-4 px-6 text-right">
                    <button 
                      onClick={() => handleView(row)}
                      className="text-gray-400 hover:text-[#0f4c9c] transition-colors p-1"
                    >
                      <Eye className="w-4 h-4" />
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
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1 text-gray-300 hover:text-gray-500 disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(totalPages || 1, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-7 h-7 flex items-center justify-center rounded ${page === p ? 'bg-[#e2e8f0] font-bold text-[#1e293b]' : 'hover:bg-gray-50'}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages || 1, p + 1))} disabled={page >= totalPages} className="p-1 hover:text-gray-800 disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-medium text-gray-500">Items per page:</span>
            <div className="relative">
              <select value={itemsPerPage} onChange={e => { setItemsPerPage(Number(e.target.value)); setPage(1); }} className="appearance-none bg-gray-50 border border-gray-200 rounded-md py-1.5 pl-3 pr-8 text-[12px] font-medium text-[#475569] focus:outline-none">
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <AuditLogDetailsDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} logData={selectedLog} />
    </div>
  );
};

export default AuditLogs;
