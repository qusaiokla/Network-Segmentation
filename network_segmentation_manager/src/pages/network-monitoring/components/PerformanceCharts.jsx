import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const PerformanceCharts = () => {
  const [selectedChart, setSelectedChart] = useState('bandwidth');
  const [timeRange, setTimeRange] = useState('1h');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data generation
  const generateTimeSeriesData = (points = 24, baseValue = 50, variance = 20) => {
    return Array.from({ length: points }, (_, i) => ({
      time: new Date(Date.now() - (points - i) * 60000)?.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      value: Math.max(0, baseValue + Math.random() * variance - variance / 2),
      timestamp: Date.now() - (points - i) * 60000
    }));
  };

  const bandwidthData = generateTimeSeriesData(24, 65, 30);
  const latencyData = generateTimeSeriesData(24, 25, 15);
  const packetLossData = generateTimeSeriesData(24, 2, 3);
  const connectionsData = generateTimeSeriesData(24, 150, 50);

  const departmentBandwidthData = [
    { name: 'IT', value: 35, color: '#059669' },
    { name: 'Finance', value: 25, color: '#0ea5e9' },
    { name: 'HR', value: 20, color: '#8b5cf6' },
    { name: 'Sales', value: 12, color: '#f59e0b' },
    { name: 'Marketing', value: 8, color: '#ef4444' }
  ];

  const protocolDistribution = [
    { name: 'HTTPS', value: 45, connections: 1250 },
    { name: 'SSH', value: 25, connections: 680 },
    { name: 'HTTP', value: 15, connections: 420 },
    { name: 'FTP', value: 10, connections: 280 },
    { name: 'Other', value: 5, connections: 140 }
  ];

  const chartConfigs = {
    bandwidth: {
      title: 'Bandwidth Utilization',
      icon: 'Activity',
      data: bandwidthData,
      color: '#0ea5e9',
      unit: 'Mbps',
      type: 'area'
    },
    latency: {
      title: 'Network Latency',
      icon: 'Clock',
      data: latencyData,
      color: '#f59e0b',
      unit: 'ms',
      type: 'line'
    },
    packetloss: {
      title: 'Packet Loss Rate',
      icon: 'AlertTriangle',
      data: packetLossData,
      color: '#ef4444',
      unit: '%',
      type: 'line'
    },
    connections: {
      title: 'Active Connections',
      icon: 'Network',
      data: connectionsData,
      color: '#059669',
      unit: 'conn',
      type: 'area'
    }
  };

  const currentConfig = chartConfigs?.[selectedChart];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{`Time: ${label}`}</p>
          <p className="text-sm text-primary">
            {`${currentConfig?.title}: ${payload?.[0]?.value?.toFixed(1)} ${currentConfig?.unit}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    if (currentConfig?.type === 'area') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={currentConfig?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={currentConfig?.color}
              fill={currentConfig?.color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={currentConfig?.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={currentConfig?.color}
              strokeWidth={2}
              dot={{ fill: currentConfig?.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: currentConfig?.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Performance Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Icon name={currentConfig?.icon} size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">{currentConfig?.title}</h3>
          </div>
          <div className="flex items-center space-x-2">
            {Object.entries(chartConfigs)?.map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedChart(key)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  selectedChart === key
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {config?.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentConfig?.color }}></div>
              <span className="text-sm text-muted-foreground">Current: </span>
              <span className="text-lg font-bold text-foreground">
                {currentConfig?.data?.[currentConfig?.data?.length - 1]?.value?.toFixed(1)} {currentConfig?.unit}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={14} className="text-success" />
              <span className="text-sm text-success">+5.2% from last hour</span>
            </div>
          </div>
        </div>

        {renderChart()}
      </div>
      {/* Department Bandwidth Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Icon name="PieChart" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Bandwidth by Department</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentBandwidthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentBandwidthData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Usage']}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {departmentBandwidthData?.map((dept) => (
              <div key={dept?.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept?.color }}></div>
                  <span className="text-sm text-foreground">{dept?.name}</span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">{dept?.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Protocol Distribution */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Icon name="BarChart3" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Protocol Distribution</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolDistribution} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="var(--color-muted-foreground)"
                  fontSize={12}
                  width={60}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'value' ? `${value}%` : `${value} connections`,
                    name === 'value' ? 'Usage' : 'Connections'
                  ]}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--color-popover)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {protocolDistribution?.map((protocol) => (
              <div key={protocol?.name} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{protocol?.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-muted-foreground">{protocol?.connections} conn</span>
                  <span className="font-mono text-accent">{protocol?.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCharts;