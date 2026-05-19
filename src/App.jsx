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

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminUsers from './pages/admin/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

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

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="applications" element={<AdminApplications />} />
              <Route path="applications/:id" element={<AdminApplicationDetail />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<div className="p-8">Settings Screen Coming Soon</div>} />
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
