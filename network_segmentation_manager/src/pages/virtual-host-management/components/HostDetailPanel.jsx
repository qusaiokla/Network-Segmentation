import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const HostDetailPanel = ({ host, isOpen, onClose, onUpdateHost, onHostAction }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setSaving] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'network', label: 'Network', icon: 'Network' },
    { id: 'resources', label: 'Resources', icon: 'Cpu' },
    { id: 'logs', label: 'Logs', icon: 'FileText' }
  ];

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

  const handleEdit = () => {
    setEditData({
      hostname: host?.hostname,
      description: host?.description || '',
      cpuCores: host?.resourceAllocation?.cpu?.toString() || '2',
      memoryGB: host?.resourceAllocation?.memory?.toString() || '4',
      diskGB: host?.resourceAllocation?.disk?.toString() || '20'
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedHost = {
        ...host,
        hostname: editData?.hostname,
        description: editData?.description,
        resourceAllocation: {
          cpu: parseInt(editData?.cpuCores),
          memory: parseInt(editData?.memoryGB),
          disk: parseInt(editData?.diskGB)
        }
      };
      onUpdateHost(updatedHost);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update host:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({});
    setIsEditing(false);
  };

  const formatUptime = (startTime) => {
    if (!startTime) return 'N/A';
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = now - start;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`;
    return `${diffHours}h ${Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))}m`;
  };

  const mockLogs = [
    { timestamp: new Date(Date.now() - 300000), level: 'INFO', message: 'Host started successfully' },
    { timestamp: new Date(Date.now() - 600000), level: 'INFO', message: 'Network interface configured' },
    { timestamp: new Date(Date.now() - 900000), level: 'WARN', message: 'High memory usage detected' },
    { timestamp: new Date(Date.now() - 1200000), level: 'INFO', message: 'Service health check passed' }
  ];

  if (!isOpen || !host) return null;

  return (
    <div className="fixed inset-0 z-[1200] overflow-hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border shadow-floating overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Server" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{host?.hostname}</h2>
              <div className="flex items-center space-x-2 mt-1">
                <Icon 
                  name={getStatusIcon(host?.status)} 
                  size={14} 
                  className={`${getStatusColor(host?.status)} ${host?.status === 'starting' ? 'animate-spin' : ''}`}
                />
                <span className={`text-sm font-medium capitalize ${getStatusColor(host?.status)}`}>
                  {host?.status}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDepartmentColor(host?.department)}`}>
                  {host?.department}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit"
                onClick={handleEdit}
              >
                Edit
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  iconName="Save"
                  onClick={handleSave}
                  loading={isSaving}
                >
                  Save
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors
                ${activeTab === tab?.id 
                  ? 'text-primary border-b-2 border-primary bg-muted/50' :'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditing ? (
                    <Input
                      label="Hostname"
                      value={editData?.hostname}
                      onChange={(e) => setEditData(prev => ({ ...prev, hostname: e?.target?.value }))}
                    />
                  ) : (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Hostname</div>
                      <div className="text-sm font-mono text-foreground">{host?.hostname}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Namespace</div>
                    <div className="text-sm font-mono text-foreground">{host?.namespace}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Created</div>
                    <div className="text-sm text-foreground">
                      {new Date(host.createdAt || Date.now())?.toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Uptime</div>
                    <div className="text-sm text-foreground">
                      {host?.status === 'running' ? formatUptime(host?.startTime) : 'N/A'}
                    </div>
                  </div>
                </div>
                {isEditing ? (
                  <Input
                    label="Description"
                    value={editData?.description}
                    onChange={(e) => setEditData(prev => ({ ...prev, description: e?.target?.value }))}
                    className="mt-4"
                  />
                ) : (
                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground mb-1">Description</div>
                    <div className="text-sm text-foreground">
                      {host?.description || 'No description provided'}
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {host?.status === 'running' ? (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Square"
                      onClick={() => onHostAction('stop', host)}
                    >
                      Stop Host
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Play"
                      onClick={() => onHostAction('start', host)}
                    >
                      Start Host
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RotateCcw"
                    onClick={() => onHostAction('restart', host)}
                  >
                    Restart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Terminal"
                    onClick={() => onHostAction('console', host)}
                  >
                    Console
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Network Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                    <div className="text-sm font-mono text-foreground">{host?.ipAddress}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Subnet</div>
                    <div className="text-sm font-mono text-foreground">{host?.subnet}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Gateway</div>
                    <div className="text-sm font-mono text-foreground">
                      {host?.subnet?.replace(/\.\d+\/\d+$/, '.1') || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">DNS</div>
                    <div className="text-sm font-mono text-foreground">8.8.8.8, 8.8.4.4</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-3">Resource Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {isEditing ? (
                    <>
                      <Select
                        label="CPU Cores"
                        options={[
                          { value: '1', label: '1 Core' },
                          { value: '2', label: '2 Cores' },
                          { value: '4', label: '4 Cores' },
                          { value: '8', label: '8 Cores' }
                        ]}
                        value={editData?.cpuCores}
                        onChange={(value) => setEditData(prev => ({ ...prev, cpuCores: value }))}
                      />
                      <Select
                        label="Memory"
                        options={[
                          { value: '2', label: '2 GB RAM' },
                          { value: '4', label: '4 GB RAM' },
                          { value: '8', label: '8 GB RAM' },
                          { value: '16', label: '16 GB RAM' }
                        ]}
                        value={editData?.memoryGB}
                        onChange={(value) => setEditData(prev => ({ ...prev, memoryGB: value }))}
                      />
                      <Select
                        label="Storage"
                        options={[
                          { value: '20', label: '20 GB Storage' },
                          { value: '50', label: '50 GB Storage' },
                          { value: '100', label: '100 GB Storage' },
                          { value: '200', label: '200 GB Storage' }
                        ]}
                        value={editData?.diskGB}
                        onChange={(value) => setEditData(prev => ({ ...prev, diskGB: value }))}
                      />
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">CPU</div>
                        <div className="text-sm text-foreground">
                          {host?.resourceAllocation?.cpu || 2} cores
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {host?.resourceUsage?.cpu || 0}% used
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Memory</div>
                        <div className="text-sm text-foreground">
                          {host?.resourceAllocation?.memory || 4} GB
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {host?.resourceUsage?.memory || 0}% used
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Storage</div>
                        <div className="text-sm text-foreground">
                          {host?.resourceAllocation?.disk || 20} GB
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {host?.resourceUsage?.disk || 0}% used
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Recent Logs</h3>
                <Button variant="ghost" size="sm" iconName="RefreshCw">
                  Refresh
                </Button>
              </div>
              <div className="space-y-2">
                {mockLogs?.map((log, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-mono px-2 py-1 rounded ${
                          log?.level === 'ERROR' ? 'bg-destructive text-destructive-foreground' :
                          log?.level === 'WARN' ? 'bg-warning text-warning-foreground' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {log?.level}
                        </span>
                        <span className="text-sm text-foreground">{log?.message}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log?.timestamp?.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDetailPanel;