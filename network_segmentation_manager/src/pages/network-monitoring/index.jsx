import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import MetricsWidget from './components/MetricsWidget';
import TrafficFlowVisualization from './components/TrafficFlowVisualization';
import AlertManagementPanel from './components/AlertManagementPanel';
import MonitoringControls from './components/MonitoringControls';
import PerformanceCharts from './components/PerformanceCharts';
import Icon from '../../components/AppIcon';

const NetworkMonitoring = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedDepartments, setSelectedDepartments] = useState(['all']);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Mock real-time metrics data
  const [metricsData, setMetricsData] = useState({
    bandwidth: {
      value: 67.5,
      trend: 5.2,
      data: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        value: 60 + Math.random() * 20
      }))
    },
    packetLoss: {
      value: 0.8,
      trend: -12.3,
      data: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        value: Math.random() * 2
      }))
    },
    latency: {
      value: 23.4,
      trend: 2.1,
      data: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        value: 20 + Math.random() * 10
      }))
    },
    connections: {
      value: 247,
      trend: 8.7,
      data: Array.from({ length: 12 }, (_, i) => ({
        time: i,
        value: 200 + Math.random() * 100
      }))
    }
  });

  // Simulate real-time data updates
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 1500);

    const interval = setInterval(() => {
      setMetricsData(prev => ({
        bandwidth: {
          ...prev?.bandwidth,
          value: Math.max(0, prev?.bandwidth?.value + (Math.random() - 0.5) * 5),
          trend: (Math.random() - 0.5) * 20
        },
        packetLoss: {
          ...prev?.packetLoss,
          value: Math.max(0, Math.min(5, prev?.packetLoss?.value + (Math.random() - 0.5) * 0.5)),
          trend: (Math.random() - 0.5) * 30
        },
        latency: {
          ...prev?.latency,
          value: Math.max(0, prev?.latency?.value + (Math.random() - 0.5) * 3),
          trend: (Math.random() - 0.5) * 15
        },
        connections: {
          ...prev?.connections,
          value: Math.max(0, prev?.connections?.value + Math.floor((Math.random() - 0.5) * 20)),
          trend: (Math.random() - 0.5) * 25
        }
      }));
      setLastUpdate(new Date());
    }, refreshInterval * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [refreshInterval]);

  // Connection status simulation
  useEffect(() => {
    const statusInterval = setInterval(() => {
      const statuses = ['connected', 'connecting', 'disconnected'];
      const weights = [0.85, 0.10, 0.05]; // 85% connected, 10% connecting, 5% disconnected
      const random = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < statuses?.length; i++) {
        cumulativeWeight += weights?.[i];
        if (random <= cumulativeWeight) {
          setConnectionStatus(statuses?.[i]);
          break;
        }
      }
    }, 45000);

    return () => clearInterval(statusInterval);
  }, []);

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    console.log('Time range changed to:', range);
  };

  const handleDepartmentFilter = (departments) => {
    setSelectedDepartments(departments);
    console.log('Department filter changed to:', departments);
  };

  const handleRefreshIntervalChange = (interval) => {
    setRefreshInterval(interval);
    console.log('Refresh interval changed to:', interval);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-success';
      case 'connecting': return 'text-warning';
      case 'disconnected': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return 'Wifi';
      case 'connecting': return 'Loader';
      case 'disconnected': return 'WifiOff';
      default: return 'Wifi';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <TabNavigation />
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">Loading Network Monitoring</h3>
              <p className="text-muted-foreground">Establishing connections and gathering data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <div className="container mx-auto px-6 py-6">
        <QuickActionToolbar context="monitoring" />
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Network Monitoring</h1>
              <p className="text-muted-foreground">
                Real-time network performance and security monitoring dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg">
              <Icon 
                name={getConnectionStatusIcon()} 
                size={16} 
                className={`${getConnectionStatusColor()} ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
              />
              <span className={`text-sm font-medium capitalize ${getConnectionStatusColor()}`}>
                {connectionStatus}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {lastUpdate?.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Monitoring Controls */}
          <div className="xl:col-span-1">
            <MonitoringControls
              onTimeRangeChange={handleTimeRangeChange}
              onDepartmentFilter={handleDepartmentFilter}
              onRefreshIntervalChange={handleRefreshIntervalChange}
            />
          </div>

          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            {/* Key Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricsWidget
                title="Bandwidth Usage"
                value={metricsData?.bandwidth?.value?.toFixed(1)}
                unit="Mbps"
                trend={metricsData?.bandwidth?.trend}
                icon="Activity"
                color="bg-primary"
                data={metricsData?.bandwidth?.data}
                isLoading={false}
              />
              <MetricsWidget
                title="Packet Loss"
                value={metricsData?.packetLoss?.value?.toFixed(2)}
                unit="%"
                trend={metricsData?.packetLoss?.trend}
                icon="AlertTriangle"
                color="bg-warning"
                data={metricsData?.packetLoss?.data}
                isLoading={false}
              />
              <MetricsWidget
                title="Latency"
                value={metricsData?.latency?.value?.toFixed(1)}
                unit="ms"
                trend={metricsData?.latency?.trend}
                icon="Clock"
                color="bg-accent"
                data={metricsData?.latency?.data}
                isLoading={false}
              />
              <MetricsWidget
                title="Active Connections"
                value={Math.floor(metricsData?.connections?.value)}
                unit="conn"
                trend={metricsData?.connections?.trend}
                icon="Network"
                color="bg-success"
                data={metricsData?.connections?.data}
                isLoading={false}
              />
            </div>

            {/* Performance Charts */}
            <PerformanceCharts />

            {/* Traffic Flow Visualization */}
            <TrafficFlowVisualization />

            {/* Alert Management Panel */}
            <AlertManagementPanel />
          </div>
        </div>

        {/* Footer Status Bar */}
        <div className="mt-8 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">Monitoring Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Database" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">Data retention: 30 days</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={14} className="text-muted-foreground" />
                <span className="text-muted-foreground">Security: Enabled</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground">
                Refresh every {refreshInterval}s
              </span>
              <span className="text-muted-foreground">
                © {new Date()?.getFullYear()} Network Segmentation Manager
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkMonitoring;