/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import PlaceholderPage from './pages/PlaceholderPage';
import UserPermissions from './pages/UserPermissions';
import DevPermit from './pages/DevPermit';
import SystemConfig from './pages/SystemConfig';
import AccessLogs from './pages/AccessLogs';
import CalendarPage from './pages/Calendar';

import SupplierDirectory from './pages/SupplierDirectory';
import MasterCode from './pages/MasterCode';
import ItemMaster from './pages/ItemMaster';
import PurchaseRequisition from './pages/PurchaseRequisition';
import PurchaseOrder from './pages/PurchaseOrder';
import PurchaseNC from './pages/PurchaseNC';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            {/* Procurement Modules */}
            <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
            
            {/* PR & PO */}
            <Route path="/pr" element={<ProtectedRoute><PurchaseRequisition /></ProtectedRoute>} />
            <Route path="/po" element={<ProtectedRoute><PurchaseOrder /></ProtectedRoute>} />
            <Route path="/approval" element={<ProtectedRoute><PlaceholderPage title="Approval Workflow" /></ProtectedRoute>} />

            {/* Vendors */}
            <Route path="/suppliers" element={<ProtectedRoute><SupplierDirectory /></ProtectedRoute>} />
            <Route path="/sla" element={<ProtectedRoute><PlaceholderPage title="SLA & Rating" /></ProtectedRoute>} />
            <Route path="/contracts" element={<ProtectedRoute><PlaceholderPage title="Strategic Contracts" /></ProtectedRoute>} />
            <Route path="/scar" element={<ProtectedRoute><PurchaseNC /></ProtectedRoute>} />

            {/* Analytics */}
            <Route path="/savings" element={<ProtectedRoute><PlaceholderPage title="Cost Savings Report" /></ProtectedRoute>} />
            <Route path="/risk" element={<ProtectedRoute><PlaceholderPage title="Supply Chain Risk" /></ProtectedRoute>} />
            <Route path="/category" element={<ProtectedRoute><PlaceholderPage title="Spend by Category" /></ProtectedRoute>} />

            {/* Inventory & MES */}
            <Route path="/gr" element={<ProtectedRoute><PlaceholderPage title="Goods Receiving (GR)" /></ProtectedRoute>} />
            <Route path="/inspection" element={<ProtectedRoute><PlaceholderPage title="Quality Inspection" /></ProtectedRoute>} />
            <Route path="/stock" element={<ProtectedRoute><PlaceholderPage title="Critical Stock Levels" /></ProtectedRoute>} />

            {/* Evaluations */}
            <Route path="/criteria" element={<ProtectedRoute><PlaceholderPage title="Selection Criteria" /></ProtectedRoute>} />
            <Route path="/vendor-selection" element={<ProtectedRoute><PlaceholderPage title="New Vendor Selection" /></ProtectedRoute>} />
            <Route path="/periodic" element={<ProtectedRoute><PlaceholderPage title="Periodic Evaluation" /></ProtectedRoute>} />
            <Route path="/eval-analysis" element={<ProtectedRoute><PlaceholderPage title="Evaluation Analysis" /></ProtectedRoute>} />

            {/* Audit */}
            <Route path="/supplier-audit" element={<ProtectedRoute><PlaceholderPage title="Supplier Audit" /></ProtectedRoute>} />
            <Route path="/checklist" element={<ProtectedRoute><PlaceholderPage title="Audit Checklist" /></ProtectedRoute>} />
            <Route path="/audit-plan" element={<ProtectedRoute><PlaceholderPage title="Audit Plan" /></ProtectedRoute>} />

            {/* Risk Management */}
            <Route path="/material-risk" element={<ProtectedRoute><PlaceholderPage title="Material Risk Assessment" /></ProtectedRoute>} />
            <Route path="/supplier-risk" element={<ProtectedRoute><PlaceholderPage title="Supplier Risk Assessment" /></ProtectedRoute>} />

            {/* Finance */}
            <Route path="/vat" element={<ProtectedRoute><PlaceholderPage title="VAT Tracking" /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><PlaceholderPage title="Payment Status" /></ProtectedRoute>} />
            <Route path="/expense" element={<ProtectedRoute><PlaceholderPage title="Expense Claims" /></ProtectedRoute>} />

            {/* Master Data */}
            <Route path="/categories" element={<ProtectedRoute><PlaceholderPage title="Categories Config" /></ProtectedRoute>} />
            <Route path="/code-master" element={<ProtectedRoute><MasterCode /></ProtectedRoute>} />
            <Route path="/items" element={<ProtectedRoute><ItemMaster /></ProtectedRoute>} />

            {/* Settings & Permissions */}
            <Route path="/permissions" element={
              <ProtectedRoute isConfidential>
                <UserPermissions />
              </ProtectedRoute>
            } />
            <Route path="/dev-permit" element={
              <ProtectedRoute isConfidential>
                <DevPermit />
              </ProtectedRoute>
            } />
            <Route path="/config" element={
              <ProtectedRoute isConfidential>
                <SystemConfig />
              </ProtectedRoute>
            } />
            <Route path="/access-logs" element={
              <ProtectedRoute isConfidential>
                <AccessLogs />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={<ProtectedRoute isConfidential><PlaceholderPage title="General Settings" /></ProtectedRoute>} />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

