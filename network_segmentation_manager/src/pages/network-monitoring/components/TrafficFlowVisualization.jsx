import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const TrafficFlowVisualization = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  const departments = [
    { id: 'hr', name: 'HR', x: 150, y: 100, color: 'bg-blue-500', connections: 45 },
    { id: 'it', name: 'IT', x: 400, y: 80, color: 'bg-green-500', connections: 89 },
    { id: 'finance', name: 'Finance', x: 300, y: 200, color: 'bg-purple-500', connections: 67 },
    { id: 'sales', name: 'Sales', x: 150, y: 280, color: 'bg-orange-500', connections: 34 },
    { id: 'marketing', name: 'Marketing', x: 450, y: 250, color: 'bg-pink-500', connections: 23 }
  ];

  const connections = [
    { from: 'hr', to: 'it', traffic: 85, protocol: 'HTTPS', status: 'active' },
    { from: 'it', to: 'finance', traffic: 92, protocol: 'SSH', status: 'active' },
    { from: 'finance', to: 'sales', traffic: 67, protocol: 'HTTPS', status: 'warning' },
    { from: 'sales', to: 'marketing', traffic: 45, protocol: 'HTTP', status: 'active' },
    { from: 'hr', to: 'finance', traffic: 23, protocol: 'HTTPS', status: 'blocked' }
  ];

  const getConnectionPath = (from, to) => {
    const fromDept = departments?.find(d => d?.id === from);
    const toDept = departments?.find(d => d?.id === to);
    
    if (!fromDept || !toDept) return '';
    
    const midX = (fromDept?.x + toDept?.x) / 2;
    const midY = (fromDept?.y + toDept?.y) / 2 - 30;
    
    return `M ${fromDept?.x} ${fromDept?.y} Q ${midX} ${midY} ${toDept?.x} ${toDept?.y}`;
  };

  const getConnectionColor = (status) => {
    switch (status) {
      case 'active': return '#059669';
      case 'warning': return '#d97706';
      case 'blocked': return '#dc2626';
      default: return '#64748b';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Network" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Network Traffic Flow</h3>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setAnimationEnabled(!animationEnabled)}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded-md transition-colors"
          >
            <Icon name={animationEnabled ? 'Pause' : 'Play'} size={14} />
            <span>{animationEnabled ? 'Pause' : 'Play'}</span>
          </button>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Active</span>
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Warning</span>
            <div className="w-2 h-2 bg-error rounded-full"></div>
            <span>Blocked</span>
          </div>
        </div>
      </div>
      <div className="relative">
        <svg width="600" height="400" className="w-full h-auto border border-border rounded-lg bg-muted/20">
          {/* Connection Lines */}
          {connections?.map((conn, index) => (
            <g key={index}>
              <path
                d={getConnectionPath(conn?.from, conn?.to)}
                stroke={getConnectionColor(conn?.status)}
                strokeWidth="3"
                fill="none"
                strokeDasharray={conn?.status === 'blocked' ? '5,5' : 'none'}
                className={animationEnabled ? 'animate-pulse' : ''}
              />
              {/* Traffic Volume Indicator */}
              <circle
                cx={departments?.find(d => d?.id === conn?.from)?.x}
                cy={departments?.find(d => d?.id === conn?.from)?.y}
                r={Math.max(3, conn?.traffic / 10)}
                fill={getConnectionColor(conn?.status)}
                opacity="0.6"
                className={animationEnabled ? 'animate-ping' : ''}
              />
            </g>
          ))}

          {/* Department Nodes */}
          {departments?.map((dept) => (
            <g key={dept?.id}>
              <circle
                cx={dept?.x}
                cy={dept?.y}
                r="25"
                className={`${dept?.color} cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={() => setSelectedDepartment(dept)}
              />
              <text
                x={dept?.x}
                y={dept?.y + 5}
                textAnchor="middle"
                className="text-xs font-medium fill-white pointer-events-none"
              >
                {dept?.name}
              </text>
              <text
                x={dept?.x}
                y={dept?.y + 45}
                textAnchor="middle"
                className="text-xs fill-current text-muted-foreground"
              >
                {dept?.connections} conn
              </text>
            </g>
          ))}
        </svg>

        {/* Department Details Panel */}
        {selectedDepartment && (
          <div className="absolute top-4 right-4 bg-popover border border-border rounded-lg p-4 shadow-lg min-w-64">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground">{selectedDepartment?.name} Department</h4>
              <button
                onClick={() => setSelectedDepartment(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Connections:</span>
                <span className="font-mono text-foreground">{selectedDepartment?.connections}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Bandwidth Usage:</span>
                <span className="font-mono text-foreground">
                  {Math.floor(Math.random() * 100)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Security Status:</span>
                <span className="text-success font-medium">Secure</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Activity:</span>
                <span className="font-mono text-foreground">2m ago</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Protocol Breakdown */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span className="text-sm font-medium text-foreground">HTTPS Traffic</span>
          </div>
          <div className="text-2xl font-bold text-foreground">67%</div>
          <div className="text-xs text-muted-foreground">Encrypted connections</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-warning rounded-full"></div>
            <span className="text-sm font-medium text-foreground">SSH Traffic</span>
          </div>
          <div className="text-2xl font-bold text-foreground">23%</div>
          <div className="text-xs text-muted-foreground">Administrative access</div>
        </div>
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-error rounded-full"></div>
            <span className="text-sm font-medium text-foreground">HTTP Traffic</span>
          </div>
          <div className="text-2xl font-bold text-foreground">10%</div>
          <div className="text-xs text-muted-foreground">Unencrypted connections</div>
        </div>
      </div>
    </div>
  );
};

export default TrafficFlowVisualization;