import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import TabNavigation from '../../components/ui/TabNavigation';
import QuickActionToolbar from '../../components/ui/QuickActionToolbar';
import DepartmentList from './components/DepartmentList';
import ConfigurationForm from './components/ConfigurationForm';
import NetworkTopologyPreview from './components/NetworkTopologyPreview';
import Icon from '../../components/AppIcon';

const DepartmentZoneConfiguration = () => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [configurationData, setConfigurationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Mock departments data
  const departments = [
    {
      id: 'hr',
      name: 'HR Department',
      description: 'Human Resources',
      icon: 'Users',
      color: 'bg-blue-600',
      status: 'active',
      vlan: '10',
      subnet: '192.168.10.0/24',
      gateway: '192.168.10.1',
      subnetMask: '255.255.255.0',
      dnsServers: '8.8.8.8, 8.8.4.4',
      hostCount: 24,
      bandwidthPriority: 60,
      accessPermissions: ['it', 'management'],
      sharedResources: ['printer', 'fileserver'],
      dhcpEnabled: true,
      internetAccess: true,
      lastModified: '2 hours ago'
    },
    {
      id: 'it',
      name: 'IT Department',
      description: 'Information Technology',
      icon: 'Monitor',
      color: 'bg-green-600',
      status: 'active',
      vlan: '20',
      subnet: '192.168.20.0/24',
      gateway: '192.168.20.1',
      subnetMask: '255.255.255.0',
      dnsServers: '8.8.8.8, 1.1.1.1',
      hostCount: 18,
      bandwidthPriority: 90,
      accessPermissions: ['hr', 'finance', 'management'],
      sharedResources: ['printer', 'fileserver', 'database', 'monitoring'],
      dhcpEnabled: true,
      internetAccess: true,
      lastModified: '30 minutes ago'
    },
    {
      id: 'finance',
      name: 'Finance Department',
      description: 'Financial Services',
      icon: 'DollarSign',
      color: 'bg-purple-600',
      status: 'warning',
      vlan: '30',
      subnet: '192.168.30.0/24',
      gateway: '192.168.30.1',
      subnetMask: '255.255.255.0',
      dnsServers: '8.8.8.8, 8.8.4.4',
      hostCount: 12,
      bandwidthPriority: 80,
      accessPermissions: ['it'],
      sharedResources: ['printer', 'database', 'backup'],
      dhcpEnabled: true,
      internetAccess: true,
      lastModified: '1 day ago'
    },
    {
      id: 'guest',
      name: 'Guest Network',
      description: 'Visitor Access',
      icon: 'Wifi',
      color: 'bg-orange-600',
      status: 'active',
      vlan: '40',
      subnet: '192.168.40.0/24',
      gateway: '192.168.40.1',
      subnetMask: '255.255.255.0',
      dnsServers: '8.8.8.8, 8.8.4.4',
      hostCount: 8,
      bandwidthPriority: 30,
      accessPermissions: [],
      sharedResources: ['printer'],
      dhcpEnabled: true,
      internetAccess: true,
      lastModified: '4 hours ago'
    }
  ];

  // Load saved department selection
  useEffect(() => {
    const savedDepartmentId = localStorage.getItem('selectedDepartmentId');
    if (savedDepartmentId) {
      const department = departments?.find(d => d?.id === savedDepartmentId);
      if (department) {
        setSelectedDepartment(department);
      }
    }
  }, []);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    localStorage.setItem('selectedDepartmentId', department?.id);
  };

  const handleConfigurationChange = (newConfig) => {
    setConfigurationData(newConfig);
  };

  const handleSaveChanges = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update department data
      const updatedDepartment = {
        ...selectedDepartment,
        ...formData,
        lastModified: 'Just now'
      };
      
      setSelectedDepartment(updatedDepartment);
      setLastSaved(new Date());
      
      // Show success notification
      console.log('Configuration saved successfully');
    } catch (error) {
      console.error('Failed to save configuration:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConfiguration = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate network test
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Show test results
      console.log('Network test completed successfully');
    } catch (error) {
      console.error('Network test failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPolicies = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate policy application
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update status
      console.log('Policies applied successfully');
    } catch (error) {
      console.error('Failed to apply policies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TabNavigation />
      <main className="pt-32">
        <div className="max-w-[1920px] mx-auto px-6">
          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Department Zone Configuration
                </h1>
                <p className="text-muted-foreground">
                  Configure network access policies and segmentation rules for organizational departments
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg">
                  <Icon name="Shield" size={16} className="text-success" />
                  <span className="text-sm font-medium text-foreground">Segmentation Active</span>
                </div>
                <div className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg">
                  <Icon name="Activity" size={16} className="text-primary" />
                  <span className="text-sm font-mono text-foreground">4 Zones</span>
                </div>
              </div>
            </div>
          </div>

          <QuickActionToolbar context="configuration" />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[calc(100vh-400px)]">
            {/* Department List - Left Panel */}
            <div className="lg:col-span-3">
              <DepartmentList
                departments={departments}
                selectedDepartment={selectedDepartment}
                onDepartmentSelect={handleDepartmentSelect}
              />
            </div>

            {/* Configuration Form - Center Panel */}
            <div className="lg:col-span-6">
              <ConfigurationForm
                selectedDepartment={selectedDepartment}
                onConfigurationChange={handleConfigurationChange}
                onSaveChanges={handleSaveChanges}
                onTestConfiguration={handleTestConfiguration}
                onApplyPolicies={handleApplyPolicies}
                isLoading={isLoading}
              />
            </div>

            {/* Network Topology Preview - Right Panel */}
            <div className="lg:col-span-3">
              <NetworkTopologyPreview
                selectedDepartment={selectedDepartment}
                departments={departments}
                configurationData={configurationData}
              />
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Icon name="Database" size={16} className="text-primary" />
                    <span className="text-sm text-muted-foreground">Total Hosts:</span>
                    <span className="text-sm font-mono text-foreground">
                      {departments?.reduce((sum, dept) => sum + dept?.hostCount, 0)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Network" size={16} className="text-accent" />
                    <span className="text-sm text-muted-foreground">Active VLANs:</span>
                    <span className="text-sm font-mono text-foreground">
                      {departments?.length}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Last Updated: {lastSaved ? lastSaved?.toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                  <span className="text-sm text-success font-medium">System Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DepartmentZoneConfiguration;