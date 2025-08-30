import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const NetworkTopologyView = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('healthy');

  const networkZones = [
    {
      id: 'hr-zone',
      name: 'HR Department',
      vlan: 'VLAN 10',
      subnet: '192.168.10.0/24',
      hosts: 12,
      status: 'healthy',
      position: { x: 20, y: 20 },
      color: 'bg-blue-500'
    },
    {
      id: 'it-zone',
      name: 'IT Department',
      vlan: 'VLAN 20',
      subnet: '192.168.20.0/24',
      hosts: 8,
      status: 'warning',
      position: { x: 60, y: 20 },
      color: 'bg-green-500'
    },
    {
      id: 'finance-zone',
      name: 'Finance Department',
      vlan: 'VLAN 30',
      subnet: '192.168.30.0/24',
      hosts: 15,
      status: 'healthy',
      position: { x: 20, y: 60 },
      color: 'bg-purple-500'
    },
    {
      id: 'guest-zone',
      name: 'Guest Network',
      vlan: 'VLAN 40',
      subnet: '192.168.40.0/24',
      hosts: 25,
      status: 'critical',
      position: { x: 60, y: 60 },
      color: 'bg-orange-500'
    }
  ];

  const connections = [
    { from: 'hr-zone', to: 'it-zone', status: 'active', type: 'allowed' },
    { from: 'it-zone', to: 'finance-zone', status: 'active', type: 'allowed' },
    { from: 'finance-zone', to: 'guest-zone', status: 'blocked', type: 'denied' },
    { from: 'hr-zone', to: 'finance-zone', status: 'blocked', type: 'denied' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'border-success bg-success/10';
      case 'warning': return 'border-warning bg-warning/10';
      case 'critical': return 'border-error bg-error/10';
      default: return 'border-muted bg-muted/10';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return 'CheckCircle';
      case 'warning': return 'AlertTriangle';
      case 'critical': return 'XCircle';
      default: return 'Circle';
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time status updates
      const statuses = ['healthy', 'warning', 'critical'];
      setConnectionStatus(statuses?.[Math.floor(Math.random() * statuses?.length)]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Network" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Network Topology</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
            <Icon name="RefreshCw" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      {/* Topology Visualization */}
      <div className="relative bg-muted/30 rounded-lg p-8 min-h-[400px] overflow-hidden">
        {/* Central Router */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center border-2 border-primary-foreground shadow-lg">
            <Icon name="Router" size={24} color="white" />
          </div>
          <div className="text-center mt-2">
            <p className="text-xs font-medium text-foreground">Core Router</p>
            <p className="text-xs text-muted-foreground">192.168.1.1</p>
          </div>
        </div>

        {/* Network Zones */}
        {networkZones?.map((zone) => (
          <div
            key={zone?.id}
            className={`absolute cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedZone === zone?.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            style={{
              left: `${zone?.position?.x}%`,
              top: `${zone?.position?.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onClick={() => setSelectedZone(selectedZone === zone?.id ? null : zone?.id)}
          >
            <div className={`w-20 h-20 rounded-lg border-2 ${getStatusColor(zone?.status)} flex items-center justify-center ${zone?.color} shadow-md`}>
              <Icon name="Building" size={20} color="white" />
            </div>
            <div className="text-center mt-2 min-w-[120px]">
              <p className="text-xs font-medium text-foreground">{zone?.name}</p>
              <p className="text-xs text-muted-foreground">{zone?.vlan}</p>
              <p className="text-xs text-muted-foreground">{zone?.hosts} hosts</p>
            </div>
            
            {/* Status Indicator */}
            <div className="absolute -top-1 -right-1">
              <Icon 
                name={getStatusIcon(zone?.status)} 
                size={16} 
                className={zone?.status === 'healthy' ? 'text-success' : zone?.status === 'warning' ? 'text-warning' : 'text-error'}
              />
            </div>
          </div>
        ))}

        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {connections?.map((connection, index) => {
            const fromZone = networkZones?.find(z => z?.id === connection?.from);
            const toZone = networkZones?.find(z => z?.id === connection?.to);
            if (!fromZone || !toZone) return null;

            const x1 = (fromZone?.position?.x / 100) * 100 + '%';
            const y1 = (fromZone?.position?.y / 100) * 100 + '%';
            const x2 = (toZone?.position?.x / 100) * 100 + '%';
            const y2 = (toZone?.position?.y / 100) * 100 + '%';

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={connection?.type === 'allowed' ? '#059669' : '#dc2626'}
                strokeWidth="2"
                strokeDasharray={connection?.type === 'denied' ? '5,5' : '0'}
                opacity="0.7"
              />
            );
          })}
        </svg>
      </div>
      {/* Zone Details */}
      {selectedZone && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          {(() => {
            const zone = networkZones?.find(z => z?.id === selectedZone);
            return (
              <div>
                <h3 className="font-medium text-foreground mb-2">{zone?.name} Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">VLAN</p>
                    <p className="font-mono text-foreground">{zone?.vlan}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Subnet</p>
                    <p className="font-mono text-foreground">{zone?.subnet}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Active Hosts</p>
                    <p className="font-mono text-foreground">{zone?.hosts}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div className="flex items-center space-x-1">
                      <Icon name={getStatusIcon(zone?.status)} size={14} className={zone?.status === 'healthy' ? 'text-success' : zone?.status === 'warning' ? 'text-warning' : 'text-error'} />
                      <p className="capitalize text-foreground">{zone?.status}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-success"></div>
            <span className="text-muted-foreground">Allowed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-0.5 bg-error" style={{ backgroundImage: 'repeating-linear-gradient(to right, #dc2626 0, #dc2626 3px, transparent 3px, transparent 6px)' }}></div>
            <span className="text-muted-foreground">Blocked</span>
          </div>
        </div>
        <span className="text-muted-foreground">Last updated: {new Date()?.toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default NetworkTopologyView;