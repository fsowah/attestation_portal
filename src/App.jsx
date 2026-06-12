import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ApplicationsPage from './pages/dashboard/ApplicationsPage';
import NewApplicationPage from './pages/dashboard/NewApplicationPage';
import InvoicesPage from './pages/dashboard/InvoicesPage';
import TrackStatusPage from './pages/dashboard/TrackStatusPage';
import OfficerLogin from './pages/officer/Login/OfficerLogin';
import OfficerDashboard from './pages/officer/Dashboard/OfficerDashboard';
import OfficerLayout from './pages/officer/layout/OfficerLayout';
import OfficerAppointments from './pages/officer/Appointments/OfficerAppointments';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Officer Routes */}
            <Route path="/officer/login" element={<OfficerLogin />} />
            <Route path="/officer" element={<OfficerLayout />}>
              <Route path="dashboard" element={<OfficerDashboard />} />
              <Route path="submissions" element={<OfficerDashboard />} />
              <Route path="appointments" element={<OfficerAppointments />} />
              <Route index element={<Navigate to="submissions" replace />} />
            </Route>

            {/* Applicant Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRole="user">
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="applications" replace />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="new-application" element={<NewApplicationPage />} />
              <Route path="invoices" element={<InvoicesPage />} />
              <Route path="track-status" element={<TrackStatusPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
