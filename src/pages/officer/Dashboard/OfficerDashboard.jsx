import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import OfficerDashboardMetrics from './components/OfficerDashboardMetrics';
import OfficerSubmissionsTable from './components/OfficerSubmissionsTable';

const OfficerDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <OfficerDashboardMetrics applications={applications} isLoading={isLoading} />
      <OfficerSubmissionsTable applications={applications} isLoading={isLoading} onRefresh={fetchApplications} />
    </div>
  );
};

export default OfficerDashboard;
