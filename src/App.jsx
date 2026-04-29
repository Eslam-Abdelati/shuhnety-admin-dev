import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';



// Pages
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import VerifyCodePage from './pages/auth/VerifyCodePage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';


import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { AllUsersPage } from './pages/users';
import { UserDetails } from './pages/users/UserDetails';
import { ShipmentManagement } from './pages/shipments/ShipmentManagement';
import { ShipmentDetails } from './pages/shipments/ShipmentDetails';
import { ShipmentTracking } from './pages/shipments/ShipmentTracking';
import { DriverVerification } from './pages/verification/DriverVerification';
import { AdminReports } from './pages/reports/AdminReports';
import { PlatformManagement } from './pages/operations/PlatformManagement';
import { SystemSettings } from './pages/settings/SystemSettings';
import { DisputeResolution } from './pages/disputes/DisputeResolution';
import { DigitalContracts } from './pages/contracts/DigitalContracts';
import AddManagerPage from './pages/users/AddManagerPage';
import ProfilePage from './pages/profile/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes (Guest only) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-code" element={<VerifyCodePage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>




        {/* Redirect Root to Admin */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Admin Dashboard Routes (Protected) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Explicit User Management Routes */}
            <Route path="users" element={<AllUsersPage />} />
            <Route path="users/details/:id" element={<UserDetails />} />
            <Route path="users/add-manager" element={<AddManagerPage />} />
            <Route path="shipments" element={<ShipmentManagement />} />
            <Route path="shipments/details/:id" element={<ShipmentDetails />} />
            <Route path="shipments/track/:id" element={<ShipmentTracking />} />

            <Route path="verification" element={<DriverVerification />} />
            <Route path="operations" element={<PlatformManagement />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="disputes" element={<DisputeResolution />} />
            <Route path="contracts" element={<DigitalContracts />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>


        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
