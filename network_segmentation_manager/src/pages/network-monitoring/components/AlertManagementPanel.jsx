import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AlertManagementPanel = () => {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('timestamp');

  const mockAlerts = [
    {
      id: 'ALT-001',
      type: 'critical',
      title: 'Unauthorized Access Attempt',
      description: 'Multiple failed login attempts detected from Finance department to IT resources',
      department: 'Finance',
      timestamp: new Date(Date.now() - 300000),
      status: 'active',
      source: '192.168.2.45',
      target: '192.168.1.10'
    },
    {
      id: 'ALT-002',
      type: 'warning',
      title: 'High Bandwidth Usage',
      description: 'Marketing department exceeding allocated bandwidth threshold (85% of 100Mbps)',
      department: 'Marketing',
      timestamp: new Date(Date.now() - 900000),
      status: 'acknowledged',
      source: '192.168.4.0/24',
      target: 'External'
    },
    {
      id: 'ALT-003',
      type: 'info',
      title: 'Scheduled Maintenance Complete',
      description: 'Network segmentation policy update completed successfully for HR department',
      department: 'HR',
      timestamp: new Date(Date.now() - 1800000),
      status: 'resolved',
      source: 'System',
      target: '192.168.3.0/24'
    },
    {
      id: 'ALT-004',
      type: 'critical',
      title: 'Policy Violation Detected',
      description: 'Sales department attempting to access restricted Finance database resources',
      department: 'Sales',
      timestamp: new Date(Date.now() - 600000),
      status: 'active',
      source: '192.168.5.23',
      target: '192.168.2.100'
    },
    {
      id: 'ALT-005',
      type: 'warning',
      title: 'Unusual Traffic Pattern',
      description: 'Abnormal inter-VLAN communication detected between IT and external networks',
      department: 'IT',
      timestamp: new Date(Date.now() - 1200000),
      status: 'investigating',
      source: '192.168.1.0/24',
      target: '203.0.113.0/24'
    }
  ];

  useEffect(() => {
    setAlerts(mockAlerts);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return 'AlertTriangle';
      case 'warning': return 'AlertCircle';
      case 'info': return 'Info';
      default: return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'critical': return 'text-error';
      case 'warning': return 'text-warning';
      case 'info': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-error text-error-foreground', label: 'Active' },
      acknowledged: { color: 'bg-warning text-warning-foreground', label: 'Acknowledged' },
      investigating: { color: 'bg-accent text-accent-foreground', label: 'Investigating' },
      resolved: { color: 'bg-success text-success-foreground', label: 'Resolved' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const filteredAlerts = alerts?.filter(alert => {
    if (filter === 'all') return true;
    return alert?.type === filter || alert?.status === filter;
  });

  const sortedAlerts = [...filteredAlerts]?.sort((a, b) => {
    if (sortBy === 'timestamp') return b?.timestamp - a?.timestamp;
    if (sortBy === 'type') return a?.type?.localeCompare(b?.type);
    if (sortBy === 'department') return a?.department?.localeCompare(b?.department);
    return 0;
  });

  const handleAcknowledge = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleResolve = (alertId) => {
    setAlerts(prev => prev?.map(alert => 
      alert?.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Bell" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Alert Management</h3>
            <span className="px-2 py-1 text-xs font-mono bg-accent text-accent-foreground rounded-full">
              {alerts?.filter(a => a?.status === 'active')?.length} Active
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-input text-foreground"
            >
              <option value="all">All Alerts</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
              <option value="active">Active Only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="px-3 py-1 text-sm border border-border rounded-md bg-input text-foreground"
            >
              <option value="timestamp">Latest First</option>
              <option value="type">By Type</option>
              <option value="department">By Department</option>
            </select>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {sortedAlerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">No Alerts Found</h4>
            <p className="text-muted-foreground">All systems are operating normally</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedAlerts?.map((alert) => (
              <div key={alert?.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Icon 
                      name={getAlertIcon(alert?.type)} 
                      size={20} 
                      className={`mt-0.5 ${getAlertColor(alert?.type)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium text-foreground truncate">
                          {alert?.title}
                        </h4>
                        {getStatusBadge(alert?.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {alert?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Icon name="Building" size={12} />
                          <span>{alert?.department}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Clock" size={12} />
                          <span>{alert?.timestamp?.toLocaleTimeString()}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="Hash" size={12} />
                          <span className="font-mono">{alert?.id}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>Source: {alert?.source}</span>
                        <Icon name="ArrowRight" size={12} />
                        <span>Target: {alert?.target}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {alert?.status === 'active' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(alert?.id)}
                          iconName="Check"
                          iconPosition="left"
                        >
                          Acknowledge
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleResolve(alert?.id)}
                          iconName="CheckCircle"
                          iconPosition="left"
                        >
                          Resolve
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="ExternalLink"
                    >
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border bg-muted/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-muted-foreground">
              Showing {sortedAlerts?.length} of {alerts?.length} alerts
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-muted-foreground">Live monitoring active</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" iconName="Download">
              Export
            </Button>
            <Button variant="outline" size="sm" iconName="Settings">
              Configure
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertManagementPanel;