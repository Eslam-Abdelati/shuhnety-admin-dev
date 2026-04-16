import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import LoginPage from './features/auth/LoginPage';
import { AdminDashboard } from './features/admin/AdminDashboard';
import { UserManagement } from './features/admin/UserManagement';
import { UserDetails } from './features/admin/UserDetails';
import { ShipmentManagement } from './features/admin/ShipmentManagement';
import { ShipmentDetails } from './features/admin/ShipmentDetails';
import { ShipmentTracking } from './features/admin/ShipmentTracking';
import { DriverVerification } from './features/admin/DriverVerification';
import { AdminReports } from './features/admin/AdminReports';
import { PlatformManagement } from './features/admin/PlatformManagement';
import { SystemSettings } from './features/admin/SystemSettings';
import { DisputeResolution } from './features/admin/DisputeResolution';
import { DigitalContracts } from './features/admin/DigitalContracts';

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
          
          {/* Explicit User Management Routes */}
          <Route path="users" element={<UserManagement forcedRole="all" />} />
          <Route path="users/customer" element={<UserManagement forcedRole="customer" />} />
          <Route path="users/driver" element={<UserManagement forcedRole="driver" />} />
          <Route path="users/company" element={<UserManagement forcedRole="company" />} />
          <Route path="users/details/:id" element={<UserDetails />} />
          <Route path="shipments" element={<ShipmentManagement />} />
          <Route path="shipments/details/:id" element={<ShipmentDetails />} />
          <Route path="shipments/track/:id" element={<ShipmentTracking />} />
          
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
