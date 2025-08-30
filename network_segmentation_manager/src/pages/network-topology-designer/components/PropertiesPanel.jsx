import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const PropertiesPanel = ({ selectedElement, onElementUpdate, onElementDelete }) => {
  const [elementData, setElementData] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (selectedElement) {
      setElementData({ ...selectedElement });
      setValidationErrors({});
    }
  }, [selectedElement]);

  const departmentOptions = [
    { value: 'HR', label: 'Human Resources', description: 'HR department network' },
    { value: 'IT', label: 'Information Technology', description: 'IT department network' },
    { value: 'Finance', label: 'Finance', description: 'Finance department network' },
    { value: 'Operations', label: 'Operations', description: 'Operations department network' },
    { value: 'Management', label: 'Management', description: 'Management network' }
  ];

  const securityLevelOptions = [
    { value: 'low', label: 'Low Security', description: 'Basic security policies' },
    { value: 'medium', label: 'Medium Security', description: 'Standard security policies' },
    { value: 'high', label: 'High Security', description: 'Strict security policies' },
    { value: 'critical', label: 'Critical Security', description: 'Maximum security policies' }
  ];

  const handleInputChange = (field, value) => {
    setElementData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors?.[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateIPRange = (ipRange) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    return ipRegex?.test(ipRange);
  };

  const handleSave = () => {
    const errors = {};
    
    if (!elementData?.name?.trim()) {
      errors.name = 'Name is required';
    }
    
    if (elementData?.ipRange && !validateIPRange(elementData?.ipRange)) {
      errors.ipRange = 'Invalid IP range format (e.g., 192.168.1.0/24)';
    }
    
    if (Object.keys(errors)?.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    onElementUpdate(elementData);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${elementData?.name}"?`)) {
      onElementDelete(elementData?.id);
    }
  };

  if (!selectedElement || !elementData) {
    return (
      <div className="w-80 bg-card border-l border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">No Element Selected</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Click on a network component in the canvas to view and edit its properties.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Properties</h2>
          <div className={`w-8 h-8 ${elementData?.color} rounded-lg flex items-center justify-center`}>
            <Icon name={elementData?.icon} size={16} color="white" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1 capitalize">
          {elementData?.type} Configuration
        </p>
      </div>
      {/* Properties Form */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Basic Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
            Basic Information
          </h3>
          
          <Input
            label="Element Name"
            type="text"
            value={elementData?.name || ''}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={validationErrors?.name}
            placeholder="Enter element name"
            required
          />

          <Input
            label="Description"
            type="text"
            value={elementData?.description || ''}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
            placeholder="Optional description"
          />
        </div>

        {/* Network Configuration */}
        {(elementData?.type === 'vlan' || elementData?.type === 'subnet') && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
              Network Configuration
            </h3>
            
            <Input
              label="IP Range"
              type="text"
              value={elementData?.ipRange || ''}
              onChange={(e) => handleInputChange('ipRange', e?.target?.value)}
              error={validationErrors?.ipRange}
              placeholder="192.168.1.0/24"
              description="CIDR notation for network range"
            />

            <Input
              label="Gateway IP"
              type="text"
              value={elementData?.gatewayIP || ''}
              onChange={(e) => handleInputChange('gatewayIP', e?.target?.value)}
              placeholder="192.168.1.1"
            />

            <Input
              label="VLAN ID"
              type="number"
              value={elementData?.vlanId || ''}
              onChange={(e) => handleInputChange('vlanId', e?.target?.value)}
              placeholder="100"
              min="1"
              max="4094"
            />
          </div>
        )}

        {/* Department Assignment */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
            Department Assignment
          </h3>
          
          <Select
            label="Department"
            options={departmentOptions}
            value={elementData?.department || ''}
            onChange={(value) => handleInputChange('department', value)}
            placeholder="Select department"
            searchable
          />

          <Select
            label="Security Level"
            options={securityLevelOptions}
            value={elementData?.securityLevel || 'medium'}
            onChange={(value) => handleInputChange('securityLevel', value)}
          />
        </div>

        {/* Security Policies */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
            Security Policies
          </h3>
          
          <Checkbox
            label="Enable Firewall"
            checked={elementData?.firewallEnabled || false}
            onChange={(e) => handleInputChange('firewallEnabled', e?.target?.checked)}
            description="Apply firewall rules to this element"
          />

          <Checkbox
            label="Enable Access Control"
            checked={elementData?.aclEnabled || false}
            onChange={(e) => handleInputChange('aclEnabled', e?.target?.checked)}
            description="Apply access control lists"
          />

          <Checkbox
            label="Enable Monitoring"
            checked={elementData?.monitoringEnabled || true}
            onChange={(e) => handleInputChange('monitoringEnabled', e?.target?.checked)}
            description="Include in network monitoring"
          />
        </div>

        {/* Connection Information */}
        {elementData?.connections && elementData?.connections?.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
              Connections
            </h3>
            <div className="space-y-2">
              {elementData?.connections?.map((connectionId, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-lg">
                  <Icon name="Link" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground font-mono">{connectionId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Position Information */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground border-b border-border pb-2">
            Position
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="X Position"
              type="number"
              value={elementData?.position?.x || 0}
              onChange={(e) => handleInputChange('position', { 
                ...elementData?.position, 
                x: parseInt(e?.target?.value) || 0 
              })}
              disabled
            />
            <Input
              label="Y Position"
              type="number"
              value={elementData?.position?.y || 0}
              onChange={(e) => handleInputChange('position', { 
                ...elementData?.position, 
                y: parseInt(e?.target?.value) || 0 
              })}
              disabled
            />
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          variant="default"
          fullWidth
          onClick={handleSave}
          iconName="Save"
          iconPosition="left"
        >
          Save Changes
        </Button>
        
        <Button
          variant="destructive"
          fullWidth
          onClick={handleDelete}
          iconName="Trash2"
          iconPosition="left"
        >
          Delete Element
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;