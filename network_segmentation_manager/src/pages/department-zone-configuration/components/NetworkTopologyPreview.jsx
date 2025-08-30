import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const NetworkTopologyPreview = ({ 
  selectedDepartment, 
  departments, 
  configurationData 
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [selectedNode, setSelectedNode] = useState(null);

  // Mock network topology data
  const networkNodes = [
    {
      id: 'core-switch',
      type: 'switch',
      label: 'Core Switch',
      x: 50,
      y: 20,
      icon: 'Router',
      status: 'active',
      connections: ['hr-switch', 'it-switch', 'finance-switch', 'guest-switch']
    },
    {
      id: 'hr-switch',
      type: 'department-switch',
      label: 'HR Switch',
      department: 'hr',
      x: 20,
      y: 60,
      icon: 'Router',
      status: 'active',
      vlan: '10',
      connections: ['hr-host-1', 'hr-host-2']
    },
    {
      id: 'it-switch',
      type: 'department-switch',
      label: 'IT Switch',
      department: 'it',
      x: 80,
      y: 60,
      icon: 'Router',
      status: 'active',
      vlan: '20',
      connections: ['it-host-1', 'it-host-2']
    },
    {
      id: 'finance-switch',
      type: 'department-switch',
      label: 'Finance Switch',
      department: 'finance',
      x: 20,
      y: 80,
      icon: 'Router',
      status: 'warning',
      vlan: '30',
      connections: ['finance-host-1']
    },
    {
      id: 'guest-switch',
      type: 'department-switch',
      label: 'Guest Switch',
      department: 'guest',
      x: 80,
      y: 80,
      icon: 'Router',
      status: 'active',
      vlan: '40',
      connections: ['guest-host-1']
    }
  ];

  const getDepartmentColor = (departmentId) => {
    const dept = departments?.find(d => d?.id === departmentId);
    return dept?.color || 'bg-muted';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'border-success bg-success/10';
      case 'warning': return 'border-warning bg-warning/10';
      case 'error': return 'border-error bg-error/10';
      case 'inactive': return 'border-muted-foreground bg-muted';
      default: return 'border-muted-foreground bg-muted';
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const renderConnections = () => {
    const connections = [];
    
    networkNodes?.forEach(node => {
      if (node?.connections) {
        node?.connections?.forEach(targetId => {
          const targetNode = networkNodes?.find(n => n?.id === targetId);
          if (targetNode) {
            const isHighlighted = selectedDepartment && 
              (node?.department === selectedDepartment?.id || targetNode?.department === selectedDepartment?.id);
            
            connections?.push(
              <line
                key={`${node?.id}-${targetId}`}
                x1={`${node?.x}%`}
                y1={`${node?.y}%`}
                x2={`${targetNode?.x}%`}
                y2={`${targetNode?.y}%`}
                stroke={isHighlighted ? 'var(--color-primary)' : 'var(--color-border)'}
                strokeWidth={isHighlighted ? 3 : 2}
                strokeDasharray={isHighlighted ? '0' : '5,5'}
                className="transition-all duration-300"
              />
            );
          }
        });
      }
    });
    
    return connections;
  };

  const renderNodes = () => {
    return networkNodes?.map(node => {
      const isHighlighted = selectedDepartment && node?.department === selectedDepartment?.id;
      const isSelected = selectedNode?.id === node?.id;
      
      return (
        <g key={node?.id} transform={`translate(${node?.x}%, ${node?.y}%)`}>
          <circle
            cx="0"
            cy="0"
            r="20"
            className={`
              cursor-pointer transition-all duration-300
              ${getStatusColor(node?.status)}
              ${isHighlighted ? 'ring-4 ring-primary/30' : ''}
              ${isSelected ? 'ring-2 ring-accent' : ''}
            `}
            onClick={() => setSelectedNode(node)}
          />
          <foreignObject x="-12" y="-12" width="24" height="24">
            <div className="flex items-center justify-center w-full h-full">
              <Icon 
                name={node?.icon} 
                size={16} 
                className={`
                  ${node?.status === 'active' ? 'text-success' : 
                    node?.status === 'warning' ? 'text-warning' : 
                    node?.status === 'error' ? 'text-error' : 'text-muted-foreground'}
                `}
              />
            </div>
          </foreignObject>
          <text
            x="0"
            y="35"
            textAnchor="middle"
            className="text-xs font-medium fill-foreground"
          >
            {node?.label}
          </text>
          {node?.vlan && (
            <text
              x="0"
              y="48"
              textAnchor="middle"
              className="text-xs fill-muted-foreground font-mono"
            >
              VLAN {node?.vlan}
            </text>
          )}
        </g>
      );
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Network" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Network Topology</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Zoom Out"
            >
              <Icon name="ZoomOut" size={16} className="text-muted-foreground" />
            </button>
            <span className="text-xs font-mono text-muted-foreground min-w-[3rem] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Zoom In"
            >
              <Icon name="ZoomIn" size={16} className="text-muted-foreground" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1 hover:bg-muted rounded transition-colors"
              title="Reset Zoom"
            >
              <Icon name="RotateCcw" size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      {/* Topology Visualization */}
      <div className="flex-1 p-4 overflow-hidden">
        <div 
          className="w-full h-full bg-muted/20 rounded-lg border border-border overflow-auto"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            className="min-h-[400px]"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--color-border)" strokeWidth="0.5" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Network Connections */}
            <g className="connections">
              {renderConnections()}
            </g>
            
            {/* Network Nodes */}
            <g className="nodes">
              {renderNodes()}
            </g>
          </svg>
        </div>
      </div>
      {/* Legend and Info */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          {/* Department Legend */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Department Zones</h4>
            <div className="grid grid-cols-2 gap-2">
              {departments?.map(dept => (
                <div 
                  key={dept?.id}
                  className={`
                    flex items-center space-x-2 p-2 rounded-lg transition-all duration-150
                    ${selectedDepartment?.id === dept?.id ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'}
                  `}
                >
                  <div className={`w-3 h-3 rounded-full ${dept?.color}`}></div>
                  <span className="text-xs font-medium text-foreground">{dept?.name}</span>
                  <span className="text-xs font-mono text-muted-foreground ml-auto">
                    VLAN {dept?.vlan}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Legend */}
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Status Indicators</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-success"></div>
                <span className="text-muted-foreground">Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-warning"></div>
                <span className="text-muted-foreground">Warning</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 rounded-full bg-error"></div>
                <span className="text-muted-foreground">Error</span>
              </div>
            </div>
          </div>

          {/* Selected Node Info */}
          {selectedNode && (
            <div className="bg-muted/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-foreground mb-2">Node Details</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <span className="ml-1 font-medium text-foreground">{selectedNode?.label}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-1 font-medium text-foreground capitalize">{selectedNode?.type}</span>
                </div>
                {selectedNode?.vlan && (
                  <div>
                    <span className="text-muted-foreground">VLAN:</span>
                    <span className="ml-1 font-mono text-foreground">{selectedNode?.vlan}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`ml-1 font-medium capitalize ${
                    selectedNode?.status === 'active' ? 'text-success' :
                    selectedNode?.status === 'warning' ? 'text-warning' :
                    selectedNode?.status === 'error' ? 'text-error' : 'text-muted-foreground'
                  }`}>
                    {selectedNode?.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NetworkTopologyPreview;