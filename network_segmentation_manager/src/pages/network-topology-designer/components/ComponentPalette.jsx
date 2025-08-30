import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ComponentPalette = ({ onDragStart, isCollapsed, onToggleCollapse }) => {
  const [activeCategory, setActiveCategory] = useState('network');

  const componentCategories = [
    {
      id: 'network',
      label: 'Network',
      icon: 'Network',
      components: [
        { id: 'vlan', name: 'VLAN', icon: 'Square', color: 'bg-blue-500', description: 'Virtual LAN segment' },
        { id: 'subnet', name: 'Subnet', icon: 'Grid3x3', color: 'bg-green-500', description: 'Network subnet' },
        { id: 'router', name: 'Router', icon: 'Router', color: 'bg-purple-500', description: 'Network router' },
        { id: 'switch', name: 'Switch', icon: 'GitBranch', color: 'bg-orange-500', description: 'Network switch' },
        { id: 'bridge', name: 'Bridge', icon: 'Bridge', color: 'bg-cyan-500', description: 'Network bridge' }
      ]
    },
    {
      id: 'devices',
      label: 'Devices',
      icon: 'Monitor',
      components: [
        { id: 'host', name: 'Host', icon: 'Monitor', color: 'bg-gray-500', description: 'Network host' },
        { id: 'server', name: 'Server', icon: 'Server', color: 'bg-red-500', description: 'Server device' },
        { id: 'firewall', name: 'Firewall', icon: 'Shield', color: 'bg-yellow-500', description: 'Security firewall' },
        { id: 'gateway', name: 'Gateway', icon: 'Globe', color: 'bg-indigo-500', description: 'Network gateway' }
      ]
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      components: [
        { id: 'acl', name: 'ACL Rule', icon: 'Lock', color: 'bg-red-600', description: 'Access control list' },
        { id: 'policy', name: 'Policy', icon: 'FileText', color: 'bg-blue-600', description: 'Security policy' },
        { id: 'zone', name: 'Security Zone', icon: 'ShieldCheck', color: 'bg-green-600', description: 'Security zone' }
      ]
    }
  ];

  const handleDragStart = (e, component) => {
    e?.dataTransfer?.setData('application/json', JSON.stringify(component));
    onDragStart(component);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-card border-r border-border flex flex-col items-center py-4 space-y-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
          title="Expand palette"
        >
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
        </button>
        {componentCategories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => {
              setActiveCategory(category?.id);
              onToggleCollapse();
            }}
            className={`p-2 rounded-lg transition-colors duration-150 ${
              activeCategory === category?.id 
                ? 'bg-primary text-primary-foreground' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
            title={category?.label}
          >
            <Icon name={category?.icon} size={16} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Package" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Components</h2>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-150"
          title="Collapse palette"
        >
          <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
        </button>
      </div>
      {/* Category Tabs */}
      <div className="flex border-b border-border">
        {componentCategories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setActiveCategory(category?.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium transition-colors duration-150 ${
              activeCategory === category?.id
                ? 'text-primary border-b-2 border-primary bg-muted/50' :'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span className="hidden sm:inline">{category?.label}</span>
          </button>
        ))}
      </div>
      {/* Components List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {componentCategories?.find(cat => cat?.id === activeCategory)
            ?.components?.map((component) => (
              <div
                key={component?.id}
                draggable
                onDragStart={(e) => handleDragStart(e, component)}
                className="flex items-center space-x-3 p-3 bg-muted/30 hover:bg-muted/50 rounded-lg cursor-grab active:cursor-grabbing transition-colors duration-150 border border-transparent hover:border-border"
              >
                <div className={`w-10 h-10 ${component?.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon name={component?.icon} size={20} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">{component?.name}</h3>
                  <p className="text-xs text-muted-foreground truncate">{component?.description}</p>
                </div>
                <Icon name="GripVertical" size={16} className="text-muted-foreground" />
              </div>
            ))}
        </div>

        {/* Usage Instructions */}
        <div className="mt-6 p-3 bg-muted/20 rounded-lg border border-border">
          <div className="flex items-start space-x-2">
            <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-foreground mb-1">How to Use</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Drag components from this palette onto the canvas to build your network topology. 
                Click on placed components to configure their properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentPalette;