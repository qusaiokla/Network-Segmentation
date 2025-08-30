import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const NetworkDiagram = ({ currentTest, testResults }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [animatingPath, setAnimatingPath] = useState(null);

  useEffect(() => {
    if (currentTest) {
      setAnimatingPath({
        source: currentTest?.source,
        destination: currentTest?.destination
      });
      
      const timer = setTimeout(() => {
        setAnimatingPath(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [currentTest]);

  const networkNodes = [
    {
      id: 'core-gw-001',
      label: 'Core Gateway',
      type: 'router',
      position: { x: 50, y: 20 },
      status: 'healthy',
      ip: '10.0.0.1',
      department: 'core'
    },
    {
      id: 'hr-ws-001',
      label: 'HR-WS-001',
      type: 'workstation',
      position: { x: 20, y: 60 },
      status: 'healthy',
      ip: '192.168.10.10',
      department: 'hr'
    },
    {
      id: 'hr-ws-002',
      label: 'HR-WS-002',
      type: 'workstation',
      position: { x: 35, y: 75 },
      status: 'healthy',
      ip: '192.168.10.11',
      department: 'hr'
    },
    {
      id: 'it-srv-001',
      label: 'IT-SRV-001',
      type: 'server',
      position: { x: 65, y: 60 },
      status: 'healthy',
      ip: '192.168.20.10',
      department: 'it'
    },
    {
      id: 'it-ws-001',
      label: 'IT-WS-001',
      type: 'workstation',
      position: { x: 80, y: 75 },
      status: 'healthy',
      ip: '192.168.20.20',
      department: 'it'
    },
    {
      id: 'fin-ws-001',
      label: 'FIN-WS-001',
      type: 'workstation',
      position: { x: 20, y: 40 },
      status: 'warning',
      ip: '192.168.30.10',
      department: 'finance'
    },
    {
      id: 'fin-srv-001',
      label: 'FIN-SRV-001',
      type: 'server',
      position: { x: 80, y: 40 },
      status: 'healthy',
      ip: '192.168.30.20',
      department: 'finance'
    },
    {
      id: 'dmz-web-001',
      label: 'DMZ-WEB-001',
      type: 'server',
      position: { x: 50, y: 5 },
      status: 'healthy',
      ip: '10.0.1.10',
      department: 'dmz'
    }
  ];

  const getNodeIcon = (type) => {
    switch (type) {
      case 'router': return 'Router';
      case 'server': return 'Server';
      case 'workstation': return 'Monitor';
      default: return 'Circle';
    }
  };

  const getNodeColor = (status, department) => {
    const baseColors = {
      hr: 'bg-blue-500',
      it: 'bg-green-500',
      finance: 'bg-purple-500',
      dmz: 'bg-orange-500',
      core: 'bg-gray-500'
    };

    if (status === 'warning') return 'bg-warning';
    if (status === 'error') return 'bg-error';
    
    return baseColors?.[department] || 'bg-secondary';
  };

  const getConnectionStatus = (sourceId, destId) => {
    const recentTest = testResults?.find(test => 
      (test?.source === sourceId && test?.destination === destId) ||
      (test?.source === destId && test?.destination === sourceId)
    );
    
    return recentTest?.status || 'unknown';
  };

  const isPathAnimating = (sourceId, destId) => {
    return animatingPath && 
           ((animatingPath?.source === sourceId && animatingPath?.destination === destId) ||
            (animatingPath?.source === destId && animatingPath?.destination === sourceId));
  };

  const renderConnections = () => {
    const connections = [
      { from: 'core-gw-001', to: 'hr-ws-001' },
      { from: 'core-gw-001', to: 'hr-ws-002' },
      { from: 'core-gw-001', to: 'it-srv-001' },
      { from: 'core-gw-001', to: 'it-ws-001' },
      { from: 'core-gw-001', to: 'fin-ws-001' },
      { from: 'core-gw-001', to: 'fin-srv-001' },
      { from: 'core-gw-001', to: 'dmz-web-001' },
      { from: 'hr-ws-001', to: 'hr-ws-002' },
      { from: 'it-srv-001', to: 'it-ws-001' }
    ];

    return connections?.map((conn, index) => {
      const fromNode = networkNodes?.find(n => n?.id === conn?.from);
      const toNode = networkNodes?.find(n => n?.id === conn?.to);
      
      if (!fromNode || !toNode) return null;

      const status = getConnectionStatus(conn?.from, conn?.to);
      const isAnimating = isPathAnimating(conn?.from, conn?.to);
      
      let strokeColor = '#64748b'; // default gray
      if (status === 'success') strokeColor = '#059669';
      if (status === 'failed') strokeColor = '#dc2626';
      if (status === 'warning') strokeColor = '#d97706';

      return (
        <line
          key={index}
          x1={`${fromNode?.position?.x}%`}
          y1={`${fromNode?.position?.y}%`}
          x2={`${toNode?.position?.x}%`}
          y2={`${toNode?.position?.y}%`}
          stroke={strokeColor}
          strokeWidth={isAnimating ? "3" : "2"}
          strokeDasharray={isAnimating ? "5,5" : "none"}
          className={isAnimating ? "animate-pulse" : ""}
          opacity={0.7}
        />
      );
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Network" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Network Topology</h3>
            <p className="text-sm text-muted-foreground">Interactive network diagram with test visualization</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-error rounded-full"></div>
              <span className="text-muted-foreground">Error</span>
            </div>
          </div>
        </div>
      </div>
      {/* Network Diagram */}
      <div className="flex-1 p-4 relative">
        <div className="relative w-full h-full bg-muted/20 rounded-lg overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            {renderConnections()}
          </svg>
          
          {/* Network Nodes */}
          {networkNodes?.map((node) => (
            <div
              key={node?.id}
              onClick={() => setSelectedNode(node)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                selectedNode?.id === node?.id ? 'scale-110 z-10' : ''
              }`}
              style={{
                left: `${node?.position?.x}%`,
                top: `${node?.position?.y}%`
              }}
            >
              <div className={`w-12 h-12 ${getNodeColor(node?.status, node?.department)} rounded-lg flex items-center justify-center shadow-lg border-2 border-white`}>
                <Icon name={getNodeIcon(node?.type)} size={20} color="white" />
              </div>
              
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                <div className="text-xs font-medium text-foreground whitespace-nowrap">
                  {node?.label}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {node?.ip}
                </div>
              </div>
              
              {/* Status indicator */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                node?.status === 'healthy' ? 'bg-success' :
                node?.status === 'warning' ? 'bg-warning' : 'bg-error'
              }`}></div>
            </div>
          ))}
        </div>

        {/* Node Details Panel */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 bg-popover border border-border rounded-lg shadow-floating p-4 w-64 z-20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-popover-foreground">{selectedNode?.label}</h4>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span className="text-popover-foreground capitalize">{selectedNode?.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP Address:</span>
                <span className="font-mono text-popover-foreground">{selectedNode?.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="text-popover-foreground capitalize">{selectedNode?.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    selectedNode?.status === 'healthy' ? 'bg-success' :
                    selectedNode?.status === 'warning' ? 'bg-warning' : 'bg-error'
                  }`}></div>
                  <span className="text-popover-foreground capitalize">{selectedNode?.status}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">
                Last tested: 2 minutes ago
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkDiagram;