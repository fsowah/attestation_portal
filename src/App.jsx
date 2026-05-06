import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/login/Login';
import Dashboard from './pages/dashboard/Dashboard';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApplications from './pages/admin/AdminApplications';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import AdminAppointments from './pages/admin/AdminAppointments';

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
            />

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
