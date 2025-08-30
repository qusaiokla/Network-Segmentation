import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateHostModal = ({ isOpen, onClose, onCreateHost }) => {
  const [formData, setFormData] = useState({
    hostname: '',
    department: '',
    ipAddress: '',
    cpuCores: '2',
    memoryGB: '4',
    diskGB: '20',
    namespace: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState({});

  const departmentOptions = [
    { value: 'IT', label: 'IT Department', description: '192.168.1.0/24 network' },
    { value: 'HR', label: 'HR Department', description: '192.168.2.0/24 network' },
    { value: 'Finance', label: 'Finance Department', description: '192.168.3.0/24 network' },
    { value: 'Marketing', label: 'Marketing Department', description: '192.168.4.0/24 network' }
  ];

  const cpuOptions = [
    { value: '1', label: '1 Core' },
    { value: '2', label: '2 Cores' },
    { value: '4', label: '4 Cores' },
    { value: '8', label: '8 Cores' }
  ];

  const memoryOptions = [
    { value: '2', label: '2 GB RAM' },
    { value: '4', label: '4 GB RAM' },
    { value: '8', label: '8 GB RAM' },
    { value: '16', label: '16 GB RAM' }
  ];

  const diskOptions = [
    { value: '20', label: '20 GB Storage' },
    { value: '50', label: '50 GB Storage' },
    { value: '100', label: '100 GB Storage' },
    { value: '200', label: '200 GB Storage' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.hostname?.trim()) {
      newErrors.hostname = 'Hostname is required';
    } else if (!/^[a-zA-Z0-9-]+$/?.test(formData?.hostname)) {
      newErrors.hostname = 'Hostname can only contain letters, numbers, and hyphens';
    }

    if (!formData?.department) {
      newErrors.department = 'Department selection is required';
    }

    if (!formData?.ipAddress?.trim()) {
      newErrors.ipAddress = 'IP address is required';
    } else if (!/^(\d{1,3}\.){3}\d{1,3}$/?.test(formData?.ipAddress)) {
      newErrors.ipAddress = 'Please enter a valid IP address';
    }

    if (!formData?.namespace?.trim()) {
      newErrors.namespace = 'Network namespace is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;

    setIsCreating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newHost = {
        id: Date.now(),
        hostname: formData?.hostname,
        department: formData?.department,
        ipAddress: formData?.ipAddress,
        subnet: getDepartmentSubnet(formData?.department),
        namespace: formData?.namespace,
        status: 'starting',
        resourceUsage: {
          cpu: 0,
          memory: 0,
          disk: 0
        },
        resourceAllocation: {
          cpu: parseInt(formData?.cpuCores),
          memory: parseInt(formData?.memoryGB),
          disk: parseInt(formData?.diskGB)
        },
        lastActivity: new Date(),
        description: formData?.description,
        createdAt: new Date()
      };

      onCreateHost(newHost);
      handleClose();
    } catch (error) {
      console.error('Failed to create host:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const getDepartmentSubnet = (department) => {
    const subnets = {
      'IT': '192.168.1.0/24',
      'HR': '192.168.2.0/24',
      'Finance': '192.168.3.0/24',
      'Marketing': '192.168.4.0/24'
    };
    return subnets?.[department] || '';
  };

  const handleClose = () => {
    setFormData({
      hostname: '',
      department: '',
      ipAddress: '',
      cpuCores: '2',
      memoryGB: '4',
      diskGB: '20',
      namespace: '',
      description: ''
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={handleClose} />
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-card border border-border rounded-lg shadow-floating w-full max-w-2xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Plus" size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Create Virtual Host</h2>
                <p className="text-sm text-muted-foreground">Configure a new virtual host for network segmentation</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={handleClose}
              disabled={isCreating}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Server" size={16} />
                <span>Basic Information</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Hostname"
                  type="text"
                  placeholder="web-server-01"
                  value={formData?.hostname}
                  onChange={(e) => handleInputChange('hostname', e?.target?.value)}
                  error={errors?.hostname}
                  required
                  description="Unique identifier for the virtual host"
                />
                
                <Input
                  label="Network Namespace"
                  type="text"
                  placeholder="ns-web-01"
                  value={formData?.namespace}
                  onChange={(e) => handleInputChange('namespace', e?.target?.value)}
                  error={errors?.namespace}
                  required
                  description="Linux network namespace for isolation"
                />
              </div>

              <Input
                label="Description"
                type="text"
                placeholder="Web server for department applications"
                value={formData?.description}
                onChange={(e) => handleInputChange('description', e?.target?.value)}
                description="Optional description of the host purpose"
              />
            </div>

            {/* Network Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Network" size={16} />
                <span>Network Configuration</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Department Zone"
                  options={departmentOptions}
                  value={formData?.department}
                  onChange={(value) => handleInputChange('department', value)}
                  error={errors?.department}
                  required
                  description="Determines network segment and policies"
                />
                
                <Input
                  label="IP Address"
                  type="text"
                  placeholder="192.168.1.100"
                  value={formData?.ipAddress}
                  onChange={(e) => handleInputChange('ipAddress', e?.target?.value)}
                  error={errors?.ipAddress}
                  required
                  description="Static IP within department subnet"
                />
              </div>

              {formData?.department && (
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground">
                    <strong>Network Details:</strong> {getDepartmentSubnet(formData?.department)} subnet
                  </div>
                </div>
              )}
            </div>

            {/* Resource Allocation */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-foreground flex items-center space-x-2">
                <Icon name="Cpu" size={16} />
                <span>Resource Allocation</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="CPU Cores"
                  options={cpuOptions}
                  value={formData?.cpuCores}
                  onChange={(value) => handleInputChange('cpuCores', value)}
                  description="Processing power allocation"
                />
                
                <Select
                  label="Memory"
                  options={memoryOptions}
                  value={formData?.memoryGB}
                  onChange={(value) => handleInputChange('memoryGB', value)}
                  description="RAM allocation"
                />
                
                <Select
                  label="Storage"
                  options={diskOptions}
                  value={formData?.diskGB}
                  onChange={(value) => handleInputChange('diskGB', value)}
                  description="Disk space allocation"
                />
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">
                  <strong>Resource Summary:</strong> {formData?.cpuCores} CPU cores, {formData?.memoryGB}GB RAM, {formData?.diskGB}GB storage
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-border bg-muted/20">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              loading={isCreating}
              iconName="Plus"
              iconPosition="left"
            >
              {isCreating ? 'Creating Host...' : 'Create Virtual Host'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHostModal;