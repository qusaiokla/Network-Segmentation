import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HostTable = ({ 
  hosts, 
  selectedHosts, 
  onSelectHost, 
  onSelectAll, 
  onHostAction, 
  onRowClick,
  sortConfig,
  onSort 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-success';
      case 'stopped': return 'text-error';
      case 'starting': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return 'Play';
      case 'stopped': return 'Square';
      case 'starting': return 'Loader';
      case 'error': return 'AlertCircle';
      default: return 'Circle';
    }
  };

  const getDepartmentColor = (department) => {
    switch (department) {
      case 'IT': return 'bg-blue-100 text-blue-800';
      case 'HR': return 'bg-green-100 text-green-800';
      case 'Finance': return 'bg-purple-100 text-purple-800';
      case 'Marketing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatResourceUsage = (usage) => {
    return `${usage?.cpu}% CPU, ${usage?.memory}% RAM`;
  };

  const formatLastActivity = (timestamp) => {
    const now = new Date();
    const activity = new Date(timestamp);
    const diffMs = now - activity;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) return 'ArrowUpDown';
    return sortConfig?.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const handleSort = (column) => {
    onSort(column);
  };

  const handleAction = (e, action, host) => {
    e?.stopPropagation();
    onHostAction(action, host);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedHosts?.length === hosts?.length && hosts?.length > 0}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              {[
                { key: 'hostname', label: 'Hostname' },
                { key: 'ipAddress', label: 'IP Address' },
                { key: 'department', label: 'Department' },
                { key: 'status', label: 'Status' },
                { key: 'resourceUsage', label: 'Resources' },
                { key: 'lastActivity', label: 'Last Activity' }
              ]?.map((column) => (
                <th
                  key={column?.key}
                  className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                  onClick={() => handleSort(column?.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column?.label}</span>
                    <Icon name={getSortIcon(column?.key)} size={12} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {hosts?.map((host) => (
              <tr
                key={host?.id}
                className={`hover:bg-muted/30 cursor-pointer transition-colors ${
                  selectedHosts?.includes(host?.id) ? 'bg-muted/50' : ''
                }`}
                onClick={() => onRowClick(host)}
                onMouseEnter={() => setHoveredRow(host?.id)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedHosts?.includes(host?.id)}
                    onChange={(e) => {
                      e?.stopPropagation();
                      onSelectHost(host?.id);
                    }}
                    className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Server" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{host?.hostname}</div>
                      <div className="text-xs text-muted-foreground font-mono">{host?.namespace}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-mono text-foreground">{host?.ipAddress}</div>
                  <div className="text-xs text-muted-foreground">{host?.subnet}</div>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(host?.department)}`}>
                    {host?.department}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={getStatusIcon(host?.status)} 
                      size={16} 
                      className={`${getStatusColor(host?.status)} ${host?.status === 'starting' ? 'animate-spin' : ''}`}
                    />
                    <span className={`text-sm font-medium capitalize ${getStatusColor(host?.status)}`}>
                      {host?.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{formatResourceUsage(host?.resourceUsage)}</div>
                  <div className="text-xs text-muted-foreground">{host?.resourceUsage?.disk}% Disk</div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-foreground">{formatLastActivity(host?.lastActivity)}</div>
                </td>
                <td className="px-4 py-4">
                  <div className={`flex items-center space-x-1 transition-opacity ${
                    hoveredRow === host?.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {host?.status === 'running' ? (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Square"
                        onClick={(e) => handleAction(e, 'stop', host)}
                        title="Stop host"
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="Play"
                        onClick={(e) => handleAction(e, 'start', host)}
                        title="Start host"
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="RotateCcw"
                      onClick={(e) => handleAction(e, 'restart', host)}
                      title="Restart host"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Settings"
                      onClick={(e) => handleAction(e, 'configure', host)}
                      title="Configure host"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Trash2"
                      onClick={(e) => handleAction(e, 'delete', host)}
                      title="Delete host"
                      className="text-destructive hover:text-destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile/Tablet Card Layout */}
      <div className="lg:hidden space-y-4 p-4">
        {hosts?.map((host) => (
          <div
            key={host?.id}
            className={`bg-background border border-border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedHosts?.includes(host?.id) ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground/20'
            }`}
            onClick={() => onRowClick(host)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedHosts?.includes(host?.id)}
                  onChange={(e) => {
                    e?.stopPropagation();
                    onSelectHost(host?.id);
                  }}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                />
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="Server" size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">{host?.hostname}</div>
                  <div className="text-xs text-muted-foreground font-mono">{host?.namespace}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Icon 
                  name={getStatusIcon(host?.status)} 
                  size={16} 
                  className={`${getStatusColor(host?.status)} ${host?.status === 'starting' ? 'animate-spin' : ''}`}
                />
                <span className={`text-sm font-medium capitalize ${getStatusColor(host?.status)}`}>
                  {host?.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                <div className="text-sm font-mono text-foreground">{host?.ipAddress}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Department</div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(host?.department)}`}>
                  {host?.department}
                </span>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Resources</div>
                <div className="text-sm text-foreground">{formatResourceUsage(host?.resourceUsage)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Last Activity</div>
                <div className="text-sm text-foreground">{formatLastActivity(host?.lastActivity)}</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-xs text-muted-foreground">{host?.subnet}</div>
              <div className="flex items-center space-x-2">
                {host?.status === 'running' ? (
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Square"
                    onClick={(e) => handleAction(e, 'stop', host)}
                  >
                    Stop
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Play"
                    onClick={(e) => handleAction(e, 'start', host)}
                  >
                    Start
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="xs"
                  iconName="Settings"
                  onClick={(e) => handleAction(e, 'configure', host)}
                >
                  Config
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {hosts?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Server" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Virtual Hosts</h3>
          <p className="text-muted-foreground mb-4">Create your first virtual host to get started with network segmentation.</p>
          <Button variant="default" iconName="Plus">
            Create Virtual Host
          </Button>
        </div>
      )}
    </div>
  );
};

export default HostTable;