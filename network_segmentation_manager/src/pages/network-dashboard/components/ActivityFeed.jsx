import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState('all');

  const mockActivities = [
    {
      id: 1,
      type: 'policy_change',
      title: 'VLAN Policy Updated',
      description: 'HR Department VLAN 10 access rules modified by admin@company.com',
      timestamp: new Date(Date.now() - 300000),
      severity: 'info',
      department: 'HR',
      icon: 'Shield'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Connectivity Issue Detected',
      description: 'Guest Network VLAN 40 showing intermittent connectivity problems',
      timestamp: new Date(Date.now() - 600000),
      severity: 'warning',
      department: 'Guest',
      icon: 'AlertTriangle'
    },
    {
      id: 3,
      type: 'test_result',
      title: 'Network Test Completed',
      description: 'Full segmentation test passed with 98.5% success rate across all zones',
      timestamp: new Date(Date.now() - 900000),
      severity: 'success',
      department: 'System',
      icon: 'CheckCircle'
    },
    {
      id: 4,
      type: 'host_added',
      title: 'New Host Connected',
      description: 'Finance workstation (192.168.30.25) joined VLAN 30 successfully',
      timestamp: new Date(Date.now() - 1200000),
      severity: 'info',
      department: 'Finance',
      icon: 'Plus'
    },
    {
      id: 5,
      type: 'policy_violation',
      title: 'Policy Violation Blocked',
      description: 'Unauthorized access attempt from HR to Finance network blocked',
      timestamp: new Date(Date.now() - 1500000),
      severity: 'error',
      department: 'Security',
      icon: 'XCircle'
    },
    {
      id: 6,
      type: 'maintenance',
      title: 'Scheduled Maintenance',
      description: 'IT Department VLAN 20 maintenance window completed successfully',
      timestamp: new Date(Date.now() - 1800000),
      severity: 'info',
      department: 'IT',
      icon: 'Settings'
    },
    {
      id: 7,
      type: 'alert',
      title: 'High Traffic Volume',
      description: 'Finance Department experiencing 85% bandwidth utilization',
      timestamp: new Date(Date.now() - 2100000),
      severity: 'warning',
      department: 'Finance',
      icon: 'Activity'
    },
    {
      id: 8,
      type: 'test_result',
      title: 'Security Scan Complete',
      description: 'Vulnerability scan completed - 2 medium priority issues found',
      timestamp: new Date(Date.now() - 2400000),
      severity: 'warning',
      department: 'Security',
      icon: 'Search'
    }
  ];

  useEffect(() => {
    setActivities(mockActivities);
    
    // Simulate real-time activity updates
    const interval = setInterval(() => {
      const newActivity = {
        id: Date.now(),
        type: 'system_update',
        title: 'System Status Update',
        description: `Network health check completed - All systems operational`,
        timestamp: new Date(),
        severity: 'info',
        department: 'System',
        icon: 'RefreshCw'
      };
      
      setActivities(prev => [newActivity, ...prev?.slice(0, 9)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'success': return 'text-success bg-success/10 border-success/20';
      case 'warning': return 'text-warning bg-warning/10 border-warning/20';
      case 'error': return 'text-error bg-error/10 border-error/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'HR': return 'bg-blue-100 text-blue-800';
      case 'IT': return 'bg-green-100 text-green-800';
      case 'Finance': return 'bg-purple-100 text-purple-800';
      case 'Guest': return 'bg-orange-100 text-orange-800';
      case 'Security': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return timestamp?.toLocaleDateString();
  };

  const filteredActivities = activities?.filter(activity => {
    if (filter === 'all') return true;
    return activity?.severity === filter;
  });

  const filterOptions = [
    { value: 'all', label: 'All Activities', count: activities?.length },
    { value: 'error', label: 'Critical', count: activities?.filter(a => a?.severity === 'error')?.length },
    { value: 'warning', label: 'Warnings', count: activities?.filter(a => a?.severity === 'warning')?.length },
    { value: 'success', label: 'Success', count: activities?.filter(a => a?.severity === 'success')?.length }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Activity" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-xs text-muted-foreground">Live</span>
          </div>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-4 bg-muted p-1 rounded-lg">
        {filterOptions?.map((option) => (
          <button
            key={option?.value}
            onClick={() => setFilter(option?.value)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
              filter === option?.value
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {option?.label}
            {option?.count > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-muted-foreground/20 rounded-full">
                {option?.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {/* Activity List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredActivities?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No activities found</p>
          </div>
        ) : (
          filteredActivities?.map((activity) => (
            <div
              key={activity?.id}
              className="flex items-start space-x-3 p-3 hover:bg-muted/50 rounded-lg transition-colors duration-150 cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getSeverityColor(activity?.severity)}`}>
                <Icon name={activity?.icon} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {activity?.title}
                  </h3>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                    {getTimeAgo(activity?.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {activity?.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDepartmentColor(activity?.department)}`}>
                    {activity?.department}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing {filteredActivities?.length} of {activities?.length} activities
        </span>
        <button className="text-xs text-primary hover:text-primary/80 transition-colors">
          View All Activities
        </button>
      </div>
    </div>
  );
};

export default ActivityFeed;