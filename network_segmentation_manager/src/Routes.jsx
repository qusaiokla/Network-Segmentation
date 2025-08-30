import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import NetworkMonitoring from './pages/network-monitoring';
import NetworkTestingDashboard from './pages/network-testing-dashboard';
import NetworkDashboard from './pages/network-dashboard';
import VirtualHostManagement from './pages/virtual-host-management';
import DepartmentZoneConfiguration from './pages/department-zone-configuration';
import NetworkTopologyDesigner from './pages/network-topology-designer';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<DepartmentZoneConfiguration />} />
        <Route path="/network-monitoring" element={<NetworkMonitoring />} />
        <Route path="/network-testing-dashboard" element={<NetworkTestingDashboard />} />
        <Route path="/network-dashboard" element={<NetworkDashboard />} />
        <Route path="/virtual-host-management" element={<VirtualHostManagement />} />
        <Route path="/department-zone-configuration" element={<DepartmentZoneConfiguration />} />
        <Route path="/network-topology-designer" element={<NetworkTopologyDesigner />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
