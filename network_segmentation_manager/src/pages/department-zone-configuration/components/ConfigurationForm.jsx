import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConfigurationForm = ({ 
  selectedDepartment, 
  onConfigurationChange,
  onSaveChanges,
  onTestConfiguration,
  onApplyPolicies,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    vlanId: '',
    ipRange: '',
    gateway: '',
    subnetMask: '',
    dnsServers: '',
    bandwidthPriority: 50,
    accessPermissions: [],
    firewallRules: [],
    dhcpEnabled: true,
    internetAccess: true,
    sharedResources: []
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (selectedDepartment) {
      setFormData({
        vlanId: selectedDepartment?.vlan || '',
        ipRange: selectedDepartment?.subnet || '',
        gateway: selectedDepartment?.gateway || '',
        subnetMask: selectedDepartment?.subnetMask || '255.255.255.0',
        dnsServers: selectedDepartment?.dnsServers || '8.8.8.8, 8.8.4.4',
        bandwidthPriority: selectedDepartment?.bandwidthPriority || 50,
        accessPermissions: selectedDepartment?.accessPermissions || [],
        firewallRules: selectedDepartment?.firewallRules || [],
        dhcpEnabled: selectedDepartment?.dhcpEnabled !== false,
        internetAccess: selectedDepartment?.internetAccess !== false,
        sharedResources: selectedDepartment?.sharedResources || []
      });
      setHasChanges(false);
      setValidationErrors({});
    }
  }, [selectedDepartment]);

  const vlanOptions = [
    { value: '10', label: 'VLAN 10 - HR Department' },
    { value: '20', label: 'VLAN 20 - IT Department' },
    { value: '30', label: 'VLAN 30 - Finance Department' },
    { value: '40', label: 'VLAN 40 - Guest Network' },
    { value: '50', label: 'VLAN 50 - Management' },
    { value: '60', label: 'VLAN 60 - Development' }
  ];

  const departmentOptions = [
    { value: 'hr', label: 'HR Department' },
    { value: 'it', label: 'IT Department' },
    { value: 'finance', label: 'Finance Department' },
    { value: 'guest', label: 'Guest Network' },
    { value: 'management', label: 'Management' }
  ];

  const sharedResourceOptions = [
    { value: 'printer', label: 'Network Printers' },
    { value: 'fileserver', label: 'File Server' },
    { value: 'database', label: 'Database Server' },
    { value: 'backup', label: 'Backup Storage' },
    { value: 'monitoring', label: 'Monitoring Tools' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear validation error for this field
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Trigger real-time configuration change
    onConfigurationChange?.({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData?.vlanId) {
      errors.vlanId = 'VLAN ID is required';
    }

    if (!formData?.ipRange) {
      errors.ipRange = 'IP range is required';
    } else if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}$/?.test(formData?.ipRange)) {
      errors.ipRange = 'Invalid IP range format (e.g., 192.168.1.0/24)';
    }

    if (!formData?.gateway) {
      errors.gateway = 'Gateway is required';
    } else if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/?.test(formData?.gateway)) {
      errors.gateway = 'Invalid gateway IP format';
    }

    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSaveChanges?.(formData);
      setHasChanges(false);
    }
  };

  const handleTest = () => {
    if (validateForm()) {
      onTestConfiguration?.(formData);
    }
  };

  const handleApply = () => {
    if (validateForm()) {
      onApplyPolicies?.(formData);
      setHasChanges(false);
    }
  };

  if (!selectedDepartment) {
    return (
      <div className="bg-card border border-border rounded-lg h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="Building2" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Department Selected</h3>
          <p className="text-muted-foreground">
            Select a department from the list to configure network settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedDepartment?.color}`}>
              <Icon name={selectedDepartment?.icon} size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {selectedDepartment?.name} Configuration
              </h2>
              <p className="text-sm text-muted-foreground">
                Network zone settings and access policies
              </p>
            </div>
          </div>
          {hasChanges && (
            <div className="flex items-center space-x-2 text-warning">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm font-medium">Unsaved Changes</span>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || isLoading}
            iconName="Save"
            iconPosition="left"
          >
            Save Changes
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleTest}
            loading={isLoading}
            iconName="TestTube"
            iconPosition="left"
          >
            Test Configuration
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleApply}
            disabled={!hasChanges}
            iconName="Play"
            iconPosition="left"
          >
            Apply Policies
          </Button>
        </div>
      </div>
      {/* Configuration Form */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Network Settings */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Network" size={16} />
              <span>Network Settings</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="VLAN ID"
                options={vlanOptions}
                value={formData?.vlanId}
                onChange={(value) => handleInputChange('vlanId', value)}
                error={validationErrors?.vlanId}
                required
              />
              <Input
                label="IP Range/Subnet"
                type="text"
                placeholder="192.168.1.0/24"
                value={formData?.ipRange}
                onChange={(e) => handleInputChange('ipRange', e?.target?.value)}
                error={validationErrors?.ipRange}
                required
              />
              <Input
                label="Gateway"
                type="text"
                placeholder="192.168.1.1"
                value={formData?.gateway}
                onChange={(e) => handleInputChange('gateway', e?.target?.value)}
                error={validationErrors?.gateway}
                required
              />
              <Input
                label="Subnet Mask"
                type="text"
                placeholder="255.255.255.0"
                value={formData?.subnetMask}
                onChange={(e) => handleInputChange('subnetMask', e?.target?.value)}
              />
              <Input
                label="DNS Servers"
                type="text"
                placeholder="8.8.8.8, 8.8.4.4"
                value={formData?.dnsServers}
                onChange={(e) => handleInputChange('dnsServers', e?.target?.value)}
                description="Comma-separated DNS server IPs"
              />
            </div>
          </div>

          {/* Access Control */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Shield" size={16} />
              <span>Access Control</span>
            </h3>
            <div className="space-y-4">
              <Select
                label="Inter-Department Access"
                options={departmentOptions}
                value={formData?.accessPermissions}
                onChange={(value) => handleInputChange('accessPermissions', value)}
                multiple
                searchable
                description="Select departments this zone can access"
              />
              <Select
                label="Shared Resources"
                options={sharedResourceOptions}
                value={formData?.sharedResources}
                onChange={(value) => handleInputChange('sharedResources', value)}
                multiple
                searchable
                description="Network resources accessible to this department"
              />
            </div>
          </div>

          {/* Network Options */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Settings" size={16} />
              <span>Network Options</span>
            </h3>
            <div className="space-y-4">
              <Checkbox
                label="Enable DHCP"
                description="Automatically assign IP addresses to devices"
                checked={formData?.dhcpEnabled}
                onChange={(e) => handleInputChange('dhcpEnabled', e?.target?.checked)}
              />
              <Checkbox
                label="Internet Access"
                description="Allow devices to access external networks"
                checked={formData?.internetAccess}
                onChange={(e) => handleInputChange('internetAccess', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Bandwidth Priority */}
          <div>
            <h3 className="text-base font-medium text-foreground mb-4 flex items-center space-x-2">
              <Icon name="Gauge" size={16} />
              <span>Bandwidth Priority</span>
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Priority Level</span>
                <span className="text-sm font-mono text-foreground">{formData?.bandwidthPriority}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={formData?.bandwidthPriority}
                onChange={(e) => handleInputChange('bandwidthPriority', parseInt(e?.target?.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer Status */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={12} />
              <span>Last saved: {new Date()?.toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Users" size={12} />
              <span>{selectedDepartment?.hostCount} active hosts</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={12} className="text-success" />
            <span>Configuration Valid</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationForm;