import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import LoginPage from './features/auth/LoginPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { DriverVerification } from './features/admin/DriverVerification';
import { AdminReports } from './features/admin/AdminReports';
import { PlatformManagement } from './features/admin/PlatformManagement';
import { SystemSettings } from './features/admin/SystemSettings';
import { DisputeResolution } from './features/admin/DisputeResolution';
import { DigitalContracts } from './features/admin/DigitalContracts';

// Loading Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
          
          {/* Redirect Root to Admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin Dashboard Routes */}
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="verification" element={<DriverVerification />} />
            <Route path="operations" element={<PlatformManagement />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="disputes" element={<DisputeResolution />} />
            <Route path="contracts" element={<DigitalContracts />} />
            <Route path="settings" element={<SystemSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </Router>
  );
}

export default App;
