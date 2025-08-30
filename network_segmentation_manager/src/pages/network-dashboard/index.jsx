import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import MetricsCard from './components/MetricsCard';
import NetworkTopologyView from './components/NetworkTopologyView';
import ActivityFeed from './components/ActivityFeed';
import QuickActions from './components/QuickActions';
import Icon from '../../components/AppIcon';

const NetworkDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    activeVlans: 4,
    connectedHosts: 60,
    policyViolations: 3,
    systemHealth: 98.5
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    loadDashboard();

    // Real-time updates every 30 seconds
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        connectedHosts: prev?.connectedHosts + Math.floor(Math.random() * 6) - 3,
        policyViolations: Math.max(0, prev?.policyViolations + Math.floor(Math.random() * 3) - 1),
        systemHealth: Math.max(95, Math.min(100, prev?.systemHealth + (Math.random() - 0.5) * 2))
      }));
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const metricsData = [
    {
      title: 'Active VLANs',
      value: dashboardData?.activeVlans,
      change: '+0',
      changeType: 'neutral',
      icon: 'Network',
      color: 'primary',
      description: 'Currently configured network segments'
    },
    {
      title: 'Connected Hosts',
      value: dashboardData?.connectedHosts,
      change: '+5',
      changeType: 'positive',
      icon: 'Server',
      color: 'success',
      description: 'Active devices across all VLANs'
    },
    {
      title: 'Policy Violations',
      value: dashboardData?.policyViolations,
      change: '-2',
      changeType: 'positive',
      icon: 'AlertTriangle',
      color: dashboardData?.policyViolations > 5 ? 'error' : 'warning',
      description: 'Security policy infractions detected'
    },
    {
      title: 'System Health',
      value: `${dashboardData?.systemHealth?.toFixed(1)}%`,
      change: '+0.3%',
      changeType: 'positive',
      icon: 'Activity',
      color: dashboardData?.systemHealth > 95 ? 'success' : 'warning',
      description: 'Overall network performance score'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Loading... | Network Segmentation Manager</title>
        </Helmet>
        <Header />
        <TabNavigation />
        <div className="pt-32 pb-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Icon name="Network" size={32} className="text-primary" />
                </div>
                <h2 className="text-lg font-medium text-foreground mb-2">Loading Dashboard</h2>
                <p className="text-muted-foreground">Fetching network status and metrics...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Network Dashboard | Network Segmentation Manager</title>
        <meta name="description" content="Monitor network segmentation status, manage VLANs, and oversee enterprise network security policies through comprehensive dashboard interface." />
        <meta name="keywords" content="network dashboard, VLAN management, network segmentation, enterprise security, network monitoring" />
      </Helmet>
      <Header />
      <TabNavigation />
      <div className="pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Network Dashboard</h1>
              <p className="text-muted-foreground">
                Monitor segmentation status and manage network policies
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm font-mono text-foreground">
                  {lastUpdate?.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live</span>
              </div>
            </div>
          </div>

          <QuickActionToolbar context="dashboard" />

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
                description={metric?.description}
              />
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Network Topology - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              <NetworkTopologyView />
            </div>

            {/* Activity Feed - Takes 1 column */}
            <div className="lg:col-span-1">
              <ActivityFeed />
            </div>
          </div>

          {/* Quick Actions Section */}
          <QuickActions />

          {/* System Information Footer */}
          <div className="mt-8 bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Network Segmentation Manager v2.4.1
                  </span>
                </div>
                <div className="w-px h-4 bg-border"></div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Uptime: 15d 7h 23m
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Current Time</p>
                  <p className="text-sm font-mono text-foreground">
                    {new Date()?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDashboard;